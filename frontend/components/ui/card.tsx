import { cn } from "@/lib/design-system/cn";
import { cardClassName, panelPadding, type CardVariant } from "@/lib/design-system/variants";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: boolean;
}

export function Card({
  variant = "default",
  padding = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardClassName({ variant }), padding && panelPadding, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("font-display text-lg font-semibold text-ink-primary", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-2 text-sm leading-relaxed text-ink-secondary", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex flex-wrap gap-3", className)} {...props} />;
}
