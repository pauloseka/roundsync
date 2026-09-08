import { MessageAttachmentsList } from "@/components/messages/MessageAttachmentsList";
import { formatMessageAgo } from "@/lib/dashboard-data";
import type { Message } from "@/lib/messages-types";

interface MessageTimelineProps {
  messages: Message[];
}

export function MessageTimeline({ messages }: MessageTimelineProps) {
  return (
    <ul className="flex flex-col gap-4">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`flex ${message.isYou ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-xl border px-4 py-3 ${
              message.isYou
                ? "border-brand-core/20 bg-brand-core-muted"
                : "border-line bg-surface-base"
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-sm font-semibold text-ink-primary">{message.authorName}</p>
              <p className="font-mono text-[11px] text-ink-secondary">{message.authorRole}</p>
            </div>
            {message.body ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{message.body}</p>
            ) : null}
            {message.attachments?.length ? (
              <MessageAttachmentsList attachments={message.attachments} />
            ) : null}
            <p className="mt-2 font-mono text-[11px] text-ink-secondary">
              {formatMessageAgo(message.sentMinutesAgo)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
