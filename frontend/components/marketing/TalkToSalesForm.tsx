"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BOOK_DEMO_HREF, SUBSCRIPTION_HREF } from "@/lib/marketing-nav";

const roleOptions = [
  "Hospital operations",
  "Clinical director",
  "Nurse manager / Ward lead",
  "Procurement",
  "IT / Digital health",
  "Administration",
  "Other",
];

const wardCountOptions = [
  "1 ward (pilot)",
  "2–5 wards",
  "6–15 wards",
  "16+ wards / multi-site",
  "Hospital group",
  "Not sure yet",
];

const timelineOptions = [
  "Exploring options",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Active procurement / RFP",
];

const inquiryOptions = [
  "Pricing & licensing",
  "Multi-ward rollout",
  "Hospital group deployment",
  "Pilot program",
  "Procurement / RFP",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  organization: string;
  role: string;
  wardCount: string;
  timeline: string;
  inquiryType: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  role: "",
  wardCount: "",
  timeline: "",
  inquiryType: "",
  message: "",
};

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function TalkToSalesForm() {
  const searchParams = useSearchParams();
  const fromSubscription = searchParams.get("from") === "subscription";
  const returnHref = fromSubscription ? SUBSCRIPTION_HREF : "/";
  const returnLabel = fromSubscription ? "Back to plans" : "Back to homepage";

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
          We&apos;ll be in touch
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary md:text-base">
          Thanks for your interest. A member of our sales team will reach out
          within two business days to discuss scope, timelines, and next steps.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={returnHref}
            className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            {returnLabel}
          </Link>
          <Link
            href={BOOK_DEMO_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            Book a demo
          </Link>
        </div>
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
          <label htmlFor="sales-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="sales-name"
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
          <label htmlFor="sales-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="sales-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClassName}
            placeholder="you@hospital.org"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="sales-organization"
            className="block text-sm font-medium text-ink-primary"
          >
            Hospital or organization
          </label>
          <input
            id="sales-organization"
            name="organization"
            type="text"
            required
            value={form.organization}
            onChange={(e) => updateField("organization", e.target.value)}
            className={inputClassName}
            placeholder="City General Hospital"
          />
        </div>

        <div>
          <label htmlFor="sales-role" className="block text-sm font-medium text-ink-primary">
            Your role
          </label>
          <select
            id="sales-role"
            name="role"
            required
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select role
            </option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sales-ward-count"
            className="block text-sm font-medium text-ink-primary"
          >
            Deployment scope
          </label>
          <select
            id="sales-ward-count"
            name="wardCount"
            required
            value={form.wardCount}
            onChange={(e) => updateField("wardCount", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select scope
            </option>
            {wardCountOptions.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sales-timeline"
            className="block text-sm font-medium text-ink-primary"
          >
            Target timeline
          </label>
          <select
            id="sales-timeline"
            name="timeline"
            required
            value={form.timeline}
            onChange={(e) => updateField("timeline", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select timeline
            </option>
            {timelineOptions.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sales-inquiry"
            className="block text-sm font-medium text-ink-primary"
          >
            What would you like to discuss?
          </label>
          <select
            id="sales-inquiry"
            name="inquiryType"
            required
            value={form.inquiryType}
            onChange={(e) => updateField("inquiryType", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select topic
            </option>
            {inquiryOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="sales-message"
            className="block text-sm font-medium text-ink-primary"
          >
            Tell us about your rollout plans
          </label>
          <textarea
            id="sales-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClassName} resize-none`}
            placeholder="Ward structure, sites involved, procurement stage, or specific questions about licensing..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending inquiry..." : "Contact sales"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-secondary">
        Want to see the product first?{" "}
        <Link href={BOOK_DEMO_HREF} className="text-brand-core hover:underline">
          Book a demo
        </Link>{" "}
        for a tailored walkthrough.
      </p>
    </form>
  );
}
