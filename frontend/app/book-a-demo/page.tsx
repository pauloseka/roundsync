import type { Metadata } from "next";
import { BookDemoBookingPanel } from "@/components/marketing/BookDemoBookingPanel";
import { DemoBookingRulesPanel } from "@/components/marketing/DemoBookingRulesPanel";
import { CtaBackground } from "@/components/marketing/CtaBackground";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";
import {
  MarketingPageHero,
  marketingSectionClassName,
  marketingSplitSectionClassName,
} from "@/components/marketing/MarketingPageLayout";

export const metadata: Metadata = {
  title: "Book a demo — RoundSync",
  description:
    "Schedule a tailored walkthrough of RoundSync — pick a live slot on our calendar or request a time that works for your team.",
};

const demoTopics = [
  {
    title: "Role-scoped coordination",
    body: "See how nurses, doctors, pharmacy, and front desk each get a lens scoped to what they need to act on.",
  },
  {
    title: "Escalation routing",
    body: "Walk through what happens when a case widens — who gets involved, and how handoffs stay in sync.",
  },
  {
    title: "Shift-aware ownership",
    body: "Understand how responsibility follows active shifts, not static assignments.",
  },
  {
    title: "Audit trail",
    body: "Review how every acknowledgment and escalation is logged for accountability.",
  },
];

export default function BookDemoPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className={marketingSectionClassName}>
        <CtaBackground />
        <PageContent wide className="relative z-10">
          <MarketingPageHero eyebrow="Book a demo" title="Grab a slot. Bring your team.">
            Pick a time that works on our calendar, or tell us when you&apos;re free — either way,
            invite colleagues who should see the ward workflow live.
          </MarketingPageHero>

          <div className={marketingSplitSectionClassName}>
            <div className="order-2 lg:order-1">
              <div className="lg:hidden">
                <details className="group rounded-xl border border-line bg-surface-card/80 backdrop-blur-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="font-display text-base font-semibold text-ink-primary">
                        What we&apos;ll cover
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
                        30–45 min · coordination, not a generic tour
                      </span>
                    </span>
                    <span
                      className="shrink-0 text-ink-secondary transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </summary>
                  <div className="border-t border-line px-4 pb-4 pt-3">
                    <ul className="space-y-3">
                      {demoTopics.map((topic) => (
                        <li
                          key={topic.title}
                          className="rounded-lg border border-line/80 bg-surface-base/80 p-4"
                        >
                          <h3 className="font-display text-sm font-semibold text-ink-primary">
                            {topic.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                            {topic.body}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>

              <div className="hidden lg:block">
                <h2 className="font-display text-xl font-semibold text-ink-primary md:text-2xl">
                  What we&apos;ll cover
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
                  Sessions typically run 30–45 minutes. We focus on coordination — not a generic
                  product tour.
                </p>

                <ul className="mt-8 space-y-5">
                  {demoTopics.map((topic) => (
                    <li
                      key={topic.title}
                      className="rounded-xl border border-line bg-surface-card/80 p-5 backdrop-blur-sm"
                    >
                      <h3 className="font-display text-base font-semibold text-ink-primary">
                        {topic.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                        {topic.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 hidden lg:mt-8 lg:block">
                <DemoBookingRulesPanel />
              </div>

              <p className="mt-6 text-center font-mono text-xs text-ink-secondary lg:mt-8 lg:text-left">
                Prefer email?{" "}
                <a
                  href="mailto:hello@roundsync.com?subject=Book%20a%20demo"
                  className="text-brand-core hover:underline"
                >
                  hello@roundsync.com
                </a>
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <BookDemoBookingPanel />
            </div>
          </div>
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
