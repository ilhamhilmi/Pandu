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

    // 5. Calculate last generated day (max day in DB)
    const lastGeneratedDay =
      allTasks.length > 0 ? Math.max(...allTasks.map((t) => t.day)) : 0;

    // 6. Calculate progress based on task completion (not timezone)
    let totalCompleted = 0;
    let totalTasks = 0;
    let currentDay = 1; // First day that is not fully completed
    let streak = 0;

    if (allTasks.length > 0) {
      // Calculate totals and find current day (first incomplete day)
      for (const dailyTask of allTasks) {
        const tasks = dailyTask.tasks as Array<{ completed?: boolean }>;
        const dayCompleted = tasks.filter((t) => t.completed).length;
        const dayTotal = tasks.length;

        totalTasks += dayTotal;
        totalCompleted += dayCompleted;

        // currentDay = first day where not all tasks are completed
        if (currentDay === dailyTask.day && dayCompleted < dayTotal && dayTotal > 0) {
          currentDay = dailyTask.day;
        } else if (dayCompleted >= dayTotal && dayTotal > 0) {
          // This day is fully completed, move to next
          if (currentDay === dailyTask.day) {
            currentDay = dailyTask.day + 1;
          }
        }
      }

      // Cap currentDay at targetDays
      currentDay = Math.min(currentDay, roadmap?.targetDays || 30);

      // Calculate streak (consecutive days with all tasks completed, going backwards from currentDay)
      for (let i = currentDay - 1; i >= 1; i--) {
        const dayTasks = allTasks.find((t) => t.day === i);
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
          lastGeneratedDay,
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