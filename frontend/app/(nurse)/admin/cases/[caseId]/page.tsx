import type { Metadata } from "next";
import { AdminCaseReviewClient } from "@/components/admin/AdminCaseReviewClient";

export const metadata: Metadata = {
  title: "Case review — RoundSync Admin",
  description: "Read-only case review for organisation administrators.",
};

interface AdminCaseReviewPageProps {
  params: Promise<{ caseId: string }>;
}

export default async function AdminCaseReviewPage({ params }: AdminCaseReviewPageProps) {
  const { caseId } = await params;
  return <AdminCaseReviewClient caseId={caseId} />;
}
