import type { Metadata } from "next";
import { SettingsPageClient } from "@/components/settings/SettingsPageClient";

export const metadata: Metadata = {
  title: "Settings — RoundSync",
  description:
    "Personal preferences — alert sounds, notification scope, display mode, profile, and account security.",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
