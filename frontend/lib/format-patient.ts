export function formatPatientLocation(patient: {
  ward: string;
  bed: string;
  id: string;
}): string {
  return `Ward ${patient.ward} · Bed ${patient.bed} · ${patient.id}`;
}

export function formatPatientBedMeta(patient: { bed: string; id: string }): string {
  return `Bed ${patient.bed} · ${patient.id}`;
}
