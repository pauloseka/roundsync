import type {
  CaseWorkflowStatus,
  EmergencyCase,
  TriggerCaseInput,
} from "@/lib/cases-types";
import { isActiveCase } from "@/lib/cases-types";
import type { CaseUrgency } from "@/lib/mock-data";
import { shiftContext } from "@/lib/mock-data";
import { resolveAlertRecipient } from "@/lib/on-call-rota";

const urgencyRank: Record<CaseUrgency, number> = {
  critical: 0,
  urgent: 1,
  moderate: 2,
};

const workflowRank: Record<Exclude<CaseWorkflowStatus, "resolved">, number> = {
  escalated: 0,
  reopened: 1,
  open: 2,
};

export function sortCasesByAcuity(cases: EmergencyCase[]): EmergencyCase[] {
  return [...cases].sort((a, b) => {
    if (a.status === "resolved" && b.status !== "resolved") return 1;
    if (b.status === "resolved" && a.status !== "resolved") return -1;

    const urgencyDiff = urgencyRank[a.urgencyLevel] - urgencyRank[b.urgencyLevel];
    if (urgencyDiff !== 0) return urgencyDiff;

    if (isActiveCase(a) && isActiveCase(b)) {
      const workflowDiff =
        workflowRank[a.status as keyof typeof workflowRank] -
        workflowRank[b.status as keyof typeof workflowRank];
      if (workflowDiff !== 0) return workflowDiff;
    }

    return a.elapsedMinutes - b.elapsedMinutes;
  });
}

export function getActiveCases(cases: EmergencyCase[]): EmergencyCase[] {
  return sortCasesByAcuity(cases.filter(isActiveCase));
}

export function getResolvedCases(cases: EmergencyCase[]): EmergencyCase[] {
  return sortCasesByAcuity(cases.filter((caseItem) => caseItem.status === "resolved"));
}

export function getActiveCasePatientIds(cases: EmergencyCase[]): Set<string> {
  return new Set(getActiveCases(cases).map((caseItem) => caseItem.patientId));
}

export function getCaseById(cases: EmergencyCase[], caseId: string): EmergencyCase | undefined {
  return cases.find((caseItem) => caseItem.id === caseId);
}

export function getCaseForPatient(
  cases: EmergencyCase[],
  patientId: string,
): EmergencyCase | undefined {
  return getActiveCases(cases).find((caseItem) => caseItem.patientId === patientId);
}

export function getActiveCaseCount(cases: EmergencyCase[]): number {
  return getActiveCases(cases).length;
}

export type CaseBadgeUrgency = CaseUrgency;

export function getCaseBadgeUrgency(cases: EmergencyCase[]): CaseBadgeUrgency {
  const sorted = getActiveCases(cases);
  return sorted[0]?.urgencyLevel ?? "moderate";
}

export interface CaseSection {
  id: Exclude<CaseWorkflowStatus, "resolved">;
  label: string;
  cases: EmergencyCase[];
}

export function getAllCaseSections(cases: EmergencyCase[]): CaseSection[] {
  const active = getActiveCases(cases);

  return [
    {
      id: "escalated",
      label: "Escalated",
      cases: active.filter((caseItem) => caseItem.status === "escalated"),
    },
    {
      id: "open",
      label: "Open",
      cases: active.filter((caseItem) => caseItem.status === "open"),
    },
    {
      id: "reopened",
      label: "Reopened",
      cases: active.filter((caseItem) => caseItem.status === "reopened"),
    },
  ];
}

export function getDashboardCasePreviews(
  cases: EmergencyCase[],
  limit = 2,
): { items: EmergencyCase[]; total: number } {
  const items = getActiveCases(cases);

  return {
    items: items.slice(0, limit),
    total: items.length,
  };
}

export interface QueueSummary {
  totalActive: number;
  escalated: number;
  open: number;
  reopened: number;
  critical: number;
  urgent: number;
  moderate: number;
  pendingAlerts: number;
}

export function getQueueSummary(cases: EmergencyCase[]): QueueSummary {
  const active = getActiveCases(cases);

  return {
    totalActive: active.length,
    escalated: active.filter((caseItem) => caseItem.status === "escalated").length,
    open: active.filter((caseItem) => caseItem.status === "open").length,
    reopened: active.filter((caseItem) => caseItem.status === "reopened").length,
    critical: active.filter((caseItem) => caseItem.urgencyLevel === "critical").length,
    urgent: active.filter((caseItem) => caseItem.urgencyLevel === "urgent").length,
    moderate: active.filter((caseItem) => caseItem.urgencyLevel === "moderate").length,
    pendingAlerts: active.reduce(
      (count, caseItem) =>
        count + caseItem.alerts.filter((alert) => alert.status === "pending").length,
      0,
    ),
  };
}

