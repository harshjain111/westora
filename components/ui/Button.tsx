import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost-on-deep";
  size?: "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
}

const variantClasses = {
  // Design system §3: primary is a solid Forest Green fill, white text.
  // Hover "becomes #0F3022" is approximated with brightness-90 on the
  // existing brand-deep token rather than a seventh hardcoded colour —
  // stays correct if the token ever changes.
  primary:
    "bg-brand-deep text-surface-raised hover:brightness-90 disabled:hover:brightness-100",
  // §3: transparent, gold border, forest-green text, fills ivory on hover.
  secondary:
    "border-[1.5px] border-accent text-brand-deep hover:bg-surface disabled:hover:bg-transparent",
  "ghost-on-deep":
    // outline-accent-on-deep, not outline-accent: this variant only ever
    // renders on the brand-deep surface, where the base accent fails the
    // 3:1 non-text contrast floor for a focus ring.
    "border border-on-deep-muted text-on-deep hover:border-on-deep disabled:hover:border-on-deep-muted focus-visible:outline-accent-on-deep",
} as const;

// Design system §1 Font Scale gives buttons their own fixed size (16px
// semibold) independent of body/lead — so "lg" only adds horizontal
// padding for emphasis, not a bigger type size.
const sizeClasses = {
  md: "min-h-[54px] px-[34px]",
  lg: "min-h-[54px] px-11",
} as const;

export function Button({
  as = "button",
  href,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel = "Sending…",
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-button font-body text-[16px] font-semibold transition-all duration-[250ms] ease-out",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = loading ? loadingLabel : children;

  if (as === "a" && href && !isDisabled) {
    return (
      <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
