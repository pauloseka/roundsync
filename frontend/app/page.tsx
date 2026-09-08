import {
  MarketingAccountability,
  MarketingCta,
  MarketingFaqs,
  MarketingFeatures,
  MarketingFlow,
  MarketingFooter,
  MarketingHero,
  MarketingRoles,
} from "@/components/marketing/MarketingSections";
import { MarketingHashScroll } from "@/components/marketing/MarketingHashScroll";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingSplash } from "@/components/marketing/MarketingSplash";

export default function MarketingPage() {
  return (
    <MarketingSplash>
      <div className="min-h-screen bg-surface-base">
        <MarketingHashScroll />
        <MarketingHeader />
        <MarketingHero />
        <MarketingFeatures />
        <MarketingFlow />
        <MarketingRoles />
        <MarketingAccountability />
        <MarketingFaqs />
        <MarketingCta />
        <MarketingFooter />
      </div>
    </MarketingSplash>
  );
}
