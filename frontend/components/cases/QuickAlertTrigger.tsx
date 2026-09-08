"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCases } from "@/components/cases/CasesStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { quickAlertCopy } from "@/lib/content/copy";
import type { CaseUrgency, ShiftPatient } from "@/lib/mock-data";
import {
  buildQuickTriggerNote,
  inferDefaultUrgency,
  patientEligibleForQuickAlert,
  QUICK_ALERT_URGENCIES,
  urgencyActionClassName,
  urgencyActionLabel,
} from "@/lib/quick-alert";

interface QuickAlertTriggerProps {
  patient: ShiftPatient;
  /** buttons = 1 click (pick urgency). confirm = 2 clicks (recommended urgency). */
  layout?: "buttons" | "confirm";
  className?: string;
}

export function QuickAlertTrigger({
  patient,
  layout = "buttons",
  className = "",
}: QuickAlertTriggerProps) {
  const router = useRouter();
  const { cases, triggerCase } = useCases();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!patientEligibleForQuickAlert(cases, patient.id)) {
    return null;
  }

  const defaultUrgency = inferDefaultUrgency(patient);
  const defaultNote = buildQuickTriggerNote(patient);

  function fireTrigger(urgencyLevel: CaseUrgency) {
    const caseId = triggerCase({
      patientId: patient.id,
      urgencyLevel,
      triggerNote: defaultNote,
    });

    if (caseId) {
      router.push(`/cases/${caseId}`);
    }
  }

  if (layout === "confirm") {
    return (
      <>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setConfirmOpen(true);
          }}
          className={`shrink-0 rounded-md bg-brand-core px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-core/90 ${className}`}
        >
          {quickAlertCopy.triggerButton}
        </button>

        <ConfirmDialog
          open={confirmOpen}
          title={quickAlertCopy.confirmTitle(patient.name)}
          description={quickAlertCopy.confirmDescription(
            urgencyActionLabel[defaultUrgency],
            defaultNote,
          )}
          confirmLabel={quickAlertCopy.confirmButton(defaultUrgency)}
          cancelLabel={quickAlertCopy.cancelButton}
          onConfirm={() => {
            setConfirmOpen(false);
            fireTrigger(defaultUrgency);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
        {quickAlertCopy.pickUrgencyLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_ALERT_URGENCIES.map((urgency) => {
          const isRecommended = urgency === defaultUrgency;

          return (
            <button
              key={urgency}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                fireTrigger(urgency);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${urgencyActionClassName[urgency]}`}
            >
              {urgencyActionLabel[urgency]}
              {isRecommended ? ` · ${quickAlertCopy.recommended}` : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
