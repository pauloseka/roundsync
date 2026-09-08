"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { NavLottieIcon } from "@/components/shell/NavLottieIcon";
import { LOGOUT_ICON, ShellNavLink } from "@/components/shell/ShellNavLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useIsOrgAdmin } from "@/components/admin/useAdminGuard";
import { wardAdminPanelNav } from "@/lib/admin-nav";
import { getCurrentUserNavSubtitle } from "@/lib/current-user";
import type { NavBadges } from "@/lib/mock-data";
import type { CaseBadgeUrgency } from "@/lib/cases";
import type { TaskBadgeTone } from "@/lib/nav-badges";
import {
  navBadgeClassName,
  nurseSettingsNav,
  nurseWorkNav,
} from "@/lib/nurse-nav";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";

interface AppNavProps {
  badges: NavBadges & { myTasksTone: TaskBadgeTone; activeCasesUrgency: CaseBadgeUrgency };
}

export function AppNav({ badges }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navSubtitle = getCurrentUserNavSubtitle();
  const isOrgAdmin = useIsOrgAdmin();

  function handleLogoutConfirm() {
    setLogoutOpen(false);
    router.push(SIGN_IN_HREF);
  }

  return (
    <>
      <nav
        aria-label="Ward navigation"
        className="flex h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-line bg-surface-card"
      >
        <div className="shrink-0 border-b border-line px-5 py-4">
          <RoundSyncLogo
            markClassName="size-7"
            textClassName="font-display text-lg font-semibold text-brand-core"
          />
          <p className="mt-2 truncate font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            {navSubtitle}
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3">
          <p className="px-3 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Shift work
          </p>
          <ul className="space-y-0.5">
            {nurseWorkNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  <ShellNavLink
                    item={item}
                    active={isActive}
                    count={count}
                    badgeClassName={badgeClassName}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {isOrgAdmin ? (
          <div className="shrink-0 border-t border-line px-3 pt-3">
            <p className="px-3 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
              Switch view
            </p>
            <ShellNavLink
              item={wardAdminPanelNav}
              active={pathname === wardAdminPanelNav.href || pathname.startsWith(`${wardAdminPanelNav.href}/`)}
            />
          </div>
        ) : null}

        <div className="mt-auto shrink-0 border-t border-line px-3 py-3">
          <ShellNavLink
            item={nurseSettingsNav}
            active={pathname === nurseSettingsNav.href}
          />

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
          >
            <NavLottieIcon src={LOGOUT_ICON} active={false} label="Log out" />
            <span>Log out</span>
          </button>
        </div>
      </nav>

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
