import { cn } from "@/lib/utils/cn";

export type IconName =
  | "quality"
  | "globe"
  | "leaf"
  | "shield"
  | "truck"
  | "handshake"
  | "headset"
  | "clipboard"
  | "clock"
  | "package"
  | "warehouse"
  | "ship"
  | "message"
  | "document"
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "chevronDown"
  | "question";

export interface IconBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconName;
  tone?: "default" | "on-deep";
  size?: "sm" | "md";
  /** Solid brand-deep circle with an on-deep icon, rather than the default
   * outlined circle — used where the badge sits on a light ground but
   * needs to read as a deliberate stamp (e.g. the catalogue CTA banner). */
  filled?: boolean;
}

const PATHS: Record<IconName, React.ReactNode> = {
  quality: (
    <>
      <path d="M12 3l2.4 4.6 5.1.8-3.7 3.6.9 5.1-4.7-2.5-4.7 2.5.9-5.1-3.7-3.6 5.1-.8L12 3z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5z" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 19c8 0 12-4 12-12V5h-2C8 5 6 11 6 15v4z" />
      <path d="M6 19c2-3 5-6 10-8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.5v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5z" />
      <path d="M8.7 12l2.2 2.2 4.4-4.4" />
    </>
  ),
  truck: (
    <>
      <rect x="2.5" y="7" width="11" height="9" rx="0.5" />
      <path d="M13.5 10h3.5l3 3v3h-6.5z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  handshake: (
    <>
      <path d="M3 11l4-3 3 2 3-2 4 3" />
      <path d="M6.5 10.5l4 4.5 2-1.8m1.5-2.7l3 3.5" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.2" />
      <rect x="17" y="13" width="4" height="6" rx="1.2" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5.5" y="4.5" width="13" height="16" rx="1.5" />
      <path d="M9 4.5V3.8A1.8 1.8 0 0 1 10.8 2h2.4A1.8 1.8 0 0 1 15 3.8v.7" />
      <path d="M8.7 12.5l2.2 2.2 4.4-4.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  package: (
    <>
      <path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2L12 3z" />
      <path d="M4 7.2 12 11l8-3.8M12 11v10" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M4.5 9.5V20h15V9.5" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  ship: (
    <>
      <path d="M4 15l1.5 4.5h13L20 15" />
      <path d="M6 15V6h8l3 4.5" />
      <path d="M9 6V3.5h3V6" />
      <path d="M2.5 15h19" />
    </>
  ),
  message: (
    <>
      <path d="M3.5 5.5h17v11h-9.5L6.5 20v-3.5h-3z" />
    </>
  ),
  document: (
    <>
      <path d="M6.5 3.5h8l3 3v14h-11z" />
      <path d="M14.5 3.5v3h3" />
      <path d="M9 12h6M9 15.5h6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17L17 7M9 7h8v8" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4v14M6 13l6 6 6-6" />
    </>
  ),
  chevronDown: (
    <>
      <path d="M6 9.5l6 6 6-6" />
    </>
  ),
  question: (
    <>
      <path d="M9 9a3 3 0 1 1 4 2.83c-.9.35-1.5 1.09-1.5 2.17v.5" />
      <path d="M12 17.5h.01" />
    </>
  ),
};

export function IconBadge({
  icon,
  tone = "default",
  size = "md",
  filled = false,
  className,
  ...props
}: IconBadgeProps) {
  const dimension = size === "sm" ? "h-10 w-10" : "h-14 w-14";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        filled
          ? "bg-brand-deep text-accent-on-deep"
          : cn("border", tone === "on-deep" ? "border-on-deep-muted text-on-deep" : "border-rule text-accent"),
        dimension,
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "sm" ? "h-5 w-5" : "h-6 w-6"}
        aria-hidden="true"
      >
        {PATHS[icon]}
      </svg>
    </span>
  );
}
