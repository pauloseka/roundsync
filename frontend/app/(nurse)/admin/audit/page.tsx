import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminAuditPageClient } from "@/components/admin/AdminAuditPageClient";

export const metadata: Metadata = {
  title: "Audit & escalations — RoundSync",
  description:
    "Review per-user audit trails, escalation paths, and missed acknowledgements for follow-up.",
};

export default function AdminAuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center px-6 py-12">
          <p className="text-sm text-ink-secondary">Loading audit view…</p>
        </div>
      }
    >
      <AdminAuditPageClient />
    </Suspense>
  );
}
