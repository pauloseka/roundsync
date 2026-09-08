import { auditLog } from "@/lib/audit-seed";
import { filterAuditLog, sortAuditLog, type AuditTrailFilter } from "@/lib/audit";
import type { AuditEntryKind, AuditLogEntry } from "@/lib/audit-types";
import { initialCases } from "@/lib/cases-seed";
import {
  alertStatusLabel,
  escalationReasonLabel,
  type CaseAlert,
  type EmergencyCase,
  type EscalationStep,
} from "@/lib/cases-types";
import type { StaffMember } from "@/lib/admin-staff";

export type AdminAuditFocus = "all" | "escalations" | "missed_acks";

export type AdminAuditCategoryFilter = AuditTrailFilter | "escalations" | "acknowledgements";

export type AdminAuditTimeFilter = "all" | "1h" | "8h" | "24h" | "custom";

export interface AdminAuditDateRange {
  from: string;
  to: string;
}

export interface AdminAuditFilterOptions {
  staff: StaffMember | null;
  query: string;
  category: AdminAuditCategoryFilter;
  ward: string;
  time: AdminAuditTimeFilter;
  dateRange?: AdminAuditDateRange;
}

const caseEntryKinds: AuditEntryKind[] = [
  "case_triggered",
  "case_note_added",
  "case_escalated",
  "case_reopened",
  "case_resolved",
  "alert_acknowledged",
];

export interface EscalationIncident {
  caseId: string;
  patientName: string;
  ward: string;
  bed: string;
  summary: string;
  steps: EscalationStep[];
  alerts: CaseAlert[];
}

export interface MissedAcknowledgement {
  id: string;
  caseId: string;
  patientName: string;
  ward: string;
  recipientName: string;
  role: string;
  status: "timed_out" | "pending";
  sentMinutesAgo: number;
  reason: string;
  suggestedAction: string;
}

function entryInvolvesPerson(entry: AuditLogEntry, fullName: string): boolean {
  if (entry.actorName === fullName) return true;

  return entry.details.some((detail) => detail.value.includes(fullName));
}

export function getAuditEntriesForStaff(member: StaffMember | null): AuditLogEntry[] {
  const sorted = sortAuditLog(auditLog);
  if (!member) return sorted;
  return sorted.filter((entry) => entryInvolvesPerson(entry, member.fullName));
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultAuditDateRange(): AdminAuditDateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return { from: formatDateInput(from), to: formatDateInput(to) };
}

