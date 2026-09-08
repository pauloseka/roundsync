import type { Metadata } from "next";
import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { forgotPasswordSteps } from "@/lib/sign-in-content";
import { BOOK_DEMO_HREF, SIGN_IN_HREF } from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Forgot password — RoundSync",
  description:
    "Reset your RoundSync password using your hospital email. Secure links expire after 24 hours.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-surface-base">
      <aside className="relative hidden w-[40%] shrink-0 flex-col justify-between border-r border-line bg-brand-core px-10 py-12 text-white lg:flex xl:px-12 xl:py-14">
        <Link href="/" aria-label="RoundSync home">
          <RoundSyncLogo
            variant="light"
            markClassName="size-9"
            textClassName="font-display text-xl font-semibold text-white"
          />
        </Link>

        <div className="w-full space-y-8">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/55">
              Account recovery
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-snug xl:text-[2rem]">
              Reset access without calling the help desk
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Ward staff can request a secure reset link by email. SSO accounts
              stay with your hospital&apos;s IT team.
            </p>
          </div>

          <ul className="space-y-4">
            {forgotPasswordSteps.map((step) => (
              <li
                key={step.id}
                className="rounded-xl border border-white/12 bg-white/6 p-5"
              >
                <h2 className="font-display text-base font-semibold text-white">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-xs text-white/40">
          Reset links expire in 24 hours · Never share credentials on shared workstations
        </p>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-card px-page py-4 lg:border-b-0 lg:bg-transparent">
          <Link href="/" className="lg:hidden" aria-label="RoundSync home">
            <RoundSyncLogo
              markClassName="size-7"
              textClassName="font-display text-lg font-semibold text-brand-core"
            />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={SIGN_IN_HREF}
              className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
            >
              Back to sign in
            </Link>
            <Link
              href={BOOK_DEMO_HREF}
              className="inline-flex h-10 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
            >
              Book a demo
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-page pb-12 pt-4 lg:pt-0">
          <div className="w-full max-w-md">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
                Forgot password
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-primary">
                Reset your password
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                We&apos;ll email a secure link to restore access. Use the hospital
                address tied to your RoundSync account.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-line bg-surface-card p-6 md:p-8">
              <ForgotPasswordForm />
            </div>

            <div className="mt-8 grid gap-4 lg:hidden">
              {forgotPasswordSteps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-xl border border-line bg-surface-card p-5"
                >
                  <h3 className="font-display text-base font-semibold text-ink-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
