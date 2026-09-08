"use client";

import Link from "next/link";
import { useState } from "react";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupPrimaryButtonClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import {
  addAllowedCidr,
  approveDevice,
  getNetworkSecurityPolicy,
  getRegisteredDevices,
  getSecurityEvents,
  rejectDevice,
  removeAllowedCidr,
  revokeDevice,
  saveNetworkSecurityPolicy,
  type DevicePolicyMode,
  type OutOfNetworkAction,
  type RegisteredDevice,
  type SecurityAuditEvent,
  type SecurityEventType,
} from "@/lib/admin-network-security";
import { signUpCopy } from "@/lib/signup-content";
import { formatTimestamp } from "@/lib/format";

function DeviceRow({
  device,
  copy,
  onApprove,
  onReject,
  onRevoke,
}: {
  device: RegisteredDevice;
  copy: (typeof signUpCopy)["adminNetworkSecurity"];
  onApprove?: () => void;
  onReject?: () => void;
  onRevoke?: () => void;
}) {
  return (
    <li className="rounded-lg border border-line bg-surface-base p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-primary">{device.label}</p>
          <p className="text-sm text-ink-secondary">{device.platform}</p>
          <p className="mt-1 text-xs text-ink-secondary">
            {device.lastSeenIp}
            {device.wardHint ? ` · ${device.wardHint}` : ""}
          </p>
          <p className="mt-1 text-xs text-ink-secondary">{copy.registeredBy(device.registeredByName)}</p>
          <p className="mt-1 text-xs text-ink-secondary" suppressHydrationWarning>
            {copy.lastSeen(formatTimestamp(new Date(device.lastSeenAt)).relative)}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {device.status === "pending" && onApprove && onReject ? (
            <>
              <button type="button" onClick={onApprove} className={signupPrimaryButtonClassName}>
                {copy.approveCta}
              </button>
              <button type="button" onClick={onReject} className={signupSecondaryButtonClassName}>
                {copy.rejectCta}
              </button>
            </>
          ) : null}
          {device.status === "approved" && onRevoke ? (
            <button type="button" onClick={onRevoke} className={signupSecondaryButtonClassName}>
              {copy.revokeCta}
            </button>
          ) : null}
          {device.status === "revoked" ? (
            <span className="inline-flex rounded-full bg-surface-card px-2.5 py-0.5 text-xs font-medium text-ink-secondary ring-1 ring-line">
              {copy.revokedLabel}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function SecurityEventRow({
  event,
  copy,
}: {
  event: SecurityAuditEvent;
  copy: (typeof signUpCopy)["adminNetworkSecurity"];
}) {
  const isCritical =
    event.type === "access_blocked_out_of_network" ||
    event.type === "unregistered_device_attempt";

  return (
    <li className="rounded-lg border border-line bg-surface-base p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isCritical
                ? "bg-critical/10 text-critical"
                : "bg-brand-core-muted text-brand-core"
            }`}
          >
            {copy.eventTypes[event.type as SecurityEventType]}
          </span>
          <p className="mt-2 text-sm text-ink-primary">{event.summary}</p>
          <p className="mt-1 text-xs text-ink-secondary">
            {event.actorName ?? "System"} · {event.ipAddress}
            {event.deviceLabel ? ` · ${event.deviceLabel}` : ""}
          </p>
        </div>
        <p className="shrink-0 text-xs text-ink-secondary" suppressHydrationWarning>
          {formatTimestamp(new Date(event.occurredAt)).relative}
        </p>
      </div>
    </li>
  );
}

export function AdminNetworkDevicesPageClient() {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminNetworkSecurity;

  const initialPolicy = getNetworkSecurityPolicy();
  const [enabled, setEnabled] = useState(initialPolicy.enabled);
  const [requireVpn, setRequireVpn] = useState(initialPolicy.requireVpn);
  const [deviceMode, setDeviceMode] = useState<DevicePolicyMode>(initialPolicy.deviceMode);
  const [outOfNetworkAction, setOutOfNetworkAction] = useState<OutOfNetworkAction>(
    initialPolicy.outOfNetworkAction,
  );
  const [allowedCidrs, setAllowedCidrs] = useState(initialPolicy.allowedCidrs);
  const [alertEmails, setAlertEmails] = useState(initialPolicy.alertEmails);
  const [newCidr, setNewCidr] = useState("");
  const [newAlertEmail, setNewAlertEmail] = useState("");
  const [devices, setDevices] = useState(() => getRegisteredDevices());
  const [events, setEvents] = useState(() => getSecurityEvents());
  const [policyMessage, setPolicyMessage] = useState<string | null>(null);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [cidrError, setCidrError] = useState<string | null>(null);

  function refresh() {
    const policy = getNetworkSecurityPolicy();
    setEnabled(policy.enabled);
    setRequireVpn(policy.requireVpn);
    setDeviceMode(policy.deviceMode);
    setOutOfNetworkAction(policy.outOfNetworkAction);
    setAllowedCidrs(policy.allowedCidrs);
    setAlertEmails(policy.alertEmails);
    setDevices(getRegisteredDevices());
    setEvents(getSecurityEvents());
  }

  if (!ready) return <PageLoadingFallback variant="embedded" />;

  const pendingDevices = devices.filter((device) => device.status === "pending");
  const approvedDevices = devices.filter((device) => device.status === "approved");

  function handleSavePolicy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPolicyError(null);
    setPolicyMessage(null);

    const result = saveNetworkSecurityPolicy({
      enabled,
      requireVpn,
      deviceMode,
      outOfNetworkAction,
      allowedCidrs,
      alertEmails,
    });

    if (!result.ok) {
      setPolicyError(result.message);
      return;
    }

    setPolicyMessage(copy.policySaved);
    refresh();
  }

  function handleAddCidr() {
    setCidrError(null);
    const result = addAllowedCidr(newCidr);
    if (!result.ok) {
      setCidrError(result.message);
      return;
    }
    setNewCidr("");
    refresh();
  }

  function handleRemoveCidr(cidr: string) {
    removeAllowedCidr(cidr);
    refresh();
  }

  function handleAddAlertEmail() {
    const trimmed = newAlertEmail.trim().toLowerCase();
    if (!trimmed || alertEmails.includes(trimmed)) {
      setNewAlertEmail("");
      return;
    }
    setAlertEmails((current) => [...current, trimmed]);
    setNewAlertEmail("");
  }

  function handleRemoveAlertEmail(email: string) {
    setAlertEmails((current) => current.filter((entry) => entry !== email));
  }

  function handleApprove(id: string) {
    approveDevice(id);
    refresh();
  }

  function handleReject(id: string) {
    rejectDevice(id);
    refresh();
  }

  function handleRevoke(id: string) {
    revokeDevice(id);
    refresh();
  }

  const deviceModeOptions: { value: DevicePolicyMode; label: string; hint: string }[] = [
    { value: "open", label: copy.deviceModeOpen, hint: copy.deviceModeOpenHint },
    {
      value: "registered_only",
      label: copy.deviceModeRegistered,
      hint: copy.deviceModeRegisteredHint,
    },
    { value: "registered_and_in_network", label: copy.deviceModeBoth, hint: copy.deviceModeBothHint },
  ];

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          {copy.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary md:text-3xl">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary md:text-base">{copy.subtitle}</p>
      </header>

      <TrialBanner />

      <p className="rounded-lg border border-line bg-surface-base px-4 py-3 text-sm leading-relaxed text-ink-secondary">
        {copy.prototypeNote}
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <form onSubmit={handleSavePolicy} className="space-y-6">
            <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.networkTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.networkBody}</p>

              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-line text-brand-core focus:ring-brand-core"
                />
                <span>
                  <span className="block text-sm font-medium text-ink-primary">
                    {copy.networkEnabledLabel}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-secondary">
                    {copy.networkEnabledHint}
                  </span>
                </span>
              </label>

              <div className={`mt-6 ${enabled ? "" : "pointer-events-none opacity-50"}`}>
                <p className="text-sm font-medium text-ink-primary">{copy.cidrLabel}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{copy.cidrHint}</p>

                <ul className="mt-4 space-y-2">
                  {allowedCidrs.map((cidr) => (
                    <li
                      key={cidr}
                      className="flex items-center justify-between rounded-lg border border-line bg-surface-base px-3 py-2"
                    >
                      <code className="text-sm text-ink-primary">{cidr}</code>
                      <button
                        type="button"
                        onClick={() => handleRemoveCidr(cidr)}
                        className="text-xs font-medium text-brand-core hover:underline"
                      >
                        {copy.removeCidr}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label htmlFor="new-cidr" className="sr-only">
                      {copy.cidrLabel}
                    </label>
                    <input
                      id="new-cidr"
                      value={newCidr}
                      onChange={(event) => setNewCidr(event.target.value)}
                      placeholder={copy.cidrPlaceholder}
                      className={signupInputClassName}
                    />
                  </div>
                  <button type="button" onClick={handleAddCidr} className={signupSecondaryButtonClassName}>
                    {copy.addCidrCta}
                  </button>
                </div>

                {cidrError ? (
                  <p className="mt-2 text-sm text-critical" role="alert">
                    {cidrError}
                  </p>
                ) : null}

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={requireVpn}
                    onChange={(event) => setRequireVpn(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-line text-brand-core focus:ring-brand-core"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink-primary">
                      {copy.requireVpnLabel}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-secondary">
                      {copy.requireVpnHint}
                    </span>
                  </span>
                </label>

                <fieldset className="mt-6">
                  <legend className="text-sm font-medium text-ink-primary">{copy.outOfNetworkLabel}</legend>
                  <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface-base px-3 py-2">
                      <input
                        type="radio"
                        name="out-of-network"
                        checked={outOfNetworkAction === "block"}
                        onChange={() => setOutOfNetworkAction("block")}
                        className="h-4 w-4 border-line text-brand-core focus:ring-brand-core"
                      />
                      <span className="text-sm text-ink-primary">{copy.outOfNetworkBlock}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface-base px-3 py-2">
                      <input
                        type="radio"
                        name="out-of-network"
                        checked={outOfNetworkAction === "alert_only"}
                        onChange={() => setOutOfNetworkAction("alert_only")}
                        className="h-4 w-4 border-line text-brand-core focus:ring-brand-core"
                      />
                      <span className="text-sm text-ink-primary">{copy.outOfNetworkAlert}</span>
                    </label>
                  </div>
                </fieldset>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.deviceTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.deviceBody}</p>

              <fieldset className={`mt-6 ${signupFormStackClassName}`}>
                {deviceModeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-surface-base p-4"
                  >
                    <input
                      type="radio"
                      name="device-mode"
                      checked={deviceMode === option.value}
                      onChange={() => setDeviceMode(option.value)}
                      className="mt-1 h-4 w-4 border-line text-brand-core focus:ring-brand-core"
                    />
                    <span>
                      <span className="block text-sm font-medium text-ink-primary">{option.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-secondary">
                        {option.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </section>

            <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.alertsTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.alertsBody}</p>

              <div className={`mt-6 ${signupFormStackClassName}`}>
                <p className="text-sm font-medium text-ink-primary">{copy.alertEmailLabel}</p>
                <p className="text-xs leading-relaxed text-ink-secondary">{copy.alertEmailHint}</p>

                {alertEmails.length > 0 ? (
                  <ul className="space-y-2">
                    {alertEmails.map((email) => (
                      <li
                        key={email}
                        className="flex items-center justify-between rounded-lg border border-line bg-surface-base px-3 py-2"
                      >
                        <span className="text-sm text-ink-primary">{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAlertEmail(email)}
                          className="text-xs font-medium text-brand-core hover:underline"
                        >
                          {copy.removeCidr}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label htmlFor="alert-email" className="sr-only">
                      {copy.alertEmailLabel}
                    </label>
                    <input
                      id="alert-email"
                      type="email"
                      value={newAlertEmail}
                      onChange={(event) => setNewAlertEmail(event.target.value)}
                      placeholder={copy.alertEmailPlaceholder}
                      className={signupInputClassName}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAlertEmail}
                    className={signupSecondaryButtonClassName}
                  >
                    {copy.addAlertEmailCta}
                  </button>
                </div>
              </div>

              {policyError ? (
                <p className="mt-4 text-sm text-critical" role="alert">
                  {policyError}
                </p>
              ) : null}

              {policyMessage ? (
                <p className="mt-4 text-sm text-brand-core" role="status">
                  {policyMessage}
                </p>
              ) : null}

              <button type="submit" className={`mt-6 ${signupPrimaryButtonClassName} max-w-xs`}>
                {copy.savePolicyCta}
              </button>
            </section>
          </form>
        </div>

        <aside className="space-y-6 xl:col-span-5">
          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.pendingTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.pendingBody}</p>

            {pendingDevices.length === 0 ? (
              <p className="mt-6 text-sm text-ink-secondary">{copy.pendingEmpty}</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {pendingDevices.map((device) => (
                  <DeviceRow
                    key={device.id}
                    device={device}
                    copy={copy}
                    onApprove={() => handleApprove(device.id)}
                    onReject={() => handleReject(device.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.approvedTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.approvedBody}</p>

            {approvedDevices.length === 0 ? (
              <p className="mt-6 text-sm text-ink-secondary">{copy.approvedEmpty}</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {approvedDevices.map((device) => (
                  <DeviceRow
                    key={device.id}
                    device={device}
                    copy={copy}
                    onRevoke={() => handleRevoke(device.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.eventsTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.eventsBody}</p>
              </div>
              <Link
                href="/admin/audit?category=security"
                className="shrink-0 text-sm font-medium text-brand-core hover:underline"
              >
                {copy.viewAllAudit} →
              </Link>
            </div>

            {events.length === 0 ? (
              <p className="mt-6 text-sm text-ink-secondary">{copy.eventsEmpty}</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {events.slice(0, 5).map((event) => (
                  <SecurityEventRow key={event.id} event={event} copy={copy} />
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
