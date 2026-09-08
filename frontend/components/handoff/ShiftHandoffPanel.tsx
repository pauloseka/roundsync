"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { getHandoffSummary, INCOMING_BEDSIDE_OWNER, isHandoffWindowActive } from "@/lib/handoff";
import { handoffCopy } from "@/lib/content/copy";
import { shiftContext } from "@/lib/mock-data";

export function ShiftHandoffBanner() {
  const { cases } = useCases();
  const { pendingCount } = getHandoffSummary(cases);

  if (!isHandoffWindowActive() || pendingCount === 0) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-brand-core/25 bg-brand-core-muted/40 px-5 py-4"
      role="status"
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
        {handoffCopy.bannerEyebrow}
      </p>
      <p className="mt-1 font-display text-base font-semibold text-ink-primary">
        {handoffCopy.bannerTitle(pendingCount, shiftContext.shiftEnd)}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{handoffCopy.bannerBody}</p>
      <a
        href="#shift-handoff"
        className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
      >
        {handoffCopy.bannerCta} →
      </a>
    </div>
  );
}

interface ShiftHandoffPanelProps {
  className?: string;
}

export function ShiftHandoffPanel({ className = "" }: ShiftHandoffPanelProps) {
  const { cases, acceptHandoff, acceptAllHandoffs } = useCases();
  const { pendingCount, cases: pendingCases } = getHandoffSummary(cases);

  if (pendingCount === 0) {
    return null;
  }

  return (
    <section
      id="shift-handoff"
      className={`overflow-visible rounded-xl border border-line bg-surface-card ${className}`}
    >
      <header className="border-b border-line px-5 py-3.5">
        <h2 className="font-display text-base font-semibold text-ink-primary">
          {handoffCopy.panelTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">{handoffCopy.panelDescription}</p>
      </header>

      <ul className="flex flex-col gap-3 p-5">
        {pendingCases.map((caseItem) => (
          <li
            key={caseItem.id}
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface-base px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink-primary">
                {caseItem.patientName}
              </p>
              <p className="mt-0.5 text-sm text-ink-secondary">{caseItem.summary}</p>
              <p className="mt-1 font-mono text-xs text-ink-secondary">
                {handoffCopy.outgoingLabel}: {caseItem.handoff?.outgoingOwnerName} ·{" "}
                {handoffCopy.incomingLabel}: {INCOMING_BEDSIDE_OWNER}
              </p>
            </div>
            <button
              type="button"
              onClick={() => acceptHandoff(caseItem.id)}
              className="shrink-0 rounded-lg bg-brand-core px-3 py-2 text-sm font-medium text-white hover:bg-brand-core/90"
            >
              {handoffCopy.acceptCaseCta}
            </button>
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
        <p className="text-sm text-ink-secondary">
          {handoffCopy.incomingLeadLabel}: <span className="font-medium text-ink-primary">{INCOMING_BEDSIDE_OWNER}</span>
        </p>
        <button
          type="button"
          onClick={acceptAllHandoffs}
          className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink-primary hover:bg-surface-base"
        >
          {handoffCopy.acceptAllCta(pendingCount)}
        </button>
      </footer>
    </section>
  );
}

export function ShiftHandoffEmptyNote() {
  const { cases } = useCases();
  const { pendingCount } = getHandoffSummary(cases);

  if (pendingCount > 0) return null;

  return (
    <p className="text-xs text-ink-secondary">
      {handoffCopy.allAcceptedNote}{" "}
      <Link href="/cases" className="font-medium text-brand-core hover:underline">
        Active cases →
      </Link>
    </p>
  );
}
