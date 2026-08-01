import Link from "next/link";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { getBySlug } from "@/data/products";
import type { Lead, ProfileRole } from "@/types";

export interface LeadsTableProps {
  leads: Lead[];
  role: ProfileRole;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function productNames(slugs: string[]) {
  return slugs.map((slug) => getBySlug(slug)?.name ?? slug).join(", ");
}

export function LeadsTable({ leads, role }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <p className="mt-8 border border-rule bg-surface-raised p-6 text-body text-ink-muted">
        No leads match the current filters.
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="mt-6 hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr className="border-b border-rule text-left font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Reference</th>
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Country</th>
              <th className="py-2 pr-4">Products</th>
              <th className="py-2 pr-4">Volume</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-rule text-ink">
                <td className="py-3 pr-4 font-mono">{formatDate(lead.created_at)}</td>
                <td className="py-3 pr-4 font-mono">
                  <Link href={`/admin/leads/${lead.id}`} className="text-accent underline underline-offset-2">
                    {lead.reference}
                  </Link>
                </td>
                <td className="py-3 pr-4">{lead.company_name}</td>
                <td className="py-3 pr-4">{lead.full_name}</td>
                <td className="py-3 pr-4">{lead.country}</td>
                <td className="max-w-[200px] truncate py-3 pr-4" title={productNames(lead.products)}>
                  {productNames(lead.products)}
                </td>
                <td className="py-3 pr-4">{lead.volume ?? "—"}</td>
                <td className="py-3 pr-4">
                  <StatusSelect leadId={lead.id} status={lead.status} disabled={role === "viewer"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 flex flex-col gap-4 lg:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className="border border-rule bg-surface-raised p-4">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="font-mono text-small text-accent underline underline-offset-2"
              >
                {lead.reference}
              </Link>
              <span className="font-mono text-eyebrow text-ink-muted">{formatDate(lead.created_at)}</span>
            </div>
            <p className="mt-2 font-display text-lead text-ink">{lead.company_name}</p>
            <p className="text-small text-ink-muted">
              {lead.full_name} · {lead.country}
            </p>
            <p className="mt-2 text-small text-ink">{productNames(lead.products)}</p>
            <div className="mt-3">
              <StatusSelect leadId={lead.id} status={lead.status} disabled={role === "viewer"} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
