"use client";

import Link from "next/link";
import { useMessages } from "@/components/messages/MessagesStore";
import { DashboardItemList } from "@/components/dashboard/DashboardItemList";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { messagesCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";

interface UnreadMessagesPreviewProps {
  className?: string;
}

export function UnreadMessagesPreview({ className = "" }: UnreadMessagesPreviewProps) {
  const { dashboardPreview } = useMessages();
  const copy = messagesCopy.dashboardWidget;
  const { items: threads, total } = dashboardPreview;

  return (
    <DashboardWidget
      title={copy.title}
      description={copy.description}
      href="/messages"
      linkLabel={copy.linkLabel}
      className={className}
      totalCount={total}
      previewCount={threads.length}
    >
      {threads.length === 0 ? (
        <p className="text-sm text-ink-secondary">{copy.empty}</p>
      ) : (
        <DashboardItemList>
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/messages/${thread.id}`}
                className="block rounded-lg border border-line bg-surface-base px-3 py-3 transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-ink-primary">{thread.from}</p>
                  <span className="shrink-0 font-mono text-xs text-ink-secondary">
                    {formatMessageAgo(thread.receivedMinutesAgo)}
                  </span>
                </div>
                {thread.patientName ? (
                  <p className="mt-0.5 text-xs text-ink-secondary">{thread.patientName}</p>
                ) : null}
                <p className="mt-2 line-clamp-2 text-sm text-ink-secondary">{thread.preview}</p>
              </Link>
            </li>
          ))}
        </DashboardItemList>
      )}
    </DashboardWidget>
  );
}
