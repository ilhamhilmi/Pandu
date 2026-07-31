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

    // 2. Get user's preference
    const preference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });

    // 3. Get user's roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    // 4. Get all daily tasks
    const allTasks = await prisma.dailyTask.findMany({
      where: { userId: user.id },
      orderBy: { day: "asc" },
    });

    // 5. Calculate current day based on when roadmap was created
    let currentDay = 1;
    let totalCompleted = 0;
    let totalTasks = 0;
    let streak = 0;

    if (allTasks.length > 0) {
      // Calculate current day
      const createdAt = new Date(allTasks[0].createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      currentDay = Math.min(diffDays + 1, roadmap?.targetDays || 30);

      // Calculate total completed tasks
      for (const dailyTask of allTasks) {
        const tasks = dailyTask.tasks as Array<{ completed?: boolean }>;
        for (const task of tasks) {
          totalTasks++;
          if (task.completed) {
            totalCompleted++;
          }
        }
      }

      // Calculate streak (consecutive days with all tasks completed, going backwards)
      for (let i = currentDay - 1; i >= 0; i--) {
        const dayTasks = allTasks.find((t) => t.day === i + 1);
        if (dayTasks) {
          const tasks = dayTasks.tasks as Array<{ completed?: boolean }>;
          const allCompleted = tasks.every((t) => t.completed);
          if (allCompleted && tasks.length > 0) {
            streak++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    const progressPercent =
      totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          hasPreference: !!preference,
          hasRoadmap: !!roadmap,
          currentDay,
          targetDays: roadmap?.targetDays || 30,
          totalTasks,
          totalCompleted,
          progressPercent,
          streak,
          goal: preference?.goal || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}