import { cn } from "@/lib/utils/cn";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

/**
 * Typographic wordmark. The extracted catalogue logo is full-colour on a
 * cream ground and has no reversed/light variant — unusable on the dark
 * surfaces (nav, footer) it needs to sit on. This lockup stands in until
 * Westora supplies a vector logo with a proper reversed mark.
 */
export function Logo({ as: Tag = "span", className, ...props }: LogoProps) {
  return (
    <Tag className={cn("inline-flex flex-col leading-none", className)} {...props}>
      <span className="font-display text-lead tracking-tight">Westora</span>
      <span className="font-mono text-[0.6875rem] tracking-mono-label uppercase text-current opacity-70">
        Global
      </span>
    </Tag>
  );
}
