"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { hospitalEmailSignIn } from "@/lib/sign-in-content";
import { resolvePostAuthRoute } from "@/lib/signup-auth";
import { signUpCopy } from "@/lib/signup-content";
import { FORGOT_PASSWORD_HREF, SIGN_UP_HREF } from "@/lib/marketing-nav";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

const primaryButtonClassName =
  "flex h-11 w-full items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70";

const secondaryButtonClassName =
  "flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-70";

function HospitalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-brand-core"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 21V7a2 2 0 0 1 2-2h4l2-2 2 2h4a2 2 0 0 1 2 2v14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10v6M9 13h6" strokeLinecap="round" />
    </svg>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function completeSignIn(signedInEmail: string) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push(resolvePostAuthRoute(signedInEmail));
  }

  async function handleHospitalEmailSignIn() {
    setError(null);
    setSsoLoading(true);

    try {
      await completeSignIn(email.trim() || "admin@citygeneral.org");
    } finally {
      setSsoLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email.trim() || !password) {
      setError("Enter your hospital email and password.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    router.push(resolvePostAuthRoute(email.trim()));
  }

  const busy = submitting || ssoLoading;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="sign-in-email" className="block text-sm font-medium text-ink-primary">
              Hospital email
            </label>
            <input
              id="sign-in-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="you@citygeneral.org"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="sign-in-password" className="block text-sm font-medium text-ink-primary">
                Password
              </label>
              <Link
                href={FORGOT_PASSWORD_HREF}
                className="shrink-0 text-sm font-medium text-brand-core hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="sign-in-password"
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
              placeholder="••••••••"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mt-0.5 size-4 rounded border-line text-brand-core focus:ring-brand-core"
            />
            <span className="text-sm leading-relaxed text-ink-secondary">
              Remember this device on trusted ward workstations
            </span>
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-critical" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <button type="submit" disabled={busy} className={primaryButtonClassName}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handleHospitalEmailSignIn}
            className={secondaryButtonClassName}
          >
            <HospitalIcon />
            <span>
              {ssoLoading ? "Redirecting..." : hospitalEmailSignIn.label}
            </span>
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        {signUpCopy.signUpNoAccount}{" "}
        <Link href={SIGN_UP_HREF} className="font-medium text-brand-core hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
