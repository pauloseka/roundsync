"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { OnCallRotaPanel } from "@/components/on-call/OnCallRotaPanel";
import { getPendingAlertWatch, getQueueSummary } from "@/lib/cases";
import { formatPatientLocation } from "@/lib/format-patient";
import { formatElapsed, formatShiftRemaining } from "@/lib/format";
import { shiftContext } from "@/lib/mock-data";
import { vitalsStatusLabel } from "@/lib/vitals";

const ALERT_TIMEOUT_MINUTES = 5;

export function CasesQueueSidebar() {
  const { cases, patientsAvailableForNewCase } = useCases();
  const summary = getQueueSummary(cases);
  const pendingAlerts = getPendingAlertWatch(cases);

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Queue at a glance
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Active</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {summary.totalActive}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Awaiting ack</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {summary.pendingAlerts}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Escalated</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink-primary">
              {summary.escalated}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">Reopened</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink-primary">
              {summary.reopened}
            </dd>
          </div>
        </dl>
        {(summary.critical > 0 || summary.urgent > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.critical > 0 ? (
              <span className="rounded bg-critical-muted px-2 py-0.5 text-xs font-semibold text-critical">
                {summary.critical} critical
              </span>
            ) : null}
            {summary.urgent > 0 ? (
              <span className="rounded bg-urgent-muted px-2 py-0.5 text-xs font-semibold text-urgent">
                {summary.urgent} urgent
              </span>
            ) : null}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <h2 className="font-display text-base font-semibold text-ink-primary">
          Awaiting response
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Pending alerts — auto-escalates after {ALERT_TIMEOUT_MINUTES} min without ack.
        </p>
        {pendingAlerts.length === 0 ? (
          <p className="mt-4 text-sm text-ink-secondary">No pending alerts right now.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {pendingAlerts.map((item) => {
              const nearingTimeout = item.sentMinutesAgo >= ALERT_TIMEOUT_MINUTES - 2;

              return (
                <li key={`${item.caseId}-${item.recipientName}`}>
                  <Link
                    href={`/cases/${item.caseId}`}
                    className="block rounded-lg border border-line bg-surface-base px-3 py-2.5 hover:border-brand-core/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-primary">{item.patientName}</p>
                        <p className="mt-0.5 text-xs text-ink-secondary">
                          {item.recipientName} · {item.role}
                        </p>
                      </div>
                      <UrgencyChip level={item.urgencyLevel} />
                    </div>
                    <p
                      className={`mt-2 font-mono text-[11px] ${
                        nearingTimeout ? "font-medium text-critical" : "text-ink-secondary"
                      }`}
                    >
                      Sent {formatElapsed(item.sentMinutesAgo)} ago
                      {nearingTimeout ? " · nearing timeout" : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <h2 className="font-display text-base font-semibold text-ink-primary">
          No open case yet
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Ward patients you can flag if something new comes up.
        </p>
        {patientsAvailableForNewCase.length === 0 ? (
          <p className="mt-4 text-sm text-ink-secondary">
            Every patient on your ward already has an active case.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {patientsAvailableForNewCase.map((patient) => {
              const vitals = vitalsStatusLabel[patient.vitalsStatus];

              return (
                <li
                  key={patient.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-line bg-surface-base px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-primary">{patient.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-ink-secondary">
                      {formatPatientLocation(patient)}
                    </p>
                    {patient.clinicalWarning ? (
                      <p className="mt-1.5 text-xs text-task-overdue">
                        {patient.clinicalWarning.signal}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${vitals.className}`}
                  >
                    {vitals.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <Link
          href="/cases/new"
          className="mt-4 inline-block text-sm font-medium text-brand-core hover:underline"
        >
          Trigger new case →
        </Link>
      </section>

      <OnCallRotaPanel />

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Shift window
        </p>
        <p className="mt-2 font-display text-sm font-semibold text-ink-primary">
          {shiftContext.ward}
        </p>
        <p className="mt-0.5 font-mono text-xs text-ink-secondary">
          {shiftContext.shiftStart}–{shiftContext.shiftEnd} ·{" "}
          <span suppressHydrationWarning>{formatShiftRemaining(shiftContext.shiftEnd)} left</span>
        </p>
      </section>
    </aside>
  );
}
