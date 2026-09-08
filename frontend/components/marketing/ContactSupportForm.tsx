"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOK_DEMO_HREF, FAQS_HREF, TALK_TO_SALES_HREF } from "@/lib/marketing-nav";

const issueTypeOptions = [
  "Account access",
  "Technical issue",
  "Escalation routing",
  "Permissions & roles",
  "Onboarding",
  "Billing",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  organization: string;
  issueType: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  issueType: "",
  subject: "",
  message: "",
};

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function ContactSupportForm() {
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
          Message sent
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary md:text-base">
          We&apos;ve received your request. Our support team will reply within
          one business day — often sooner for urgent access or routing issues.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            Back to homepage
          </Link>
          <Link
            href={FAQS_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            Browse FAQs
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
          <label htmlFor="support-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="support-name"
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
          <label htmlFor="support-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="support-email"
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
            htmlFor="support-organization"
            className="block text-sm font-medium text-ink-primary"
          >
            Hospital or organization
          </label>
          <input
            id="support-organization"
            name="organization"
            type="text"
            required
            value={form.organization}
            onChange={(e) => updateField("organization", e.target.value)}
            className={inputClassName}
            placeholder="City General Hospital"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="support-issue-type"
            className="block text-sm font-medium text-ink-primary"
          >
            What do you need help with?
          </label>
          <select
            id="support-issue-type"
            name="issueType"
            required
            value={form.issueType}
            onChange={(e) => updateField("issueType", e.target.value)}
            className={inputClassName}
          >
            <option value="" disabled>
              Select issue type
            </option>
            {issueTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="support-subject"
            className="block text-sm font-medium text-ink-primary"
          >
            Subject
          </label>
          <input
            id="support-subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className={inputClassName}
            placeholder="Can't access ward dashboard after shift change"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="support-message"
            className="block text-sm font-medium text-ink-primary"
          >
            Describe the issue
          </label>
          <textarea
            id="support-message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClassName} resize-none`}
            placeholder="What happened, what you expected, and any steps you've already tried..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending message..." : "Send message"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-secondary">
        For pricing and rollout planning,{" "}
        <Link href={TALK_TO_SALES_HREF} className="text-brand-core hover:underline">
          talk to sales
        </Link>
        . For a product walkthrough,{" "}
        <Link href={BOOK_DEMO_HREF} className="text-brand-core hover:underline">
          book a demo
        </Link>
        .
      </p>
    </form>
  );
}
