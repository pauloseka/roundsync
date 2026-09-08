import type { AuditEntryKind, AuditLogEntry, AuditTrailFilter } from "@/lib/audit-types";
import { formatTimestamp } from "@/lib/format";

const caseKinds: AuditEntryKind[] = [
  "case_triggered",
  "case_note_added",
  "case_escalated",
  "case_reopened",
  "case_resolved",
  "alert_acknowledged",
];

export const auditKindLabel: Record<AuditEntryKind, string> = {
  case_triggered: "Case triggered",
  case_note_added: "Case note",
  case_escalated: "Escalation",
  case_reopened: "Case reopened",
  case_resolved: "Case resolved",
  alert_acknowledged: "Alert acknowledged",
  task_completed: "Task completed",
};

export function sortAuditLog(entries: AuditLogEntry[]): AuditLogEntry[] {
  return [...entries].sort((a, b) => a.occurredMinutesAgo - b.occurredMinutesAgo);
}

export function normalizeAuditSearch(query: string): string {
  return query.trim().toLowerCase();
}

export function auditEntryMatchesSearch(entry: AuditLogEntry, query: string): boolean {
  const normalized = normalizeAuditSearch(query);
  if (!normalized) return true;

  return [
    entry.summary,
    entry.actorName,
    entry.actorRole,
    entry.patientName ?? "",
    entry.caseId ?? "",
    entry.taskId ?? "",
    auditKindLabel[entry.kind],
  ].some((field) => field.toLowerCase().includes(normalized));
}

export function filterAuditLog(
  entries: AuditLogEntry[],
  options: { query: string; filter: AuditTrailFilter },
): AuditLogEntry[] {
  return entries.filter((entry) => {
    if (!auditEntryMatchesSearch(entry, options.query)) return false;

    switch (options.filter) {
      case "cases":
        return caseKinds.includes(entry.kind);
      case "tasks":
        return entry.kind === "task_completed";
      default:
        return true;
    }
  });
}

export function formatAuditOccurred(minutesAgo: number): {
  relative: string;
  absolute: string;
} {
  const occurredAt = new Date(Date.now() - minutesAgo * 60_000);
  return formatTimestamp(occurredAt);
}

export function getAuditTrailCounts(entries: AuditLogEntry[]) {
  const cases = entries.filter((entry) => caseKinds.includes(entry.kind)).length;
  const tasks = entries.filter((entry) => entry.kind === "task_completed").length;

  return {
    total: entries.length,
    cases,
    tasks,
  };
}

export type { AuditEntryKind, AuditLogEntry, AuditTrailFilter } from "@/lib/audit-types";
