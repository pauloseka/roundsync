"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { patientsCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { formatElapsed, formatTimestamp } from "@/lib/format";
import { formatPatientLocation } from "@/lib/format-patient";
import { getPatientById, patientHasEarlyWarning } from "@/lib/patients";
import { shiftPatients } from "@/lib/mock-data";
import { getTasksForPatient } from "@/lib/scheduled-tasks";
import { vitalsStatusLabel } from "@/lib/vitals";
import { signUpCopy } from "@/lib/signup-content";

interface AdminPatientReviewClientProps {
  patientId: string;
}

export function AdminPatientReviewClient({ patientId }: AdminPatientReviewClientProps) {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminReview;
  const detailCopy = patientsCopy.detail;
  const { getPatientCase, activeCasePatientIds } = useCases();
  const patient = getPatientById(shiftPatients, patientId);
  const openCase = getPatientCase(patientId);
  const tasks = getTasksForPatient(patientId);
  const showEarlyWarning = patient
    ? patientHasEarlyWarning(patient, activeCasePatientIds)
    : false;

  if (!ready) return <PageLoadingFallback variant="embedded" />;

  if (!patient) {
    return (
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-ink-secondary">{copy.patientNotFound}</p>
        <Link
          href="/admin/audit"
          className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
        >
          {copy.backToAudit}
        </Link>
      </div>
    );
  }

  const vitals = vitalsStatusLabel[patient.vitalsStatus];
  const updatedAt = new Date();
  updatedAt.setMinutes(updatedAt.getMinutes() - patient.lastUpdatedMinutes);
  const timestamp = formatTimestamp(updatedAt);

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
          <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${vitals.className}`}>
            {vitals.label}
          </span>
          {openCase ? (
            <span className="rounded bg-brand-core-muted px-2 py-0.5 text-[11px] font-semibold text-brand-core">
              {detailCopy.activeCaseLabel}
            </span>
          ) : null}
          {showEarlyWarning ? (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-task-overdue">
              {detailCopy.earlyWarningLabel}
            </span>
          ) : null}
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {copy.adminLabel}
          </span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">{patient.name}</h1>
        <p className="mt-1 font-mono text-sm text-ink-secondary">{formatPatientLocation(patient)}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface-card p-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            {detailCopy.vitalsLabel}
          </p>
          <p className="mt-3 font-display text-lg font-semibold text-ink-primary">{vitals.label}</p>
          <p className="mt-1 text-sm text-ink-secondary" suppressHydrationWarning>
            {detailCopy.lastUpdatedLabel}: {timestamp.relative}{" "}
            <span className="font-mono text-xs">({timestamp.absolute})</span>
          </p>

          {showEarlyWarning && patient.clinicalWarning ? (
            <div className="mt-4 rounded-lg border border-amber-200/70 bg-amber-50/50 px-4 py-3">
              <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-task-overdue">
                {detailCopy.earlyWarningLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-primary">
                {patient.clinicalWarning.signal}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">{patient.clinicalWarning.trend}</p>
              <p className="mt-2 font-mono text-xs text-ink-secondary">
                Flagged {formatMessageAgo(patient.clinicalWarning.flaggedMinutesAgo)}
              </p>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            {detailCopy.activeCaseLabel}
          </h2>
          {openCase ? (
            <div className="mt-4 rounded-lg border border-line bg-surface-base px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <UrgencyChip level={openCase.urgencyLevel} />
                <span className="font-mono text-xs text-ink-secondary">
                  Open {formatElapsed(openCase.elapsedMinutes)}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-secondary">{openCase.summary}</p>
              <Link
                href={`/admin/cases/${openCase.id}`}
                className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
              >
                {copy.viewCase} →
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-secondary">{detailCopy.noActiveCase}</p>
          )}
        </section>

        <section className="rounded-xl border border-line bg-surface-card p-5 xl:col-span-2">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            {detailCopy.tasksLabel}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.tasksReadOnlyBody}</p>
          {tasks.length === 0 ? (
            <p className="mt-4 text-sm text-ink-secondary">{detailCopy.tasksEmpty}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-line bg-surface-base px-4 py-3 text-sm text-ink-secondary"
                >
                  <span className="font-medium text-ink-primary">{task.description}</span>
                  <span className="mx-2 text-line">·</span>
                  {task.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
