import { cn } from "@/lib/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  surface?: "default" | "deep";
}

export function Section({
  as: Tag = "section",
  surface = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        "py-24 lg:py-40",
        surface === "deep"
          ? "bg-brand-deep text-on-deep"
          : "bg-surface text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
