import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireEnv } from "@/lib/utils/env";

/**
 * Server Component / Route Handler / Server Action client — anon key,
 * respects RLS, carries the visitor's auth session via cookies. This is
 * what admin pages use to read `leads` as the signed-in admin/viewer.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component during render — the
            // middleware below is responsible for refreshing the
            // session in that case, so this is safe to ignore.
          }
        },
      },
    },
  );
}
