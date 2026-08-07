import type { SupabaseClient } from "@supabase/supabase-js";

export interface AnalyticsStats {
  visitsToday: number;
  visits7d: number;
  visits30d: number;
  pageViews30d: number;
  dailyVisits: { date: string; count: number }[];
  /** Hour of day (0-23, UTC) sessions typically arrive, last 30 days. */
  hourlyDistribution: { hour: number; count: number }[];
  deviceSplit: { mobile: number; tablet: number; desktop: number };
  countrySplit: { country: string; count: number }[];
  topReferrers: { host: string; count: number }[];
  directCount: number;
  topPages: { path: string; count: number }[];
  topSections: {
    sectionId: string;
    avgDurationMs: number;
    totalDurationMs: number;
    sampleCount: number;
  }[];
  /** Density grid (rows x cols) of click positions on the most-visited page. */
  heatmap: { path: string; rows: number; cols: number; cells: number[] } | null;
}

const HEATMAP_ROWS = 14;
const HEATMAP_COLS = 20;
const HEATMAP_CLICK_LIMIT = 5000;

/**
 * Returns null (never throws) if the query fails — same convention as
 * getDashboardStats (PRD FR-15.3): the page renders an explicit
 * "couldn't load" state rather than fabricating zeros.
 */
export async function getAnalyticsStats(supabase: SupabaseClient): Promise<AnalyticsStats | null> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [sessionsRes, pageViewsRes, sectionsRes] = await Promise.all([
    supabase
      .from("analytics_sessions")
      .select("id, first_seen, device_type, country, referrer_host")
      .gte("first_seen", start30d)
      .limit(20000)
      .returns<
        { id: string; first_seen: string; device_type: string; country: string | null; referrer_host: string | null }[]
      >(),
    supabase
      .from("analytics_page_views")
      .select("path, created_at")
      .gte("created_at", start30d)
      .limit(50000)
      .returns<{ path: string; created_at: string }[]>(),
    supabase
      .from("analytics_section_engagement")
      .select("section_id, duration_ms")
      .gte("created_at", start30d)
      .limit(50000)
      .returns<{ section_id: string; duration_ms: number }[]>(),
  ]);

  if (sessionsRes.error || pageViewsRes.error || sectionsRes.error) {
    console.error(
      "[admin] analytics query failed:",
      sessionsRes.error?.message ?? pageViewsRes.error?.message ?? sectionsRes.error?.message,
    );
    return null;
  }

  const sessions = sessionsRes.data;
  const pageViews = pageViewsRes.data;
  const sections = sectionsRes.data;

  const visitsToday = sessions.filter((s) => s.first_seen >= startOfToday).length;
  const visits7d = sessions.filter((s) => s.first_seen >= start7d).length;
  const visits30d = sessions.length;
  const pageViews30d = pageViews.length;

  const dailyCounts = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dailyCounts.set(date, 0);
  }
  for (const session of sessions) {
    const date = session.first_seen.slice(0, 10);
    if (dailyCounts.has(date)) dailyCounts.set(date, (dailyCounts.get(date) ?? 0) + 1);
  }
  const dailyVisits = [...dailyCounts.entries()].map(([date, count]) => ({ date, count }));

  const hourlyCounts = new Map<number, number>();
  for (let h = 0; h < 24; h++) hourlyCounts.set(h, 0);
  for (const session of sessions) {
    const hour = new Date(session.first_seen).getUTCHours();
    hourlyCounts.set(hour, (hourlyCounts.get(hour) ?? 0) + 1);
  }
  const hourlyDistribution = [...hourlyCounts.entries()].map(([hour, count]) => ({ hour, count }));

  const deviceSplit = { mobile: 0, tablet: 0, desktop: 0 };
  for (const session of sessions) {
    if (session.device_type === "mobile") deviceSplit.mobile += 1;
    else if (session.device_type === "tablet") deviceSplit.tablet += 1;
    else deviceSplit.desktop += 1;
  }

  const countryCounts = new Map<string, number>();
  for (const session of sessions) {
    if (!session.country) continue;
    countryCounts.set(session.country, (countryCounts.get(session.country) ?? 0) + 1);
  }
  const countrySplit = [...countryCounts.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const referrerCounts = new Map<string, number>();
  let directCount = 0;
  for (const session of sessions) {
    if (!session.referrer_host) {
      directCount += 1;
      continue;
    }
    referrerCounts.set(session.referrer_host, (referrerCounts.get(session.referrer_host) ?? 0) + 1);
  }
  const topReferrers = [...referrerCounts.entries()]
    .map(([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const pageCounts = new Map<string, number>();
  for (const view of pageViews) {
    pageCounts.set(view.path, (pageCounts.get(view.path) ?? 0) + 1);
  }
  const topPages = [...pageCounts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const sectionTotals = new Map<string, { total: number; count: number }>();
  for (const row of sections) {
    const existing = sectionTotals.get(row.section_id) ?? { total: 0, count: 0 };
    existing.total += row.duration_ms;
    existing.count += 1;
    sectionTotals.set(row.section_id, existing);
  }
  const topSections = [...sectionTotals.entries()]
    .map(([sectionId, { total, count }]) => ({
      sectionId,
      totalDurationMs: total,
      avgDurationMs: Math.round(total / count),
      sampleCount: count,
    }))
    .sort((a, b) => b.totalDurationMs - a.totalDurationMs);

  let heatmap: AnalyticsStats["heatmap"] = null;
  const heatmapPath = topPages[0]?.path;
  if (heatmapPath) {
    const { data: clicks, error: clicksError } = await supabase
      .from("analytics_clicks")
      .select("x_pct, y_pct")
      .eq("path", heatmapPath)
      .gte("created_at", start30d)
      .limit(HEATMAP_CLICK_LIMIT)
      .returns<{ x_pct: number; y_pct: number }[]>();

    if (!clicksError && clicks) {
      const cells = new Array(HEATMAP_ROWS * HEATMAP_COLS).fill(0) as number[];
      for (const click of clicks) {
        const col = Math.min(HEATMAP_COLS - 1, Math.floor((click.x_pct / 100) * HEATMAP_COLS));
        const row = Math.min(HEATMAP_ROWS - 1, Math.floor((click.y_pct / 100) * HEATMAP_ROWS));
        const index = row * HEATMAP_COLS + col;
        cells[index] = (cells[index] ?? 0) + 1;
      }
      heatmap = { path: heatmapPath, rows: HEATMAP_ROWS, cols: HEATMAP_COLS, cells };
    }
  }

  return {
    visitsToday,
    visits7d,
    visits30d,
    pageViews30d,
    dailyVisits,
    hourlyDistribution,
    deviceSplit,
    countrySplit,
    topReferrers,
    directCount,
    topPages,
    topSections,
    heatmap,
  };
}
