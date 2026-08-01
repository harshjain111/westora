import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/utils/env";

/**
 * Browser client — anon key only, respects RLS. Never import this in a
 * Server Action that needs to write to `leads`; that path uses the
 * service-role client created inline in lib/actions/enquiry.ts instead.
 */
export function createClient() {
  return createBrowserClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
