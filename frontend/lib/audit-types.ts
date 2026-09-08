export type AuditEntryKind =
  | "case_triggered"
  | "case_note_added"
  | "case_escalated"
  | "case_reopened"
  | "case_resolved"
  | "alert_acknowledged"
  | "task_completed";

export interface AuditEntryDetail {
  label: string;
  value: string;
}

export interface AuditLogEntry {
  id: string;
  kind: AuditEntryKind;
  summary: string;
  actorName: string;
  actorRole: string;
  occurredMinutesAgo: number;
  patientId?: string;
  patientName?: string;
  ward?: string;
  bed?: string;
  caseId?: string;
  taskId?: string;
  details: AuditEntryDetail[];
}

export type AuditTrailFilter = "all" | "cases" | "tasks";
