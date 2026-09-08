import type { Metadata } from "next";
import { DashboardTriage } from "@/components/dashboard/DashboardTriage";

export const metadata: Metadata = {
  title: "Dashboard — RoundSync",
  description: "Nurse shift overview — cases, tasks, messages, and clinical warnings at a glance.",
};

export default function DashboardPage() {
  return <DashboardTriage />;
}
