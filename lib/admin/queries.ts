import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead, LeadStatus } from "@/types";
import { getProducts } from "@/data/products";

export interface DashboardStats {
  leadsToday: number;
  leads7d: number;
  leads30d: number;
  statusFunnel: Record<LeadStatus, number>;
  topProducts: { slug: string; name: string; count: number }[];
  countrySplit: { uk: number; us: number; other: number };
  dailySubmissions: { date: string; count: number }[];
}

const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "quoted", "sampled", "won", "lost"];

/**
 * Returns null (never throws) if the query fails — the dashboard renders
 * an explicit "couldn't load" state rather than crashing or showing
 * zeros as if they were real data (PRD FR-15.3 / Prompt 44).
 */
export async function getDashboardStats(supabase: SupabaseClient): Promise<DashboardStats | null> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("status, country, products, created_at")
    .gte("created_at", start30d)
    .returns<Pick<Lead, "status" | "country" | "products" | "created_at">[]>();

  if (error) {
    console.error("[admin] dashboard query failed:", error.message);
    return null;
  }

  const leadsToday = leads.filter((lead) => lead.created_at >= startOfToday).length;
  const leads7d = leads.filter((lead) => lead.created_at >= start7d).length;
  const leads30d = leads.length;

  const statusFunnel = STATUS_ORDER.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<LeadStatus, number>,
  );
  for (const lead of leads) {
    if (lead.status in statusFunnel) statusFunnel[lead.status as LeadStatus] += 1;
  }

  const productCounts = new Map<string, number>();
  for (const lead of leads) {
    for (const slug of lead.products) {
      productCounts.set(slug, (productCounts.get(slug) ?? 0) + 1);
    }
  }
  const allProducts = await getProducts();
  const nameBySlug = new Map(allProducts.map((product) => [product.slug, product.name]));
  const topProducts = [...productCounts.entries()]
    .map(([slug, count]) => ({ slug, name: nameBySlug.get(slug) ?? slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const countrySplit = { uk: 0, us: 0, other: 0 };
  for (const lead of leads) {
    if (lead.country === "United Kingdom") countrySplit.uk += 1;
    else if (lead.country === "United States") countrySplit.us += 1;
    else countrySplit.other += 1;
  }

  const dailyCounts = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dailyCounts.set(date, 0);
  }
  for (const lead of leads) {
    const date = lead.created_at.slice(0, 10);
    if (dailyCounts.has(date)) {
      dailyCounts.set(date, (dailyCounts.get(date) ?? 0) + 1);
    }
  }
  const dailySubmissions = [...dailyCounts.entries()].map(([date, count]) => ({ date, count }));

  return { leadsToday, leads7d, leads30d, statusFunnel, topProducts, countrySplit, dailySubmissions };
}
