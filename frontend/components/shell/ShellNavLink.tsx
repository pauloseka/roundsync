"use client";

import Link from "next/link";
import { NavLottieIcon } from "@/components/shell/NavLottieIcon";
import type { AdminNavItem } from "@/lib/admin-nav";
import type { NurseNavItem } from "@/lib/nurse-nav";

type ShellNavItem = AdminNavItem | NurseNavItem;

interface ShellNavLinkProps {
  item: ShellNavItem;
  active: boolean;
  count?: number;
  badgeClassName?: string;
}

export function ShellNavLink({ item, active, count = 0, badgeClassName }: ShellNavLinkProps) {
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-brand-core-muted font-semibold text-brand-core"
          : "font-normal text-ink-secondary hover:bg-surface-base hover:text-ink-primary"
      }`}
    >
      <NavLottieIcon src={item.icon} active={active} label={item.label} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {count > 0 && badgeClassName ? (
        <span
          className={`min-w-5 shrink-0 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${badgeClassName}`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export const LOGOUT_ICON = "/icons/nav/logout.json";
