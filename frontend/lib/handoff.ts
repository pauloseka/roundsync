/**
 * Gap 1 — Shift ends mid-case: who owns the patient?
 * Cases stay patient-scoped; bedside ownership transfers via explicit handoff acceptance.
 *
 * UI: components/handoff/ShiftHandoffBanner.tsx, ShiftHandoffPanel.tsx (Dashboard)
 * Chip: components/cases/CaseOwnershipChip.tsx
 */

import type { EmergencyCase } from "@/lib/cases-types";
import { isActiveCase } from "@/lib/cases-types";
import { shiftContext } from "@/lib/mock-data";

/** Incoming RN who accepts open cases at shift change (prototype). */
export const INCOMING_BEDSIDE_OWNER = "David Chen";

export function getPendingHandoffCases(cases: EmergencyCase[]): EmergencyCase[] {
  return cases.filter(
    (caseItem) => isActiveCase(caseItem) && caseItem.handoff?.status === "pending",
  );
}

export function getHandoffSummary(cases: EmergencyCase[]): {
  pendingCount: number;
  cases: EmergencyCase[];
} {
  const pending = getPendingHandoffCases(cases);
  return { pendingCount: pending.length, cases: pending };
}

export function isHandoffWindowActive(): boolean {
  return shiftContext.handoffWindowActive === true;
}

export function acceptHandoffRecord(
  caseItem: EmergencyCase,
  incomingOwnerName: string = INCOMING_BEDSIDE_OWNER,
): EmergencyCase {
  return {
    ...caseItem,
    bedsideOwnerName: incomingOwnerName,
    handoff: {
      status: "accepted",
      outgoingOwnerName: caseItem.handoff?.outgoingOwnerName ?? caseItem.bedsideOwnerName ?? shiftContext.nurseName,
      incomingOwnerName,
      offeredMinutesAgo: caseItem.handoff?.offeredMinutesAgo,
      acceptedMinutesAgo: 0,
    },
  };
}

export function acceptAllHandoffs(
  cases: EmergencyCase[],
  incomingOwnerName: string = INCOMING_BEDSIDE_OWNER,
): EmergencyCase[] {
  return cases.map((caseItem) =>
    caseItem.handoff?.status === "pending"
      ? acceptHandoffRecord(caseItem, incomingOwnerName)
      : caseItem,
  );
}

export function formatHandoffOwnership(caseItem: EmergencyCase): string {
  const handoff = caseItem.handoff;
  if (handoff?.status === "pending") {
    return `Outgoing: ${handoff.outgoingOwnerName} · Incoming: —`;
  }
  if (handoff?.status === "accepted" && handoff.incomingOwnerName) {
    return `Bedside: ${handoff.incomingOwnerName}`;
  }
  return `Bedside: ${caseItem.bedsideOwnerName ?? caseItem.triggeredByName}`;
}
