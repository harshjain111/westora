import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { analyticsEventSchema } from "@/lib/schemas/analytics";

/**
 * Ingests first-party analytics events. A Route Handler rather than a
 * Server Action (CLAUDE.md §9 normally prefers Server Actions) because the
 * tracker relies on navigator.sendBeacon for the "user is leaving the
 * page" flush — that only works against a plain fetch-able URL, and
 * doesn't reliably survive being wrapped in a Server Action call. Security
 * model is identical to the enquiry action: a service-role client used
 * only here, server-side, writing to tables with no anon/authenticated
 * insert policy (supabase/migrations/0006_analytics_rls.sql).
 *
 * Only ever called once a visitor has explicitly clicked "Allow" on the
 * cookie banner — see components/analytics/AnalyticsTracker.tsx.
 */

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
}

function deviceTypeFromUserAgent(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (/iPad|Tablet/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function hostFromReferrer(referrer: string | undefined): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).host || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // sendBeacon posts a Blob with no content-type guarantee — read as text
  // and parse manually rather than relying on request.json().
  let raw: unknown;
  try {
    const body = await request.text();
    raw = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const input = parsed.data;

  const supabase = getServiceClient();
  if (!supabase) {
    // Analytics is best-effort infrastructure, not a user-facing feature —
    // fail silently rather than surfacing an error to the visitor.
    return NextResponse.json({ ok: true });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const country = request.headers.get("x-vercel-ip-country") ?? null;

  if (input.isNewSession) {
    await supabase.from("analytics_sessions").upsert({
      id: input.sessionId,
      entry_path: input.entryPath ?? "/",
      referrer_host: hostFromReferrer(input.referrer),
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
      country,
      device_type: deviceTypeFromUserAgent(userAgent),
      last_seen: new Date().toISOString(),
    });
  } else {
    await supabase
      .from("analytics_sessions")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", input.sessionId);
  }

  if (input.pageViews && input.pageViews.length > 0) {
    await supabase.from("analytics_page_views").insert(
      input.pageViews.map((view) => ({ session_id: input.sessionId, path: view.path })),
    );
  }

  if (input.sections && input.sections.length > 0) {
    // Sub-250ms glances (a scroll-past, not a read) are noise, not signal.
    const meaningful = input.sections.filter((section) => section.durationMs >= 250);
    if (meaningful.length > 0) {
      await supabase.from("analytics_section_engagement").insert(
        meaningful.map((section) => ({
          session_id: input.sessionId,
          path: section.path,
          section_id: section.sectionId,
          duration_ms: section.durationMs,
        })),
      );
    }
  }

  if (input.clicks && input.clicks.length > 0) {
    await supabase.from("analytics_clicks").insert(
      input.clicks.map((click) => ({
        session_id: input.sessionId,
        path: click.path,
        x_pct: click.xPct,
        y_pct: click.yPct,
      })),
    );
  }

  return NextResponse.json({ ok: true });
}
