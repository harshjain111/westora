import { cn } from "@/lib/utils/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral";
}

/**
 * Pill-shaped per the brand-identity board ("Tags / Badges").
 */
export function Chip({ variant = "neutral", className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-westora border px-2.5 py-1 font-mono text-eyebrow uppercase tracking-mono-label",
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
