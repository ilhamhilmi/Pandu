import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(
      {
        success: true,
        data: {
          tasksByDay,
          targetDays,
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