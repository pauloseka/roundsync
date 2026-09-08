"use client";

import Link from "next/link";
import { AddCaseNoteForm } from "@/components/cases/AddCaseNoteForm";
import { ReopenCaseForm } from "@/components/cases/ReopenCaseForm";
import { RelapseResolvedNote } from "@/components/cases/RelapseSuggestionPanel";
import { CaseOwnershipChip } from "@/components/cases/CaseOwnershipChip";
import { CaseDetailSidebar } from "@/components/cases/CaseDetailSidebar";
import { CaseNotesTimeline } from "@/components/cases/CaseNotesTimeline";
import { CaseResponseStatus, formatCaseElapsed } from "@/components/cases/CaseResponseStatus";
import { CaseSupportCommsPanel } from "@/components/cases/CaseSupportCommsPanel";
import { CaseRoleBoundaryNote } from "@/components/cases/CaseRoleBoundaryNote";
import { EscalationTrail } from "@/components/cases/EscalationTrail";
import { useCases } from "@/components/cases/CasesStore";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { caseStatusLabel } from "@/lib/cases-types";
import { formatPatientLocation } from "@/lib/format-patient";
import { formatMessageAgo } from "@/lib/dashboard-data";

interface CaseDetailViewProps {
  caseId: string;
}

export function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const { getCase, addNote, reopenCase } = useCases();
  const caseItem = getCase(caseId);

  if (!caseItem) {
    return (
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-ink-secondary">Case not found.</p>
        <Link href="/cases" className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline">
          Back to queue
        </Link>
      </div>
    );
  }

  const isResolved = caseItem.status === "resolved";
  const statusLabel = caseStatusLabel[caseItem.status];

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <Link
          href="/cases"
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          ← Active Cases
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <UrgencyChip level={caseItem.urgencyLevel} />
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {statusLabel}
          </span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">
          {caseItem.patientName}
        </h1>
        <p className="mt-1 font-mono text-sm text-ink-secondary">
          {formatPatientLocation(caseItem)}
        </p>
        <p className="mt-2 text-sm text-ink-secondary">{caseItem.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CaseOwnershipChip caseItem={caseItem} />
        </div>
        <RelapseResolvedNote caseItem={caseItem} />
        <p className="mt-2 font-mono text-xs text-ink-secondary">
          {isResolved && caseItem.resolvedMinutesAgo !== undefined
            ? `Resolved ${formatMessageAgo(caseItem.resolvedMinutesAgo)}`
            : formatCaseElapsed(caseItem.elapsedMinutes)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-6">
          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              Original trigger note
            </h2>
            <p className="mt-1 font-mono text-xs text-ink-secondary">
              Flagged by {caseItem.triggeredByName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              {caseItem.triggerNote}
            </p>
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              Who&apos;s been alerted
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Live response status from case_alerts.
            </p>
            <div className="mt-4">
              <CaseResponseStatus alerts={caseItem.alerts} />
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              Escalation trail
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Auto-escalations when an alert timed out without response.
            </p>
            <div className="mt-4">
              <EscalationTrail steps={caseItem.escalationTrail} />
            </div>
          </section>

          {!isResolved ? <CaseSupportCommsPanel caseItem={caseItem} /> : null}

          {isResolved ? (
            <section className="rounded-xl border border-line bg-surface-card p-5">
              <h2 className="font-display text-base font-semibold text-ink-primary">
                Relapse
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Reopen this case to preserve audit lineage — don&apos;t trigger a new case ID.
              </p>
              <div className="mt-4">
                <ReopenCaseForm
                  caseItem={caseItem}
                  onReopen={(note) => reopenCase(caseItem.id, note)}
                />
              </div>
            </section>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 xl:col-span-3">
          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              Follow-up notes
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">case_notes on this case.</p>
            <div className="mt-4">
              <CaseNotesTimeline notes={caseItem.notes} />
            </div>
            {!isResolved ? (
              <div className="mt-5 border-t border-line pt-5">
                <AddCaseNoteForm onSubmit={(note) => addNote(caseItem.id, note)} />
              </div>
            ) : null}
          </section>

          <CaseRoleBoundaryNote />
        </div>

        <div className="xl:col-span-3">
          <CaseDetailSidebar caseItem={caseItem} />
        </div>
      </div>
    </div>
  );
}
