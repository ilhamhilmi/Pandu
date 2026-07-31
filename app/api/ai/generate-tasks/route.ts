import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateDailyTasks } from "@/lib/ai/generate";

export async function POST() {
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

    // 3. Check if daily tasks already exist — if so, delete them
    await prisma.dailyTask.deleteMany({
      where: { userId: user.id },
    });

    const phases = roadmap.phases as Array<{
      title: string;
      week: string;
      order: number;
      topics: string[];
      duration: string;
    }>;

    // 4. Generate tasks for all days
    const allDailyTasks: Array<{
      userId: string;
      day: number;
      tasks: Array<{
        title: string;
        duration_minutes: number;
        resources: Array<{ type: "video" | "article"; title: string; url: string }>;
      }>;
    }> = [];

    // Generate tasks in batches to avoid too many concurrent API calls
    const BATCH_SIZE = 5;
    const totalDays = roadmap.targetDays;

    for (let batchStart = 1; batchStart <= totalDays; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalDays);
      const batchPromises = [];

      for (let day = batchStart; day <= batchEnd; day++) {
        batchPromises.push(
          generateDailyTasks(phases, day, totalDays).then((tasks) => ({
            userId: user.id,
            day,
            tasks: tasks.map((t) => ({
              title: t.title,
              duration_minutes: t.duration_minutes,
              resources: t.resources.map((r) => ({
                type: r.type as "video" | "article",
                title: r.title,
                url: r.url,
              })),
            })),
          }))
        );
      }

      const batchResults = await Promise.all(batchPromises);
      allDailyTasks.push(...batchResults);
    }

    // 5. Save all daily tasks to database
    if (allDailyTasks.length > 0) {
      await prisma.dailyTask.createMany({
        data: allDailyTasks,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          totalDays,
          generatedCount: allDailyTasks.length,
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