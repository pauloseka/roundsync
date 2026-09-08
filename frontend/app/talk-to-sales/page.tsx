import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
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
import { TalkToSalesForm } from "@/components/marketing/TalkToSalesForm";
import { BOOK_DEMO_HREF, CONTACT_SUPPORT_HREF, FAQS_HREF } from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Talk to sales — RoundSync",
  description:
    "Discuss deployment scope, licensing, timelines, and multi-ward rollout with the RoundSync sales team.",
};

const salesTopics = [
  {
    title: "Deployment scope",
    body: "Single-ward pilots through hospital-group rollouts — we'll map a plan to your structure and timeline.",
  },
  {
    title: "Pricing & licensing",
    body: "Transparent licensing based on ward count and roles. We'll walk through options for your organization size.",
  },
  {
    title: "Rollout timelines",
    body: "Typical pilots go live in weeks, not months. We align onboarding, training, and go-live with your procurement cycle.",
  },
  {
    title: "Procurement & RFPs",
    body: "Security documentation, implementation plans, and reference materials for your evaluation process.",
  },
];

const quickLinks = [
  { label: "Book a demo", href: BOOK_DEMO_HREF },
  { label: "Contact support", href: CONTACT_SUPPORT_HREF },
  { label: "FAQs", href: FAQS_HREF },
];

export default function TalkToSalesPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className={marketingSectionClassName}>
        <CtaBackground />
        <PageContent wide className="relative z-10">
          <MarketingPageHero eyebrow="Talk to sales" title="Plan your rollout with us">
            Discuss deployment scope, licensing, and timelines with our team. Not ready to buy?{" "}
            <Link href={BOOK_DEMO_HREF} className="text-brand-core hover:underline">
              Book a demo
            </Link>{" "}
            to see the product first.
          </MarketingPageHero>

          <div className={marketingSplitSectionClassName}>
            <div className="order-2 lg:order-1">
              <MarketingTopicsPanel
                title="What we'll discuss"
                subtitle="Sales conversations focus on scope, commercial terms, and rollout — not product walkthroughs. For a live demo, use the link above."
                mobileSummary="Scope, licensing, rollout — not product walkthroughs"
                topics={salesTopics}
              >
                <div className="rounded-xl border border-line bg-surface-card/80 p-4 backdrop-blur-sm lg:p-5">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                    Response time
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    Sales inquiries are answered within two business days. Active procurement and
                    RFP timelines are prioritized.
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
                    href="mailto:sales@roundsync.com?subject=RoundSync%20sales%20inquiry"
                    className="text-brand-core hover:underline"
                  >
                    sales@roundsync.com
                  </a>
                </p>
              </MarketingTopicsPanel>
            </div>

            <div className="order-1 lg:order-2">
              <Suspense
                fallback={
                  <div className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
                    <div className="h-40 animate-pulse rounded-lg bg-surface-base" />
                  </div>
                }
              >
                <TalkToSalesForm />
              </Suspense>
            </div>
          </div>
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
