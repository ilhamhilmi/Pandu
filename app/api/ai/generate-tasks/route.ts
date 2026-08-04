import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateDailyTasksBatch } from "@/lib/ai/generate";

const DAYS_PER_BATCH = 7;

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user's roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap belum dibuat. Generate roadmap terlebih dahulu." },
        { status: 400 }
      );
    }

    // 3. Get user's preference for daily study hours (drives task density)
    const preference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });
    const hoursPerDay = preference?.hoursPerDay ?? null;

    // 4. Parse optional body: startDay & difficultyFeedback
    let startDay = 1;
    let difficultyFeedback: string | undefined;
    try {
      const body = await request.json();
      if (body?.startDay && typeof body.startDay === "number") {
        startDay = body.startDay;
      }
      if (typeof body?.difficultyFeedback === "string") {
        difficultyFeedback = body.difficultyFeedback;
      }
    } catch {
      // No body or invalid JSON — default to startDay = 1
    }

    const totalDays = roadmap.targetDays;

    // Validate startDay
    if (startDay < 1 || startDay > totalDays) {
      return NextResponse.json(
        { error: `startDay harus antara 1 dan ${totalDays}` },
        { status: 400 }
      );
    }

    // 5. If startDay === 1, delete all existing tasks (fresh start / re-onboarding)
    //    If startDay > 1, only delete tasks for the days we're about to generate
    //    (to avoid duplicates if user clicks the button twice)
    const batchEnd = Math.min(startDay + DAYS_PER_BATCH - 1, totalDays);

    if (startDay === 1) {
      await prisma.dailyTask.deleteMany({
        where: { userId: user.id },
      });
    } else {
      // Delete only tasks in the range [startDay, batchEnd] to avoid duplicates
      await prisma.dailyTask.deleteMany({
        where: {
          userId: user.id,
          day: { gte: startDay, lte: batchEnd },
        },
      });
    }

    const phases = roadmap.phases as Array<{
      title: string;
      week: string;
      order: number;
      topics: string[];
      duration: string;
    }>;

    // 6. Generate daily tasks for this batch (7 days)
    const daysToGenerate = Math.min(DAYS_PER_BATCH, totalDays - startDay + 1);
    const taskBatches = await generateDailyTasksBatch(
      phases,
      startDay,
      daysToGenerate,
      totalDays,
      hoursPerDay,
      difficultyFeedback
    );

    const newDailyTasks: Array<{
      userId: string;
      day: number;
      tasks: Array<{
        title: string;
        duration_minutes: number;
        resources: Array<{ type: "video" | "article"; title: string; url: string }>;
      }>;
    }> = taskBatches.map((batch) => ({
      userId: user.id,
      day: batch.day,
      tasks: batch.tasks.map((t) => ({
        title: t.title,
        duration_minutes: t.duration_minutes,
        resources: t.resources.map((r) => ({
          type: r.type as "video" | "article",
          title: r.title,
          url: r.url,
        })),
      })),
    }));

    // 7. Save new daily tasks to database
    if (newDailyTasks.length > 0) {
      await prisma.dailyTask.createMany({
        data: newDailyTasks,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          totalDays,
          startDay,
          endDay: batchEnd,
          generatedCount: newDailyTasks.length,
          hasMore: batchEnd < totalDays,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating daily tasks:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}