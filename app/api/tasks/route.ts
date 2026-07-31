import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get day from query params
    const url = new URL(request.url);
    const day = parseInt(url.searchParams.get("day") || "1");

    // 3. Get tasks for this day
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
        { error: "Tasks untuk hari ini belum tersedia" },
        { status: 404 }
      );
    }

    // 4. Check if this day is accessible (day 1 is always accessible, others accessible after createdAt + (day-1) days)
    const now = new Date();
    const createdAt = new Date(dailyTask.createdAt);
    const unlockDate = new Date(createdAt);
    unlockDate.setDate(unlockDate.getDate() + (day - 1));
    unlockDate.setHours(0, 0, 0, 0);

    const isAccessible = day === 1 || now >= unlockDate;

    // 5. Get user's roadmap for context
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    const targetDays = roadmap?.targetDays || 30;

    return NextResponse.json(
      {
        success: true,
        data: {
          day,
          tasks: dailyTask.tasks,
          isAccessible,
          unlockDate: unlockDate.toISOString(),
          targetDays,
          createdAt: dailyTask.createdAt,
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
    const { day, taskIndex, completed } = body;

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

    // 5. Save updated tasks
    const updated = await prisma.dailyTask.update({
      where: {
        userId_day: {
          userId: user.id,
          day,
        },
      },
      data: {
        tasks: tasks as any,
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