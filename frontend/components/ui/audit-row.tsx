import { cn } from "@/lib/design-system/cn";
import { Badge } from "@/components/ui/badge";

interface AuditRowProps {
  relativeTime: string;
  absoluteTime: string;
  actorName: string;
  actorRole?: string;
  action: string;
  category?: string;
  metadata?: Array<{ label: string; value: string }>;
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * Accountability log row — relative + absolute timestamp, actor, action.
 * Monospace for data; display font for summary only.
 */
export function AuditRow({
  relativeTime,
  absoluteTime,
  actorName,
  actorRole,
  action,
  category,
  metadata,
  trailing,
  className,
}: AuditRowProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-line bg-surface-base px-4 py-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {category ? (
            <Badge tone="neutral">
              <span className="font-mono text-[10px] uppercase tracking-wide">{category}</span>
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 font-display text-sm font-semibold text-ink-primary">{action}</p>
        <p className="mt-1 text-sm text-ink-secondary">
          {actorName}
          {actorRole ? ` · ${actorRole}` : ""}
        </p>
        {metadata && metadata.length > 0 ? (
          <dl className="mt-2 space-y-1">
            {metadata.map((item) => (
              <div key={item.label} className="flex flex-wrap gap-x-2 text-xs">
                <dt className="font-mono text-ink-secondary">{item.label}</dt>
                <dd className="font-mono text-ink-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
        <time className="font-mono text-xs text-ink-secondary" suppressHydrationWarning>
          {relativeTime}
        </time>
        <time className="font-mono text-[11px] text-ink-secondary/80" suppressHydrationWarning>
          ({absoluteTime})
        </time>
        {trailing}
      </div>
    </article>
  );
}
