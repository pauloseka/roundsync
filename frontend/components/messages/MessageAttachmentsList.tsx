import {
  attachmentLabel,
  formatFileSize,
  isImageAttachment,
} from "@/lib/message-attachments";
import type { MessageAttachment } from "@/lib/messages-types";

interface MessageAttachmentsListProps {
  attachments: MessageAttachment[];
}

function AttachmentIcon({ mimeType }: { mimeType: string }) {
  if (isImageAttachment(mimeType)) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageAttachmentsList({ attachments }: MessageAttachmentsListProps) {
  if (attachments.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-card px-3 py-2">
            <span className="text-brand-core">
              <AttachmentIcon mimeType={attachment.mimeType} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-primary">{attachment.name}</p>
              <p className="font-mono text-[11px] text-ink-secondary">
                {attachmentLabel(attachment.mimeType)} · {formatFileSize(attachment.sizeBytes)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
