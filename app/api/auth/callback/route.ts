import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        // exchangeCodeForSession already returns the session's user,
        // so we avoid an extra getUser() round-trip.
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if user already has a preference saved
            const preference = await prisma.userPreference.findUnique({
                where: { userId: data.user.id },
            });

            // Redirect to dashboard if user has data, otherwise onboarding
            const redirectPath = preference ? "/dashboard" : "/onboarding";
            return NextResponse.redirect(`${origin}${redirectPath}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
