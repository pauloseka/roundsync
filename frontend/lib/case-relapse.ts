/**
 * Gap 2 — Resolved case relapses: reopen same lineage, never fork a new case ID.
 *
 * UI: components/cases/RelapseSuggestionPanel.tsx (Patient detail, trigger form)
 * Queue: Active Cases → Reopened section (lib/cases.ts getAllCaseSections)
 */

import type { EmergencyCase } from "@/lib/cases-types";

/** Within this window, relapse must reopen — not create a new case. */
export const RELAPSE_REOPEN_WINDOW_MINUTES = 24 * 60;

export function getRecentlyResolvedCase(
  cases: EmergencyCase[],
  patientId: string,
): EmergencyCase | undefined {
  return cases.find(
    (caseItem) =>
      caseItem.patientId === patientId &&
      caseItem.status === "resolved" &&
      caseItem.resolvedMinutesAgo !== undefined &&
      caseItem.resolvedMinutesAgo <= RELAPSE_REOPEN_WINDOW_MINUTES,
  );
}

export function shouldSuggestReopen(cases: EmergencyCase[], patientId: string): boolean {
  const hasActive = cases.some(
    (caseItem) => caseItem.patientId === patientId && caseItem.status !== "resolved",
  );
  if (hasActive) return false;
  return getRecentlyResolvedCase(cases, patientId) !== undefined;
}

export function getRelapseBlockReason(
  cases: EmergencyCase[],
  patientId: string,
): string | null {
  const recent = getRecentlyResolvedCase(cases, patientId);
  if (!recent) return null;

  const resolvedLabel =
    recent.resolvedMinutesAgo === 1
      ? "1 minute ago"
      : `${recent.resolvedMinutesAgo} minutes ago`;

  return `This patient had ${recent.id} resolved ${resolvedLabel}. Reopen that case — don't start a new one.`;
}

export function patientCanTriggerNewCase(cases: EmergencyCase[], patientId: string): boolean {
  const hasActive = cases.some(
    (caseItem) => caseItem.patientId === patientId && caseItem.status !== "resolved",
  );
  if (hasActive) return false;
  if (getRecentlyResolvedCase(cases, patientId)) return false;
  return true;
}

export function getPatientsBlockedForNewCase(cases: EmergencyCase[]): EmergencyCase[] {
  const blocked = new Map<string, EmergencyCase>();

  for (const caseItem of cases) {
    if (
      caseItem.status === "resolved" &&
      caseItem.resolvedMinutesAgo !== undefined &&
      caseItem.resolvedMinutesAgo <= RELAPSE_REOPEN_WINDOW_MINUTES
    ) {
      blocked.set(caseItem.patientId, caseItem);
    }
  }

  return [...blocked.values()];
}
