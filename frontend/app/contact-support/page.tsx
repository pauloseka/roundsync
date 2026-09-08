import type { Metadata } from "next";
import Link from "next/link";
import { ContactSupportForm } from "@/components/marketing/ContactSupportForm";
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
import { FAQS_HREF, HELP_CENTRE_HREF, TALK_TO_SALES_HREF } from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Contact support — RoundSync",
  description:
    "Get help with account access, escalation routing, permissions, and technical issues — our support team responds within one business day.",
};

const helpTopics = [
  {
    title: "Account & access",
    body: "Login issues, password resets, and role assignments for ward staff and administrators.",
  },
  {
    title: "Routing & escalation",
    body: "Configuration questions about who gets notified, escalation windows, and shift handoffs.",
  },
  {
    title: "Permissions & roles",
    body: "Help scoping what each role can see — clinical detail vs. operational views.",
  },
  {
    title: "Onboarding & setup",
    body: "Ward structure, user provisioning, and getting your team live on RoundSync.",
  },
];

const quickLinks = [
  { label: "FAQs", href: FAQS_HREF },
  { label: "Talk to sales", href: TALK_TO_SALES_HREF },
  { label: "Help centre", href: HELP_CENTRE_HREF },
];

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className={marketingSectionClassName}>
        <CtaBackground />
        <PageContent wide className="relative z-10">
          <MarketingPageHero eyebrow="Contact support" title="We're here to help">
            Reach our team for technical issues, account questions, and configuration help. We
            respond within one business day.
          </MarketingPageHero>

          <div className={marketingSplitSectionClassName}>
            <div className="order-2 lg:order-1">
              <MarketingTopicsPanel
                title="What we can help with"
                subtitle="Support covers live deployments and pilot wards. For pricing and rollout planning, talk to sales."
                mobileSummary="Account access, routing, permissions, onboarding"
                topics={helpTopics}
              >
                <div className="rounded-xl border border-line bg-surface-card/80 p-4 backdrop-blur-sm lg:p-5">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                    Response time
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    Standard requests: within one business day. Access and routing blockers are
                    prioritized — often same day during ward hours.
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
                    href="mailto:support@roundsync.com?subject=RoundSync%20support%20request"
                    className="text-brand-core hover:underline"
                  >
                    support@roundsync.com
                  </a>
                </p>
              </MarketingTopicsPanel>
            </div>

            <div className="order-1 lg:order-2">
              <ContactSupportForm />
            </div>
          </div>
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
