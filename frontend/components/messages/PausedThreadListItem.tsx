"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { formatPatientLocation } from "@/lib/format-patient";
import { messagesCopy } from "@/lib/content/copy";
import { caseDetailHref, messageThreadHref } from "@/lib/message-routes";
import type { MessageThread } from "@/lib/messages-types";

interface PausedThreadListItemProps {
  thread: MessageThread;
}

export function PausedThreadListItem({ thread }: PausedThreadListItemProps) {
  const { getPatientCase } = useCases();
  const linkedCase = thread.patientId ? getPatientCase(thread.patientId) : undefined;
  const navCopy = messagesCopy.navigation;
  const threadHref = messageThreadHref(thread.id, linkedCase?.id);

  return (
    <div className="rounded-lg border border-line bg-surface-base px-3 py-3">
      <Link
        href={threadHref}
        className="block transition-colors hover:opacity-90"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-sm font-semibold text-ink-primary">{thread.title}</p>
              {thread.unread ? (
                <span className="rounded-full bg-moderate-muted px-2 py-0.5 text-[11px] font-semibold text-message-unread">
                  Unread
                </span>
              ) : null}
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-task-overdue">
                Case open
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
      </Link>

      {linkedCase ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3">
          <Link
            href={threadHref}
            className="text-sm font-medium text-brand-core hover:underline"
          >
            {navCopy.viewThread} →
          </Link>
          <Link
            href={caseDetailHref(linkedCase.id)}
            className="text-sm font-medium text-brand-core hover:underline"
          >
            {navCopy.openActiveCase} — {linkedCase.patientName} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
