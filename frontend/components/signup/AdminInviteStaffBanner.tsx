"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signUpCopy } from "@/lib/signup-content";
import { useClientMounted } from "@/lib/hooks/useClientMounted";
import { deferStateUpdate } from "@/lib/defer-state-update";
import { ADMIN_HREF } from "@/lib/signup-routes";
import {
  dismissInviteStaffPrompt,
  getSignUpSession,
} from "@/lib/signup-session";

export function AdminInviteStaffBanner() {
  const mounted = useClientMounted();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    deferStateUpdate(() => {
      setVisible(getSignUpSession().showInviteStaffPrompt);
    });
  }, [mounted]);

  if (!mounted || !visible || dismissed) return null;

  function handleDismiss() {
    dismissInviteStaffPrompt();
    setDismissed(true);
    setVisible(false);
  }

  return (
    <section
      className="rounded-xl border border-brand-core/30 bg-brand-core-muted/50 p-5 md:p-6"
      aria-labelledby="admin-invite-heading"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            First setup step
          </p>
          <h2
            id="admin-invite-heading"
            className="mt-2 font-display text-lg font-semibold text-ink-primary"
          >
            {signUpCopy.invitePrompt.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
            {signUpCopy.invitePrompt.body}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href={ADMIN_HREF}
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-core px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            {signUpCopy.invitePrompt.cta}
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface-card px-5 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base"
          >
            {signUpCopy.invitePrompt.dismiss}
          </button>
        </div>
      </div>
    </section>
  );
}
