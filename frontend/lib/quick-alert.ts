import { patientCanTriggerNewCase } from "@/lib/case-relapse";
import type { EmergencyCase } from "@/lib/cases-types";
import { formatPatientLocation } from "@/lib/format-patient";
import type { CaseUrgency, ShiftPatient } from "@/lib/mock-data";

export const QUICK_ALERT_URGENCIES: CaseUrgency[] = ["critical", "urgent", "moderate"];

export function inferDefaultUrgency(patient: ShiftPatient): CaseUrgency {
  if (patient.vitalsStatus === "abnormal") return "critical";
  if (patient.clinicalWarning) return "urgent";
  if (patient.vitalsStatus === "watch") return "urgent";
  return "moderate";
}

export function buildQuickTriggerNote(patient: ShiftPatient): string {
  if (patient.clinicalWarning) {
    return `${patient.clinicalWarning.signal} — ${patient.clinicalWarning.trend}. Escalation triggered from ward view.`;
  }

  return `Escalation triggered for ${patient.name} (${formatPatientLocation(patient)}). Vitals status: ${patient.vitalsStatus}.`;
}

export function patientEligibleForQuickAlert(
  cases: EmergencyCase[],
  patientId: string,
): boolean {
  return patientCanTriggerNewCase(cases, patientId);
}

export const urgencyActionLabel: Record<CaseUrgency, string> = {
  critical: "Critical",
  urgent: "Urgent",
  moderate: "Moderate",
};

export const urgencyActionClassName: Record<CaseUrgency, string> = {
  critical: "bg-critical-muted text-critical hover:bg-critical-muted/80",
  urgent: "bg-urgent-muted text-urgent hover:bg-urgent-muted/80",
  moderate: "bg-surface-base text-ink-primary ring-1 ring-line hover:bg-surface-card",
};
