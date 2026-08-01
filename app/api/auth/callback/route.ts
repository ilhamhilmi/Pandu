import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Get the authenticated user from the session
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Check if user already has a preference saved
                const preference = await prisma.userPreference.findUnique({
                    where: { userId: user.id },
                });

                // Redirect to dashboard if user has data, otherwise onboarding
                const redirectPath = preference ? "/dashboard" : "/onboarding";
                return NextResponse.redirect(`${origin}${redirectPath}`);
            }

            return NextResponse.redirect(`${origin}/dashboard`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
