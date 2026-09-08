import { PatientRow } from "@/components/dashboard/PatientRow";
import type { ShiftPatient } from "@/lib/mock-data";

interface PatientListProps {
  patients: ShiftPatient[];
}

export function PatientList({ patients }: PatientListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {patients.map((patient) => (
        <li key={patient.id}>
          <PatientRow patient={patient} />
        </li>
      ))}
    </ul>
  );
}
