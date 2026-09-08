import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { SignUpStepIndicator } from "@/components/signup/SignUpStepIndicator";
import { signUpCopy } from "@/lib/signup-content";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";
import type { SignupStepId } from "@/lib/signup-routes";

interface SignUpShellProps {
  step: SignupStepId;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
}

const sidebarByStep: Record<
  SignupStepId,
  { label: string; title: string; body: string }
> = {
  account: signUpCopy.sidebar.account,
  "verify-email": signUpCopy.sidebar.verify,
  organization: signUpCopy.sidebar.organization,
};

export function SignUpShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  wide = false,
}: SignUpShellProps) {
  const sidebar = sidebarByStep[step];

  return (
    <div className="flex min-h-screen bg-surface-base">
      <aside className="relative hidden w-[42%] max-w-xl shrink-0 flex-col justify-between border-r border-line bg-brand-core px-12 py-14 text-white xl:px-16 xl:py-16">
        <Link href="/" aria-label="RoundSync home">
          <RoundSyncLogo
            variant="light"
            markClassName="size-9"
            textClassName="font-display text-xl font-semibold text-white"
          />
        </Link>

        <div className="w-full max-w-md space-y-5">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/55">
            {sidebar.label}
          </p>
          <h1 className="font-display text-3xl font-semibold leading-snug xl:text-[2.125rem] xl:leading-tight">
            {sidebar.title}
          </h1>
          <p className="text-base leading-relaxed text-white/70">{sidebar.body}</p>
        </div>

        <p className="font-mono text-xs text-white/40">
          Escalate · Route · Respond · Resolve
        </p>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface-card px-page py-5 lg:border-b-0 lg:bg-transparent lg:px-10 lg:py-8 xl:px-14">
          <Link href="/" className="lg:hidden" aria-label="RoundSync home">
            <RoundSyncLogo
              markClassName="size-7"
              textClassName="font-display text-lg font-semibold text-brand-core"
            />
          </Link>
          <Link
            href={SIGN_IN_HREF}
            className="ml-auto inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface-base px-5 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            Sign in
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center px-page pb-12 pt-6 sm:px-page lg:justify-center lg:px-10 lg:pb-20 lg:pt-12 xl:px-14">
          <div className={`w-full ${wide ? "max-w-xl" : "max-w-lg"}`}>
            <SignUpStepIndicator currentStep={step} />

            <header className="mt-8 space-y-3 sm:mt-12 md:mt-14">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
                {eyebrow}
              </p>
              <h2 className="font-display text-2xl font-semibold leading-tight text-ink-primary sm:text-3xl md:text-[2rem]">
                {title}
              </h2>
              <p className="max-w-prose text-sm leading-relaxed text-ink-secondary sm:text-base">
                {subtitle}
              </p>
            </header>

            <div className="mt-8 rounded-2xl border border-line bg-surface-card p-5 shadow-sm sm:p-8 md:mt-12 md:p-10">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
