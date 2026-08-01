import { cn } from "@/lib/utils/cn";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
  tone?: "accent" | "on-deep";
}

export function Eyebrow({
  as: Tag = "span",
  tone = "accent",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "block font-mono text-eyebrow tracking-mono-label uppercase",
        tone === "accent" ? "text-accent" : "text-on-deep-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
