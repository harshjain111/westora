import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Our @theme in globals.css defines a custom font-size scale (text-h1,
// text-h2, text-h3, text-lead, text-body, text-small, text-eyebrow)
// alongside custom text-color tokens (text-on-deep, text-accent, text-ink,
// ...). Plain twMerge doesn't recognise these custom names as font-size
// utilities, so it falls back to lumping every unrecognised `text-*` class
// into the text-color group — meaning `cn("text-h2", "text-on-deep")`
// silently drops text-h2, and the heading renders at the browser default
// 16px instead of its intended size. Registering the scale here as its own
// group is what stops that: font-size now only conflicts with itself.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-h1", "text-h2", "text-h3", "text-lead", "text-body", "text-small", "text-eyebrow"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
