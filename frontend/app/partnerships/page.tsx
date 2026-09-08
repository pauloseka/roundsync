import type { Metadata } from "next";
import Link from "next/link";
import { CtaBackground } from "@/components/marketing/CtaBackground";
import {
  MarketingPageHero,
  MarketingTopicsPanel,
  marketingSectionClassName,
  marketingSplitSectionClassName,
} from "@/components/marketing/MarketingPageLayout";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";
import { PartnershipsForm } from "@/components/marketing/PartnershipsForm";
import { BOOK_DEMO_HREF, TALK_TO_SALES_HREF, FAQS_HREF } from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Partnerships — RoundSync",
  description:
    "Partner with RoundSync on integrations, hospital group deployments, and health tech alliances.",
};

const partnershipAreas = [
  {
    title: "Technology integrations",
    body: "Connect RoundSync with EHRs, alerting systems, and clinical workflows — we work with vendors on APIs, data exchange, and co-developed solutions.",
  },
  {
    title: "Hospital groups & networks",
    body: "Multi-site rollouts with shared governance, standardized escalation paths, and network-wide audit visibility across member hospitals.",
  },
  {
    title: "Referral & reseller",
    body: "Bring RoundSync to hospitals you serve — implementation partners, consultancies, and regional health tech distributors.",
  },
  {
    title: "Research & academic",
    body: "Collaborate on coordination research, pilot programs, and studies on handoff quality, alert routing, and ward operations.",
  },
];

const quickLinks = [
  { label: "Talk to sales", href: TALK_TO_SALES_HREF },
  { label: "Book a demo", href: BOOK_DEMO_HREF },
  { label: "FAQs", href: FAQS_HREF },
];

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className={marketingSectionClassName}>
        <CtaBackground />
        <PageContent wide className="relative z-10">
          <MarketingPageHero eyebrow="Partnerships" title="Build with RoundSync">
            Integrate, distribute, or deploy at scale. We partner with health tech vendors, hospital
            groups, and system integrators to extend coordinated care.
          </MarketingPageHero>

          <div className={marketingSplitSectionClassName}>
            <div className="order-2 lg:order-1">
              <MarketingTopicsPanel
                title="Partnership areas"
                subtitle="Partnership inquiries cover integrations, distribution, and network deployments — not direct hospital sales."
                mobileSummary="Integrations, networks, resellers, research"
                topics={partnershipAreas}
              >
                <div className="rounded-xl border border-line bg-surface-card/80 p-4 backdrop-blur-sm lg:p-5">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                    What happens next
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    We review fit and scope, then schedule an intro call within three business days.
                    Integration partners receive technical documentation after initial alignment.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm font-medium text-brand-core hover:underline"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>

                <p className="text-center font-mono text-xs text-ink-secondary lg:text-left">
                  Prefer email?{" "}
                  <a
                    href="mailto:partners@roundsync.com?subject=RoundSync%20partnership%20inquiry"
                    className="text-brand-core hover:underline"
                  >
                    partners@roundsync.com
                  </a>
                </p>
              </MarketingTopicsPanel>
            </div>

            <div className="order-1 lg:order-2">
              <PartnershipsForm />
            </div>
          </div>
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
