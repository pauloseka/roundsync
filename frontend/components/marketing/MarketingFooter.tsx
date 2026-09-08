import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { MarketingNavLink } from "@/components/marketing/MarketingNavLink";
import { PageContent } from "@/components/marketing/PageContent";
import {
  BOOK_DEMO_HREF,
  CONTACT_SUPPORT_HREF,
  FAQS_HREF,
  HELP_CENTRE_HREF,
  HOW_IT_WORKS_HREF,
  IMPLEMENTATION_HREF,
  PARTNERSHIPS_HREF,
  PRICING_HREF,
  PRODUCT_AUDIT_TRAIL_HREF,
  PRODUCT_PLATFORM_HREF,
  SOLUTIONS_ROLE_VIEWS_HREF,
  TALK_TO_SALES_HREF,
} from "@/lib/marketing-nav";

const linkColumns = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: PRODUCT_PLATFORM_HREF },
      { label: "How it works", href: HOW_IT_WORKS_HREF },
      { label: "Roles", href: SOLUTIONS_ROLE_VIEWS_HREF },
      { label: "Accountability", href: PRODUCT_AUDIT_TRAIL_HREF },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", href: PRICING_HREF },
      { label: "Implementation", href: IMPLEMENTATION_HREF },
      { label: "Help centre", href: HELP_CENTRE_HREF },
      { label: "FAQs", href: FAQS_HREF },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Book a demo", href: BOOK_DEMO_HREF },
      { label: "Talk to sales", href: TALK_TO_SALES_HREF },
      { label: "Partnerships", href: PARTNERSHIPS_HREF },
      { label: "Contact support", href: CONTACT_SUPPORT_HREF },
    ],
  },
];

const footerLinkClassName =
  "text-[15px] text-white/70 transition-colors hover:text-white";

export function MarketingFooter() {
  return (
    <footer
      id="support"
      className="scroll-mt-20 bg-brand-core px-page py-12 text-white md:py-14"
    >
      <PageContent wide>
        <div className="grid gap-11 lg:grid-cols-[minmax(0,16rem)_1fr_auto] lg:items-start lg:gap-14">
          <div className="max-w-xs">
            <Link href="/" aria-label="RoundSync home" className="inline-block">
              <RoundSyncLogo
                variant="light"
                markClassName="size-9"
                textClassName="font-display text-xl font-semibold text-white md:text-2xl"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/60 md:text-[15px]">
              Hospital coordination OS for routine shift work and emergency
              handoffs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3 sm:gap-x-12">
            {linkColumns.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                  {column.title}
                </p>
                <nav
                  className="mt-3.5 flex flex-col gap-2.5"
                  aria-label={`${column.title} links`}
                >
                  {column.links.map((link) => (
                    <MarketingNavLink
                      key={link.label}
                      href={link.href}
                      className={footerLinkClassName}
                    >
                      {link.label}
                    </MarketingNavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col gap-3 lg:min-w-[10rem] lg:flex-col">
            <Link
              href={BOOK_DEMO_HREF}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-brand-core transition-colors hover:bg-white/90 lg:w-auto"
            >
              Book a demo
            </Link>
            <Link
              href={TALK_TO_SALES_HREF}
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:border-white/45 hover:bg-white/8 lg:w-auto"
            >
              Talk to sales
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-white/45">
            © {new Date().getFullYear()} RoundSync
          </p>

          <p className="font-mono text-xs text-white/40">
            Escalate · Route · Respond · Resolve
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-white/55">
            <a
              href="mailto:support@roundsync.com"
              className="transition-colors hover:text-white"
            >
              support@roundsync.com
            </a>
            <a
              href="mailto:hello@roundsync.com"
              className="transition-colors hover:text-white"
            >
              hello@roundsync.com
            </a>
          </div>
        </div>
      </PageContent>
    </footer>
  );
}
