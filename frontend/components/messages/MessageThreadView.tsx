"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCases } from "@/components/cases/CasesStore";
import { MessageTimeline } from "@/components/messages/MessageTimeline";
import { MessageRoleBoundaryNote } from "@/components/messages/MessagesSidebar";
import { ReplyForm } from "@/components/messages/ReplyForm";
import { useMessages } from "@/components/messages/MessagesStore";
import { messagesCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { isThreadVisibleForCases, threadKindHeaderLabel } from "@/lib/messages";
import { caseDetailHref, parseReturnCaseId } from "@/lib/message-routes";
import { channelAllowsMentions, getMessageChannel } from "@/lib/messages-channels";
import { messageIndividuals } from "@/lib/messages-recipients";
import { formatPatientLocation } from "@/lib/format-patient";

interface MessageThreadViewProps {
  threadId: string;
}

export function MessageThreadView({ threadId }: MessageThreadViewProps) {
  const searchParams = useSearchParams();
  const { getThread, markThreadRead, sendReply } = useMessages();
  const { activeCasePatientIds, getPatientCase, getCase } = useCases();
  const thread = getThread(threadId);
  const markedReadRef = useRef<string | null>(null);
  const navCopy = messagesCopy.navigation;

  useEffect(() => {
    if (!thread?.unread || markedReadRef.current === threadId) return;
    markedReadRef.current = threadId;
    markThreadRead(threadId);
  }, [thread?.unread, threadId, markThreadRead]);

  if (!thread) {
    return (
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-ink-secondary">Thread not found.</p>
        <Link href="/messages" className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline">
          {navCopy.backToInbox}
        </Link>
      </div>
    );
  }

  const isPaused = !isThreadVisibleForCases(thread, activeCasePatientIds);
  const linkedCase = thread.patientId ? getPatientCase(thread.patientId) : undefined;
  const returnCaseId = parseReturnCaseId(searchParams.get("case"), linkedCase?.id);
  const returnCase = returnCaseId ? getCase(returnCaseId) : undefined;
  const backHref = returnCase ? caseDetailHref(returnCase.id) : "/messages";
  const backLabel = returnCase ? navCopy.backToCase : navCopy.backToInbox;
  const channel =
    thread.kind === "channel" && thread.channelId
      ? getMessageChannel(thread.channelId)
      : undefined;
  const showMentions = channel ? channelAllowsMentions(channel) : false;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <Link
          href={backHref}
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          {backLabel}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {threadKindHeaderLabel(thread.kind)}
          </span>
          {isPaused ? (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-task-overdue">
              Paused — case open
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">{thread.title}</h1>
        {thread.patientName && thread.ward && thread.bed && thread.patientId ? (
          <p className="mt-1 font-mono text-sm text-ink-secondary">
            {thread.patientName} ·{" "}
            {formatPatientLocation({
              ward: thread.ward,
              bed: thread.bed,
              id: thread.patientId,
            })}
          </p>
        ) : null}
        <p className="mt-2 font-mono text-xs text-ink-secondary">
          Last activity {formatMessageAgo(thread.lastMessageMinutesAgo)}
        </p>
        {returnCase ? (
          <p className="mt-2 text-sm text-ink-secondary">
            Linked to{" "}
            <Link href={caseDetailHref(returnCase.id)} className="font-medium text-brand-core hover:underline">
              {returnCase.patientName}&apos;s active case
            </Link>
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          {isPaused && linkedCase ? (
            <section className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-5">
              <h2 className="font-display text-base font-semibold text-ink-primary">
                Coordination on the active case
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                This patient has an open case — clinical updates belong in case notes. Lab and
                pharmacy replies paged by the doctor also appear on the case.
              </p>
              <Link
                href={caseDetailHref(linkedCase.id)}
                className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
              >
                {navCopy.openActiveCase} — {linkedCase.patientName} →
              </Link>
            </section>
          ) : null}

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <MessageTimeline messages={thread.messages} />
          </section>

          {!isPaused ? (
            <section className="rounded-xl border border-line bg-surface-card p-5">
              <h2 className="font-display text-base font-semibold text-ink-primary">Reply</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Informal update only — not recorded as a case event. You can attach photos or
                PDFs.
              </p>
              <div className="mt-4">
                <ReplyForm
                  onSubmit={(input) => sendReply(thread.id, input)}
                  showMentions={showMentions}
                  mentionIndividuals={messageIndividuals}
                />
              </div>
            </section>
          ) : null}
        </div>

        <div className="xl:col-span-4">
          <MessageRoleBoundaryNote linkedCaseId={linkedCase?.id} />
        </div>
      </div>
    </div>
  );
}
