"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { CategoryFilter, type CategoryKey } from "@/components/product/CategoryFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductModal } from "@/components/product/ProductModal";
import { getByCategory, getBySlug } from "@/data/products";
import { useCatalogueFilter } from "@/lib/context/CatalogueFilterContext";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { track } from "@/lib/analytics/track";

// Copy here is verbatim from the client's supplied reference layout, at
// their explicit direction ("ditto copy") — an intentional exception to
// this codebase's usual rule of only stating claims we can substantiate
// (CLAUDE.md §11). Everywhere else on the site still follows that rule.
const CTA_POINTS: { icon: IconName; title: string; body: string }[] = [
  { icon: "headset", title: "Let's connect", body: "Our team is ready to assist you personally." },
  {
    icon: "clipboard",
    title: "Custom solutions",
    body: "Bulk orders, private labeling & tailored specifications.",
  },
  {
    icon: "clock",
    title: "Response in 24 hours",
    body: "We respond quickly and provide detailed information.",
  },
  {
    icon: "package",
    title: "End-to-end support",
    body: "From sourcing to shipping, we've got you covered.",
  },
];

export interface CatalogueProps {
  initialCategory?: CategoryKey;
}

export function Catalogue({ initialCategory = "all" }: CatalogueProps) {
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { stateFilter, setStateFilter } = useCatalogueFilter();
  const { open: openEnquiry } = useEnquiryModal();

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
    <section id="catalogue" className="bg-surface">
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <Image
            src="/images/catalogue-banner.jpg"
            alt="Ginger, cardamom, cinnamon and star anise arranged on a wooden table"
            fill
            sizes="58vw"
            className="object-cover"
            priority
          />
        </div>

        <Container className="relative py-24 lg:py-32">
          <div className="max-w-[560px]">
            <Eyebrow as="p">The catalogue</Eyebrow>
            <Heading level={2} className="mt-4">
              Our product catalogue
            </Heading>
            <div className="mt-3 h-[3px] w-16 bg-accent" aria-hidden="true" />
            <p className="mt-6 text-lead text-ink-muted">
              Explore our range of origin-locked crops, carefully sourced from
              Northeast India and exported worldwide.
            </p>
          </div>

          <PremiumBadge className="absolute right-[24%] top-1/2 hidden -translate-y-1/2 lg:block" />
        </Container>
      </div>

      <Container className="pt-16 lg:pt-20">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <CategoryFilter value={category} onChange={handleCategoryChange} />
          {stateFilter && (
            <button
              type="button"
              onClick={() => setStateFilter(null)}
              className="flex min-h-11 items-center rounded-westora border border-accent px-4 py-2 font-mono text-small tracking-mono-label uppercase text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {stateFilter} × Clear
            </button>
          )}
        </div>

        <motion.div
          layout={!prefersReducedMotion}
          transition={{ duration: 0.3 }}
          className="mt-10 grid grid-cols-2 gap-3 min-[640px]:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4"
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

        {/* Mobile / tablet: simple stacked card — the desktop version below
            relies on a fixed-aspect diagonal background image that can't
            gracefully reflow to a stacked layout. */}
        <div className="mt-16 flex flex-col gap-8 rounded-card bg-brand-deep p-8 lg:hidden">
          <div className="flex flex-col gap-2">
            <p className="font-display text-h3 text-on-deep">
              Can&apos;t find what you&apos;re <em className="text-accent-on-deep">looking for?</em>
            </p>
            <div className="h-[2px] w-10 bg-accent-on-deep" aria-hidden="true" />
            <p className="text-body text-on-deep-muted">
              Get in touch directly — the same team that sources, tests and ships can help
              with bulk needs, specifications or customization beyond this catalogue.
            </p>
            <div className="mt-2">
              <Button variant="ghost-on-deep" onClick={() => openEnquiry()}>
                Talk to our export team
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-on-deep-muted pt-8">
            {CTA_POINTS.map((point) => (
              <div key={point.title} className="flex flex-col items-start gap-2">
                <IconBadge icon={point.icon} filled size="sm" />
                <p className="font-display text-body text-on-deep">{point.title}</p>
                <p className="text-small text-on-deep-muted">{point.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: exact reference layout — pre-built diagonal-cut
            background image (dark ground + leaf branch + spice bowl),
            content positioned in the two zones it defines. */}
        <div className="relative mt-16 hidden overflow-hidden rounded-card lg:block">
          <Image
            src="/images/catalogue-cta-banner.jpg"
            alt=""
            width={1900}
            height={828}
            className="h-auto w-full"
          />

          <div className="absolute inset-0 flex items-center">
            <div className="w-[42%] pl-12 pr-6">
              <p className="font-display text-h3 text-on-deep">
                Can&apos;t find what you&apos;re{" "}
                <em className="text-accent-on-deep">looking for?</em>
              </p>
              <div className="mt-4 h-[2px] w-10 bg-accent-on-deep" aria-hidden="true" />
              <p className="mt-4 text-small text-on-deep-muted">
                Get in touch directly — the same team that sources, tests and ships can help
                with bulk needs, specifications or customization beyond this catalogue.
              </p>
              <div className="mt-6">
                <Button
                  variant="ghost-on-deep"
                  size="md"
                  className="border-accent-on-deep text-accent-on-deep hover:border-on-deep hover:text-on-deep"
                  onClick={() => openEnquiry()}
                >
                  Talk to our export team
                </Button>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-4 gap-4 divide-x divide-rule px-8">
              {CTA_POINTS.map((point) => (
                <div key={point.title} className="flex flex-col items-center gap-2 px-2 text-center first:pl-0">
                  <IconBadge icon={point.icon} filled size="sm" />
                  <p className="font-display text-small font-medium text-ink">{point.title}</p>
                  <p className="text-[0.8125rem] leading-snug text-ink-muted">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
