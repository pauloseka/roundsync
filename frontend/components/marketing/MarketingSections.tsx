import Link from "next/link";
import { BOOK_DEMO_HREF, HOW_IT_WORKS_HREF } from "@/lib/marketing-nav";
import { PageContent } from "@/components/marketing/PageContent";
import { DashboardScreenshot } from "@/components/marketing/DashboardScreenshot";
import { HeroBackground } from "@/components/marketing/HeroBackground";

export function MarketingHero() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-surface-base px-page py-8 md:min-h-[88vh] md:py-12">
      <HeroBackground />
      <PageContent wide className="relative z-10 flex min-h-0 flex-1 flex-col items-center gap-6 md:gap-10">
        <div className="mx-auto w-full max-w-3xl shrink-0 text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
            Hospital coordination OS
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-primary sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Every role coordinated. Every handoff clear.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:mt-4 sm:text-base md:text-lg">
            RoundSync connects nurses, doctors, pharmacists, and front desk
            around the same patient — routine shift work and emergencies in one
            coordinated system, with accountability built in.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={BOOK_DEMO_HREF}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:w-auto"
            >
              Book a demo
            </Link>
            <Link
              href={HOW_IT_WORKS_HREF}
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-line bg-surface-card px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-1 items-end justify-center pt-2 md:pt-4">
          <div className="aspect-[4/3] w-full max-w-[960px] sm:max-w-[85vw] md:w-[55vw]">
            <DashboardScreenshot className="h-full w-full" />
          </div>
        </div>
      </PageContent>
    </section>
  );
}

export {
  MarketingAccountability,
  MarketingCta,
  MarketingFaqs,
  MarketingFeatures,
  MarketingFlow,
  MarketingFooter,
  MarketingRoles,
} from "@/components/marketing/MarketingPageSections";
