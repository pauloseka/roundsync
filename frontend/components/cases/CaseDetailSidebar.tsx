"use client";

import Link from "next/link";
import { CaseResponseStatus, formatCaseElapsed } from "@/components/cases/CaseResponseStatus";
import { useCases } from "@/components/cases/CasesStore";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { useWardOperations } from "@/components/ward/WardOperationsStore";
import { getScheduledPrimaryOnCall } from "@/lib/on-call-rota";
import { getOtherActiveCases } from "@/lib/cases";
import { formatPatientLocation } from "@/lib/format-patient";
import { formatElapsed } from "@/lib/format";
import { caseStatusLabel, type EmergencyCase } from "@/lib/cases-types";
import { shiftPatients } from "@/lib/mock-data";
import { vitalsStatusLabel } from "@/lib/vitals";

interface CaseDetailSidebarProps {
  caseItem: EmergencyCase;
}

export function CaseDetailSidebar({ caseItem }: CaseDetailSidebarProps) {
  const { cases } = useCases();
  const patient = shiftPatients.find((item) => item.id === caseItem.patientId);
  const otherCases = getOtherActiveCases(cases, caseItem.id, 3);
  const pendingAlerts = caseItem.alerts.filter((alert) => alert.status === "pending");
  const latestNote = caseItem.notes[0];
  const { wardCode, activeOnCall } = useWardOperations();
  const scheduledOnCall = getScheduledPrimaryOnCall(wardCode);
  const isResolved = caseItem.status === "resolved";

  return (
    <aside className="flex flex-col gap-6">
      {patient ? (
        <section className="rounded-xl border border-line bg-surface-card p-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Patient snapshot
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold text-ink-primary">
                {patient.name}
              </p>
              <p className="mt-0.5 font-mono text-xs text-ink-secondary">
                {formatPatientLocation(patient)} · {patient.id}
              </p>
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${vitalsStatusLabel[patient.vitalsStatus].className}`}
            >
              {vitalsStatusLabel[patient.vitalsStatus].label}
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-ink-secondary">
            Vitals updated {formatElapsed(patient.lastUpdatedMinutes)} ago
          </p>
          {patient.clinicalWarning ? (
            <div className="mt-3 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2.5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-task-overdue">
                Early warning
              </p>
              <p className="mt-1 text-sm font-medium text-ink-primary">
                {patient.clinicalWarning.signal}
              </p>
              <p className="mt-0.5 text-xs text-ink-secondary">{patient.clinicalWarning.trend}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Case timeline
        </p>
        <dl className="mt-3 space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-secondary">Status</dt>
            <dd className="font-medium text-ink-primary">{caseStatusLabel[caseItem.status]}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-secondary">Triggered by</dt>
            <dd className="text-right font-medium text-ink-primary">
              {caseItem.triggeredByName}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-secondary">Case ID</dt>
            <dd className="font-mono text-xs text-ink-primary">{caseItem.id}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-secondary">{isResolved ? "Time open" : "Open for"}</dt>
            <dd className="font-mono text-xs text-ink-primary">
              {formatCaseElapsed(caseItem.elapsedMinutes)}
            </dd>
          </div>
          {caseItem.notes.length > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-secondary">Follow-up notes</dt>
              <dd className="font-medium text-ink-primary">{caseItem.notes.length}</dd>
            </div>
          ) : null}
          {caseItem.escalationTrail.length > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-secondary">Escalations</dt>
              <dd className="font-medium text-critical">{caseItem.escalationTrail.length}</dd>
            </div>
          ) : null}
        </dl>
        {latestNote ? (
          <blockquote className="mt-4 border-l-2 border-line pl-3 text-sm text-ink-secondary">
            <p className="font-medium text-ink-primary">{latestNote.authorName}</p>
            <p className="mt-1 leading-relaxed">{latestNote.note}</p>
            <p className="mt-1.5 font-mono text-[11px] text-ink-secondary">
              {formatElapsed(latestNote.createdMinutesAgo)} ago
            </p>
          </blockquote>
        ) : null}
      </section>

      {!isResolved && pendingAlerts.length > 0 ? (
        <section className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            Still waiting on
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {pendingAlerts.length === 1
              ? "1 alert hasn't been acknowledged yet."
              : `${pendingAlerts.length} alerts haven't been acknowledged yet.`}
          </p>
          <div className="mt-3">
            <CaseResponseStatus alerts={pendingAlerts} />
          </div>
        </section>
      ) : null}

      {otherCases.length > 0 ? (
        <section className="rounded-xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-base font-semibold text-ink-primary">
            Other active cases
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">Elsewhere on your ward.</p>
          <ul className="mt-4 flex flex-col gap-2">
            {otherCases.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/cases/${other.id}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-line bg-surface-base px-3 py-2.5 hover:border-brand-core/30"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-primary">{other.patientName}</p>
                    <p className="mt-0.5 text-xs text-ink-secondary">{other.summary}</p>
                  </div>
                  <UrgencyChip level={other.urgencyLevel} />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/cases"
            className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
          >
            Back to full queue →
          </Link>
        </section>
      ) : null}

      <section className="rounded-xl border border-line bg-surface-card p-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            On-call routing
          </p>
          <p className="mt-2 text-sm font-medium text-ink-primary">{activeOnCall.name}</p>
          <p className="text-xs text-ink-secondary">
            {activeOnCall.role}
            {scheduledOnCall && scheduledOnCall.name !== activeOnCall.name
              ? ` · Rota: ${scheduledOnCall.name}`
              : ""}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
            Alerts route from rota — use messages for non-urgent updates on this case.
          </p>
        </section>
    </aside>
  );
}
