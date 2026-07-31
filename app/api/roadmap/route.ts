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

    // 2. Get user's roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: { userId: user.id },
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap belum dibuat" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roadmap }, { status: 200 });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}