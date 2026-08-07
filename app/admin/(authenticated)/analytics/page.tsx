import { Heading } from "@/components/ui/Heading";
import { SubmissionsChart } from "@/components/admin/SubmissionsChart";
import { AnalyticsHourlyChart } from "@/components/admin/AnalyticsHourlyChart";
import { AnalyticsHeatmap } from "@/components/admin/AnalyticsHeatmap";
import { getAnalyticsStats } from "@/lib/admin/analyticsQueries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
};

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const stats = await getAnalyticsStats(supabase);

  return (
    <div>
      <Heading level={1}>Analytics</Heading>
      <p className="mt-2 max-w-[64ch] text-small text-ink-muted">
        First-party, cookieless-by-default visit data — recorded only for visitors who click
        &quot;Allow&quot; on the cookie notice. Last 30 days.
      </p>

      {!stats ? (
        <p className="mt-8 border border-rule bg-surface-raised p-6 text-body text-ink-muted">
          Couldn&apos;t load analytics data. This is expected until the site has recorded any
          consented visits.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              { label: "Visits today", value: stats.visitsToday },
              { label: "Visits, 7 days", value: stats.visits7d },
              { label: "Visits, 30 days", value: stats.visits30d },
              { label: "Page views, 30 days", value: stats.pageViews30d },
            ].map((card) => (
              <div key={card.label} className="border border-rule bg-surface-raised p-6">
                <p className="font-display text-h2 text-ink">{card.value}</p>
                <p className="mt-1 font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                  {card.label}
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Visits, last 30 days
            </p>
            <div className="mt-3 border border-rule bg-surface-raised p-4">
              <SubmissionsChart data={stats.dailyVisits} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Arrival time of day (UTC)
              </p>
              <div className="mt-3 border border-rule bg-surface-raised p-4">
                <AnalyticsHourlyChart data={stats.hourlyDistribution} />
              </div>
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Device
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {Object.entries(stats.deviceSplit).map(([device, count]) => (
                  <li
                    key={device}
                    className="flex justify-between border-b border-rule py-2 text-small text-ink"
                  >
                    <span>{DEVICE_LABELS[device] ?? device}</span>
                    <span className="font-mono text-ink-muted">{count}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Where visits come from
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li className="flex justify-between border-b border-rule py-2 text-small text-ink">
                  <span>Direct / unknown</span>
                  <span className="font-mono text-ink-muted">{stats.directCount}</span>
                </li>
                {stats.topReferrers.length === 0 ? (
                  <li className="py-2 text-small text-ink-muted">No referrer traffic recorded.</li>
                ) : (
                  stats.topReferrers.map((referrer) => (
                    <li
                      key={referrer.host}
                      className="flex justify-between border-b border-rule py-2 text-small text-ink"
                    >
                      <span>{referrer.host}</span>
                      <span className="font-mono text-ink-muted">{referrer.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Countries
              </p>
              {stats.countrySplit.length === 0 ? (
                <p className="mt-3 text-small text-ink-muted">No country data recorded yet.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {stats.countrySplit.map((entry) => (
                    <li
                      key={entry.country}
                      className="flex justify-between border-b border-rule py-2 text-small text-ink"
                    >
                      <span>{entry.country}</span>
                      <span className="font-mono text-ink-muted">{entry.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Most-visited pages
              </p>
              {stats.topPages.length === 0 ? (
                <p className="mt-3 text-small text-ink-muted">No page views recorded yet.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {stats.topPages.map((page) => (
                    <li
                      key={page.path}
                      className="flex justify-between border-b border-rule py-2 text-small text-ink"
                    >
                      <span className="truncate">{page.path}</span>
                      <span className="font-mono text-ink-muted">{page.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Time spent per section (homepage)
            </p>
            {stats.topSections.length === 0 ? (
              <p className="mt-3 text-small text-ink-muted">No section engagement recorded yet.</p>
            ) : (
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.topSections.map((section) => (
                  <li key={section.sectionId} className="border border-rule bg-surface-raised p-4">
                    <p className="font-display text-lead text-ink">
                      {formatDuration(section.totalDurationMs)}
                    </p>
                    <p className="mt-1 font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                      {section.sectionId}
                    </p>
                    <p className="mt-2 text-small text-ink-muted">
                      Avg {formatDuration(section.avgDurationMs)} · {section.sampleCount} visit
                      {section.sampleCount === 1 ? "" : "s"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Click heatmap {stats.heatmap ? `— ${stats.heatmap.path}` : ""}
            </p>
            {!stats.heatmap ? (
              <p className="mt-3 text-small text-ink-muted">No click data recorded yet.</p>
            ) : (
              <div className="mt-3">
                <AnalyticsHeatmap
                  rows={stats.heatmap.rows}
                  cols={stats.heatmap.cols}
                  cells={stats.heatmap.cells}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
