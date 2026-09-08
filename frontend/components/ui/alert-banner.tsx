import { cn } from "@/lib/design-system/cn";
import { Button } from "@/components/ui/button";

export type AlertBannerLevel = "critical" | "urgent" | "info";

const levelStyles: Record<
  AlertBannerLevel,
  { container: string; icon: string; label: string }
> = {
  critical: {
    container: "border-critical/30 bg-critical-muted",
    icon: "●",
    label: "Critical alert",
  },
  urgent: {
    container: "border-urgent/30 bg-urgent-muted",
    icon: "▲",
    label: "Urgent alert",
  },
  info: {
    container: "border-info/30 bg-info-muted",
    icon: "◆",
    label: "Information",
  },
};

interface AlertBannerProps {
  level: AlertBannerLevel;
  title: string;
  body?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
  pulse?: boolean;
}

/** Full-width banner for operational and critical alerts — not a dismissible toast. */
export function AlertBanner({
  level,
  title,
  body,
  primaryAction,
  secondaryAction,
  className,
  pulse = level === "critical",
}: AlertBannerProps) {
  const config = levelStyles[level];

  return (
    <div
      role="alert"
      className={cn(
        "w-full border-b px-6 py-4",
        config.container,
        pulse && "rs-urgency-pulse",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className={cn(
              "inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest",
              level === "critical" && "text-critical",
              level === "urgent" && "text-urgent",
              level === "info" && "text-info",
            )}
          >
            <span aria-hidden="true">{config.icon}</span>
            {config.label}
          </p>
          <p className="mt-1 font-display text-base font-semibold text-ink-primary">{title}</p>
          {body ? <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{body}</p> : null}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex shrink-0 flex-wrap gap-2">
            {secondaryAction ? (
              <Button variant="secondary" size="sm" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button variant="primary" size="sm" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
