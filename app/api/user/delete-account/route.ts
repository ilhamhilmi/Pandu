import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    // 1. Authenticate user via their Supabase session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Delete the app data (User + all related data via cascade).
    //    Related: UserPreference, Roadmap, DailyTask. If the user record
    //    doesn't exist (e.g. never finished onboarding), that's fine.
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (prismaError: unknown) {
      const isNotFound =
        prismaError instanceof Error &&
        prismaError.message.includes("Record to delete does not exist");
      if (!isNotFound) {
        throw prismaError;
      }
    }

    // 3. Delete the user from Supabase Auth (auth.users) using the admin API.
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (deleteError) {
      console.error("Error deleting Supabase auth user:", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus akun dari autentikasi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
