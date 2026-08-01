"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { CategoryFilter, type CategoryKey } from "@/components/product/CategoryFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductModal } from "@/components/product/ProductModal";
import { getByCategory, getBySlug } from "@/data/products";
import { useCatalogueFilter } from "@/lib/context/CatalogueFilterContext";
import { track } from "@/lib/analytics/track";

export interface CatalogueProps {
  initialCategory?: CategoryKey;
}

export function Catalogue({ initialCategory = "all" }: CatalogueProps) {
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { stateFilter, setStateFilter } = useCatalogueFilter();

  const items = useMemo(() => {
    const byCategory = getByCategory(category);
    return stateFilter ? byCategory.filter((product) => product.origin === stateFilter) : byCategory;
  }, [category, stateFilter]);

  // Direct load of /?product=slug opens the modal (FR-5.8). Runs after
  // mount so the server-rendered markup (always closed) matches the
  // client's first render — no hydration mismatch. ProductModal's own
  // URL-sync effect ignores its first run, so it won't race to clear this
  // query param before this effect gets to read it.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("product");
    if (slug && getBySlug(slug)) {
      setOpenSlug(slug);
      track("product_modal_open", { slug, source: "deeplink" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selecting a state from OriginMap should show everything from that
  // state, not just whatever category happened to be selected already.
  useEffect(() => {
    if (stateFilter) setCategory("all");
  }, [stateFilter]);

  const handleOpenFromGrid = (slug: string) => {
    setOpenSlug(slug);
    track("product_modal_open", { slug, source: "grid" });
  };

  const handleCategoryChange = (next: CategoryKey) => {
    setCategory(next);
    track("catalogue_filter_change", { category: next });
  };

  return (
    <section id="catalogue" className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow as="p">The catalogue</Eyebrow>
          <Heading level={2} className="mt-4">
            Seventeen crops, five categories
          </Heading>
          <p className="mt-4 text-lead text-ink-muted">
            Every product below is available for sampling. Click any item for
            specifications and to raise an enquiry.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CategoryFilter value={category} onChange={handleCategoryChange} />
          {stateFilter && (
            <button
              type="button"
              onClick={() => setStateFilter(null)}
              className="flex min-h-11 items-center border border-accent px-4 py-2 font-mono text-small tracking-mono-label uppercase text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {stateFilter} × Clear
            </button>
          )}
        </div>

        <motion.div
          layout={!prefersReducedMotion}
          transition={{ duration: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4"
        >
          {items.map((product, index) => (
            <motion.div
              key={product.slug}
              layout={!prefersReducedMotion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} onOpen={handleOpenFromGrid} priority={index < 4} />
            </motion.div>
          ))}
        </motion.div>
      </Container>

      <ProductModal
        slug={openSlug}
        category={category}
        onClose={() => setOpenSlug(null)}
        onNavigate={setOpenSlug}
      />
    </section>
  );
}
