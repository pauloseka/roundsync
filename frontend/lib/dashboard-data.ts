import type { EmergencyCase } from "@/lib/cases-types";
import type { ShiftPatient, VitalsStatus } from "@/lib/mock-data";
import { getActiveCasePatientIds, getDashboardCasePreviews } from "@/lib/cases";
import { initialCases } from "@/lib/cases-seed";
import {
  getDashboardMessagePreviews,
  getUnreadThreadCount,
  type MessageThreadPreview,
} from "@/lib/messages";
import { initialThreads } from "@/lib/messages-seed";
import { getDashboardTaskPreviews, type ScheduledTask } from "@/lib/scheduled-tasks";

export interface DashboardPreview<T> {
  items: T[];
  total: number;
}

export interface ShiftTeamMember {
  name: string;
  role: string;
  isYou?: boolean;
}

export type { MessageThreadPreview } from "@/lib/messages-types";

export interface ClinicalWarningSnapshot {
  id: string;
  patientName: string;
  patientId: string;
  ward: string;
  bed: string;
  vitalsStatus: VitalsStatus;
  signal: string;
  trend: string;
  flaggedMinutesAgo: number;
}

export const shiftTeam: ShiftTeamMember[] = [
  { name: "Amaka Okafor", role: "RN", isYou: true },
  { name: "David Chen", role: "RN" },
  { name: "Sarah Mitchell", role: "HCA" },
  { name: "Dr. Patel", role: "On-call" },
];

export function getActiveCaseSnapshots(limit = 2): DashboardPreview<EmergencyCase> {
  return getDashboardCasePreviews(initialCases, limit);
}

export function getDueTaskSnapshots(
  limit = 3,
  casePatientIds = getActiveCasePatientIds(initialCases),
): DashboardPreview<ScheduledTask> {
  return getDashboardTaskPreviews({
    excludePatientIds: casePatientIds,
    limit,
  });
}

export function getUnreadMessageCount(casePatientIds = getActiveCasePatientIds(initialCases)): number {
  return getUnreadThreadCount(initialThreads, casePatientIds);
}

export function getUnreadMessagePreviews(
  limit = 2,
  casePatientIds = getActiveCasePatientIds(initialCases),
): DashboardPreview<MessageThreadPreview> {
  return getDashboardMessagePreviews(initialThreads, casePatientIds, limit);
}

const vitalsRank: Record<VitalsStatus, number> = {
  abnormal: 0,
  watch: 1,
  stable: 2,
};

export function getClinicalWarningSnapshots(
  patients: ShiftPatient[],
  limit = 2,
  casePatientIds = getActiveCasePatientIds(initialCases),
): DashboardPreview<ClinicalWarningSnapshot> {
  const warnings = patients
    .filter((patient) => !casePatientIds.has(patient.id) && patient.clinicalWarning)
    .sort((a, b) => {
      const vitalsDiff = vitalsRank[a.vitalsStatus] - vitalsRank[b.vitalsStatus];
      if (vitalsDiff !== 0) return vitalsDiff;
      return (
        a.clinicalWarning!.flaggedMinutesAgo - b.clinicalWarning!.flaggedMinutesAgo
      );
    });

  return {
    items: warnings.slice(0, limit).map((patient) => ({
      id: `warning-${patient.id}`,
      patientName: patient.name,
      patientId: patient.id,
      ward: patient.ward,
      bed: patient.bed,
      vitalsStatus: patient.vitalsStatus,
      signal: patient.clinicalWarning!.signal,
      trend: patient.clinicalWarning!.trend,
      flaggedMinutesAgo: patient.clinicalWarning!.flaggedMinutesAgo,
    })),
    total: warnings.length,
  };
}

export function formatMessageAgo(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? "1 hr ago" : `${hours} hr ago`;
}
