import type { Metadata } from "next";
import Link from "next/link";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { settingsCopy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: "Change password — RoundSync",
  description: "Update your RoundSync account password while signed in.",
};

export default function ChangePasswordPage() {
  const copy = settingsCopy.changePassword;

  return (
    <div className="flex min-h-full w-full flex-col px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <Link
        href="/settings"
        className="self-start font-mono text-xs font-medium uppercase tracking-widest text-brand-core hover:underline"
      >
        {copy.backLabel}
      </Link>

      <div className="mx-auto mt-8 w-full max-w-md xl:mt-10">
        <header className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink-primary">{copy.title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{copy.subtitle}</p>
        </header>

        <div className="mt-8">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
