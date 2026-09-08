"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { SignUpShell } from "@/components/signup/SignUpShell";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupPrimaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { signUpCopy } from "@/lib/signup-content";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";
import { SIGNUP_VERIFY_HREF } from "@/lib/signup-routes";
import { saveSignUpAccount } from "@/lib/signup-session";
import { getPasswordValidationError } from "@/lib/password-requirements";

export function SignUpAccountStep() {
  const router = useRouter();
  const copy = signUpCopy.account;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Complete all required fields.");
      setSubmitting(false);
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      setSubmitting(false);
      return;
    }

    saveSignUpAccount({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
    });

    setSubmitting(false);
    router.push(SIGNUP_VERIFY_HREF);
  }

  return (
    <SignUpShell
      step="account"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className={signupFormStackClassName}>
          <div>
            <label htmlFor="signup-full-name" className="block text-sm font-medium text-ink-primary">
              {copy.fullNameLabel}
            </label>
            <input
              id="signup-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={signupInputClassName}
              placeholder="Dr. Sarah Chen"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-ink-primary">
              {copy.emailLabel}
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={signupInputClassName}
              placeholder="you@citygeneral.org"
              autoComplete="email"
              required
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.emailHint}</p>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-ink-primary">
              {copy.passwordLabel}
            </label>
            <PasswordInput
              id="signup-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={signupInputClassName}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-describedby="signup-password-requirements"
              required
            />
            <div id="signup-password-requirements">
              <PasswordRequirements
                password={password}
                title={copy.passwordRequirementsTitle}
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-critical" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={`${signupPrimaryButtonClassName} mt-8`}
        >
          {submitting ? "Continuing…" : copy.cta}
        </button>

        <p className="mt-8 text-center text-sm text-ink-secondary">
          {signUpCopy.signInHasAccount}{" "}
          <Link href={SIGN_IN_HREF} className="font-medium text-brand-core hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </SignUpShell>
  );
}
