"use client";

import { PasswordInput } from "@/components/auth/PasswordInput";
import Link from "next/link";
import { useState } from "react";
import { settingsCopy } from "@/lib/content/copy";
import { CONTACT_SUPPORT_HREF } from "@/lib/marketing-nav";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function ChangePasswordForm() {
  const copy = settingsCopy.changePassword;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!currentPassword.trim()) {
      setError(copy.currentRequiredError);
      return;
    }

    if (newPassword.length < 8) {
      setError(copy.tooShortError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(copy.mismatchError);
      return;
    }

    if (newPassword === currentPassword) {
      setError(copy.sameAsCurrentError);
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="w-full rounded-xl border border-line bg-surface-card p-5">
        <div className="rounded-lg border border-line bg-surface-base px-4 py-4 text-center" role="status">
          <p className="font-display text-base font-semibold text-ink-primary">{copy.successTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.successBody}</p>
        </div>
        <div className="mt-5 flex justify-center">
          <Link
            href="/settings"
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            {copy.backToSettingsLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-line bg-surface-card p-5"
    >
      <div className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-ink-primary">{copy.currentLabel}</span>
          <PasswordInput
            name="current-password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className={inputClassName}
            disabled={submitting}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink-primary">{copy.newLabel}</span>
          <PasswordInput
            name="new-password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={inputClassName}
            disabled={submitting}
          />
          <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.newHint}</p>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink-primary">{copy.confirmLabel}</span>
          <PasswordInput
            name="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClassName}
            disabled={submitting}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand-core px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? copy.savingLabel : copy.saveLabel}
        </button>
        <Link
          href="/settings"
          className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
        >
          {copy.cancelLabel}
        </Link>
      </div>

      <p className="mt-5 border-t border-line pt-5 text-center text-xs leading-relaxed text-ink-secondary">
        {copy.ssoNote}{" "}
        <Link href={CONTACT_SUPPORT_HREF} className="font-medium text-brand-core hover:underline">
          {copy.supportLinkLabel}
        </Link>
      </p>
    </form>
  );
}
