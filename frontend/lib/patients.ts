import type { ShiftPatient } from "@/lib/mock-data";

export type PatientRosterFilter = "all" | "warnings" | "on_case";

const vitalsRank = { abnormal: 0, watch: 1, stable: 2 } as const;

export function normalizePatientSearch(query: string): string {
  return query.trim().toLowerCase();
}

export function patientMatchesSearch(patient: ShiftPatient, query: string): boolean {
  const normalized = normalizePatientSearch(query);
  if (!normalized) return true;

  return [patient.name, patient.id, patient.bed, patient.ward, `bed ${patient.bed}`].some((field) =>
    field.toLowerCase().includes(normalized),
  );
}

export function patientHasEarlyWarning(
  patient: ShiftPatient,
  activeCasePatientIds: Set<string>,
): boolean {
  return Boolean(patient.clinicalWarning && !activeCasePatientIds.has(patient.id));
}

export function patientIsOnActiveCase(
  patient: ShiftPatient,
  activeCasePatientIds: Set<string>,
): boolean {
  return activeCasePatientIds.has(patient.id);
}

export function filterPatients(
  patients: ShiftPatient[],
  options: {
    query: string;
    filter: PatientRosterFilter;
    activeCasePatientIds: Set<string>;
  },
): ShiftPatient[] {
  return patients.filter((patient) => {
    if (!patientMatchesSearch(patient, options.query)) return false;

    switch (options.filter) {
      case "warnings":
        return patientHasEarlyWarning(patient, options.activeCasePatientIds);
      case "on_case":
        return patientIsOnActiveCase(patient, options.activeCasePatientIds);
      default:
        return true;
    }
  });
}

export function sortPatientsForRoster(patients: ShiftPatient[]): ShiftPatient[] {
  return [...patients].sort((a, b) => {
    const bedDiff = Number.parseInt(a.bed, 10) - Number.parseInt(b.bed, 10);
    if (!Number.isNaN(bedDiff) && bedDiff !== 0) return bedDiff;

    const vitalsDiff = vitalsRank[a.vitalsStatus] - vitalsRank[b.vitalsStatus];
    if (vitalsDiff !== 0) return vitalsDiff;

    return a.name.localeCompare(b.name);
  });
}

export function getPatientRosterCounts(
  patients: ShiftPatient[],
  activeCasePatientIds: Set<string>,
) {
  const warnings = patients.filter((patient) =>
    patientHasEarlyWarning(patient, activeCasePatientIds),
  ).length;
  const onCase = patients.filter((patient) =>
    patientIsOnActiveCase(patient, activeCasePatientIds),
  ).length;

  return {
    total: patients.length,
    warnings,
    onCase,
  };
}

export function getPatientById(
  patients: ShiftPatient[],
  patientId: string,
): ShiftPatient | undefined {
  return patients.find((patient) => patient.id === patientId);
}
