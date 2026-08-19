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

    if (!preference) {
      return NextResponse.json(
        { error: "Preferensi belum diisi" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          goal: preference.goal,
          goalCustom: preference.goalCustom,
          targetDays: preference.targetDays,
          selectedSkills: preference.selectedSkills,
          hoursPerDay: preference.hoursPerDay,
          aiNote: preference.aiNote,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching preference:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}