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
        "font-display font-normal tracking-tight text-balance",
        sizeByLevel[level],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
