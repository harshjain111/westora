"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { useCatalogueFilter } from "@/lib/context/CatalogueFilterContext";
import { useProducts } from "@/lib/context/ProductsContext";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";
import { ORIGIN_STATES, type OriginState } from "@/data/origin-states";

// States, pin coordinates and the crop standing for each now come from
// data/origin-states.ts, shared with the hero's origin spread — so the
// map and the hero can never disagree about which states exist or what
// represents them. Tripura was previously missing here entirely.
type StateMarker = OriginState;
const STATES = ORIGIN_STATES;

const leafPath = (
  <>
    <path d="M6 19c8 0 12-4 12-12V5h-2C8 5 6 11 6 15v4z" />
    <path d="M6 19c2-3 5-6 10-8" />
  </>
);

function tooltipPositionClasses(state: StateMarker) {
  const horizontal =
    state.x < 25 ? "left-0 translate-x-0" : state.x > 78 ? "right-0 left-auto translate-x-0" : "left-1/2 -translate-x-1/2";
  const vertical = state.y > 65 ? "bottom-full mb-3" : "top-full mt-3";
  return cn(horizontal, vertical);
}

export function OriginMap() {
  const { setStateFilter } = useCatalogueFilter();
  const { products } = useProducts();
  const [activeState, setActiveState] = useState<string>(STATES[0]!.name);
  const prefersReducedMotion = useReducedMotion();

  function productsForState(state: string) {
    return products.filter((product) => product.origin === state);
  }
  // Seven concurrent infinite animations running from page load regardless
  // of scroll position was wasted compositor work for most of the visit
  // — gated to only animate while the map is actually on screen.
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { margin: "-10% 0px" });

  const activeProducts = productsForState(activeState);
  const previewImage = activeProducts[0]?.images[0];
  const activeMeta = STATES.find((s) => s.name === activeState)!;

  const handleViewInCatalogue = (state: string) => {
    track("origin_map_state_click", { state });
    setStateFilter(state);
    document
      .getElementById("catalogue")
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    // overflow-anchor:none — the map's per-dot tooltip is absolutely
    // positioned but still expands the page's scrollable bounds as it
    // flips above/below and left/right per dot. Without this, Chrome's
    // scroll anchoring "corrects" the viewport for that change on every
    // hover, which is what read as the map itself scrolling.
    <section id="origin" className="bg-brand-deep py-24 lg:py-40 [overflow-anchor:none]">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start lg:gap-12 xl:gap-24">
          {/* LEFT: copy, state pills, live preview card */}
          <div>
            <p className="font-display text-lead text-on-deep-muted">
              Seven states, one region
            </p>
            <Heading level={2} className="mt-3 text-on-deep">
              Select a state to see what we <em className="text-accent-on-deep">source</em> from it.
            </Heading>
            <p className="mt-5 max-w-[42ch] text-body text-on-deep-muted">
              From the fertile hills and valleys of Northeast India, we source
              premium spices, herbs and botanicals known for their
              exceptional quality and rich flavour.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {STATES.map((state) => {
                const isActive = activeState === state.name;
                return (
                  <button
                    key={state.name}
                    type="button"
                    onMouseEnter={() => setActiveState(state.name)}
                    onFocus={() => setActiveState(state.name)}
                    onClick={() => setActiveState(state.name)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-card border px-2 py-3 text-center transition-colors duration-[350ms] ease-out",
                      isActive
                        ? "border-accent-on-deep bg-brand-mid/25"
                        : "border-on-deep-muted/25 hover:border-on-deep-muted/50",
                    )}
                  >
                    <span
                      className={cn(
                        "block h-1.5 w-1.5 rounded-full transition-colors duration-[350ms]",
                        isActive ? "bg-accent-on-deep" : "bg-on-deep-muted/50",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] uppercase leading-tight tracking-mono-label transition-colors duration-[350ms]",
                        isActive ? "text-on-deep" : "text-on-deep-muted",
                      )}
                    >
                      {state.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* min-h reserves room for the tallest state's content (Assam,
                4 products, measured ~216px) so switching state never
                changes this box's height. It used to be a soft 124px
                floor — real content routinely exceeded it, and browsers'
                scroll-anchoring "corrects" the viewport for a height
                change that happens above the fold, which is exactly what
                read as "the map scrolls when you hover a dot". */}
            <div className="relative mt-8 min-h-[240px]">
              <motion.div
                key={activeState}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex gap-4 rounded-card border border-on-deep-muted/20 bg-surface/[0.04] p-4"
              >
                {previewImage ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-photo">
                    <Image
                      src={previewImage.src}
                      alt={previewImage.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  // No catalogued SKU for this state — fall back to its
                  // signature-crop cut-out so the card never renders as an
                  // empty slot.
                  <Image
                    src={activeMeta.image}
                    alt=""
                    aria-hidden="true"
                    sizes="80px"
                    className="h-20 w-20 shrink-0 object-contain"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-mono text-eyebrow uppercase tracking-mono-label text-accent-on-deep">
                    {activeState}
                  </p>
                  {activeProducts.length > 0 ? (
                    <ul className="mt-2 flex flex-col gap-1">
                      {activeProducts.map((product) => (
                        <li key={product.slug} className="flex items-center gap-2 text-small text-on-deep">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3 shrink-0 text-accent-on-deep"
                            aria-hidden="true"
                          >
                            {leafPath}
                          </svg>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-small leading-snug text-on-deep-muted">
                      <span className="text-on-deep">{activeMeta.crop}</span> — the region&apos;s
                      signature crop, not yet catalogued.
                    </p>
                  )}
                  {/* Only offered when the filter would actually land on
                      something. For a state with no SKUs it would scroll
                      the buyer to an empty grid. */}
                  {activeProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleViewInCatalogue(activeState)}
                      className="-ml-1 mt-1 inline-flex min-h-11 items-center px-1 font-mono text-[0.6875rem] uppercase tracking-mono-label text-accent-on-deep underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-deep"
                    >
                      View in catalogue →
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-on-deep-muted" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-accent-on-deep"
              >
                {leafPath}
              </svg>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label">
                Direct from origin. Delivered worldwide.
              </p>
            </div>
          </div>

          {/* RIGHT: interactive embossed map */}
          <div ref={mapRef} className="relative mx-auto aspect-[1000/1076] w-full max-w-[480px] lg:max-w-none">
            <Image
              src="/images/origin-map.png"
              alt="Relief map of the seven Northeast India states Westora sources from: Arunachal Pradesh, Assam, Nagaland, Meghalaya, Manipur, Tripura and Mizoram"
              fill
              sizes="(min-width: 1024px) 46vw, 90vw"
              className="object-contain"
            />

            {STATES.map((state) => {
              const isActive = activeState === state.name;
              const stateProducts = productsForState(state.name);

              return (
                <div
                  key={state.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${state.x}%`, top: `${state.y}%` }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActiveState(state.name)}
                    onFocus={() => setActiveState(state.name)}
                    onClick={() => setActiveState(state.name)}
                    aria-label={`${state.name} — preview products sourced from here`}
                    aria-pressed={isActive}
                    className="relative flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-deep"
                  >
                    {!prefersReducedMotion && !isActive && mapInView && (
                      <motion.span
                        className="absolute h-3 w-3 rounded-full bg-accent-on-deep"
                        animate={{ scale: [1, 2.4, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        "absolute h-7 w-7 rounded-full bg-accent-on-deep/50 blur-md transition-opacity duration-[350ms] ease-out",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "relative block h-2.5 w-2.5 rounded-full bg-accent-on-deep shadow-[0_0_10px_rgba(201,162,95,0.85)] transition-transform duration-[350ms] ease-out",
                        isActive && "scale-125",
                      )}
                    />
                  </button>

                  {isActive && (
                    <motion.div
                      role="tooltip"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={cn(
                        "pointer-events-none absolute z-10 w-max max-w-[min(240px,62vw)] rounded-card border border-on-deep-muted/25 bg-brand-deep/85 p-3 text-left shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md",
                        tooltipPositionClasses(state),
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* The state's crop, same cut-out the hero uses —
                            it ties the two sections together and makes the
                            pin mean something at a glance. */}
                        <Image
                          src={state.image}
                          alt=""
                          aria-hidden="true"
                          sizes="52px"
                          className="h-[52px] w-[52px] shrink-0 object-contain"
                        />
                        <div className="min-w-0">
                          <p className="font-mono text-eyebrow uppercase tracking-mono-label text-accent-on-deep">
                            {state.name}
                          </p>
                          <p className="mt-1 font-display text-small font-semibold leading-tight text-on-deep">
                            {state.crop}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2.5 border-t border-on-deep-muted/25 pt-2.5 text-small leading-snug text-on-deep-muted">
                        {stateProducts.length > 0
                          ? stateProducts.map((product) => product.name).join(" · ")
                          : "Regional signature crop — not yet catalogued."}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
