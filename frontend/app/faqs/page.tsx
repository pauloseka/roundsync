import type { Metadata } from "next";
import { FaqPageContent } from "@/components/marketing/FaqPageContent";
import { MarketingPageHero } from "@/components/marketing/MarketingPageLayout";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";

export const metadata: Metadata = {
  title: "FAQs — RoundSync",
  description:
    "Answers to common questions about ward coordination, routing, roles, shift handoffs, onboarding, and licensing.",
};

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className="border-b border-line bg-surface-card px-page py-10 md:py-16">
        <PageContent wide>
          <MarketingPageHero eyebrow="FAQs" title="Frequently asked questions">
            Search our knowledge base for answers on routing, roles, handoffs, onboarding, and
            more. Can&apos;t find what you need? Ask us at the bottom of the page.
          </MarketingPageHero>

          <FaqPageContent />
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
