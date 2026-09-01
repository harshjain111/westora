"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Odometer-style counter for the credential strip.
 *
 * Differs from StatCell (still used for the About section's plain stats)
 * in easing over 1.4s rather than 0.6s, so the four figures read as
 * deliberate rather than as a flicker, and in holding a fixed width via
 * tabular numerals so the layout does not jitter as digits change.
 *
 * An earlier version set a huge ghosted copy of the value behind the
 * figure as texture. It did not survive contact with the two-column
 * layout: offset from the real numeral it simply read as a doubled,
 * mis-rendered number. Texture is carried by the section's rule grid and
 * motif instead, and each figure gets a short accent rule of its own.
 *
 * Anything with no leading integer ("UK · US") renders verbatim and skips
 * the animation entirely.
 */

const NUMERIC = /^(\d+(?:,\d{3})*)(.*)$/;

export interface StatCounterProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCounter({ value, label, className }: StatCounterProps) {
  const match = value.match(NUMERIC);
  const target = match ? Number(match[1]!.replace(/,/g, "")) : null;
  const suffix = match ? match[2]! : "";

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion || target === null ? (target ?? 0) : 0);

  useEffect(() => {
    if (target === null) return;
    if (!isInView || prefersReducedMotion) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, target]);

  const shown = target === null ? value : `${display.toLocaleString()}${suffix}`;

  return (
    <div ref={ref} className={cn("group", className)}>
      <span
        aria-hidden="true"
        className="block h-[2px] w-8 bg-accent-on-deep transition-all duration-500 ease-out group-hover:w-14"
      />
      <p className="mt-6 font-display text-[3rem] font-extrabold leading-none tracking-display text-on-deep tabular-nums lg:text-[3.75rem]">
        {shown}
      </p>
      <p className="mt-4 max-w-[26ch] text-small leading-snug text-on-deep-muted">{label}</p>
    </div>
  );
}
