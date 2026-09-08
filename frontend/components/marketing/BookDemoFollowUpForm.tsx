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
import type { DemoSlotSelection } from "@/lib/demo-scheduling";
import { formatDemoSlotSummary, isValidDemoBooking } from "@/lib/demo-scheduling";

interface BookDemoFollowUpFormProps {
  booking: DemoSlotSelection;
  onSubmit: () => void;
}

interface FollowUpState {
  name: string;
  email: string;
  organization: string;
  role: string;
  wardSize: string;
  message: string;
  guestEmails: string[];
}

export function BookDemoFollowUpForm({ booking, onSubmit }: BookDemoFollowUpFormProps) {
  const copy = bookDemoPanelCopy;
  const fieldClassName = cn(inputClassName, "text-base sm:text-sm");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FollowUpState>({
    name: booking.attendeeName ?? "",
    email: booking.attendeeEmail ?? "",
    organization: "",
    role: "",
    wardSize: "",
    message: "",
    guestEmails: [""],
  });

  function updateField<K extends keyof FollowUpState>(field: K, value: FollowUpState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidDemoBooking(booking)) return;

    setSubmitting(true);
    normalizeGuestEmails(form.guestEmails);

    // Prototype — wire to API / CRM later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitting(false);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-brand-core/25 bg-brand-core-muted/40 px-4 py-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
          Confirmed slot
        </p>
        <p className="mt-1 text-sm font-medium text-ink-primary">
          {formatDemoSlotSummary(booking)}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="follow-up-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="follow-up-name"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="follow-up-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="follow-up-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="follow-up-organization"
            className="block text-sm font-medium text-ink-primary"
          >
            Hospital or organization
          </label>
          <input
            id="follow-up-organization"
            required
            value={form.organization}
            onChange={(event) => updateField("organization", event.target.value)}
            className={fieldClassName}
            placeholder="City General Hospital"
          />
        </div>

        <div>
          <label htmlFor="follow-up-role" className="block text-sm font-medium text-ink-primary">
            Your role
          </label>
          <select
            id="follow-up-role"
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
          <label
            htmlFor="follow-up-ward-size"
            className="block text-sm font-medium text-ink-primary"
          >
            Approx. ward size
          </label>
          <select
            id="follow-up-ward-size"
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
            idPrefix="follow-up-guest"
            emails={form.guestEmails}
            onChange={(guestEmails) => updateField("guestEmails", guestEmails)}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="follow-up-message" className="block text-sm font-medium text-ink-primary">
            {copy.anythingElseLabel}
          </label>
          <textarea
            id="follow-up-message"
            rows={4}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder={copy.anythingElsePlaceholder}
            className={`${fieldClassName} resize-none`}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className={signupPrimaryButtonClassName}>
        {submitting ? copy.submitting : copy.submitFollowUp}
      </button>
    </form>
  );
}
