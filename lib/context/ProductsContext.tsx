"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Category, Product } from "@/data/products";

export interface ProductsContextValue {
  products: Product[];
  getBySlug: (slug: string) => Product | undefined;
  getByCategory: (category: Category | "all") => Product[];
  categoryCounts: Record<Category | "all", number>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

/**
 * Products now live in Supabase (data/products.ts), fetched once per
 * request in the root layout (a Server Component) and handed down here so
 * Client Components — the catalogue grid, product modal, category
 * filter, enquiry form's product picker, admin leads table/CSV — don't
 * each need their own fetch. Re-derive counts/lookups here rather than
 * duplicating them at every call site.
 */
export function ProductsProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const value = useMemo<ProductsContextValue>(() => {
    const counts: Record<Category | "all", number> = {
      all: products.length,
      spices: 0,
      chillies: 0,
      tea: 0,
      rice: 0,
      other: 0,
    };
    for (const product of products) counts[product.category] += 1;

    return {
      products,
      getBySlug: (slug) => products.find((product) => product.slug === slug),
      getByCategory: (category) =>
        category === "all" ? products : products.filter((product) => product.category === category),
      categoryCounts: counts,
    };
  }, [products]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return ctx;
}
