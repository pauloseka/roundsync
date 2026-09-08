import type { Metadata } from "next";
import { AdminSetupPageClient } from "@/components/admin/AdminSetupPageClient";

export const metadata: Metadata = {
  title: "Team setup — RoundSync",
  description:
    "Invite ward staff, assign roles, and configure permission scope for your organisation.",
};

export default function AdminPage() {
  return <AdminSetupPageClient />;
}
