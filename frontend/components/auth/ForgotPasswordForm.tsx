"use client";

import Link from "next/link";
import { useState } from "react";
import { CONTACT_SUPPORT_HREF, SIGN_IN_HREF } from "@/lib/marketing-nav";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

const primaryButtonClassName =
  "flex h-11 w-full items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    // UI-only — wire to Supabase auth password reset later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!email.trim()) {
      setError("Enter your hospital email address.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full">
        <div
          className="rounded-lg border border-line bg-surface-base px-4 py-4"
          role="status"
        >
          <p className="font-display text-base font-semibold text-ink-primary">
            Check your email
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            If an account exists for{" "}
            <span className="font-medium text-ink-primary">{email.trim()}</span>, we
            sent a password reset link. It expires in 24 hours.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            Didn&apos;t receive it? Check spam, confirm you used your hospital email,
            or contact support if your organisation uses SSO.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className={primaryButtonClassName}
          >
            Try another email
          </button>
          <Link
            href={SIGN_IN_HREF}
            className="flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            Back to sign in
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-ink-secondary">
          Need help?{" "}
          <Link href={CONTACT_SUPPORT_HREF} className="font-medium text-brand-core hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="forgot-password-email" className="block text-sm font-medium text-ink-primary">
            Hospital email
          </label>
          <input
            id="forgot-password-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
            placeholder="you@citygeneral.org"
          />
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Enter the email your ward administrator provisioned for RoundSync.
          </p>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-critical" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6">
          <button type="submit" disabled={submitting} className={primaryButtonClassName}>
            {submitting ? "Sending link..." : "Send reset link"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Remember your password?{" "}
        <Link href={SIGN_IN_HREF} className="font-medium text-brand-core hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
