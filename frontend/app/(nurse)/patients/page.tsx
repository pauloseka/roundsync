import type { Metadata } from "next";
import { PatientsPageClient } from "@/components/patients/PatientsPageClient";

export const metadata: Metadata = {
  title: "Patients — RoundSync",
  description:
    "Ward roster lookup — vitals, early warnings, and active case status for your assigned patients.",
};

export default function PatientsPage() {
  return <PatientsPageClient />;
}
