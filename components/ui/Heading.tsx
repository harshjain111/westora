import { cn } from "@/lib/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3;
  as?: React.ElementType;
}

const sizeByLevel = {
  1: "text-h1",
  2: "text-h2",
  3: "text-h3",
} as const;

export function Heading({ level, as, className, children, ...props }: HeadingProps) {
  const Tag = as ?? (`h${level}` as React.ElementType);

  return (
    <Tag
      className={cn(
        // Weight 400 was right for the old serif, where the letterforms
        // carried the presence themselves. A grotesque at 44px set at 400
        // just reads as large body copy — the section headings needed
        // real weight and negative tracking to hold the page.
        "font-display font-bold tracking-display text-balance",
        sizeByLevel[level],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
