import { cn } from "@/lib/design-system/cn";
import { eyebrowClassName, pageSubtitleClassName, pageTitleClassName } from "@/lib/design-system/variants";

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  brand?: boolean;
}

export function Eyebrow({ brand = false, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(eyebrowClassName, brand && "text-brand-core", className)}
      {...props}
    />
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  brandEyebrow?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  brandEyebrow = false,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <Eyebrow brand={brandEyebrow}>{eyebrow}</Eyebrow> : null}
        <h2 className={cn(pageTitleClassName, eyebrow && "mt-1", !eyebrow && "mt-0")}>{title}</h2>
        {description ? <p className={pageSubtitleClassName}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  brandEyebrow?: boolean;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, brandEyebrow = false, className }: PageHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {eyebrow ? <Eyebrow brand={brandEyebrow}>{eyebrow}</Eyebrow> : null}
      <h1 className={cn(pageTitleClassName, eyebrow && "mt-1")}>{title}</h1>
      {subtitle ? <p className={pageSubtitleClassName}>{subtitle}</p> : null}
    </header>
  );
}
