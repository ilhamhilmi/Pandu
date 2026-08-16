import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateRoadmap } from "@/lib/ai/generate";

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

    // 2. Get user preference
    const preference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });

    if (!preference) {
      return NextResponse.json(
        { error: "Preferensi belum diisi. Silakan isi onboarding terlebih dahulu." },
        { status: 400 }
      );
    }

    // 3. Check if roadmap already exists — if so, delete it (and its daily tasks)
    const existingRoadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    if (existingRoadmap) {
      // Delete old daily tasks and roadmap
      await prisma.dailyTask.deleteMany({
        where: { userId: user.id },
      });
      await prisma.roadmap.delete({
        where: { userId: user.id },
      });
    }

    // 4. Generate roadmap via AI (termasuk reasoning keseluruhan + saran)
    const { phases, reasoning } = await generateRoadmap({
      goal: preference.goal,
      goalCustom: preference.goalCustom,
      targetDays: preference.targetDays,
      selectedSkills: preference.selectedSkills,
      hoursPerDay: preference.hoursPerDay,
    });

    // 5. Save to database
    const roadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        goal: preference.goal,
        targetDays: preference.targetDays,
        reasoning,
        phases: phases as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      { success: true, data: roadmap },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating roadmap:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}