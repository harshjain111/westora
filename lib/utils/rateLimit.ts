import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_HOURS = 1;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * 5 submissions per IP per hour (PRD FR-12.4). Returns true if the
 * request should be BLOCKED. Records this attempt regardless of the
 * outcome, so the count reflects attempts, not just successes.
 */
export async function isRateLimited(supabase: SupabaseClient, ip: string): Promise<boolean> {
  const ipHash = hashIp(ip);
  const windowStart = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (error) {
    console.error("[rateLimit] count query failed:", error.message);
    // Fail open rather than blocking every legitimate submission if the
    // rate-limit table itself is unreachable.
    return false;
  }

  await supabase.from("rate_limit_events").insert({ ip_hash: ipHash });

  return (count ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW;
}
