import type { Metadata } from "next";
import { CasesQueueClient } from "@/components/cases/CasesQueueClient";

export const metadata: Metadata = {
  title: "Active Cases — RoundSync",
  description: "Emergency queue — open, escalated, and reopened cases with live response status.",
};

export default function CasesPage() {
  return <CasesQueueClient />;
}
