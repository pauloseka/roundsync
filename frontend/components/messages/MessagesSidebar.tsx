"use client";

import Link from "next/link";
import { useMessages } from "@/components/messages/MessagesStore";
import { shiftTeam } from "@/lib/dashboard-data";
import { messagesCopy } from "@/lib/content/copy";
import { caseDetailHref } from "@/lib/message-routes";

export function MessagesSidebar() {
  const { unreadCount, readThreads, pausedThreads } = useMessages();
  const onShift = shiftTeam.filter((member) => !member.isYou);

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Inbox summary
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Unread</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {unreadCount}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Earlier</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {readThreads.length}
            </dd>
          </div>
        </dl>
        {pausedThreads.length > 0 ? (
          <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
            {pausedThreads.length} thread{pausedThreads.length === 1 ? "" : "s"} paused while a
            case is open.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <h2 className="font-display text-base font-semibold text-ink-primary">On shift with</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {onShift.map((member) => (
            <li
              key={member.name}
              className="rounded-lg border border-line bg-surface-base px-3 py-2 text-sm text-ink-primary"
            >
              <span className="font-medium">{member.name}</span>
              <span className="text-ink-secondary"> · {member.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <MessageRoleBoundaryNote />
    </aside>
  );
}

export function MessageRoleBoundaryNote({ linkedCaseId }: { linkedCaseId?: string } = {}) {
  const copy = messagesCopy.boundary;
  const navCopy = messagesCopy.navigation;

  return (
    <div className="rounded-lg border border-line bg-surface-base px-4 py-3">
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
        {copy.title}
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
        {copy.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {linkedCaseId ? (
        <Link
          href={caseDetailHref(linkedCaseId)}
          className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
        >
          {navCopy.openActiveCase} →
        </Link>
      ) : (
        <Link
          href="/cases"
          className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
        >
          Go to Active cases →
        </Link>
      )}
    </div>
  );
}
