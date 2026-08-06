import { Heading } from "@/components/ui/Heading";
import { SubmissionsChart } from "@/components/admin/SubmissionsChart";
import { getDashboardStats } from "@/lib/admin/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  sampled: "Sampled",
  won: "Won",
  lost: "Lost",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getDashboardStats(supabase);

  return (
    <div>
      <Heading level={1}>Dashboard</Heading>

      {!stats ? (
        <p className="mt-8 border border-rule bg-surface-raised p-6 text-body text-ink-muted">
          Couldn&apos;t load dashboard data. This is expected until Supabase is configured with
          real credentials and the schema in supabase/migrations/ has been applied.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Leads today", value: stats.leadsToday },
              { label: "Leads, 7 days", value: stats.leads7d },
              { label: "Leads, 30 days", value: stats.leads30d },
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
              Status funnel
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries(stats.statusFunnel).map(([status, count]) => (
                <div key={status} className="border border-rule bg-surface-raised p-4">
                  <p className="font-display text-lead text-ink">{count}</p>
                  <p className="mt-1 font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                    {STATUS_LABELS[status] ?? status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Top-enquired products
              </p>
              {stats.topProducts.length === 0 ? (
                <p className="mt-3 text-small text-ink-muted">No enquiries in the last 30 days.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {stats.topProducts.map((product) => (
                    <li
                      key={product.slug}
                      className="flex justify-between border-b border-rule py-2 text-small text-ink"
                    >
                      <span>{product.name}</span>
                      <span className="font-mono text-ink-muted">{product.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Country split
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li className="flex justify-between border-b border-rule py-2 text-small text-ink">
                  <span>United Kingdom</span>
                  <span className="font-mono text-ink-muted">{stats.countrySplit.uk}</span>
                </li>
                <li className="flex justify-between border-b border-rule py-2 text-small text-ink">
                  <span>United States</span>
                  <span className="font-mono text-ink-muted">{stats.countrySplit.us}</span>
                </li>
                <li className="flex justify-between border-b border-rule py-2 text-small text-ink">
                  <span>Other</span>
                  <span className="font-mono text-ink-muted">{stats.countrySplit.other}</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Submissions, last 30 days
            </p>
            <div className="mt-3 border border-rule bg-surface-raised p-4">
              <SubmissionsChart data={stats.dailySubmissions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
