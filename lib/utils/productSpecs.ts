import type { Product, ProductSpec } from "@/data/products";

/**
 * Specs plus HSN code / packing sizes as extra rows, for the mono spec
 * table (ProductSpecTable) on the product page and modal — same
 * empty-means-omit rule as every other spec row. Pure/type-only
 * dependency on data/products.ts so it's safe to import from Client
 * Components too (ProductModal.tsx), unlike the data-fetching functions
 * there.
 */
export function getDisplaySpecs(product: Product): ProductSpec[] {
  return [
    ...product.specs,
    ...(product.hsnCode ? [{ label: "HSN code", value: product.hsnCode }] : []),
    ...(product.packingSizes.length > 0
      ? [{ label: "Packing sizes", value: product.packingSizes.join(" · ") }]
      : []),
  ];
}
