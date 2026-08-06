"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface ProvenanceLineProps {
  nodes: string[];
  size?: "inline" | "feature";
  /** Set when rendering on the brand-deep surface (e.g. the Quality
   * section) — the base accent fails 3:1 non-text contrast there, so the
   * line and dots switch to the lightened accent-on-deep token. */
  onDeep?: boolean;
  className?: string;
}

const ROLES = ["origin", "consolidation", "load port", "discharge"];

export function ProvenanceLine({ nodes, size = "inline", onDeep = false, className }: ProvenanceLineProps) {
  const prefersReducedMotion = useReducedMotion();
  const columns = { gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` };
  const isFeature = size === "feature";
  const accentClass = onDeep ? "bg-accent-on-deep" : "bg-accent";

  return (
    <div className={cn("w-full", className)}>
      <div className="grid gap-2" style={columns}>
        {nodes.map((node) => (
          <p
            key={`place-${node}`}
            className={cn(
              // min-w-0: without it, CSS Grid items default to
              // min-width:auto (their min-content size), which lets long
              // unbreakable labels like "Felixstowe / New York" blow out
              // the grid track and overflow the page on narrow viewports.
              "min-w-0 break-words text-center font-mono tracking-mono-label uppercase text-current",
              isFeature ? "text-body" : "text-eyebrow",
            )}
          >
            {node}
          </p>
        ))}
      </div>

      <div className={cn("relative", isFeature ? "my-4 h-4" : "my-2 h-2")}>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current opacity-15" />
        <motion.div
          className={cn("absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2", accentClass)}
          initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
        />
        <div className="relative grid h-full" style={columns}>
          {nodes.map((node, index) => (
            <div key={`dot-${node}`} className="flex min-w-0 items-center justify-center">
              <motion.span
                className={cn("block rounded-full", accentClass, isFeature ? "h-3 w-3" : "h-2 w-2")}
                initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.25, delay: index * 0.1, ease: "easeOut" }
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2" style={columns}>
        {nodes.map((node, index) => (
          <p
            key={`role-${node}`}
            className={cn(
              "min-w-0 text-center font-mono tracking-mono-label uppercase text-current opacity-60",
              isFeature ? "text-small" : "text-eyebrow",
            )}
          >
            {ROLES[index] ?? ""}
          </p>
        ))}
      </div>
    </div>
  );
}
