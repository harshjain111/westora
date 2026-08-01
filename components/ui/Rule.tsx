import { cn } from "@/lib/utils/cn";

export type RuleProps = React.HTMLAttributes<HTMLHRElement>;

export function Rule({ className, ...props }: RuleProps) {
  return (
    <hr
      className={cn("border-0 border-t border-t-rule", className)}
      {...props}
    />
  );
}
