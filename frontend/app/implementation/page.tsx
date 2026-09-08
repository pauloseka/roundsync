import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingPageSections";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";
import {
  configurationPillars,
  implementationPhases,
} from "@/lib/implementation-data";
import {
  BOOK_DEMO_HREF,
  HELP_CENTRE_HREF,
  TALK_TO_SALES_HREF,
} from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Implementation — RoundSync",
  description:
    "How RoundSync onboards wards, roles, and escalation paths — from discovery through pilot to full rollout.",
};

export default function ImplementationPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      <MarketingHeader />

      <section className="border-b border-line bg-surface-card px-page py-10 md:py-16">
        <PageContent wide>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
              Implementation
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-primary sm:text-4xl md:text-5xl">
              From discovery to live wards
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:mt-4 sm:text-base md:text-lg">
              How we onboard your organization — ward mapping, role
              configuration, escalation setup, and phased rollout with your
              team at every step.
            </p>
          </div>
        </PageContent>
      </section>

      <section className="px-page py-12 md:py-20">
        <PageContent wide>
          <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-3xl">
            What we configure
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            Implementation is hands-on — not a self-serve signup. Our team works
            with yours to match RoundSync to your ward structure and policies.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {configurationPillars.map((pillar) => (
              <li
                key={pillar.title}
                className="rounded-xl border border-line bg-surface-card p-6 md:p-7"
              >
                <h3 className="font-display text-lg font-semibold text-ink-primary">
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

      <section className="border-t border-line bg-surface-base px-page py-16 md:py-20">
        <PageContent wide>
          <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-3xl">
            Implementation phases
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            Typical single-ward pilots go live in a few weeks. Multi-ward
            rollouts scale from the same foundation — timelines adjust to scope.
          </p>

          <ol className="relative mt-12 space-y-6">
            <div
              className="pointer-events-none absolute bottom-6 left-4 top-6 hidden w-px bg-line md:block"
              aria-hidden="true"
            />
            {implementationPhases.map((phase) => (
              <li key={phase.id} className="relative md:pl-12">
                <span
                  className="absolute left-0 top-6 hidden size-8 items-center justify-center rounded-full border border-line bg-surface-card font-mono text-xs font-semibold text-brand-core md:flex"
                  aria-hidden="true"
                >
                  {phase.label.replace("Phase ", "")}
                </span>
                <div className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
                      {phase.label}
                    </span>
                    <span className="font-mono text-[11px] text-ink-secondary">
                      {phase.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink-primary">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
                    {phase.summary}
                  </p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {phase.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-ink-secondary"
                      >
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-core"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </PageContent>
      </section>

      <section className="border-t border-line bg-surface-card px-page py-16 md:py-20">
        <PageContent wide>
          <div className="mx-auto max-w-3xl rounded-xl border border-line bg-surface-base p-8 text-center md:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink-primary">
              Ready to plan your rollout?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary md:text-base">
              Talk to sales for scope and timelines, book a demo to see the
              product, or browse the help centre for administrator and IT
              guides.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={TALK_TO_SALES_HREF}
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:w-auto"
              >
                Talk to sales
              </Link>
              <Link
                href={BOOK_DEMO_HREF}
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-card px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
              >
                Book a demo
              </Link>
              <Link
                href={HELP_CENTRE_HREF}
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-card px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
              >
                Help centre
              </Link>
            </div>
          </div>
        </PageContent>
      </section>

      <MarketingFooter />
    </div>
  );
}
