"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignUpShell } from "@/components/signup/SignUpShell";
import {
  signupPrimaryButtonClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { useSignUpGuard } from "@/components/signup/useSignUpGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { signUpCopy } from "@/lib/signup-content";
import { SIGNUP_ORG_HREF } from "@/lib/signup-routes";
import { getSignUpSession, markEmailVerified } from "@/lib/signup-session";

const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_COOLDOWN_KEY = "roundsync_verify_resend_until";

function getCooldownRemainingSeconds(): number {
  if (typeof window === "undefined") return 0;
  const until = Number(sessionStorage.getItem(RESEND_COOLDOWN_KEY) ?? 0);
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function startResendCooldown() {
  sessionStorage.setItem(
    RESEND_COOLDOWN_KEY,
    String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000),
  );
}

export function SignUpVerifyEmailStep() {
  const router = useRouter();
  const ready = useSignUpGuard("verify-email");
  const copy = signUpCopy.verifyEmail;
  const [email] = useState(() => getSignUpSession().account?.email ?? "");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(() => getCooldownRemainingSeconds());

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setCooldownSeconds(getCooldownRemainingSeconds());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  if (!ready) return <PageLoadingFallback />;

  const resendDisabled = resending || cooldownSeconds > 0;

  async function handleResend() {
    if (resendDisabled) return;

    setResending(true);
    setResent(false);
    await new Promise((resolve) => setTimeout(resolve, 700));
    startResendCooldown();
    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    setResending(false);
    setResent(true);
  }

  function handleVerified() {
    markEmailVerified();
    router.push(SIGNUP_ORG_HREF);
  }

  function resendLabel() {
    if (resending) return copy.resending;
    if (cooldownSeconds > 0) return copy.resendCooldown(cooldownSeconds);
    return copy.resend;
  }

  return (
    <SignUpShell
      step="verify-email"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      <div className="space-y-8">
        <div className="rounded-xl border border-line bg-surface-base p-6">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            {copy.sentTo}
          </p>
          <p className="mt-2 text-base font-semibold text-ink-primary">{email || "your work email"}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
            Click the link in that email to continue. Check spam if it doesn&apos;t arrive within a
            few minutes.
          </p>
        </div>

        {resent ? (
          <p className="text-sm text-brand-core" role="status">
            {copy.resent}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className={signupSecondaryButtonClassName}
        >
          {resendLabel()}
        </button>

        <button type="button" onClick={handleVerified} className={signupPrimaryButtonClassName}>
          {copy.devBypass}
        </button>

        <p className="text-center text-xs leading-relaxed text-ink-secondary">
          Prototype: Supabase sends the real confirmation link in production. Use the button above to
          simulate a verified email locally.
        </p>
      </div>
    </SignUpShell>
  );
}
