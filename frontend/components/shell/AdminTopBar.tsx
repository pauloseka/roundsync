"use client";

import { useState } from "react";
import { formatTimestamp } from "@/lib/format";
import { getCurrentUserDisplayName } from "@/lib/current-user";
import { getSignUpSession } from "@/lib/signup-session";

export function AdminTopBar() {
  const session = getSignUpSession();
  const orgName = session.organization?.hospitalName ?? "Your organisation";
  const adminName = getCurrentUserDisplayName() ?? "Administrator";
  const [loggedInAt] = useState(() => new Date());

  const login = formatTimestamp(loggedInAt);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-line bg-surface-card px-6 py-3">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
          Organisation admin
        </p>
        <p className="mt-0.5 font-display text-lg font-semibold text-ink-primary">{adminName}</p>
        <p className="text-sm text-ink-secondary">{orgName}</p>
      </div>

      <p className="max-w-[min(100%,22rem)] shrink-0 text-right font-mono text-xs leading-relaxed text-ink-secondary sm:max-w-none sm:whitespace-nowrap">
        <span suppressHydrationWarning>
          Signed in{" "}
          <span className="font-medium text-ink-primary">{login.relative}</span>{" "}
          <span className="text-ink-secondary">({login.absolute})</span>
        </span>
      </p>
    </header>
  );
}
