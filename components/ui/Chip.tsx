import { cn } from "@/lib/utils/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral";
}

/**
 * Rectangular, not a rounded pill — CLAUDE.md §6 caps radius at 2px
 * across the whole site ("softness reads consumer, this is a trade site").
 */
export function Chip({ variant = "neutral", className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[2px] border px-2 py-1 font-mono text-eyebrow uppercase tracking-mono-label",
        variant === "accent"
          ? "border-accent text-accent"
          : "border-rule text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