export interface PendingAlertWatchItem {
  caseId: string;
  patientName: string;
  recipientName: string;
  role: string;
  sentMinutesAgo: number;
  urgencyLevel: CaseUrgency;
}

export function getPendingAlertWatch(cases: EmergencyCase[]): PendingAlertWatchItem[] {
  const items: PendingAlertWatchItem[] = [];

  for (const caseItem of getActiveCases(cases)) {
    for (const alert of caseItem.alerts) {
      if (alert.status === "pending") {
        items.push({
          caseId: caseItem.id,
          patientName: caseItem.patientName,
          recipientName: alert.recipientName,
          role: alert.role,
          sentMinutesAgo: alert.sentMinutesAgo,
          urgencyLevel: caseItem.urgencyLevel,
        });
      }
    }
  }

  return items.sort((a, b) => b.sentMinutesAgo - a.sentMinutesAgo);
}

export function getOtherActiveCases(
  cases: EmergencyCase[],
  excludeCaseId: string,
  limit = 4,
): EmergencyCase[] {
  return getActiveCases(cases)
    .filter((caseItem) => caseItem.id !== excludeCaseId)
    .slice(0, limit);
}

export function createCaseId(): string {
  return `case-${Date.now()}`;
}

export function createNoteId(): string {
  return `note-${Date.now()}`;
}

export function buildTriggeredCase(
  input: TriggerCaseInput,
  patient: { id: string; name: string; ward: string; bed: string },
  onCallOverrideId?: string | null,
): EmergencyCase {
  const onCall = resolveAlertRecipient(patient.ward, onCallOverrideId);

  return {
    id: createCaseId(),
    patientId: patient.id,
    patientName: patient.name,
    ward: patient.ward,
    bed: patient.bed,
    urgencyLevel: input.urgencyLevel,
    status: "open",
    summary: input.triggerNote.slice(0, 72),
    triggerNote: input.triggerNote,
    triggeredByName: shiftContext.nurseName,
    bedsideOwnerName: shiftContext.nurseName,
    elapsedMinutes: 0,
    alerts: [
      {
        id: `alert-${Date.now()}`,
        recipientName: onCall.name,
        role: onCall.role,
        status: "pending",
        sentMinutesAgo: 0,
      },
    ],
    notes: [],
    escalationTrail: [],
  };
}

export function reopenCaseRecord(
  caseItem: EmergencyCase,
  triggerNote: string,
  onCallOverrideId?: string | null,
): EmergencyCase {
  const onCall = resolveAlertRecipient(caseItem.ward, onCallOverrideId);
  const priorResolution =
    caseItem.priorResolutionSummary ??
    caseItem.notes.find((note) => note.authorRole === "On-call")?.note;

  return {
    ...caseItem,
    status: "reopened",
    elapsedMinutes: 0,
    resolvedMinutesAgo: undefined,
    summary: triggerNote.slice(0, 72),
    triggerNote,
    triggeredByName: shiftContext.nurseName,
    bedsideOwnerName: shiftContext.nurseName,
    reopenedFromCaseId: caseItem.id,
    reopenedAfterResolvedMinutesAgo: caseItem.resolvedMinutesAgo,
    priorResolutionSummary: priorResolution,
    alerts: [
      {
        id: `alert-${Date.now()}`,
        recipientName: onCall.name,
        role: onCall.role,
        status: "pending",
        sentMinutesAgo: 0,
      },
    ],
    notes: [
      ...caseItem.notes,
      {
        id: createNoteId(),
        authorName: shiftContext.nurseName,
        authorRole: "RN",
        note: `Case reopened — ${triggerNote}`,
        createdMinutesAgo: 0,
      },
    ],
    escalationTrail: [],
  };
}

export { acceptHandoffRecord, acceptAllHandoffs } from "@/lib/handoff";
export { getHandoffSummary, getPendingHandoffCases } from "@/lib/handoff";

// Re-export types for convenience
export type {
  CaseAlert,
  CaseAlertStatus,
  CaseNote,
  CaseWorkflowStatus,
  EmergencyCase,
  EscalationStep,
  TriggerCaseInput,
} from "@/lib/cases-types";
export {
  alertStatusLabel,
  caseStatusLabel,
  escalationReasonLabel,
  isActiveCase,
} from "@/lib/cases-types";
