"use client";

import { cn } from "@/lib/utils/cn";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  /** First item open by default; independent native <details> elements
   * otherwise, so any number can be open at once. */
  defaultOpenId?: string;
  className?: string;
  /** Fires when an item is opened (not closed) — index into `items`. */
  onItemOpen?: (index: number) => void;
}

export function Accordion({ items, defaultOpenId, className, onItemOpen }: AccordionProps) {
  return (
    <div className={cn("divide-y divide-rule border-y border-rule", className)}>
      {items.map((item, index) => (
        <details
          key={item.id}
          open={item.id === defaultOpenId}
          className="group py-5"
          onToggle={(event) => {
            if (event.currentTarget.open) onItemOpen?.(index);
          }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lead text-ink [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden="true"
              className="font-mono text-lead text-ink-muted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-4 max-w-[70ch] text-body text-ink-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
