import { cn } from "@/lib/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({ as: Tag = "div", className, children, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-16", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
