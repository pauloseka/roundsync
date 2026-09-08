import type { Metadata } from "next";
import { CaseDetailView } from "@/components/cases/CaseDetailView";

export const metadata: Metadata = {
  title: "Case detail — RoundSync",
  description: "Emergency case detail — trigger note, alerts, escalation trail, and follow-up notes.",
};

interface CaseDetailPageProps {
  params: Promise<{ caseId: string }>;
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseId } = await params;
  return <CaseDetailView caseId={caseId} />;
}
