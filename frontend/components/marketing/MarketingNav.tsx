"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { MarketingNavLink } from "@/components/marketing/MarketingNavLink";
import { PageContent } from "@/components/marketing/PageContent";
import {
  BOOK_DEMO_HREF,
  ENTER_WARD_HREF,
  ENTER_WARD_LABEL,
  HOW_IT_WORKS_HREF,
  PRICING_HREF,
  PRODUCT_PLATFORM_HREF,
  SIGN_IN_HREF,
  SIGN_UP_HREF,
  SUBSCRIPTION_HREF,
  CHECKOUT_HREF,
  TALK_TO_SALES_HREF,
  marketingNavDropdowns,
  type NavDropdown,
} from "@/lib/marketing-nav";

const enterWardLinkClassName =
  "hidden h-10 items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card sm:inline-flex";

const enterWardMobileLinkClassName =
  "inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-base text-sm font-medium text-ink-primary";

function MarketingNavEnterWardLink({
  className,
  onClick,
}: {
  className: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFromSubscriptionFlow =
    pathname === TALK_TO_SALES_HREF && searchParams.get("from") === "subscription";

  if (isFromSubscriptionFlow) {
    return (
      <Link href={SUBSCRIPTION_HREF} className={className} onClick={onClick}>
        Back to plans
      </Link>
    );
  }

  return (
    <Link href={ENTER_WARD_HREF} className={className} onClick={onClick}>
      {ENTER_WARD_LABEL}
    </Link>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavDropdownPanel({
  menu,
  onNavigate,
}: {
  menu: NavDropdown;
  onNavigate: () => void;
}) {
  return (
    <div className="absolute left-1/2 top-full z-30 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 pt-2">
      <div className="overflow-hidden rounded-xl border border-line bg-surface-card shadow-[0_16px_48px_-8px_rgba(26,29,35,0.14)]">
        <div className="grid md:grid-cols-[1fr_1.6fr]">
          {menu.featured ? (
            <div className="border-b border-line bg-surface-base p-6 md:border-b-0 md:border-r">
              <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
                {menu.label}
              </p>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-ink-primary">
                {menu.featured.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {menu.featured.body}
              </p>
              <MarketingNavLink
                href={menu.featured.href}
                onNavigate={onNavigate}
                className="mt-4 inline-flex text-sm font-semibold text-brand-core hover:underline"
              >
                {menu.featured.cta} →
              </MarketingNavLink>
            </div>
          ) : null}

          <div
            className={`grid gap-6 p-6 ${menu.featured ? "sm:grid-cols-2" : "sm:grid-cols-2 md:col-span-2"}`}
          >
            {menu.columns.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                  {column.title}
                </p>
                <ul className="mt-3 space-y-1">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <MarketingNavLink
                        href={link.href}
                        onNavigate={onNavigate}
                        className="group block rounded-lg px-2 py-2 transition-colors hover:bg-surface-base"
                      >
                        <span className="block text-sm font-semibold text-ink-primary group-hover:text-brand-core">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-secondary">
                          {link.description}
                        </span>
                      </MarketingNavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAccordionSection({
  menu,
  onNavigate,
}: {
  menu: NavDropdown;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  function handleNavigate() {
    setOpen(false);
    onNavigate();
  }

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-ink-primary"
        aria-expanded={open}
      >
        {menu.label}
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <div className="pb-4">
          {menu.featured ? (
            <div className="mb-4 rounded-lg bg-surface-base p-4">
              <p className="font-display text-base font-semibold text-ink-primary">
                {menu.featured.title}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">
                {menu.featured.body}
              </p>
              <MarketingNavLink
                href={menu.featured.href}
                onNavigate={handleNavigate}
                className="mt-2 inline-block text-sm font-semibold text-brand-core"
              >
                {menu.featured.cta} →
              </MarketingNavLink>
            </div>
          ) : null}
          {menu.columns.map((column) => (
            <div key={column.title} className="mb-4 last:mb-0">
              <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                {column.title}
              </p>
              <ul className="mt-2 space-y-1">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <MarketingNavLink
                      href={link.href}
                      onNavigate={handleNavigate}
                      className="block rounded-md py-2"
                    >
                      <span className="text-sm font-medium text-ink-primary">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-secondary">
                        {link.description}
                      </span>
                    </MarketingNavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MarketingNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const navRef = useRef<HTMLDivElement>(null);
  const isOnBookDemo = pathname === BOOK_DEMO_HREF;
  const isOnPricing = pathname === PRICING_HREF;
  const isOnEnterWard =
    pathname === SIGN_IN_HREF ||
    pathname === SIGN_UP_HREF ||
    pathname === SUBSCRIPTION_HREF ||
    pathname === CHECKOUT_HREF ||
    pathname.startsWith("/sign-up");

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeAll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface-card px-page">
      <PageContent wide>
        <div
          ref={navRef}
          className="flex items-center justify-between gap-3 py-3 md:gap-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="shrink-0"
              onClick={closeAll}
              aria-label="RoundSync home"
            >
              <RoundSyncLogo />
            </Link>

            <nav
              className="hidden min-w-0 items-center justify-start gap-0.5 lg:flex"
              aria-label="Main navigation"
            >
              {marketingNavDropdowns.map((menu) => (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      openMenu === menu.label
                        ? "bg-surface-base text-ink-primary"
                        : "text-ink-secondary hover:bg-surface-base hover:text-ink-primary"
                    }`}
                    aria-expanded={openMenu === menu.label}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenMenu(openMenu === menu.label ? null : menu.label)
                    }
                  >
                    {menu.label}
                    <ChevronIcon open={openMenu === menu.label} />
                  </button>
                  {openMenu === menu.label ? (
                    <NavDropdownPanel menu={menu} onNavigate={closeAll} />
                  ) : null}
                </div>
              ))}

              <Link
                href={PRICING_HREF}
                onClick={closeAll}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isOnPricing
                    ? "bg-surface-base text-ink-primary"
                    : "text-ink-secondary hover:bg-surface-base hover:text-ink-primary"
                }`}
              >
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!isOnEnterWard ? (
              <Suspense
                fallback={
                  <Link href={ENTER_WARD_HREF} className={enterWardLinkClassName}>
                    {ENTER_WARD_LABEL}
                  </Link>
                }
              >
                <MarketingNavEnterWardLink className={enterWardLinkClassName} />
              </Suspense>
            ) : null}

            {!isOnBookDemo ? (
              <Link
                href={BOOK_DEMO_HREF}
                className="hidden h-10 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:inline-flex"
              >
                Book a demo
              </Link>
            ) : (
              <Link
                href="/"
                className="hidden h-10 items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card sm:inline-flex"
              >
                Back to home
              </Link>
            )}

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md border border-line text-ink-primary lg:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </PageContent>

      {mobileOpen ? (
        <div className="border-t border-line bg-surface-card px-page lg:hidden">
          <PageContent wide>
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto py-2">
              <div className="mb-2 grid grid-cols-3 gap-2 border-b border-line pb-4">
                <MarketingNavLink
                  href={PRODUCT_PLATFORM_HREF}
                  onNavigate={closeAll}
                  className="rounded-md border border-line bg-surface-base px-3 py-2 text-center text-sm font-medium text-ink-primary"
                >
                  Platform
                </MarketingNavLink>
                <MarketingNavLink
                  href={HOW_IT_WORKS_HREF}
                  onNavigate={closeAll}
                  className="rounded-md border border-line bg-surface-base px-3 py-2 text-center text-sm font-medium text-ink-primary"
                >
                  How it works
                </MarketingNavLink>
                <MarketingNavLink
                  href={PRICING_HREF}
                  onNavigate={closeAll}
                  className={`rounded-md border px-3 py-2 text-center text-sm font-medium ${
                    isOnPricing
                      ? "border-brand-core bg-brand-core-muted/30 text-brand-core"
                      : "border-line bg-surface-base text-ink-primary"
                  }`}
                >
                  Pricing
                </MarketingNavLink>
              </div>

              {marketingNavDropdowns.map((menu) => (
                <MobileAccordionSection
                  key={menu.label}
                  menu={menu}
                  onNavigate={closeAll}
                />
              ))}

              <div className="grid gap-2 py-4">
                {!isOnEnterWard ? (
                  <Suspense
                    fallback={
                      <Link
                        href={ENTER_WARD_HREF}
                        className={enterWardMobileLinkClassName}
                        onClick={closeAll}
                      >
                        {ENTER_WARD_LABEL}
                      </Link>
                    }
                  >
                    <MarketingNavEnterWardLink
                      className={enterWardMobileLinkClassName}
                      onClick={closeAll}
                    />
                  </Suspense>
                ) : null}
                {isOnBookDemo ? (
                  <Link
                    href="/"
                    className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-base text-sm font-medium text-ink-primary"
                    onClick={closeAll}
                  >
                    Back to home
                  </Link>
                ) : (
                  <Link
                    href={BOOK_DEMO_HREF}
                    className="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white"
                    onClick={closeAll}
                  >
                    Book a demo
                  </Link>
                )}
              </div>
            </div>
          </PageContent>
        </div>
      ) : null}
    </header>
  );
}
