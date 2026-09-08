import Link from "next/link";
import { PanelHeaderTooltip } from "@/components/ui/PanelHeaderTooltip";
import { viewAllLabel } from "@/lib/content/copy";

interface DashboardWidgetProps {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
  className?: string;
  totalCount?: number;
  previewCount?: number;
  tooltipAlign?: "left" | "right";
}

export function DashboardWidget({
  title,
  description,
  href,
  linkLabel,
  children,
  className = "",
  totalCount = 0,
  previewCount = 0,
  tooltipAlign = "left",
}: DashboardWidgetProps) {
  const hasMore = totalCount > previewCount;

  return (
    <section
      className={`flex flex-col overflow-visible rounded-xl border border-line bg-surface-card ${className}`}
    >
      <PanelHeaderTooltip
        description={description}
        align={tooltipAlign}
        className="w-full cursor-help border-b border-line px-5 py-3.5"
      >
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-ink-primary">{title}</h2>
          <Link
            href={href}
            className="relative z-10 shrink-0 cursor-pointer text-sm font-medium text-brand-core hover:underline"
          >
            {linkLabel}
          </Link>
        </header>
      </PanelHeaderTooltip>
      <div className="p-5">{children}</div>
      {hasMore ? (
        <footer className="border-t border-line px-5 py-3">
          <Link
            href={href}
            className="text-sm font-medium text-brand-core hover:underline"
          >
            {viewAllLabel(totalCount)}
          </Link>
        </footer>
      ) : null}
    </section>
  );
}
