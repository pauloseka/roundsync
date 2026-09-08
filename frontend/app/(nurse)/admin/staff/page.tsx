import type { Metadata } from "next";
import { StaffRosterPageClient } from "@/components/admin/StaffRosterPageClient";

export const metadata: Metadata = {
  title: "Staff & shifts — RoundSync",
  description:
    "Assign shift schedules, track ward presence, and review staff activity for your organisation.",
};

export default function AdminStaffPage() {
  return <StaffRosterPageClient />;
}
