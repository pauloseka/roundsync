import Link from "next/link";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { threadKindLabel } from "@/lib/messages";
import { formatPatientLocation } from "@/lib/format-patient";
import type { MessageThread } from "@/lib/messages-types";

interface ThreadListItemProps {
  thread: MessageThread;
}

export function ThreadListItem({ thread }: ThreadListItemProps) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-semibold text-ink-primary">{thread.title}</p>
          {thread.unread ? (
            <span className="rounded-full bg-moderate-muted px-2 py-0.5 text-[11px] font-semibold text-message-unread">
              Unread
            </span>
          ) : null}
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {threadKindLabel(thread.kind)}
          </span>
        </div>
        {thread.patientName && thread.ward && thread.bed && thread.patientId ? (
          <p className="mt-0.5 font-mono text-xs text-ink-secondary">
            {thread.patientName} ·{" "}
            {formatPatientLocation({
              ward: thread.ward,
              bed: thread.bed,
              id: thread.patientId,
            })}
          </p>
        ) : null}
        <p className="mt-2 line-clamp-2 text-sm text-ink-secondary">{thread.lastMessagePreview}</p>
      </div>
      <span className="shrink-0 font-mono text-xs text-ink-secondary">
        {formatMessageAgo(thread.lastMessageMinutesAgo)}
      </span>
    </div>
  );

  const className =
    "block rounded-lg border border-line bg-surface-base px-3 py-3 transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/20";

  return (
    <Link href={`/messages/${thread.id}`} className={className}>
      {content}
    </Link>
  );
}
