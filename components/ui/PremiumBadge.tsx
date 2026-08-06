import { cn } from "@/lib/utils/cn";

export interface PremiumBadgeProps {
  className?: string;
}

/**
 * Circular stamp badge, rotating text reusing the locked tagline
 * ("Premium origins. Global excellence.") rather than inventing new copy.
 */
export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <svg
      viewBox="0 0 140 140"
      className={cn("h-28 w-28 text-brand-deep", className)}
      aria-hidden="true"
    >
      <defs>
        <path id="premium-badge-circle" d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
      </defs>
      <circle cx="70" cy="70" r="62" fill="var(--color-surface-raised)" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="70" cy="70" r="40" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      <text fontSize="7.5" letterSpacing="2.5" fill="currentColor" className="font-mono uppercase">
        <textPath href="#premium-badge-circle" startOffset="0%">
          PREMIUM ORIGINS &#8226; GLOBAL EXCELLENCE &#8226;
        </textPath>
      </text>
      <g transform="translate(70,70)" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-9,10c11,0 17,-6 17,-17v-3h-3c-11,0 -14,8 -14,14v6z" />
        <path d="M-9,10c3,-4.5 7.5,-9 15,-12" />
      </g>
    </svg>
  );
}
