"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signUpCopy } from "@/lib/signup-content";
import { useClientMounted } from "@/lib/hooks/useClientMounted";
import { deferStateUpdate } from "@/lib/defer-state-update";
import { SUBSCRIPTION_HREF } from "@/lib/signup-routes";
import { TRIAL_DAYS, getTrialDaysRemaining, isTrialActive } from "@/lib/signup-session";

export function TrialBanner() {
  const mounted = useClientMounted();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!mounted || !isTrialActive()) return;

    deferStateUpdate(() => setDaysLeft(getTrialDaysRemaining()));

    const timer = window.setInterval(() => {
      if (!isTrialActive()) return;
      deferStateUpdate(() => setDaysLeft(getTrialDaysRemaining()));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [mounted]);

  if (!mounted || !isTrialActive()) return null;

  const copy = signUpCopy.trial;
  const displayDays = daysLeft || getTrialDaysRemaining();
  const dayLabel = displayDays === 1 ? copy.daySingular : copy.dayPlural;

  return (
    <section
      className="rounded-xl border border-brand-core/30 bg-brand-core-muted/50 px-5 py-4 md:flex md:items-center md:justify-between md:gap-4"
      aria-live="polite"
    >
      <div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
          {copy.bannerLabel}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-ink-primary">
          {copy.bannerTitle(displayDays, dayLabel)}
        </p>
        <p className="mt-1 text-sm text-ink-secondary">{copy.bannerBody(TRIAL_DAYS)}</p>
      </div>
      <Link
        href={SUBSCRIPTION_HREF}
        className="mt-3 inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 md:mt-0"
      >
        {copy.upgradeCta}
      </Link>
    </section>
  );
}
