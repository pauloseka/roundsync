"use client";

import { useState } from "react";
import { demoRoleOptions, demoWardSizeOptions } from "@/lib/book-demo-config";
import { bookDemoPanelCopy } from "@/lib/book-demo-content";
import {
  GuestEmailFields,
  normalizeGuestEmails,
} from "@/components/marketing/GuestEmailFields";
import { inputClassName, signupPrimaryButtonClassName } from "@/lib/design-system/variants";
import { cn } from "@/lib/design-system/cn";

interface BookDemoManualFormProps {
  onSubmit: () => void;
}

interface ManualFormState {
  name: string;
  email: string;
  organization: string;
  role: string;
  wardSize: string;
  message: string;
  guestEmails: string[];
}

export function BookDemoManualForm({ onSubmit }: BookDemoManualFormProps) {
  const copy = bookDemoPanelCopy;
  const fieldClassName = cn(inputClassName, "text-base sm:text-sm");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ManualFormState>({
    name: "",
    email: "",
    organization: "",
    role: "",
    wardSize: "",
    message: "",
    guestEmails: [""],
  });

  function updateField<K extends keyof ManualFormState>(field: K, value: ManualFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    normalizeGuestEmails(form.guestEmails);

    // Prototype — wire to API / CRM later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitting(false);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="manual-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="manual-name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldClassName}
            placeholder="Amaka Okafor"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="manual-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="manual-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClassName}
            placeholder="you@hospital.org"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="manual-organization"
            className="block text-sm font-medium text-ink-primary"
          >
            Hospital or organization
          </label>
          <input
            id="manual-organization"
            required
            value={form.organization}
            onChange={(event) => updateField("organization", event.target.value)}
            className={fieldClassName}
            placeholder="City General Hospital"
          />
        </div>

        <div>
          <label htmlFor="manual-role" className="block text-sm font-medium text-ink-primary">
            Your role
          </label>
          <select
            id="manual-role"
            required
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            className={fieldClassName}
          >
            <option value="" disabled>
              Select role
            </option>
            {demoRoleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="manual-ward-size" className="block text-sm font-medium text-ink-primary">
            Approx. ward size
          </label>
          <select
            id="manual-ward-size"
            value={form.wardSize}
            onChange={(event) => updateField("wardSize", event.target.value)}
            className={fieldClassName}
          >
            <option value="">Optional</option>
            {demoWardSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <GuestEmailFields
            idPrefix="manual-guest"
            emails={form.guestEmails}
            onChange={(guestEmails) => updateField("guestEmails", guestEmails)}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="manual-message" className="block text-sm font-medium text-ink-primary">
            {copy.anythingElseLabel}
          </label>
          <textarea
            id="manual-message"
            rows={4}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder={copy.manualMessagePlaceholder}
            className={`${fieldClassName} resize-none`}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className={signupPrimaryButtonClassName}>
        {submitting ? copy.submitting : copy.submitManual}
      </button>

      <p className="text-center text-xs leading-relaxed text-ink-secondary">
        {copy.manualPrivacyNote}
      </p>
    </form>
  );
}
