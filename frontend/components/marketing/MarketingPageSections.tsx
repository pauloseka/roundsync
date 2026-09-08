import Link from "next/link";
import { BOOK_DEMO_HREF, CONTACT_SUPPORT_HREF, FAQS_HREF } from "@/lib/marketing-nav";
import { homepageFaqItems } from "@/lib/faq-data";
import {
  accountabilityPoints,
  flowSteps,
  platformPillars,
  roles,
  successMetrics,
} from "@/lib/product-data";
import { PageContent } from "@/components/marketing/PageContent";
import { SectionHeader } from "@/components/marketing/SectionHeader";

const faqs = homepageFaqItems;

export function MarketingFeatures() {
  return (
    <section
      id="platform"
      className="scroll-mt-20 border-t border-line bg-surface-card px-page py-20 md:py-24"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Platform"
          title="Coordinate the full shift — not just the crisis"
          description="RoundSync is built for how hospital teams actually work: planned care running in parallel with emergency coordination, on one system, with clear boundaries between them."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {platformPillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-xl border border-line bg-surface-base p-6 md:p-7"
            >
              <h3 className="font-display text-lg font-semibold text-ink-primary md:text-xl">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </PageContent>
    </section>
  );
}

export function MarketingFlow() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-surface-base px-page py-20 md:py-24"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="How it works"
          title="Four stages when coordination needs to widen"
          description="From escalation to resolution, every role stays in sync — with automatic escalation if coordination stalls."
        />

        <ol className="relative mt-14 grid gap-6 lg:grid-cols-4 lg:gap-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-line lg:block"
            aria-hidden="true"
          />
          {flowSteps.map((step, index) => (
            <li key={step.label} className="relative">
              <div className="rounded-xl border border-line bg-surface-card p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-core-muted font-mono text-xs font-semibold text-brand-core">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink-primary">
                    {step.label}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-secondary md:text-base">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </PageContent>
    </section>
  );
}

export function MarketingRoles() {
  return (
    <section
      id="roles"
      className="scroll-mt-20 border-t border-line bg-surface-card px-page py-20 md:py-24"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Roles"
          title="Same patient. Different lens. One coordinated record."
          description="Each person on the ward sees only what they need to act on — permission-gated coordination, not a single shared inbox."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {roles.map((item) => (
            <li
              key={item.role}
              className="flex flex-col rounded-xl border border-line bg-surface-base p-6 md:p-7"
            >
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core">
                {item.role}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-primary md:text-xl">
                {item.summary}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-secondary md:text-base">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </PageContent>
    </section>
  );
}

export function MarketingAccountability() {
  return (
    <section
      id="accountability"
      className="scroll-mt-20 bg-surface-base px-page py-20 md:py-24"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Accountability"
          title="Coordination you can reconstruct after the fact"
          description="In a hospital, unclear handoffs have consequences. RoundSync makes every step in a coordination chain visible and attributable."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {accountabilityPoints.map((point) => (
            <li
              key={point.title}
              className="rounded-xl border border-line bg-surface-card p-6 md:p-7"
            >
              <h3 className="font-display text-lg font-semibold text-ink-primary">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
                {point.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-4 rounded-xl border border-line bg-surface-card p-6 sm:grid-cols-3 md:p-8">
          {successMetrics.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core">
                {item.label}
              </p>
              <p className="mt-2 font-display text-base font-semibold text-ink-primary md:text-lg">
                {item.metric}
              </p>
            </div>
          ))}
        </div>
      </PageContent>
    </section>
  );
}

export function MarketingFaqs() {
  return (
    <section
      id="faqs"
      className="scroll-mt-20 border-t border-line bg-surface-card px-page py-20 md:py-24"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="FAQs"
          title="Common questions about ward coordination"
          description="How RoundSync handles routing, shift handoffs, and keeping routine care separate from emergency coordination."
        />

        <ul className="mx-auto mt-14 max-w-3xl divide-y divide-line">
          {faqs.map((faq) => (
            <li key={faq.id} className="py-6 first:pt-0 last:pb-0">
              <h3 className="font-display text-base font-semibold text-ink-primary md:text-lg">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
                {faq.answer}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href={FAQS_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            View all FAQs
          </Link>
        </div>
      </PageContent>
    </section>
  );
}

export function MarketingCta() {
  return (
    <section
      id="book-demo"
      className="scroll-mt-20 border-b border-line bg-surface-base px-page py-20 md:py-24"
    >
      <PageContent wide className="text-center">
        <SectionHeader
          eyebrow="Book a demo"
          title="See coordinated care in your ward"
          description="Walk through role-scoped views, escalation routing, and the audit trail with our team — tailored to your ward structure and workflows."
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={BOOK_DEMO_HREF}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-core px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:w-auto"
          >
            Book a demo
          </a>
          <a
            href={CONTACT_SUPPORT_HREF}
            className="inline-flex h-12 w-full items-center justify-center rounded-md border border-line bg-surface-card px-8 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
          >
            Contact us
          </a>
        </div>
        <p className="mt-5 font-mono text-xs text-ink-secondary">
          hello@roundsync.com
        </p>
      </PageContent>
    </section>
  );
}

export { MarketingFooter } from "@/components/marketing/MarketingFooter";
