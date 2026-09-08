"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RelapseSuggestionPanel } from "@/components/cases/RelapseSuggestionPanel";
import { useCases } from "@/components/cases/CasesStore";
import { getRelapseBlockReason } from "@/lib/case-relapse";
import { relapseCopy } from "@/lib/content/copy";
import type { CaseUrgency } from "@/lib/mock-data";
import { formatPatientLocation } from "@/lib/format-patient";

const urgencyOptions: { value: CaseUrgency; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "urgent", label: "Urgent" },
  { value: "moderate", label: "Moderate" },
];

export function TriggerCaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cases, patientsAvailableForNewCase, patientsBlockedForNewCase, triggerCase } = useCases();
  const requestedPatientId = searchParams.get("patient");
  const defaultPatientId =
    patientsAvailableForNewCase.find((patient) => patient.id === requestedPatientId)?.id ??
    patientsAvailableForNewCase[0]?.id ??
    "";
  const [patientId, setPatientId] = useState(defaultPatientId);
  const [urgencyLevel, setUrgencyLevel] = useState<CaseUrgency>("urgent");
  const [triggerNote, setTriggerNote] = useState("");

  const blockedForRequested = requestedPatientId
    ? getRelapseBlockReason(cases, requestedPatientId)
    : null;
  const blockedPatient = patientsBlockedForNewCase.find(
    (caseItem) => caseItem.patientId === requestedPatientId,
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const caseId = triggerCase({ patientId, urgencyLevel, triggerNote });
    if (caseId) {
      router.push(`/cases/${caseId}`);
    }
  }

  if (blockedForRequested && blockedPatient) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 px-4 py-3">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-task-overdue">
            {relapseCopy.triggerBlockedTitle}
          </p>
          <p className="mt-1 text-sm text-ink-secondary">{blockedForRequested}</p>
        </div>
        <RelapseSuggestionPanel
          patientId={blockedPatient.patientId}
          patientName={blockedPatient.patientName}
          variant="inline"
        />
        <Link
          href="/cases"
          className="text-sm font-medium text-brand-core hover:underline"
        >
          ← Back to queue
        </Link>
      </div>
    );
  }

  if (patientsAvailableForNewCase.length === 0) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <p className="text-sm text-ink-secondary">
          Every patient on your ward already has an open case or a recently resolved case that must
          be reopened. Check the queue or reopen from the patient record.
        </p>
        {patientsBlockedForNewCase.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {patientsBlockedForNewCase.map((caseItem) => (
              <li key={caseItem.id}>
                <RelapseSuggestionPanel
                  patientId={caseItem.patientId}
                  patientName={caseItem.patientName}
                  variant="inline"
                />
              </li>
            ))}
          </ul>
        ) : null}
        <Link href="/cases" className="text-sm font-medium text-brand-core hover:underline">
          ← Back to queue
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Patient
        </span>
        <select
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
          className="rounded-lg border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary focus:border-brand-core focus:outline-none"
        >
          {patientsAvailableForNewCase.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} · {formatPatientLocation(patient)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Urgency
        </span>
        <select
          value={urgencyLevel}
          onChange={(event) => setUrgencyLevel(event.target.value as CaseUrgency)}
          className="rounded-lg border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary focus:border-brand-core focus:outline-none"
        >
          {urgencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Trigger note
        </span>
        <textarea
          value={triggerNote}
          onChange={(event) => setTriggerNote(event.target.value)}
          rows={4}
          placeholder="What happened? Include vitals, symptoms, and what you've done so far."
          className="rounded-lg border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-secondary focus:border-brand-core focus:outline-none"
          required
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!triggerNote.trim() || !patientId}
          className="rounded-lg bg-brand-core px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Trigger case
        </button>
        <Link
          href="/cases"
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-primary hover:bg-surface-base"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
