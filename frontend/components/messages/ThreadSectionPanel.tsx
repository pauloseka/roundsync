import { PausedThreadListItem } from "@/components/messages/PausedThreadListItem";
import { ThreadListItem } from "@/components/messages/ThreadListItem";
import type { MessageThread } from "@/lib/messages-types";

interface ThreadSectionPanelProps {
  title: string;
  description: string;
  threads: MessageThread[];
  emptyMessage: string;
  paused?: boolean;
}

export function ThreadSectionPanel({
  title,
  description,
  threads,
  emptyMessage,
  paused = false,
}: ThreadSectionPanelProps) {
  return (
    <section
      className={`overflow-visible rounded-xl border border-line bg-surface-card ${paused ? "opacity-90" : ""}`}
    >
      <header className="border-b border-line px-5 py-3.5">
        <h2 className="font-display text-base font-semibold text-ink-primary">{title}</h2>
        <p className="mt-1 text-sm text-ink-secondary">{description}</p>
      </header>
      <div className="p-5">
        {threads.length === 0 ? (
          <p className="text-sm text-ink-secondary">{emptyMessage}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {threads.map((thread) => (
              <li key={thread.id}>
                {paused ? (
                  <PausedThreadListItem thread={thread} />
                ) : (
                  <ThreadListItem thread={thread} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
