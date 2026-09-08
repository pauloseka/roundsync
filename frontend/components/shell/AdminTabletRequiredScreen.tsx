import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { BOOK_DEMO_HREF } from "@/lib/marketing-nav";
import { buttonClassName } from "@/lib/design-system/variants";

export function AdminTabletRequiredScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-base px-page pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="mx-auto w-full max-w-lg">
        <Link href="/" aria-label="RoundSync home">
          <RoundSyncLogo
            markClassName="size-8"
            textClassName="font-display text-lg font-semibold text-brand-core"
          />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
        <div className="rounded-2xl border border-line bg-surface-card p-6 text-center shadow-sm md:p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-core-muted">
            <span className="font-mono text-lg text-brand-core" aria-hidden="true">
              ⊞
            </span>
          </div>

          <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            Tablet required
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink-primary">
            Organisation admin works best on a tablet or desktop
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
            Team setup, staff rosters, audit review, and security controls need a
            wider screen — at least 768px wide. Open this section on a tablet,
            laptop, or desktop.
          </p>

          <div className="mt-8 grid gap-3">
            <Link href="/dashboard" className={buttonClassName({ fullWidth: true })}>
              Open ward app on this device
            </Link>
            <Link
              href="/"
              className={buttonClassName({ variant: "secondary", fullWidth: true })}
            >
              Back to homepage
            </Link>
            <Link
              href={BOOK_DEMO_HREF}
              className={buttonClassName({ variant: "ghost", fullWidth: true })}
            >
              Book a demo
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-secondary">
          Need help from a phone? Use{" "}
          <Link href="/dashboard" className="font-medium text-brand-core hover:underline">
            Dashboard
          </Link>
          ,{" "}
          <Link href="/cases" className="font-medium text-brand-core hover:underline">
            Cases
          </Link>
          , and{" "}
          <Link href="/messages" className="font-medium text-brand-core hover:underline">
            Messages
          </Link>{" "}
          in the ward app — they&apos;re built for mobile.
        </p>
      </main>
    </div>
  );
}
