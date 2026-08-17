import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { todayInTimezone } from "@/lib/dates";

export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get ALL daily tasks for the user, sorted by day
    const allTasks = await prisma.dailyTask.findMany({
      where: { userId: user.id },
      orderBy: { day: "asc" },
    });

    // 3. Get user's roadmap for targetDays
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    const targetDays = roadmap?.targetDays || 30;

    // 4. Return all tasks as array
    const tasksByDay = allTasks.map((dailyTask) => ({
      day: dailyTask.day,
      tasks: dailyTask.tasks,
    }));

    // Reasoning comes from the latest generated batch (the max-day record),
    // since daily tasks are generated on-demand in rolling 7-day batches.
    // Fall back to the last record that has a reasoning, if any.
    const latestDay = allTasks.length > 0 ? allTasks[allTasks.length - 1] : null;
    let reasoning =
      typeof latestDay?.reasoning === "string" && latestDay.reasoning.trim()
        ? latestDay.reasoning.trim()
        : "";
    if (!reasoning) {
      const recordWithReasoning = [...allTasks]
        .reverse()
        .find((t) => typeof t.reasoning === "string" && t.reasoning.trim());
      reasoning = recordWithReasoning?.reasoning?.trim() || "";
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tasksByDay,
          targetDays,
          reasoning,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { day, taskIndex, completed, timezone } = body;

    if (day === undefined || taskIndex === undefined || completed === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: day, taskIndex, completed" },
        { status: 400 }
      );
    }

    // 3. Get current tasks
    const dailyTask = await prisma.dailyTask.findUnique({
      where: {
        userId_day: {
          userId: user.id,
          day,
        },
      },
    });

    if (!dailyTask) {
      return NextResponse.json(
        { error: "Tasks tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Update the specific task's completed status
    const tasks = JSON.parse(JSON.stringify(dailyTask.tasks)) as Array<{
      title: string;
      duration_minutes: number;
      resources: Array<{ type: string; title: string; url: string }>;
      completed?: boolean;
    }>;

    if (taskIndex < 0 || taskIndex >= tasks.length) {
      return NextResponse.json(
        { error: "Task index tidak valid" },
        { status: 400 }
      );
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed,
    };

    // 5. Persist timezone from browser (backfill for existing users), if provided
    if (typeof timezone === "string" && timezone.trim()) {
      const preference = await prisma.userPreference.findUnique({
        where: { userId: user.id },
      });
      if (preference && preference.timezone !== timezone.trim()) {
        await prisma.userPreference.update({
          where: { userId: user.id },
          data: { timezone: timezone.trim() },
        });
      }
    }

    // 6. Track active day for streak (TikTok-style).
    //    A day counts as "active" when the user checks at least 1 task that day.
    //    Once recorded, it stays even if the task is unchecked later.
    if (completed) {
      // Read the user's timezone (just saved above, or existing)
      const preference = await prisma.userPreference.findUnique({
        where: { userId: user.id },
      });
      const tz = preference?.timezone || null;
      const dateKey = todayInTimezone(tz);

      const existing = await prisma.activeDay.findUnique({
        where: { userId_date: { userId: user.id, date: dateKey } },
      });
      if (!existing) {
        await prisma.activeDay.create({
          data: { userId: user.id, date: dateKey },
        });
      }
    }

    // 7. Save updated tasks
    const updated = await prisma.dailyTask.update({
      where: {
        userId_day: {
          userId: user.id,
          day,
        },
      },
      data: {
        tasks: tasks as unknown as import("@prisma/client").Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      { success: true, data: { day, tasks: updated.tasks } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}