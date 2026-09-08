import type { Metadata } from "next";
import { PatientDetailClient } from "@/components/patients/PatientDetailClient";
import { getPatientById } from "@/lib/patients";
import { shiftPatients } from "@/lib/mock-data";

interface PatientDetailPageProps {
  params: Promise<{ patientId: string }>;
}

export async function generateMetadata({ params }: PatientDetailPageProps): Promise<Metadata> {
  const { patientId } = await params;
  const patient = getPatientById(shiftPatients, patientId);

  return {
    title: patient ? `${patient.name} — Patients — RoundSync` : "Patient — RoundSync",
    description: patient
      ? `Ward reference for ${patient.name} — vitals, tasks, and active case status.`
      : "Patient lookup on your ward roster.",
  };
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { patientId } = await params;

  return <PatientDetailClient patientId={patientId} />;
}
