import type { Metadata } from "next";
import { AdminPatientReviewClient } from "@/components/admin/AdminPatientReviewClient";

export const metadata: Metadata = {
  title: "Patient review — RoundSync Admin",
  description: "Read-only patient context for organisation administrators.",
};

interface AdminPatientReviewPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function AdminPatientReviewPage({ params }: AdminPatientReviewPageProps) {
  const { patientId } = await params;
  return <AdminPatientReviewClient patientId={patientId} />;
}
