"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { NavLottieIcon } from "@/components/shell/NavLottieIcon";
import { LOGOUT_ICON, ShellNavLink } from "@/components/shell/ShellNavLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { adminAccountNav, adminOrganisationNav, adminWardAppNav } from "@/lib/admin-nav";
import { getCurrentUserDisplayName } from "@/lib/current-user";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";
import { getCurrentUserEmail, getSignUpSession } from "@/lib/signup-session";

function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/staff") {
    return pathname === "/admin/staff" || pathname.startsWith("/admin/staff/");
  }
  if (href === "/admin/audit") {
    return (
      pathname === "/admin/audit" ||
      pathname.startsWith("/admin/audit/") ||
      pathname.startsWith("/admin/cases/") ||
      pathname.startsWith("/admin/patients/")
    );
  }
  if (href === "/admin/security") {
    return pathname === "/admin/security" || pathname.startsWith("/admin/security/");
  }
  if (href === "/subscription") {
    return pathname === "/subscription" || pathname === "/checkout";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminAppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const session = getSignUpSession();
  const orgName = session.organization?.hospitalName ?? "Your organisation";
  const adminName = getCurrentUserDisplayName() ?? "";
  const adminEmail = getCurrentUserEmail() ?? session.account?.email ?? "";

  function handleLogoutConfirm() {
    setLogoutOpen(false);
    router.push(SIGN_IN_HREF);
  }

  return (
    <>
      <nav
        aria-label="Administrator navigation"
        className="flex h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-line bg-surface-card"
      >
        <div className="shrink-0 border-b border-line px-5 py-4">
          <RoundSyncLogo
            markClassName="size-7"
            textClassName="font-display text-lg font-semibold text-brand-core"
          />
          <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            Administrator
          </p>
          <p className="mt-1 truncate text-xs text-ink-secondary">{orgName}</p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3">
          <p className="px-3 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Organisation
          </p>
          <ul className="space-y-0.5">
            {adminOrganisationNav.map((item) => (
              <li key={item.href}>
                <ShellNavLink item={item} active={isNavItemActive(pathname, item.href)} />
              </li>
            ))}
          </ul>

          <p className="mt-4 px-3 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Switch view
          </p>
          <ul className="space-y-0.5">
            <li>
              <ShellNavLink
                item={adminWardAppNav}
                active={isNavItemActive(pathname, adminWardAppNav.href)}
              />
            </li>
          </ul>

          <p className="mt-4 px-3 pb-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Account
          </p>
          <ul className="space-y-0.5">
            {adminAccountNav.map((item) => (
              <li key={item.href}>
                <ShellNavLink item={item} active={isNavItemActive(pathname, item.href)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-line px-3 py-3">
          {adminName ? (
            <p className="truncate px-3 text-sm font-medium text-ink-primary">{adminName}</p>
          ) : null}
          {adminEmail ? (
            <p className={`truncate px-3 text-xs text-ink-secondary ${adminName ? "mt-0.5" : ""}`}>
              {adminEmail}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary ${adminName || adminEmail ? "mt-3" : ""}`}
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
