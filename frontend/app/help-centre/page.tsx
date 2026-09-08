import type { Metadata } from "next";
import { HelpCentreContent } from "@/components/marketing/HelpCentreContent";
import { MarketingPageHero } from "@/components/marketing/MarketingPageLayout";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";

export const metadata: Metadata = {
  title: "Help centre — RoundSync",
  description:
    "Guides for administrators, shift leads, and IT teams — escalation setup, handoffs, deployment, and getting started.",
};

export default function HelpCentrePage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className="border-b border-line bg-surface-card px-page py-10 md:py-16">
        <PageContent wide>
          <MarketingPageHero eyebrow="Help centre" title="Guides for your team">
            Step-by-step guides for administrators, shift leads, IT teams, and ward staff — search
            by topic or filter by audience.
          </MarketingPageHero>

          <HelpCentreContent />
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
