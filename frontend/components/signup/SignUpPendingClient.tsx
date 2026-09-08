"use client";

import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { signUpCopy } from "@/lib/signup-content";
import { CONTACT_SUPPORT_HREF } from "@/lib/marketing-nav";

export function SignUpPendingClient() {
  const copy = signUpCopy.pending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-base px-page py-12">
      <Link href="/" aria-label="RoundSync home">
        <RoundSyncLogo
          markClassName="size-8"
          textClassName="font-display text-xl font-semibold text-brand-core"
        />
      </Link>

      <div className="mt-10 w-full max-w-md rounded-xl border border-line bg-surface-card p-8 text-center">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          RoundSync
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink-primary">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{copy.body}</p>
        <p className="mt-2 text-sm text-ink-secondary">{copy.hint}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={CONTACT_SUPPORT_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            {copy.contactAdmin}
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            {copy.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
