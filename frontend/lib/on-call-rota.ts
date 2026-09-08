/**
 * Gap 3 — On-call routing without a manual checkbox.
 * Rota is source of truth; override is optional; stale rota is surfaced to shift lead.
 *
 * UI: components/on-call/OnCallRotaPanel.tsx (Cases sidebar)
 * Store: components/ward/WardOperationsStore.tsx
 */

export interface OnCallClinician {
  id: string;
  name: string;
  role: "On-call" | "Backup on-call";
}

export interface OnCallRotaEntry {
  ward: string;
  primary: OnCallClinician;
  backup: OnCallClinician;
}

/** Minutes without ack before each escalation step fires. */
export const ON_CALL_ESCALATION_THRESHOLDS_MINUTES = [0, 2, 5, 10] as const;

export const onCallRota: OnCallRotaEntry[] = [
  {
    ward: "4B",
    primary: { id: "dr-patel", name: "Dr. Patel", role: "On-call" },
    backup: { id: "dr-adeyemi", name: "Dr. Adeyemi", role: "Backup on-call" },
  },
];

/** Doctors currently logged in on the ward — presence signal for stale-rota detection. */
export const loggedInClinicians: OnCallClinician[] = [
  { id: "dr-adeyemi", name: "Dr. Adeyemi", role: "On-call" },
];

export function getRotaForWard(wardCode: string): OnCallRotaEntry | undefined {
  return onCallRota.find((entry) => entry.ward === wardCode);
}

export function getScheduledPrimaryOnCall(wardCode: string): OnCallClinician | undefined {
  return getRotaForWard(wardCode)?.primary;
}

export function getScheduledBackupOnCall(wardCode: string): OnCallClinician | undefined {
  return getRotaForWard(wardCode)?.backup;
}

export interface StaleRotaAssessment {
  isStale: boolean;
  scheduledName: string;
  loggedInNames: string[];
  suggestedCoverName?: string;
}

export function assessOnCallRota(
  wardCode: string,
  activeOverrideId?: string | null,
): StaleRotaAssessment {
  const rota = getRotaForWard(wardCode);
  if (!rota) {
    return { isStale: false, scheduledName: "—", loggedInNames: [] };
  }

  if (activeOverrideId) {
    const override =
      rota.primary.id === activeOverrideId
        ? rota.primary
        : rota.backup.id === activeOverrideId
          ? rota.backup
          : loggedInClinicians.find((clinician) => clinician.id === activeOverrideId);

    if (override) {
      return {
        isStale: false,
        scheduledName: override.name,
        loggedInNames: loggedInClinicians.map((clinician) => clinician.name),
      };
    }
  }

  const scheduledLoggedIn = loggedInClinicians.some(
    (clinician) => clinician.id === rota.primary.id,
  );

  if (scheduledLoggedIn) {
    return {
      isStale: false,
      scheduledName: rota.primary.name,
      loggedInNames: loggedInClinicians.map((clinician) => clinician.name),
    };
  }

  const suggested = loggedInClinicians[0];

  return {
    isStale: true,
    scheduledName: rota.primary.name,
    loggedInNames: loggedInClinicians.map((clinician) => clinician.name),
    suggestedCoverName: suggested?.name,
  };
}

export function resolveAlertRecipient(
  wardCode: string,
  activeOverrideId?: string | null,
): OnCallClinician {
  const rota = getRotaForWard(wardCode);
  if (!rota) {
    return { id: "unknown", name: "On-call pool", role: "On-call" };
  }

  if (activeOverrideId) {
    if (rota.primary.id === activeOverrideId) return rota.primary;
    if (rota.backup.id === activeOverrideId) return rota.backup;
    const loggedIn = loggedInClinicians.find((clinician) => clinician.id === activeOverrideId);
    if (loggedIn) return loggedIn;
  }

  const assessment = assessOnCallRota(wardCode);
  if (assessment.isStale && loggedInClinicians[0]) {
    return loggedInClinicians[0];
  }

  return rota.primary;
}

export function getEscalationStepLabel(minutesWithoutAck: number): string {
  if (minutesWithoutAck >= ON_CALL_ESCALATION_THRESHOLDS_MINUTES[3]) {
    return "Hospital on-call pool";
  }
  if (minutesWithoutAck >= ON_CALL_ESCALATION_THRESHOLDS_MINUTES[2]) {
    return "Shift lead + ward channel";
  }
  if (minutesWithoutAck >= ON_CALL_ESCALATION_THRESHOLDS_MINUTES[1]) {
    return "Backup on-call";
  }
  return "Scheduled on-call (rota)";
}
