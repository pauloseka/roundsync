"use client";

import { useState } from "react";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupPrimaryButtonClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { OrgAdministratorsSection } from "@/components/admin/OrgAdministratorsSection";
import { WardNamesSection } from "@/components/admin/WardNamesSection";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import {
  adminPermissionScopes,
  adminRoleTemplates,
  getAdminRoleById,
  type AdminInviteDraft,
  type AdminPermissionScope,
  type AdminRoleId,
} from "@/lib/admin-setup-data";
import { signUpCopy } from "@/lib/signup-content";
import {
  ALL_WARDS_ASSIGNMENT,
  TRIAL_DAYS,
  dismissInviteStaffPrompt,
  getOrganizationWards,
  isTrialActive,
} from "@/lib/signup-session";

function createInviteId() {
  return `invite-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminSetupPageClient() {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminSetup;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<AdminRoleId>("nursing");
  const [organizationWards, setOrganizationWards] = useState(() => getOrganizationWards());
  const [ward, setWard] = useState(() => {
    const wards = getOrganizationWards();
    return wards[0] ?? "";
  });
  const [permissionScope, setPermissionScope] = useState<AdminPermissionScope>("ward_only");
  const [invites, setInvites] = useState<AdminInviteDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedRole = getAdminRoleById(roleId);
  const trialActive = isTrialActive();

  function handleRoleChange(nextRoleId: AdminRoleId) {
    setRoleId(nextRoleId);
    if (nextRoleId === "front_desk" || nextRoleId === "ward_admin") {
      setPermissionScope("operations");
    }
  }

  function handleWardsChange(wards: string[]) {
    setOrganizationWards(wards);
    setWard((current) => {
      if (current && (wards.includes(current) || current === ALL_WARDS_ASSIGNMENT)) {
        return current;
      }
      return wards[0] ?? "";
    });
  }

  const wardInviteOptions =
    organizationWards.length > 0
      ? [...organizationWards, ALL_WARDS_ASSIGNMENT]
      : [];

  if (!ready) return <PageLoadingFallback variant="embedded" />;

  function handleAddInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Enter a name and work email.");
      return;
    }

    if (!ward) {
      setError(copy.wardsEmpty);
      return;
    }

    setInvites((prev) => [
      ...prev,
      {
        id: createInviteId(),
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        roleId,
        ward,
        permissionScope,
        status: "draft",
      },
    ]);

    setFullName("");
    setEmail("");
  }

  function removeInvite(id: string) {
    setInvites((prev) => prev.filter((invite) => invite.id !== id));
    setSent(false);
  }

  async function handleSendInvites() {
    if (invites.length === 0) {
      setError("Add at least one team member before sending invites.");
      return;
    }

    setError(null);
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setInvites((prev) => prev.map((invite) => ({ ...invite, status: "sent" as const })));
    setSending(false);
    setSent(true);
    dismissInviteStaffPrompt();
  }

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          {copy.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary md:text-3xl">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary md:text-base">
          {copy.subtitle}
        </p>
        {trialActive ? (
          <p className="mt-3 rounded-lg border border-brand-core/25 bg-brand-core-muted/40 px-4 py-3 text-sm leading-relaxed text-ink-primary">
            {copy.trialNote(TRIAL_DAYS)}
          </p>
        ) : null}
      </header>

      <TrialBanner />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <OrgAdministratorsSection />

          <WardNamesSection onWardsChange={handleWardsChange} />

          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">
              {copy.inviteSectionTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              {copy.inviteSectionBody}
            </p>

            <form onSubmit={handleAddInvite} className={`mt-6 ${signupFormStackClassName}`}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="admin-invite-name" className="block text-sm font-medium text-ink-primary">
                    {copy.fullNameLabel}
                  </label>
                  <input
                    id="admin-invite-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className={signupInputClassName}
                    placeholder="Sarah Mitchell"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="admin-invite-email" className="block text-sm font-medium text-ink-primary">
                    {copy.emailLabel}
                  </label>
                  <input
                    id="admin-invite-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={signupInputClassName}
                    placeholder="sarah@citygeneral.org"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="admin-invite-role" className="block text-sm font-medium text-ink-primary">
                    {copy.roleLabel}
                  </label>
                  <select
                    id="admin-invite-role"
                    value={roleId}
                    onChange={(event) => handleRoleChange(event.target.value as AdminRoleId)}
                    className={signupInputClassName}
                  >
                    {adminRoleTemplates.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label} ({role.abbrev})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="admin-invite-ward" className="block text-sm font-medium text-ink-primary">
                    {copy.wardLabel}
                  </label>
                  {wardInviteOptions.length === 0 ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.wardsEmpty}</p>
                  ) : (
                    <select
                      id="admin-invite-ward"
                      value={ward}
                      onChange={(event) => setWard(event.target.value)}
                      className={signupInputClassName}
                    >
                      {wardInviteOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-ink-primary">{copy.scopeLabel}</p>
                  <div className="mt-3 space-y-2">
                    {adminPermissionScopes.map((scope) => (
                      <label
                        key={scope.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 transition-colors hover:border-brand-core/30"
                      >
                        <input
                          type="radio"
                          name="permission-scope"
                          value={scope.id}
                          checked={permissionScope === scope.id}
                          onChange={() => setPermissionScope(scope.id)}
                          className="mt-0.5 size-4 border-line text-brand-core focus:ring-brand-core"
                        />
                        <span>
                          <span className="block text-sm font-medium text-ink-primary">
                            {scope.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-ink-secondary">
                            {scope.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error ? (
                <p className="text-sm text-critical" role="alert">
                  {error}
                </p>
              ) : null}

              <button type="submit" className={`${signupSecondaryButtonClassName} max-w-xs`}>
                {copy.addInviteCta}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.pendingTitle}</h2>

            {invites.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{copy.pendingEmpty}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {invites.map((invite) => {
                  const role = getAdminRoleById(invite.roleId);
                  const scope = adminPermissionScopes.find((item) => item.id === invite.permissionScope);

                  return (
                    <li
                      key={invite.id}
                      className="flex flex-col gap-3 rounded-lg border border-line bg-surface-base p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{invite.fullName}</p>
                        <p className="text-sm text-ink-secondary">{invite.email}</p>
                        <p className="mt-1 text-xs text-ink-secondary">
                          {role.label} · {invite.ward} · {scope?.label}
                          {invite.status === "sent" ? " · Sent" : ""}
                        </p>
                      </div>
                      {invite.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => removeInvite(invite.id)}
                          className="text-sm font-medium text-ink-secondary hover:text-critical"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}

            {sent ? (
              <p className="mt-4 text-sm text-brand-core" role="status">
                {copy.invitesSent}
              </p>
            ) : null}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSendInvites}
                disabled={sending || invites.length === 0}
                className={`${signupPrimaryButtonClassName} max-w-xs`}
              >
                {sending ? copy.sendingInvites : copy.sendInvitesCta}
              </button>
            </div>
          </section>
        </div>

        <aside className="xl:col-span-5">
          <section className="rounded-xl border border-line bg-surface-card p-6">
            <h2 className="font-display text-lg font-semibold text-ink-primary">
              {copy.rolesSectionTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.rolesSectionBody}</p>

            <ul className="mt-6 space-y-4">
              {adminRoleTemplates.map((role) => (
                <li
                  key={role.id}
                  className={`rounded-lg border p-4 ${
                    role.id === selectedRole.id
                      ? "border-brand-core/40 bg-brand-core-muted/30"
                      : "border-line bg-surface-base"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-primary">{role.label}</p>
                      <p className="text-xs text-ink-secondary">{role.abbrev}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{role.description}</p>
                  <ul className="mt-3 space-y-1">
                    {role.permissions.map((permission) => (
                      <li key={permission} className="text-xs text-ink-secondary">
                        · {permission}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-6 rounded-lg border border-line bg-surface-base px-4 py-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
              Selected template
            </p>
            <p className="mt-2 text-sm font-medium text-ink-primary">
              {selectedRole.label} ({selectedRole.abbrev})
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
              {selectedRole.description}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