function parseDateStart(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

function parseDateEnd(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}

function getEntryOccurredAt(entry: AuditLogEntry): number {
  return Date.now() - entry.occurredMinutesAgo * 60_000;
}

function applyTimeFilter(
  entries: AuditLogEntry[],
  time: AdminAuditTimeFilter,
  dateRange?: AdminAuditDateRange,
): AuditLogEntry[] {
  if (time === "all") return entries;

  if (time === "custom") {
    if (!dateRange?.from || !dateRange?.to) return entries;

    const rangeStart = parseDateStart(dateRange.from);
    const rangeEnd = parseDateEnd(dateRange.to);
    if (rangeStart > rangeEnd) return [];

    return entries.filter((entry) => {
      const occurredAt = getEntryOccurredAt(entry);
      return occurredAt >= rangeStart && occurredAt <= rangeEnd;
    });
  }

  const maxMinutes = time === "1h" ? 60 : time === "8h" ? 480 : 1440;
  return entries.filter((entry) => entry.occurredMinutesAgo <= maxMinutes);
}

function applyCategoryFilter(
  entries: AuditLogEntry[],
  category: AdminAuditCategoryFilter,
): AuditLogEntry[] {
  switch (category) {
    case "escalations":
      return entries.filter((entry) => entry.kind === "case_escalated");
    case "acknowledgements":
      return entries.filter((entry) => entry.kind === "alert_acknowledged");
    case "cases":
      return entries.filter((entry) => caseEntryKinds.includes(entry.kind));
    case "tasks":
      return entries.filter((entry) => entry.kind === "task_completed");
    default:
      return entries;
  }
}

export function filterAdminAuditEntries(options: AdminAuditFilterOptions): AuditLogEntry[] {
  let entries = getAuditEntriesForStaff(options.staff);

  if (options.ward) {
    entries = entries.filter((entry) => entry.ward === options.ward);
  }

  entries = applyTimeFilter(entries, options.time, options.dateRange);
  entries = applyCategoryFilter(entries, options.category);
  entries = filterAuditLog(entries, { query: options.query, filter: "all" });

  return sortAuditLog(entries);
}

export function getAdminAuditFilterCounts(
  staff: StaffMember | null,
  ward: string,
  time: AdminAuditTimeFilter,
  dateRange?: AdminAuditDateRange,
) {
  let base = getAuditEntriesForStaff(staff);
  if (ward) base = base.filter((entry) => entry.ward === ward);
  base = applyTimeFilter(base, time, dateRange);

  return {
    all: base.length,
    cases: base.filter((entry) => caseEntryKinds.includes(entry.kind)).length,
    tasks: base.filter((entry) => entry.kind === "task_completed").length,
    escalations: base.filter((entry) => entry.kind === "case_escalated").length,
    acknowledgements: base.filter((entry) => entry.kind === "alert_acknowledged").length,
  };
}

export function getAdminAuditWardOptions(staff: StaffMember | null): string[] {
  const wards = new Set(
    getAuditEntriesForStaff(staff)
      .map((entry) => entry.ward)
      .filter((ward): ward is string => Boolean(ward)),
  );
  return [...wards].sort();
}

export function getEscalationIncidents(): EscalationIncident[] {
  return initialCases
    .filter((caseItem) => caseItem.escalationTrail.length > 0 || caseItem.status === "escalated")
    .map((caseItem) => ({
      caseId: caseItem.id,
      patientName: caseItem.patientName,
      ward: caseItem.ward,
      bed: caseItem.bed,
      summary: caseItem.summary,
      steps: caseItem.escalationTrail,
      alerts: caseItem.alerts,
    }));
}

export function getMissedAcknowledgements(): MissedAcknowledgement[] {
  const incidents: MissedAcknowledgement[] = [];

  for (const caseItem of initialCases) {
    for (const alert of caseItem.alerts) {
      if (alert.status !== "timed_out" && alert.status !== "pending") continue;

      incidents.push({
        id: `${caseItem.id}-${alert.id}`,
        caseId: caseItem.id,
        patientName: caseItem.patientName,
        ward: caseItem.ward,
        recipientName: alert.recipientName,
        role: alert.role,
        status: alert.status,
        sentMinutesAgo: alert.sentMinutesAgo,
        reason:
          alert.status === "timed_out"
            ? "No acknowledgement within the escalation window"
            : "Alert still awaiting response",
        suggestedAction:
          alert.status === "timed_out"
            ? "Review escalation path and follow up with covering clinician or shift lead"
            : "Monitor — escalate manually if window expires",
      });
    }
  }

  return incidents.sort((a, b) => a.sentMinutesAgo - b.sentMinutesAgo);
}

export function getStaffMissedAcknowledgements(member: StaffMember): MissedAcknowledgement[] {
  return getMissedAcknowledgements().filter(
    (incident) => incident.recipientName === member.fullName,
  );
}

export function getStaffEscalationSteps(member: StaffMember): Array<{
  caseItem: EmergencyCase;
  step: EscalationStep;
  direction: "from" | "to";
}> {
  const matches: Array<{ caseItem: EmergencyCase; step: EscalationStep; direction: "from" | "to" }> =
    [];

  for (const caseItem of initialCases) {
    for (const step of caseItem.escalationTrail) {
      if (step.fromRecipientName === member.fullName) {
        matches.push({ caseItem, step, direction: "from" });
      }
      if (step.toRecipientName === member.fullName) {
        matches.push({ caseItem, step, direction: "to" });
      }
    }
  }

  return matches;
}

export function formatEscalationReason(reason: string): string {
  return escalationReasonLabel[reason] ?? reason.replaceAll("_", " ");
}

export function formatAlertStatus(status: CaseAlert["status"]): string {
  return alertStatusLabel[status] ?? status;
}

export function countStaffAuditEvents(member: StaffMember): number {
  return getAuditEntriesForStaff(member).length;
}

export function countStaffMissedAcks(member: StaffMember): number {
  return getStaffMissedAcknowledgements(member).length;
}
