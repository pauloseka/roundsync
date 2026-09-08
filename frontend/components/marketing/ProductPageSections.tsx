import Link from "next/link";
import { DashboardScreenshot } from "@/components/marketing/DashboardScreenshot";
import { PageContent } from "@/components/marketing/PageContent";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import {
  accountabilityPoints,
  flowSteps,
  platformPillars,
  productCapabilities,
  roles,
  successMetrics,
} from "@/lib/product-data";
import { BOOK_DEMO_HREF, HOW_IT_WORKS_HREF, TALK_TO_SALES_HREF } from "@/lib/marketing-nav";

export function ProductHero() {
  return (
    <section className="border-b border-line bg-surface-card px-page py-12 md:py-16 lg:py-20">
      <PageContent wide>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
              Product
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink-primary md:text-5xl">
              Hospital coordination OS
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-secondary md:text-lg">
              Routine shift work and emergency escalation in one system —
              separate signals, shared patient context, and accountability built
              in from the first handoff.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={BOOK_DEMO_HREF}
                className="inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
              >
                Book a demo
              </Link>
              <Link
                href={HOW_IT_WORKS_HREF}
                className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
              >
                See how it works
              </Link>
            </div>
          </div>

          <DashboardScreenshot className="mx-auto aspect-[1280/960] w-full max-w-xl lg:aspect-auto lg:h-[min(28rem,52vh)] lg:max-w-none" />
        </div>
      </PageContent>
    </section>
  );
}

export function ProductPlatform() {
  return (
    <section
      id="platform"
      className="scroll-mt-20 border-b border-line bg-surface-card px-page py-16 md:py-20"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Platform"
          title="Coordinate the full shift — not just the crisis"
          description="RoundSync is built for how hospital teams actually work: planned care running in parallel with emergency coordination, on one system, with clear boundaries between them."
          align="left"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
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

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {productCapabilities.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-line bg-surface-base p-5 md:p-6"
            >
              <h3 className="font-display text-base font-semibold text-ink-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </PageContent>
    </section>
  );
}

export function ProductFlow() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-line bg-surface-base px-page py-16 md:py-20"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="How it works"
          title="Four stages when coordination needs to widen"
          description="From escalation to resolution, every role stays in sync — with automatic escalation if coordination stalls."
          align="left"
        />

        <ol className="relative mt-12 grid gap-6 lg:grid-cols-4 lg:gap-4">
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

export function ProductRoles() {
  return (
    <section
      id="roles"
      className="scroll-mt-20 border-b border-line bg-surface-card px-page py-16 md:py-20"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Roles"
          title="Same patient. Different lens. One coordinated record."
          description="Each person on the ward sees only what they need to act on — permission-gated coordination, not a single shared inbox."
          align="left"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
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

export function ProductAccountability() {
  return (
    <section
      id="accountability"
      className="scroll-mt-20 bg-surface-base px-page py-16 md:py-20"
    >
      <PageContent wide>
        <SectionHeader
          eyebrow="Trust & compliance"
          title="Coordination you can reconstruct after the fact"
          description="In a hospital, unclear handoffs have consequences. RoundSync makes every step in a coordination chain visible and attributable."
          align="left"
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
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

        <div className="mt-10 grid gap-4 rounded-xl border border-line bg-surface-card p-6 sm:grid-cols-3 md:p-8">
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

export function ProductCta() {
  return (
    <section className="border-t border-b border-line bg-surface-base px-page py-16 md:py-20">
      <PageContent wide className="text-center">
        <SectionHeader
          eyebrow="Next step"
          title="See the product in your ward"
          description="Walk through role-scoped views, escalation routing, and the audit trail — tailored to your structure and workflows."
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={BOOK_DEMO_HREF}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-core px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:w-auto"
          >
            Book a demo
          </Link>
          <Link
            href={TALK_TO_SALES_HREF}
            className="inline-flex h-12 w-full items-center justify-center rounded-md border border-line bg-surface-card px-8 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
          >
            Talk to sales
          </Link>
        </div>
      </PageContent>
    </section>
  );
}
