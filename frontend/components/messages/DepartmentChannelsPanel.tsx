import Link from "next/link";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { messagesCopy } from "@/lib/content/copy";
import type { DepartmentChannelView } from "@/lib/messages-types";

interface DepartmentChannelsPanelProps {
  channels: DepartmentChannelView[];
}

export function DepartmentChannelsPanel({ channels }: DepartmentChannelsPanelProps) {
  const copy = messagesCopy.channels;

  return (
    <section className="rounded-xl border border-line bg-surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink-primary">{copy.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{copy.description}</p>
        </div>
        <Link
          href="/messages/new"
          className="shrink-0 rounded-md bg-brand-core px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
        >
          {copy.newMessageLabel}
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {channels.map(({ channel, thread }) => {
          const href = thread ? `/messages/${thread.id}` : `/messages/new?channel=${channel.id}`;

          return (
            <li key={channel.id}>
              <Link
                href={href}
                className="block rounded-lg border border-line bg-surface-base px-3 py-3 transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-semibold text-ink-primary">
                        {channel.name}
                      </p>
                      {thread?.unread ? (
                        <span className="rounded-full bg-moderate-muted px-2 py-0.5 text-[11px] font-semibold text-message-unread">
                          Unread
                        </span>
                      ) : null}
                      {!thread ? (
                        <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
                          {copy.noThreadLabel}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                      {channel.description}
                    </p>
                    {thread ? (
                      <p className="mt-2 line-clamp-1 text-sm text-ink-secondary">
                        {thread.lastMessagePreview}
                      </p>
                    ) : null}
                  </div>
                  {thread ? (
                    <span className="shrink-0 font-mono text-xs text-ink-secondary">
                      {formatMessageAgo(thread.lastMessageMinutesAgo)}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
