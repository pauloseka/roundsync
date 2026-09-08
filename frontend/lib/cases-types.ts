import type { CaseUrgency } from "@/lib/mock-data";

export type CaseWorkflowStatus = "open" | "escalated" | "reopened" | "resolved";
export type CaseAlertStatus = "pending" | "acknowledged" | "escalated" | "timed_out";
export type HandoffStatus = "active" | "pending" | "accepted";

export interface CaseHandoff {
  status: HandoffStatus;
  outgoingOwnerName: string;
  incomingOwnerName?: string;
  offeredMinutesAgo?: number;
  acceptedMinutesAgo?: number;
}

export interface CaseAlert {
  id: string;
  recipientName: string;
  role: string;
  status: CaseAlertStatus;
  sentMinutesAgo: number;
  acknowledgedMinutesAgo?: number;
}

export interface CaseNote {
  id: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdMinutesAgo: number;
}

export interface EscalationStep {
  id: string;
  fromRecipientName: string;
  fromRole: string;
  toRecipientName: string;
  toRole: string;
  reason: string;
  escalatedMinutesAgo: number;
}

export interface EmergencyCase {
  id: string;
  patientId: string;
  patientName: string;
  ward: string;
  bed: string;
  urgencyLevel: CaseUrgency;
  status: CaseWorkflowStatus;
  summary: string;
  triggerNote: string;
  triggeredByName: string;
  elapsedMinutes: number;
  resolvedMinutesAgo?: number;
  /** Bedside RN responsible for coordination on this case. */
  bedsideOwnerName?: string;
  /** Shift-boundary ownership transfer — see lib/handoff.ts */
  handoff?: CaseHandoff;
  /** Set when a resolved case is reopened — see lib/case-relapse.ts */
  reopenedFromCaseId?: string;
  reopenedAfterResolvedMinutesAgo?: number;
  priorResolutionSummary?: string;
  alerts: CaseAlert[];
  notes: CaseNote[];
  escalationTrail: EscalationStep[];
}

export interface TriggerCaseInput {
  patientId: string;
  urgencyLevel: CaseUrgency;
  triggerNote: string;
}

export const caseStatusLabel: Record<CaseWorkflowStatus, string> = {
  escalated: "Escalated",
  open: "Open",
  reopened: "Reopened",
  resolved: "Resolved",
};

export const alertStatusLabel: Record<CaseAlertStatus, string> = {
  pending: "Pending",
  acknowledged: "Acknowledged",
  escalated: "Escalated",
  timed_out: "Timed out",
};

export const escalationReasonLabel: Record<string, string> = {
  no_response_timeout: "No response within timeout window",
};

export function isActiveCase(caseItem: EmergencyCase): boolean {
  return caseItem.status !== "resolved";
}
