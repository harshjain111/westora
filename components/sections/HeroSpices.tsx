"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ORIGIN_STATES, type OriginState } from "@/data/origin-states";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";

/**
 * The origin spread: one crop per Northeast state, as cut-outs resting on
 * the page ground. Hovering or focusing one raises its provenance.
 *
 * Data — including which states may claim a catalogue link — comes from
 * data/origin-states.ts; read the provenance note there before changing
 * what any card asserts.
 */

function Card({ state }: { state: OriginState }) {
  return (
    <>
      <p className="font-mono text-[11px] tracking-mono-label uppercase text-accent-on-deep">
        {state.district ? `${state.district} · ${state.name}` : state.name}
      </p>
      <p className="mt-2 font-display text-lead font-semibold leading-tight text-on-deep">
        {state.crop}
      </p>
      <p className="mt-1 text-[13px] italic leading-snug text-on-deep-muted">{state.botanical}</p>

      {state.slug ? (
        <>
          <p className="mt-3 border-t border-on-deep-muted/30 pt-3 text-[13px] leading-snug text-on-deep">
            {state.note}
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-mono-label uppercase text-accent-on-deep">
            View details →
          </p>
        </>
      ) : (
        // No catalogue row lists this state as an origin yet, so the card
        // names the region's crop and stops — no spec, no product link,
        // nothing that would read as a sourcing claim.
        <p className="mt-3 border-t border-on-deep-muted/30 pt-3 text-[13px] leading-snug text-on-deep-muted">
          Regional signature crop — not yet catalogued.
        </p>
      )}
    </>
  );
}

export function HeroSpices({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <ul
      className={cn(
        // Always a grid, never a scroller: seven crops wrap onto as many
        // rows as the width allows, so none is ever clipped or hidden
        // behind a scroll the visitor has to discover. Column count steps
        // 3 → 4 → 7 so the last row is never left with a single orphan.
        "grid grid-cols-3 gap-x-1 gap-y-3 min-[560px]:grid-cols-4 xl:grid-cols-7 xl:gap-y-0",
        className,
      )}
    >
      {ORIGIN_STATES.map((state) => {
        const isActive = active === state.name;
        const Wrapper = state.slug ? "a" : "div";

        return (
          <li key={state.name} className="relative">
            <Wrapper
              {...(state.slug
                ? {
                    href: `/products/${state.slug}`,
                    onClick: () => track("hero_cta_click", { target: "catalogue" }),
                  }
                : {})}
              tabIndex={0}
              onMouseEnter={() => setActive(state.name)}
              onMouseLeave={() => setActive((s) => (s === state.name ? null : s))}
              onFocus={() => setActive(state.name)}
              onBlur={() => setActive((s) => (s === state.name ? null : s))}
              aria-label={
                state.slug
                  ? `${state.crop} from ${state.name} — view specifications`
                  : `${state.crop} — signature crop of ${state.name}`
              }
              className="group block rounded-card px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {/* Height-constrained, not width-constrained. The crops
                  have wildly different aspect ratios — a pineapple is
                  portrait, a heap of tea is wide — so sizing by width
                  makes the tall ones tower over the row. A fixed height
                  with object-contain gives every crop the same optical
                  weight and keeps the band an even depth. */}
              <div className="flex h-[96px] items-end justify-center lg:h-[116px] xl:h-[132px]">
                <Image
                  src={state.image}
                  alt={`${state.crop} from ${state.name}`}
                  sizes="(min-width: 1280px) 170px, (min-width: 640px) 140px, 112px"
                  priority
                  className={cn(
                    "max-h-full w-auto object-contain transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-hover:-translate-y-3 group-focus-visible:-translate-y-3",
                  )}
                />
              </div>
              <p
                className={cn(
                  "mt-1 text-center font-mono text-[10px] leading-tight tracking-mono-label uppercase transition-colors duration-300",
                  isActive ? "text-accent" : "text-ink-muted",
                )}
              >
                {state.name}
              </p>
            </Wrapper>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  // Pointer-events off: the card reports on the item being
                  // hovered, it is never a hover target itself, so it can
                  // never steal the pointer and flicker the state.
                  className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-[248px] -translate-x-1/2 rounded-card bg-brand-deep p-5 shadow-[0_24px_50px_rgba(43,32,21,0.32)]"
                >
                  <Card state={state} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
