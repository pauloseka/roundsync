import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TriggerCaseForm } from "@/components/cases/TriggerCaseForm";

export const metadata: Metadata = {
  title: "Trigger case — RoundSync",
  description: "Open a new emergency case from the active queue.",
};

export default function TriggerCasePage() {
  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-xl">
        <Link
          href="/cases"
          className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
        >
          ← Active Cases
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">
          Trigger new case
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
          Flag an emergency directly from the queue — useful when something new comes up while
          you&apos;re already triaging.
        </p>
      </header>

      <Suspense fallback={<div className="text-sm text-ink-secondary">Loading…</div>}>
        <TriggerCaseForm />
      </Suspense>
    </div>
  );
}
