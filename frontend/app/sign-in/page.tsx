import type { Metadata } from "next";
import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { SignInForm } from "@/components/auth/SignInForm";
import { accessProfiles } from "@/lib/sign-in-content";
import { BOOK_DEMO_HREF } from "@/lib/marketing-nav";

export const metadata: Metadata = {
  title: "Sign in — RoundSync",
  description:
    "Sign in to RoundSync with your hospital email. Clinical staff, IT administrators, and dual-role accounts each receive a scoped view after authentication.",
};

export default function SignInPage() {
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
              Secure access
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-snug xl:text-[2rem]">
              One login. The right view for your role.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Your view after sign-in is scoped to the roles your organisation
              assigned — not something you choose here.
            </p>
          </div>

          <ul className="space-y-4">
            {accessProfiles.map((profile) => (
              <li
                key={profile.id}
                className="rounded-xl border border-white/12 bg-white/6 p-5"
              >
                <h2 className="font-display text-base font-semibold text-white">
                  {profile.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {profile.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-xs text-white/40">
          Roles assigned by your organisation · Switch active role in Settings
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
          <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex h-11 w-full touch-manipulation items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card sm:h-10 sm:w-auto"
            >
              Back to home
            </Link>
            <Link
              href={BOOK_DEMO_HREF}
              className="inline-flex h-11 w-full touch-manipulation items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:h-10 sm:w-auto"
            >
              Book a demo
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center px-page pb-12 pt-6 sm:pt-4 lg:justify-center lg:pt-0">
          <div className="w-full max-w-md">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
                Sign in
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-primary sm:text-3xl">
                Access your ward
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Use your hospital email. Your dashboard reflects the roles IT
                provisioned for you.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-line bg-surface-card p-6 md:p-8">
              <SignInForm />
            </div>

            <div className="mt-8 grid gap-4 lg:hidden">
              {accessProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-xl border border-line bg-surface-card p-5"
                >
                  <h3 className="font-display text-base font-semibold text-ink-primary">
                    {profile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {profile.body}
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
