import type { Metadata } from "next";
import { DesignSystemPageClient } from "@/components/design-system/DesignSystemPageClient";

export const metadata: Metadata = {
  title: "Design system — RoundSync (internal)",
  description:
    "RoundSync design tokens, components, and patterns — internal reference for engineering and design.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <DesignSystemPageClient />;
}
