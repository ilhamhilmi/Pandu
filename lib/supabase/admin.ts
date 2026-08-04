import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// Create a Supabase client with the service role key for admin operations
// (e.g. deleting users from Supabase Auth). Server-only; never expose to browser.
export function createAdminClient(): SupabaseClient {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
