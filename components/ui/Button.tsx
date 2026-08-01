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
  primary:
    "bg-accent text-surface-raised hover:bg-brand-mid disabled:hover:bg-accent",
  secondary:
    "border border-ink text-ink hover:border-accent hover:text-accent disabled:hover:border-ink disabled:hover:text-ink",
  "ghost-on-deep":
    // outline-accent-on-deep, not outline-accent: this variant only ever
    // renders on the brand-deep surface, where the base accent fails the
    // 3:1 non-text contrast floor for a focus ring (2.55:1).
    "border border-on-deep-muted text-on-deep hover:border-on-deep disabled:hover:border-on-deep-muted focus-visible:outline-accent-on-deep",
} as const;

const sizeClasses = {
  md: "min-h-11 px-6 text-body",
  lg: "min-h-12 px-8 text-lead",
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
    "inline-flex items-center justify-center gap-2 rounded-[2px] font-body text-[0.9375rem] font-medium transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:cursor-not-allowed disabled:opacity-50",
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
