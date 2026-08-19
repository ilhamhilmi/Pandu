import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generatePracticeQuestions } from "@/lib/ai/generate";

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

    // 2. Get user's preference (goal)
    const preference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });

    if (!preference) {
      return NextResponse.json(
        { error: "Atur preferensi kamu dulu untuk mengatur goal belajarmu." },
        { status: 400 }
      );
    }

    const goal =
      preference.goal === "custom" && preference.goalCustom
        ? preference.goalCustom
        : preference.goal;

    // 3. Get user's roadmap topics as reference material
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    const topics: string[] = [];
    if (roadmap && Array.isArray(roadmap.phases)) {
      const phases = roadmap.phases as Array<{ topics?: string[] }>;
      phases.forEach((phase) => {
        if (Array.isArray(phase.topics)) {
          topics.push(...phase.topics);
        }
      });
    }

    // 4. Generate practice questions
    const questions = await generatePracticeQuestions({
      goal,
      topics,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          goal,
          questions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating practice questions:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
