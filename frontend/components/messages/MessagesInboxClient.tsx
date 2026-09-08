"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { DepartmentChannelsPanel } from "@/components/messages/DepartmentChannelsPanel";
import { useMessages } from "@/components/messages/MessagesStore";
import { ThreadSectionPanel } from "@/components/messages/ThreadSectionPanel";
import { MessagesSidebar } from "@/components/messages/MessagesSidebar";
import { messagesCopy } from "@/lib/content/copy";

export function MessagesInboxClient() {
  const { unreadThreads, readThreads, pausedThreads, departmentChannels } = useMessages();
  const { activeCases } = useCases();
  const copy = messagesCopy.sections;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
              Messages
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
              Care-team threads
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              {messagesCopy.pageSubtitle}
            </p>
          </div>
          <Link
            href="/messages/new"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            {messagesCopy.channels.newMessageLabel}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <ThreadSectionPanel
            title={copy.unread.label}
            description={copy.unread.description}
            threads={unreadThreads}
            emptyMessage={copy.unread.empty}
          />
          <ThreadSectionPanel
            title={copy.read.label}
            description={copy.read.description}
            threads={readThreads}
            emptyMessage={copy.read.empty}
          />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-5">
          <DepartmentChannelsPanel channels={departmentChannels} />
          {pausedThreads.length > 0 ? (
            <ThreadSectionPanel
              title={copy.paused.label}
              description={copy.paused.description}
              threads={pausedThreads}
              emptyMessage={copy.paused.empty}
              paused
            />
          ) : null}

          {activeCases.length > 0 ? (
            <section className="rounded-xl border border-line bg-surface-card p-5">
              <h2 className="font-display text-base font-semibold text-ink-primary">
                Case coordination
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">
                {activeCases.length === 1
                  ? "1 open case is handling patient-linked escalation."
                  : `${activeCases.length} open cases are handling patient-linked escalation.`}
              </p>
              <Link
                href="/cases"
                className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
              >
                Open Active cases →
              </Link>
            </section>
          ) : null}

          <MessagesSidebar />
        </div>
      </div>
    </div>
  );
}
