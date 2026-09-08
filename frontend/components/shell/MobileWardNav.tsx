"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NavLottieIcon } from "@/components/shell/NavLottieIcon";
import { LOGOUT_ICON } from "@/components/shell/ShellNavLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { wardAdminPanelNav } from "@/lib/admin-nav";
import type { NavBadges } from "@/lib/mock-data";
import type { CaseBadgeUrgency } from "@/lib/cases";
import type { TaskBadgeTone } from "@/lib/nav-badges";
import {
  navBadgeClassName,
  nurseSettingsNav,
  nurseWorkNav,
  type NurseNavItem,
} from "@/lib/nurse-nav";
import { cn } from "@/lib/design-system/cn";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";

const primaryNav = nurseWorkNav.slice(0, 4);

interface MobileWardNavProps {
  badges: NavBadges & { myTasksTone: TaskBadgeTone; activeCasesUrgency: CaseBadgeUrgency };
  isOrgAdmin: boolean;
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileWardNav({ badges, isOrgAdmin }: MobileWardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const secondaryNav: NurseNavItem[] = [
    ...nurseWorkNav.slice(4),
    nurseSettingsNav,
  ];

  function handleLogoutConfirm() {
    setLogoutOpen(false);
    setMenuOpen(false);
    router.push(SIGN_IN_HREF);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        aria-label="Ward navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-card/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <ul className="grid grid-cols-5">
          {primaryNav.map((item) => {
            const active = isNavActive(pathname, item.href);
            const count = item.badge ? badges[item.badge] : 0;
            const badgeClassName =
              count > 0 && item.badgeVariant
                ? navBadgeClassName(item.badgeVariant, {
                    taskTone: item.id === "tasks" ? badges.myTasksTone : undefined,
                    caseUrgency: item.id === "cases" ? badges.activeCasesUrgency : undefined,
                  })
                : undefined;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex touch-manipulation flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium transition-colors",
                    active ? "text-brand-core" : "text-ink-secondary",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <NavLottieIcon
                      src={item.icon}
                      active={active}
                      label={item.label}
                    />
                    {count > 0 && badgeClassName ? (
                      <span
                        className={cn(
                          "absolute -right-2 -top-1 min-w-4 rounded-full px-1 py-0.5 text-center text-[9px] font-semibold leading-none",
                          badgeClassName,
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate">{item.label.split(" ")[0]}</span>
                </Link>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex w-full touch-manipulation flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium text-ink-secondary"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              <span className="flex size-5 items-center justify-center rounded-md border border-line text-xs">
                ···
              </span>
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="More navigation">
          <button
            type="button"
            className="absolute inset-0 bg-surface-overlay"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[min(80dvh,520px)] overflow-y-auto rounded-t-2xl border-t border-line bg-surface-card px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-lg">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden="true" />
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
              Ward menu
            </p>
            <ul className="mt-3 space-y-1">
              {secondaryNav.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                        active
                          ? "bg-brand-core-muted font-semibold text-brand-core"
                          : "text-ink-secondary hover:bg-surface-base hover:text-ink-primary",
                      )}
                    >
                      <NavLottieIcon src={item.icon} active={active} label={item.label} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              {isOrgAdmin ? (
                <li>
                  <Link
                    href={wardAdminPanelNav.href}
                    onClick={closeMenu}
                    className="flex touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
                  >
                    <NavLottieIcon
                      src={wardAdminPanelNav.icon}
                      active={false}
                      label={wardAdminPanelNav.label}
                    />
                    <span>{wardAdminPanelNav.label}</span>
                  </Link>
                </li>
              ) : null}
            </ul>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setLogoutOpen(true);
              }}
              className="mt-3 flex w-full touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
            >
              <NavLottieIcon src={LOGOUT_ICON} active={false} label="Log out" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        description="You'll return to the sign-in screen. Any unsaved work in this session will be lost."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}
