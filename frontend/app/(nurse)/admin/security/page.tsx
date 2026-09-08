import type { Metadata } from "next";
import { AdminNetworkDevicesPageClient } from "@/components/admin/AdminNetworkDevicesPageClient";

export const metadata: Metadata = {
  title: "Network & devices — RoundSync",
  description:
    "Configure hospital network boundaries, approve ward devices, and review out-of-network access alerts.",
};

export default function AdminNetworkDevicesPage() {
  return <AdminNetworkDevicesPageClient />;
}
