import { badgeClassName, type BadgeTone } from "@/lib/design-system/variants";
import { cn } from "@/lib/design-system/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeClassName(tone), className)} {...props}>
      {children}
    </span>
  );
}
