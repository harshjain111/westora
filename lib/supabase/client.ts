import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client — anon key only, respects RLS. Never import this in a
 * Server Action that needs to write to `leads`; that path uses the
 * service-role client created inline in lib/actions/enquiry.ts instead.
 *
 * Reads process.env with static, literal property access (not the
 * requireEnv(name) helper used on the server) — Next.js only inlines
 * NEXT_PUBLIC_* values into the client bundle when it can statically see
 * the exact `process.env.NEXT_PUBLIC_X` expression at build time. A
 * dynamic `process.env[name]` lookup is invisible to that inlining, so
 * requireEnv() silently resolves to undefined in the browser even when
 * the variable is correctly set — it only works server-side, where a real
 * process.env object exists at runtime.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient(url, anonKey);
}
