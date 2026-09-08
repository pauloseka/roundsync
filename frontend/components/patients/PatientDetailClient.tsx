"use client";

import Link from "next/link";
import { QuickAlertTrigger } from "@/components/cases/QuickAlertTrigger";
import { RelapseSuggestionPanel } from "@/components/cases/RelapseSuggestionPanel";
import { useCases } from "@/components/cases/CasesStore";
import { PatientRoleBoundaryNote } from "@/components/patients/PatientsSidebar";
import { TaskRow } from "@/components/tasks/TaskRow";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { patientsCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { formatElapsed, formatTimestamp } from "@/lib/format";
import { formatPatientLocation } from "@/lib/format-patient";
import { getPatientById, patientHasEarlyWarning } from "@/lib/patients";
import { shouldSuggestReopen } from "@/lib/case-relapse";
import { shiftPatients } from "@/lib/mock-data";
import { getTasksForPatient } from "@/lib/scheduled-tasks";
import { vitalsStatusLabel } from "@/lib/vitals";

interface PatientDetailClientProps {
  patientId: string;
}

export function PatientDetailClient({ patientId }: PatientDetailClientProps) {
  const { getPatientCase, activeCasePatientIds, cases } = useCases();
  const copy = patientsCopy.detail;
  const patient = getPatientById(shiftPatients, patientId);
  const openCase = getPatientCase(patientId);
  const tasks = getTasksForPatient(patientId);
  const showEarlyWarning = patient
    ? patientHasEarlyWarning(patient, activeCasePatientIds)
    : false;
  const suggestReopen = shouldSuggestReopen(cases, patientId);

  if (!patient) {
    return (
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-ink-secondary">Patient not found on your ward roster.</p>
        <Link href="/patients" className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline">
          {copy.backLabel}
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
          href="/patients"
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          {copy.backLabel}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${vitals.className}`}
          >
            {vitals.label}
          </span>
          {openCase ? (
            <span className="rounded bg-brand-core-muted px-2 py-0.5 text-[11px] font-semibold text-brand-core">
              Active case open
            </span>
          ) : null}
          {showEarlyWarning ? (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-task-overdue">
              Early warning
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">{patient.name}</h1>
        <p className="mt-1 font-mono text-sm text-ink-secondary">
          {formatPatientLocation(patient)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <section className="rounded-xl border border-line bg-surface-card p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
              {copy.vitalsLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-ink-primary">{vitals.label}</p>
                <p className="mt-1 text-sm text-ink-secondary" suppressHydrationWarning>
                  {copy.lastUpdatedLabel}: {timestamp.relative}{" "}
                  <span className="font-mono text-xs">({timestamp.absolute})</span>
                </p>
              </div>
            </div>

            {showEarlyWarning && patient.clinicalWarning ? (
              <div className="mt-4 rounded-lg border border-amber-200/70 bg-amber-50/50 px-4 py-3">
                <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-task-overdue">
                  {copy.earlyWarningLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink-primary">
                  {patient.clinicalWarning.signal}
                </p>
                <p className="mt-1 text-sm text-ink-secondary">{patient.clinicalWarning.trend}</p>
                <p className="mt-2 font-mono text-xs text-ink-secondary">
                  Flagged {formatMessageAgo(patient.clinicalWarning.flaggedMinutesAgo)}
                </p>
                <div className="mt-3 border-t border-amber-200/60 pt-3">
                  <QuickAlertTrigger patient={patient} layout="buttons" />
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              {copy.activeCaseLabel}
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
                  href={`/cases/${openCase.id}`}
                  className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
                >
                  {copy.openCaseCta} →
                </Link>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                <RelapseSuggestionPanel
                  patientId={patient.id}
                  patientName={patient.name}
                  variant="banner"
                />
                {!suggestReopen ? (
                  <>
                    <p className="text-sm text-ink-secondary">{copy.noActiveCase}</p>
                    <QuickAlertTrigger patient={patient} layout="buttons" />
                  </>
                ) : null}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">{copy.tasksLabel}</h2>
            <p className="mt-1 text-sm text-ink-secondary">{copy.tasksDescription}</p>
            {tasks.length === 0 ? (
              <p className="mt-4 text-sm text-ink-secondary">{copy.tasksEmpty}</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </ul>
            )}
            <Link
              href="/tasks"
              className="mt-4 inline-block text-sm font-medium text-brand-core hover:underline"
            >
              {copy.viewTasksCta} →
            </Link>
          </section>
        </div>

        <div className="xl:col-span-5">
          <PatientRoleBoundaryNote />
        </div>
      </div>
    </div>
  );
}
