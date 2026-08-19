import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user via Supabase session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { goal, goalCustom, targetDays, selectedSkills, hoursPerDay, timezone, aiNote } = body;

    // 3. Validate required fields
    if (!goal || !targetDays || !selectedSkills) {
      return NextResponse.json(
        { error: "Missing required fields: goal, targetDays, selectedSkills" },
        { status: 400 }
      );
    }

    if (goal === "lainnya" && !goalCustom) {
      return NextResponse.json(
        { error: "goalCustom is required when goal is 'lainnya'" },
        { status: 400 }
      );
    }

    // 4. Upsert User record (create if first time, update email if exists)
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: {
        id: user.id,
        email: user.email,
      },
    });

    // 5. Upsert UserPreference (upsert so resubmission updates existing)
    const preference = await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        goal,
        goalCustom: goal === "lainnya" ? goalCustom : null,
        targetDays,
        selectedSkills,
        hoursPerDay: hoursPerDay || null,
        aiNote: aiNote?.trim() || null,
        timezone: timezone || undefined,
      },
      create: {
        userId: user.id,
        goal,
        goalCustom: goal === "lainnya" ? goalCustom : null,
        targetDays,
        selectedSkills,
        hoursPerDay: hoursPerDay || null,
        aiNote: aiNote?.trim() || null,
        timezone: timezone || null,
      },
    });

    return NextResponse.json(
      { success: true, data: preference },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}