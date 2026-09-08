"use client";

import Link from "next/link";
import { QuickAlertTrigger } from "@/components/cases/QuickAlertTrigger";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { useCases } from "@/components/cases/CasesStore";
import { patientEligibleForQuickAlert } from "@/lib/quick-alert";
import { formatDueIn, formatElapsed, formatTimestamp } from "@/lib/format";
import { formatPatientLocation } from "@/lib/format-patient";
import type { ShiftPatient } from "@/lib/mock-data";
import { getTasksForPatient } from "@/lib/scheduled-tasks";
import { vitalsStatusLabel } from "@/lib/vitals";

interface PatientRowProps {
  patient: ShiftPatient;
}

export function PatientRow({ patient }: PatientRowProps) {
  const vitals = vitalsStatusLabel[patient.vitalsStatus];
  const { cases, getPatientCase } = useCases();
  const openCase = getPatientCase(patient.id);
  const canQuickAlert = !openCase && patientEligibleForQuickAlert(cases, patient.id);
  const pendingTasks = getTasksForPatient(patient.id);
  const nextTask = pendingTasks[0];
  const updatedAt = new Date();
  updatedAt.setMinutes(updatedAt.getMinutes() - patient.lastUpdatedMinutes);
  const timestamp = formatTimestamp(updatedAt);

  return (
    <div className="w-full rounded-lg border border-line bg-surface-card transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/30">
      <div className="flex items-start gap-3 px-4 py-3">
        <Link
          href={`/patients/${patient.id}`}
          className="min-w-0 flex-1 text-left"
          aria-label={`View ${patient.name}, bed ${patient.bed}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-display text-base font-semibold text-ink-primary">
                  {patient.name}
                </h2>
                <span className="font-mono text-xs text-ink-secondary">{patient.id}</span>
              </div>

              <p className="mt-0.5 font-mono text-xs text-ink-secondary">
                {formatPatientLocation(patient)}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${vitals.className}`}
              >
                {vitals.label}
              </span>
              <p className="font-mono text-xs text-ink-secondary" suppressHydrationWarning>
                {timestamp.relative} <span>({timestamp.absolute})</span>
              </p>
            </div>
          </div>
        </Link>

        {canQuickAlert ? (
          <QuickAlertTrigger patient={patient} layout="confirm" className="mt-0.5" />
        ) : null}
      </div>

      <Link
        href={`/patients/${patient.id}`}
        className="block border-t border-line px-4 py-3"
        aria-hidden={!openCase && pendingTasks.length === 0}
      >
        <div className="flex flex-wrap items-center gap-2">
          {openCase ? (
            <div className="flex items-center gap-2">
              <UrgencyChip level={openCase.urgencyLevel} />
              <span className="font-mono text-xs text-ink-secondary">
                Open {formatElapsed(openCase.elapsedMinutes)}
              </span>
            </div>
          ) : null}

          {nextTask ? (
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                nextTask.status === "overdue"
                  ? "bg-amber-50 text-task-overdue"
                  : nextTask.status === "due_soon"
                    ? "bg-amber-50/60 text-task-overdue"
                    : "bg-surface-base text-task-neutral ring-1 ring-line"
              }`}
            >
              {nextTask.description} · {formatDueIn(nextTask.dueInMinutes)}
            </span>
          ) : null}

          {pendingTasks.length > 1 ? (
            <span className="text-xs text-ink-secondary">
              +{pendingTasks.length - 1} more task
              {pendingTasks.length - 1 === 1 ? "" : "s"}
            </span>
          ) : null}

          {!openCase && pendingTasks.length === 0 ? (
            <span className="text-xs text-ink-secondary">No tasks due soon</span>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
