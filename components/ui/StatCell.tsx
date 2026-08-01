"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface StatCellProps {
  value: string;
  label: string;
  tone?: "on-deep" | "default";
  className?: string;
}

const NUMERIC_PATTERN = /^(\d+(?:,\d{3})*)(.*)$/;

/**
 * Renders `value` as-is when it has no leading integer (e.g. "UK · US").
 * When it does (e.g. "17", "100%"), counts up from 0 on first scroll into
 * view over 600ms, then stays at the final value. Static under
 * prefers-reduced-motion.
 */
export function StatCell({ value, label, tone = "default", className }: StatCellProps) {
  const match = value.match(NUMERIC_PATTERN);
  const target = match ? Number(match[1]!.replace(/,/g, "")) : null;
  const suffix = match ? match[2]! : "";

  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion || target === null ? target ?? 0 : 0);

  useEffect(() => {
    if (target === null) return;
    if (!isInView || prefersReducedMotion) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, target]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p
        ref={ref}
        className={cn(
          "font-display text-h2",
          tone === "on-deep" ? "text-on-deep" : "text-ink",
        )}
      >
        {target === null ? value : `${display.toLocaleString()}${suffix}`}
      </p>
      <p
        className={cn(
          "font-mono text-small tracking-mono-label uppercase",
          tone === "on-deep" ? "text-on-deep-muted" : "text-ink-muted",
        )}
      >
        {label}
      </p>
    </div>
  );
}
