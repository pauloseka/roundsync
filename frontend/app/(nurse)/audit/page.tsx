import type { Metadata } from "next";
import { AuditPageClient } from "@/components/audit/AuditPageClient";

export const metadata: Metadata = {
  title: "Audit Trail — RoundSync",
  description:
    "Permission-scoped activity history — case actions and task completions on your shift, timestamped for accountability.",
};

export default function AuditPage() {
  return <AuditPageClient />;
}
