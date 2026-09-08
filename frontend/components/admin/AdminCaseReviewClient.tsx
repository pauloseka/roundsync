"use client";

import Link from "next/link";
import { CaseNotesTimeline } from "@/components/cases/CaseNotesTimeline";
import { CaseOwnershipChip } from "@/components/cases/CaseOwnershipChip";
import { CaseResponseStatus, formatCaseElapsed } from "@/components/cases/CaseResponseStatus";
import { EscalationTrail } from "@/components/cases/EscalationTrail";
import { useCases } from "@/components/cases/CasesStore";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { caseStatusLabel } from "@/lib/cases-types";
import { formatPatientLocation } from "@/lib/format-patient";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { signUpCopy } from "@/lib/signup-content";

interface AdminCaseReviewClientProps {
  caseId: string;
}

export function AdminCaseReviewClient({ caseId }: AdminCaseReviewClientProps) {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminReview;
  const { getCase } = useCases();
  const caseItem = getCase(caseId);

  if (!ready) return <PageLoadingFallback variant="embedded" />;

  if (!caseItem) {
    return (
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-ink-secondary">{copy.caseNotFound}</p>
        <Link
          href="/admin/audit"
          className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
        >
          {copy.backToAudit}
        </Link>
      </div>
    );
  }

  const isResolved = caseItem.status === "resolved";

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <Link
          href="/admin/audit"
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          {copy.backToAudit}
        </Link>
        <p className="mt-4 rounded-lg border border-brand-core/25 bg-brand-core-muted/30 px-4 py-3 text-sm leading-relaxed text-ink-primary">
          {copy.readOnlyBanner}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <UrgencyChip level={caseItem.urgencyLevel} />
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {caseStatusLabel[caseItem.status]}
          </span>
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {copy.adminLabel}
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
        <p className="mt-2 font-mono text-xs text-ink-secondary">
          {isResolved && caseItem.resolvedMinutesAgo !== undefined
            ? `Resolved ${formatMessageAgo(caseItem.resolvedMinutesAgo)}`
            : formatCaseElapsed(caseItem.elapsedMinutes)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            {copy.triggerNoteTitle}
          </h2>
          <p className="mt-1 font-mono text-xs text-ink-secondary">
            {copy.triggeredBy(caseItem.triggeredByName)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{caseItem.triggerNote}</p>
        </section>

        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            {copy.alertsTitle}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.alertsBody}</p>
          <div className="mt-4">
            <CaseResponseStatus alerts={caseItem.alerts} />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            {copy.escalationTitle}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.escalationBody}</p>
          <div className="mt-4">
            <EscalationTrail steps={caseItem.escalationTrail} />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">{copy.notesTitle}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.notesBody}</p>
          <div className="mt-4">
            <CaseNotesTimeline notes={caseItem.notes} />
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href={`/admin/patients/${caseItem.patientId}`}
          className="text-sm font-medium text-brand-core hover:underline"
        >
          {copy.viewPatient} →
        </Link>
      </div>
    </div>
  );
}
