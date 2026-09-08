"use client";

import { inputClassName } from "@/lib/design-system/variants";
import { bookDemoPanelCopy } from "@/lib/book-demo-content";

interface GuestEmailFieldsProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  idPrefix?: string;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function GuestEmailFields({
  emails,
  onChange,
  idPrefix = "guest-email",
}: GuestEmailFieldsProps) {
  const copy = bookDemoPanelCopy;

  function updateEmail(index: number, value: string) {
    onChange(emails.map((email, i) => (i === index ? value : email)));
  }

  function addEmail() {
    onChange([...emails, ""]);
  }

  function removeEmail(index: number) {
    onChange(emails.filter((_, i) => i !== index));
  }

  const rows = emails.length > 0 ? emails : [""];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="block text-sm font-medium text-ink-primary">
          {copy.guestEmailsLabel}
        </label>
        <span className="text-xs text-ink-secondary">{copy.guestEmailsHint}</span>
      </div>
      <ul className="mt-2 space-y-2">
        {rows.map((email, index) => (
          <li key={`${idPrefix}-${index}`} className="flex gap-2">
            <input
              id={`${idPrefix}-${index}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => updateEmail(index, event.target.value)}
              placeholder={copy.guestEmailsPlaceholder}
              className={inputClassName}
              aria-invalid={email.length > 0 && !isValidEmail(email)}
            />
            {rows.length > 1 ? (
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="shrink-0 rounded-md border border-line px-3 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
              >
                {copy.removeGuestEmail}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addEmail}
        className="mt-2 text-sm font-medium text-brand-core hover:underline"
      >
        + {copy.addGuestEmail}
      </button>
    </div>
  );
}

export function normalizeGuestEmails(emails: string[]) {
  const seen = new Set<string>();
  return emails
    .map((email) => email.trim().toLowerCase())
    .filter((email) => {
      if (!email || !isValidEmail(email) || seen.has(email)) return false;
      seen.add(email);
      return true;
    });
}
