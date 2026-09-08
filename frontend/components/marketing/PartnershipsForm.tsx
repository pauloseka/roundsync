"use client";

import { useState } from "react";
import Link from "next/link";
import { TALK_TO_SALES_HREF } from "@/lib/marketing-nav";

const partnershipTypeOptions = [
  "Technology integration",
  "EHR / clinical systems",
  "Hospital group / network",
  "Referral / reseller",
  "Research / academic",
  "Other",
];

const organizationTypeOptions = [
  "Health tech vendor",
  "EHR provider",
  "Hospital group",
  "System integrator",
  "Consultancy",
  "Academic institution",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  organization: string;
  partnershipType: string;
  organizationType: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  partnershipType: "",
  organizationType: "",
  message: "",
};

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function PartnershipsForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    // UI-only — simulate request; wire to API or form service later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-surface-card p-8 text-center md:p-10">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-core-muted">
          <span className="text-lg text-brand-core" aria-hidden="true">
            ✓
          </span>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink-primary">
          Inquiry received
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary md:text-base">
          Thanks for reaching out. Our partnerships team will review your
          inquiry and respond within three business days.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-line bg-surface-card p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="partner-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="partner-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClassName}
            placeholder="Amaka Okafor"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="partner-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="partner-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClassName}
            placeholder="you@company.org"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="partner-organization"
            className="block text-sm font-medium text-ink-primary"
          >
            Organization
          </label>
          <input
            id="partner-organization"
            name="organization"
            type="text"
            required
            value={form.organization}
            onChange={(e) => updateField("organization", e.target.value)}
            className={inputClassName}
            placeholder="Acme Health Systems"
          />
        </div>

        <div>
          <label
            htmlFor="partner-type"
            className="block text-sm font-medium text-ink-primary"
          >
            Partnership type
          </label>
          <select
            id="partner-type"
            name="partnershipType"
            required
            value={form.partnershipType}
            onChange={(e) => updateField("partnershipType", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select type
            </option>
            {partnershipTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="partner-org-type"
            className="block text-sm font-medium text-ink-primary"
          >
            Organization type
          </label>
          <select
            id="partner-org-type"
            name="organizationType"
            required
            value={form.organizationType}
            onChange={(e) => updateField("organizationType", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select category
            </option>
            {organizationTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="partner-message"
            className="block text-sm font-medium text-ink-primary"
          >
            Tell us about the partnership
          </label>
          <textarea
            id="partner-message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClassName} resize-none`}
            placeholder="Integration goals, hospital network scope, mutual customers, or how you envision working together..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending inquiry..." : "Submit partnership inquiry"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-secondary">
        Looking to deploy RoundSync at your hospital?{" "}
        <Link href={TALK_TO_SALES_HREF} className="text-brand-core hover:underline">
          Talk to sales
        </Link>{" "}
        instead.
      </p>
    </form>
  );
}
