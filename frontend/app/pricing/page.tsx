import type { Metadata } from "next";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";
import { PricingPageClient } from "@/components/marketing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing — RoundSync",
  description:
    "Clinic, Hospital, and Network plans for ward coordination — transparent self-serve pricing with optional add-ons and enterprise terms.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />
      <PageContent wide>
        <PricingPageClient />
      </PageContent>
      <MarketingFooter />
    </div>
  );
}
