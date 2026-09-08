"use client";

import { useState } from "react";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { signUpCopy } from "@/lib/signup-content";
import {
  addOrgAdministrator,
  getOrgAdministrators,
  removeOrgAdministrator,
} from "@/lib/signup-session";

export function OrgAdministratorsSection() {
  const copy = signUpCopy.adminSetup;
  const [admins, setAdmins] = useState(() => getOrgAdministrators());
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function refreshAdmins() {
    setAdmins(getOrgAdministrators());
  }

  function handleAddAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const result = addOrgAdministrator(fullName, email);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setFullName("");
    setEmail("");
    setSuccess(copy.orgAdminsAdded);
    refreshAdmins();
  }

  function handleRemoveAdmin(adminEmail: string) {
    setError(null);
    setSuccess(null);

    const result = removeOrgAdministrator(adminEmail);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    refreshAdmins();
  }

  return (
    <section className="rounded-xl border border-brand-core/25 bg-brand-core-muted/20 p-6 md:p-8">
      <h2 className="font-display text-lg font-semibold text-ink-primary">
        {copy.orgAdminsSectionTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.orgAdminsSectionBody}</p>

      <div className="mt-6">
        <p className="text-sm font-medium text-ink-primary">{copy.orgAdminsCurrentTitle}</p>
        {admins.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.orgAdminsEmpty}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {admins.map((admin) => (
              <li
                key={admin.email}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-primary">{admin.fullName}</p>
                    <span className="rounded-full bg-surface-base px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink-secondary ring-1 ring-line">
                      {admin.isPrimary ? copy.orgAdminsPrimaryLabel : copy.orgAdminsCoAdminLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-secondary">{admin.email}</p>
                </div>
                {!admin.isPrimary ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveAdmin(admin.email)}
                    className="text-sm font-medium text-ink-secondary hover:text-critical"
                  >
                    {copy.orgAdminsRemove}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAddAdmin} className={`mt-6 border-t border-line pt-6 ${signupFormStackClassName}`}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="org-admin-name" className="block text-sm font-medium text-ink-primary">
              {copy.fullNameLabel}
            </label>
            <input
              id="org-admin-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={signupInputClassName}
              placeholder="James Okonkwo"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="org-admin-email" className="block text-sm font-medium text-ink-primary">
              {copy.emailLabel}
            </label>
            <input
              id="org-admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={signupInputClassName}
              placeholder="it@citygeneral.org"
              autoComplete="email"
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-critical" role="alert">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="text-sm text-brand-core" role="status">
            {success}
          </p>
        ) : null}

        <button type="submit" className={`${signupSecondaryButtonClassName} max-w-xs`}>
          {copy.orgAdminsAddCta}
        </button>
      </form>
    </section>
  );
}
