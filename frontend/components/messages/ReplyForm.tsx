"use client";

import { useRef, useState } from "react";
import { MentionPicker } from "@/components/messages/MentionPicker";
import { messagesCopy } from "@/lib/content/copy";
import {
  fileToAttachment,
  formatFileSize,
  isAllowedAttachment,
  MAX_ATTACHMENT_BYTES,
  MAX_MESSAGE_ATTACHMENTS,
} from "@/lib/message-attachments";
import type { MessageAttachment, MessageIndividual, ReplyInput } from "@/lib/messages-types";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

interface ReplyFormProps {
  onSubmit: (input: ReplyInput) => void;
  disabled?: boolean;
  showMentions?: boolean;
  mentionIndividuals?: MessageIndividual[];
}

export function ReplyForm({
  onSubmit,
  disabled = false,
  showMentions = false,
  mentionIndividuals = [],
}: ReplyFormProps) {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const copy = messagesCopy.compose;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const remaining = MAX_MESSAGE_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      setError(copy.fileCountError);
      return;
    }

    const nextAttachments = [...attachments];

    for (const file of files.slice(0, remaining)) {
      if (!isAllowedAttachment(file)) {
        setError(copy.fileTypeError);
        return;
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        setError(copy.fileSizeError);
        return;
      }

      nextAttachments.push(fileToAttachment(file));
    }

    if (files.length > remaining) {
      setError(copy.fileCountError);
    }

    setAttachments(nextAttachments);
  }

  function removeAttachment(attachmentId: string) {
    setAttachments((current) => current.filter((item) => item.id !== attachmentId));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = body.trim();
    if (!trimmed && attachments.length === 0) {
      setError(copy.requireContentError);
      return;
    }

    if (disabled) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSubmit({ body: trimmed, attachments });
    setBody("");
    setAttachments([]);
    setSubmitting(false);
  }

  const canSubmit = (body.trim().length > 0 || attachments.length > 0) && !disabled && !submitting;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message-reply" className="sr-only">
        Reply
      </label>
      <textarea
        ref={bodyRef}
        id="message-reply"
        name="reply"
        rows={3}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className={inputClassName}
        placeholder={showMentions ? copy.replyPlaceholderWithMentions : copy.replyPlaceholder}
        disabled={disabled || submitting}
      />

      <div className="mt-4 flex flex-wrap items-start gap-2">
        {showMentions && mentionIndividuals.length > 0 ? (
          <MentionPicker
            textareaRef={bodyRef}
            body={body}
            onBodyChange={setBody}
            individuals={mentionIndividuals}
            disabled={disabled || submitting}
          />
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || submitting || attachments.length >= MAX_MESSAGE_ATTACHMENTS}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || submitting || attachments.length >= MAX_MESSAGE_ATTACHMENTS}
          className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-base px-3 py-2 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.88 18.09a2 2 0 0 1-2.83-2.83l8.49-8.49" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copy.attachLabel}
        </button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
        {showMentions ? copy.replyToolbarHint : copy.attachHint}
      </p>

      {attachments.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-base px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-primary">{attachment.name}</p>
                <p className="font-mono text-[11px] text-ink-secondary">
                  {formatFileSize(attachment.sizeBytes)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="shrink-0 text-sm font-medium text-brand-core hover:underline"
              >
                {copy.removeFileLabel}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? copy.sendingLabel : copy.sendLabel}
      </button>
    </form>
  );
}
