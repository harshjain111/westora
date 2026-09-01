"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils/cn";

/**
 * The source-to-port journey.
 *
 * Replaces an absolutely-positioned overlay whose stops were pinned to
 * percentages measured off the background artwork. That approach could
 * not hold: the heading column was 48% wide and the first stop sat at
 * x=14%, so on a wide viewport — where the fixed 1721:914 box is short
 * relative to its text — the intro paragraph ran straight through the
 * first icon. It also forced an entirely separate stacked layout below
 * sm, so the section was maintained twice.
 *
 * This is one flow layout at every width. The rail is drawn with a
 * transform rather than by positioning things on top of a photograph, so
 * nothing can collide no matter how the copy reflows.
 */

export interface Stop {
  icon: IconName;
  place: string;
  role: string;
  description: string;
}

export function QualityJourney({ stops }: { stops: Stop[] }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);

  return (
    <ol
      ref={ref}
      className="relative grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* The rail. Horizontal from lg, where all four stops share a row;
          below that each stop carries its own short vertical connector,
          because a single line across a wrapped grid would cut through
          the gap between rows rather than joining anything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[30px] hidden lg:block"
      >
        <motion.div
          className="h-px origin-left bg-accent-on-deep/45"
          initial={prefersReducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {stops.map((stop, index) => (
        <motion.li
          key={stop.place}
          className="group relative"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: prefersReducedMotion ? 0 : 0.28 + index * 0.13,
          }}
        >
          <div className="flex items-center gap-4 lg:block">
            <div className="relative z-10 inline-flex shrink-0 bg-brand-deep lg:pr-4">
              <IconBadge
                icon={stop.icon}
                tone="on-deep"
                className={cn(
                  "border-accent-on-deep/40 bg-brand-deep transition-all duration-[400ms] ease-out",
                  "group-hover:border-accent-on-deep group-hover:text-accent-on-deep",
                  "group-hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent-on-deep)_14%,transparent)]",
                )}
              />
            </div>

            {/* Below lg the rail becomes a short leader beside each stop. */}
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-accent-on-deep/30 lg:hidden"
            />
          </div>

          <div className="mt-5 lg:mt-6">
            <p className="font-mono text-[11px] tracking-mono-label uppercase text-accent-on-deep">
              {String(index + 1).padStart(2, "0")} · {stop.role}
            </p>
            <p className="mt-2 font-display text-lead font-semibold leading-tight text-on-deep">
              {stop.place}
            </p>
            <p className="mt-2 max-w-[30ch] text-small leading-relaxed text-on-deep-muted">
              {stop.description}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
