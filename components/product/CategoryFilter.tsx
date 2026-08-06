"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { categoryCounts, type Category } from "@/data/products";

export type CategoryKey = Category | "all";

const OPTIONS: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "spices", label: "Spices" },
  { key: "chillies", label: "Chillies" },
  { key: "tea", label: "Tea" },
  { key: "rice", label: "Rice" },
  { key: "other", label: "Other" },
];

export interface CategoryFilterProps {
  value: CategoryKey;
  onChange: (key: CategoryKey) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (fromIndex: number, delta: number) => {
    const nextIndex = (fromIndex + delta + OPTIONS.length) % OPTIONS.length;
    const next = OPTIONS[nextIndex]!;
    onChange(next.key);
    refs.current[next.key]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Filter catalogue by category" className="flex flex-wrap gap-3">
      {OPTIONS.map((option, index) => {
        const isActive = option.key === value;
        return (
          <button
            key={option.key}
            ref={(el) => {
              refs.current[option.key] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.key)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className={cn(
              "flex min-h-11 items-center rounded-westora border px-4 py-2 font-mono text-small tracking-mono-label uppercase transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              isActive
                ? "border-accent bg-accent text-surface-raised"
                : "border-rule text-ink-muted hover:border-accent/50 hover:text-ink",
            )}
          >
            {option.label} ({categoryCounts[option.key]})
          </button>
        );
      })}
    </div>
  );
}
