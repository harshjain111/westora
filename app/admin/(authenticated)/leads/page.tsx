import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { LeadsFilters } from "@/components/admin/LeadsFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { ExportCsv } from "@/components/admin/ExportCsv";
import { createClient } from "@/lib/supabase/server";
import type { Lead, ProfileRole } from "@/types";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

function buildQueryString(params: Record<string, string | undefined>, overrides: Record<string, string>) {
  const merged = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...overrides })) {
    if (value !== undefined && value !== "") merged.set(key, value);
  }
  return merged.toString();
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const role: ProfileRole = (profile?.role as ProfileRole) ?? "viewer";

  let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", {
    ascending: false,
  });

  if (params.status) query = query.eq("status", params.status);
  if (params.country === "other") {
    query = query.not("country", "in", '("United Kingdom","United States")');
  } else if (params.country) {
    query = query.eq("country", params.country);
  }
  if (params.product) query = query.contains("products", [params.product]);
  if (params.from) query = query.gte("created_at", params.from);
  if (params.q) {
    query = query.or(
      `full_name.ilike.%${params.q}%,company_name.ilike.%${params.q}%,email.ilike.%${params.q}%`,
    );
  }

  const { data: leads, count, error } = await query.range(from, to).returns<Lead[]>();

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading level={1}>Leads</Heading>
        <ExportCsv leads={leads ?? []} />
      </div>

      <div className="mt-6">
        <LeadsFilters />
      </div>

      {error ? (
        <p className="mt-8 border border-rule bg-surface-raised p-6 text-body text-ink-muted">
          Couldn&apos;t load leads. This is expected until Supabase is configured with real
          credentials and the schema in supabase/migrations/ has been applied.
        </p>
      ) : (
        <>
          <LeadsTable leads={leads ?? []} role={role} />

          {totalPages > 1 && (
            <nav className="mt-6 flex items-center gap-4 font-mono text-small text-ink-muted">
              {page > 1 && (
                <Link href={`?${buildQueryString(params, { page: String(page - 1) })}`}>
                  ← Previous
                </Link>
              )}
              <span>
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`?${buildQueryString(params, { page: String(page + 1) })}`}>
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
