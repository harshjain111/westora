/**
 * Single source of truth for all 17+ SKUs — now Supabase-backed
 * (supabase/migrations/0007-0009) rather than a static array, so the
 * admin product CRUD (lib/actions/products.ts) can add/edit/delete SKUs
 * without a redeploy.
 *
 * Reads go through Next.js's Data Cache (tag "products", revalidated on
 * every admin write via revalidateTag — see lib/actions/products.ts) so
 * the marketing pages stay statically served between edits, per CLAUDE.md
 * §14 ("Marketing page is statically rendered. It should be a CDN
 * document."). Server-side only — Client Components read products via
 * lib/context/ProductsContext.tsx instead of importing this module.
 */
import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/utils/env";
import { FALLBACK_PRODUCTS } from "@/data/products.fallback";

export type Category = "spices" | "chillies" | "tea" | "rice" | "other";

export interface ProductSpec {
  label: string;
  value: string;
  unverified?: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface CustomField {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  origin: string;
  originDistrict?: string;
  botanical: string;
  hasGI: boolean;
  giNumber?: string;
  heroLine: string;
  description: string;
  specs: ProductSpec[];
  forms: string[];
  packaging: string[];
  provenance: string[];
  images: ProductImage[];
  featured?: boolean;
  customFields: CustomField[];
  hsnCode?: string;
  packingSizes: string[];
}

interface ProductRow {
  slug: string;
  name: string;
  category: Category;
  origin: string;
  origin_district: string | null;
  botanical: string;
  has_gi: boolean;
  gi_number: string | null;
  hero_line: string;
  description: string;
  specs: ProductSpec[];
  forms: string[];
  packaging: string[];
  provenance: string[];
  images: ProductImage[];
  featured: boolean;
  custom_fields: CustomField[];
  hsn_code: string | null;
  packing_sizes: string[];
}

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    origin: row.origin,
    originDistrict: row.origin_district ?? undefined,
    botanical: row.botanical,
    hasGI: row.has_gi,
    giNumber: row.gi_number ?? undefined,
    heroLine: row.hero_line,
    description: row.description,
    specs: row.specs ?? [],
    forms: row.forms ?? [],
    packaging: row.packaging ?? [],
    provenance: row.provenance ?? [],
    images: row.images ?? [],
    featured: row.featured,
    customFields: row.custom_fields ?? [],
    hsnCode: row.hsn_code ?? undefined,
    packingSizes: row.packing_sizes ?? [],
  };
}

function cachedFetch(url: string | URL | Request, options?: RequestInit) {
  return fetch(url, { ...options, next: { revalidate: 3600, tags: ["products"] } });
}

function getClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false }, global: { fetch: cachedFetch } },
  );
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getClient()
    .from("products")
    .select(
      "slug, name, category, origin, origin_district, botanical, has_gi, gi_number, hero_line, description, specs, forms, packaging, provenance, images, featured, custom_fields, hsn_code, packing_sizes",
    )
    .order("sort_order", { ascending: true })
    .returns<ProductRow[]>();

  if (error) {
    // Supabase is unreachable — NOT the same as "there are no products".
    // Returning [] here shipped a silently empty catalogue on a page whose
    // whole job is credibility, so fall back to the build-time snapshot of
    // the seed migration instead. A legitimate empty result (someone
    // deleted every row via /admin/products) still returns empty below:
    // that is a real answer and must not be overridden.
    console.error(
      `[products] fetch failed (${error.message}) — serving ${FALLBACK_PRODUCTS.length} products from the build-time seed snapshot. Check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.`,
    );
    return FALLBACK_PRODUCTS;
  }
  return data.map(rowToProduct);
}

export async function getBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getByCategory(category: Category | "all"): Promise<Product[]> {
  const products = await getProducts();
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
}

export async function getCategoryCounts(): Promise<Record<Category | "all", number>> {
  const products = await getProducts();
  return {
    all: products.length,
    spices: products.filter((p) => p.category === "spices").length,
    chillies: products.filter((p) => p.category === "chillies").length,
    tea: products.filter((p) => p.category === "tea").length,
    rice: products.filter((p) => p.category === "rice").length,
    other: products.filter((p) => p.category === "other").length,
  };
}
