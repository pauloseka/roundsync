"use client";

import Link from "next/link";
import { MessageAttachmentsList } from "@/components/messages/MessageAttachmentsList";
import { useMessages } from "@/components/messages/MessagesStore";
import { casesCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { messageThreadHref } from "@/lib/message-routes";
import { getPatientCaseThreads } from "@/lib/messages";
import type { EmergencyCase } from "@/lib/cases-types";
import type { MessageThread } from "@/lib/messages-types";

interface CaseSupportCommsPanelProps {
  caseItem: EmergencyCase;
}

export function CaseSupportCommsPanel({ caseItem }: CaseSupportCommsPanelProps) {
  const { threads } = useMessages();
  const copy = casesCopy.supportComms;
  const patientThreads = getPatientCaseThreads(threads, caseItem.patientId);

  return (
    <section className="rounded-xl border border-line bg-surface-card p-5">
      <h2 className="font-display text-base font-semibold text-ink-primary">{copy.title}</h2>
      <p className="mt-1 text-sm text-ink-secondary">{copy.description}</p>

      {patientThreads.length === 0 ? (
        <p className="mt-4 text-sm text-ink-secondary">{copy.empty}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {patientThreads.map((thread) => (
            <SupportCommCard key={thread.id} thread={thread} caseId={caseItem.id} />
          ))}
        </ul>
      )}
    </section>
  );
}

function SupportCommCard({ thread, caseId }: { thread: MessageThread; caseId: string }) {
  const copy = casesCopy.supportComms;
  const latest = thread.messages[thread.messages.length - 1];

  return (
    <li className="rounded-lg border border-line bg-surface-base px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink-primary">{thread.title}</p>
            {thread.unread ? (
              <span className="rounded-full bg-moderate-muted px-2 py-0.5 text-[11px] font-semibold text-message-unread">
                New
              </span>
            ) : null}
            <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
              {copy.pagedLabel}
            </span>
          </div>
          {latest ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{latest.body}</p>
              {latest.attachments?.length ? (
                <MessageAttachmentsList attachments={latest.attachments} />
              ) : null}
              <p className="mt-2 font-mono text-[11px] text-ink-secondary">
                {latest.authorName} · {formatMessageAgo(latest.sentMinutesAgo)}
              </p>
            </>
          ) : null}
        </div>
        <span className="shrink-0 font-mono text-xs text-ink-secondary">
          {formatMessageAgo(thread.lastMessageMinutesAgo)}
        </span>
      </div>
      <Link
        href={messageThreadHref(thread.id, caseId)}
        className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
      >
        {copy.viewThread} →
      </Link>
    </li>
  );
}
