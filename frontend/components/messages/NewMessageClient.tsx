"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useCases } from "@/components/cases/CasesStore";
import { MentionPicker } from "@/components/messages/MentionPicker";
import { MessageRoleBoundaryNote } from "@/components/messages/MessagesSidebar";
import { useMessages } from "@/components/messages/MessagesStore";
import {
  RecipientSearch,
  recipientFromSearchParams,
  type RecipientSelection,
} from "@/components/messages/RecipientSearch";
import {
  channelAllowsMentions,
  channelAllowsPatientLink,
  getMessageChannel,
} from "@/lib/messages-channels";
import { messagesCopy } from "@/lib/content/copy";
import {
  fileToAttachment,
  formatFileSize,
  isAllowedAttachment,
  MAX_ATTACHMENT_BYTES,
  MAX_MESSAGE_ATTACHMENTS,
} from "@/lib/message-attachments";
import { formatPatientLocation } from "@/lib/format-patient";
import { shiftPatients } from "@/lib/mock-data";
import { messageIndividuals } from "@/lib/messages-recipients";
import type { MessageAttachment } from "@/lib/messages-types";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function NewMessageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startConversation } = useMessages();
  const { activeCasePatientIds } = useCases();
  const copy = messagesCopy.newMessage;
  const composeCopy = messagesCopy.compose;

  const [recipient, setRecipient] = useState<RecipientSelection | null>(() =>
    recipientFromSearchParams(searchParams.get("channel"), searchParams.get("to")),
  );
  const [patientId, setPatientId] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const selectedChannel =
    recipient?.type === "channel" ? getMessageChannel(recipient.id) : undefined;

  const showPatientLink =
    recipient?.type === "individual" ||
    (selectedChannel ? channelAllowsPatientLink(selectedChannel) : false);

  const showMentions =
    recipient?.type === "channel" &&
    selectedChannel !== undefined &&
    channelAllowsMentions(selectedChannel);

  const effectivePatientId = showPatientLink ? patientId : "";

  const availablePatients = useMemo(
    () =>
      shiftPatients.filter((patient) => !activeCasePatientIds.has(patient.id)),
    [activeCasePatientIds],
  );

  function handleRecipientChange(next: RecipientSelection | null) {
    setRecipient(next);
    if (next?.type === "channel") {
      const channel = getMessageChannel(next.id);
      if (channel && !channelAllowsPatientLink(channel)) {
        setPatientId("");
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const remaining = MAX_MESSAGE_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      setError(composeCopy.fileCountError);
      return;
    }

    const nextAttachments = [...attachments];

    for (const file of files.slice(0, remaining)) {
      if (!isAllowedAttachment(file)) {
        setError(composeCopy.fileTypeError);
        return;
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        setError(composeCopy.fileSizeError);
        return;
      }

      nextAttachments.push(fileToAttachment(file));
    }

    if (files.length > remaining) {
      setError(composeCopy.fileCountError);
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

    if (!recipient) {
      setError(copy.recipientRequiredError);
      return;
    }

    const trimmed = body.trim();
    if (!trimmed && attachments.length === 0) {
      setError(composeCopy.requireContentError);
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const threadId = startConversation({
        recipientType: recipient.type,
        channelId: recipient.type === "channel" ? recipient.id : undefined,
        individualId: recipient.type === "individual" ? recipient.id : undefined,
        patientId: effectivePatientId || undefined,
        body: trimmed,
        attachments,
      });

      router.push(`/messages/${threadId}`);
    } catch {
      setError(copy.submitError);
      setSubmitting(false);
    }
  }

  const canSubmit =
    recipient !== null &&
    (body.trim().length > 0 || attachments.length > 0) &&
    !submitting;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header>
        <Link
          href="/messages"
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          {messagesCopy.navigation.backToInbox}
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink-primary">{copy.title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-secondary">{copy.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-line bg-surface-card p-5"
          >
            <RecipientSearch value={recipient} onChange={handleRecipientChange} disabled={submitting} />

            {showPatientLink ? (
              <div className="mt-5">
                <label htmlFor="message-patient" className="block text-sm font-medium text-ink-primary">
                  {copy.patientLabel}
                </label>
                <select
                  id="message-patient"
                  value={patientId}
                  onChange={(event) => setPatientId(event.target.value)}
                  className={inputClassName}
                  disabled={submitting}
                >
                  <option value="">{copy.noPatientOption}</option>
                  {availablePatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} · {formatPatientLocation(patient)}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.patientHint}</p>
                {activeCasePatientIds.size > 0 ? (
                  <p className="mt-2 text-xs leading-relaxed text-task-overdue">{copy.activeCaseHint}</p>
                ) : null}
              </div>
            ) : recipient?.type === "channel" ? (
              <p className="mt-5 rounded-lg border border-line bg-surface-base px-3 py-2.5 text-xs leading-relaxed text-ink-secondary">
                {copy.wardChannelHint}
              </p>
            ) : null}

            <div className="mt-5">
              <label htmlFor="message-body" className="block text-sm font-medium text-ink-primary">
                {copy.bodyLabel}
              </label>
              <textarea
                ref={bodyRef}
                id="message-body"
                name="body"
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className={inputClassName}
                placeholder={showMentions ? copy.bodyPlaceholderWithMentions : copy.bodyPlaceholder}
                disabled={submitting}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-2">
              {showMentions ? (
                <MentionPicker
                  textareaRef={bodyRef}
                  body={body}
                  onBodyChange={setBody}
                  individuals={messageIndividuals}
                  disabled={submitting}
                />
              ) : null}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
                className="sr-only"
                onChange={handleFileChange}
                disabled={submitting || attachments.length >= MAX_MESSAGE_ATTACHMENTS}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting || attachments.length >= MAX_MESSAGE_ATTACHMENTS}
                className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-base px-3 py-2 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-60"
              >
                {composeCopy.attachLabel}
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
              {showMentions ? copy.composeToolbarHint : composeCopy.attachHint}
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
                      {composeCopy.removeFileLabel}
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
              className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? copy.sendingLabel : copy.sendLabel}
            </button>
          </form>
        </div>

        <div className="xl:col-span-5">
          <MessageRoleBoundaryNote />
        </div>
      </div>
    </div>
  );
}
