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
import { ShiftScheduleSection } from "@/components/admin/ShiftScheduleSection";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import {
  getStaffActivity,
  getStaffPresenceMap,
  getStaffRoster,
  getStaffRoleOptions,
  isStaffOnline,
  updateStaffMember,
  type StaffMember,
} from "@/lib/admin-staff";
import { getUpcomingAssignmentsForStaff } from "@/lib/admin-shift-schedule";
import { getOrganizationWards } from "@/lib/signup-session";
import { signUpCopy } from "@/lib/signup-content";
import { countStaffMissedAcks } from "@/lib/admin-audit";
import { formatTimestamp } from "@/lib/format";

function formatLastActivity(minutesAgo: number | null) {
  if (minutesAgo === null) return "No recent activity";
  if (minutesAgo < 1) return "Just now";
  if (minutesAgo === 1) return "1 minute ago";
  return `${minutesAgo} minutes ago`;
}

export function StaffRosterPageClient() {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminStaff;
  const [staff, setStaff] = useState(() => getStaffRoster());
  const wards = getOrganizationWards();
  const [roleOptions, setRoleOptions] = useState(() => getStaffRoleOptions());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRoleLabel, setEditRoleLabel] = useState("");
  const [editWard, setEditWard] = useState("");
  const [editShiftStart, setEditShiftStart] = useState("");
  const [editShiftEnd, setEditShiftEnd] = useState("");
  const [detailsMessage, setDetailsMessage] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [shiftMessage, setShiftMessage] = useState<string | null>(null);
  const [shiftError, setShiftError] = useState<string | null>(null);
  const [presenceVersion, setPresenceVersion] = useState(0);
  const [scheduleVersion, setScheduleVersion] = useState(0);

  function syncMemberToEditForm(member: StaffMember) {
    setEditFullName(member.fullName);
    setEditEmail(member.email);
    setEditRoleLabel(member.roleLabel);
    setEditWard(member.ward);
    setEditShiftStart(member.shiftStart);
    setEditShiftEnd(member.shiftEnd);
  }

  function refreshStaff() {
    const roster = getStaffRoster();
    setStaff(roster);
    setPresenceVersion((value) => value + 1);
    if (selectedId) {
      const member = roster.find((entry) => entry.id === selectedId);
      if (member) syncMemberToEditForm(member);
    }
  }

  if (!ready) return <PageLoadingFallback variant="embedded" />;

  const presence = getStaffPresenceMap();
  void presenceVersion;
  void scheduleVersion;
  const selectedMember = staff.find((entry) => entry.id === selectedId) ?? null;
  const selectedActivity = selectedMember ? getStaffActivity(selectedMember) : null;

  function handleSelectMember(member: StaffMember) {
    setSelectedId(member.id);
    syncMemberToEditForm(member);
    setDetailsMessage(null);
    setDetailsError(null);
    setShiftMessage(null);
    setShiftError(null);
  }

  function handleSaveDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMember) return;

    setDetailsError(null);
    setDetailsMessage(null);

    const result = updateStaffMember(selectedMember.id, {
      fullName: editFullName,
      email: editEmail,
      roleLabel: editRoleLabel,
    });

    if (!result.ok) {
      setDetailsError(result.message);
      return;
    }

    setDetailsMessage(copy.detailsSaved);
    refreshStaff();
    setRoleOptions(getStaffRoleOptions());
  }

  function handleSaveShift(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMember) return;

    setShiftError(null);
    setShiftMessage(null);

    const result = updateStaffMember(selectedMember.id, {
      ward: editWard,
      shiftStart: editShiftStart,
      shiftEnd: editShiftEnd,
    });

    if (!result.ok) {
      setShiftError(result.message);
      return;
    }

    setShiftMessage(copy.shiftSaved);
    refreshStaff();
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
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary md:text-base">{copy.subtitle}</p>
      </header>

      <TrialBanner />

      <ShiftScheduleSection onScheduleChange={() => setScheduleVersion((value) => value + 1)} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8 xl:col-span-7">
          <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.rosterTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.rosterBody}</p>

          <ul className="mt-6 space-y-3">
            {staff.map((member) => {
              const online = isStaffOnline(member.email);
              const activity = getStaffActivity(member);
              const login = presence.get(member.email);
              const missedAcks = countStaffMissedAcks(member);
              const upcoming = getUpcomingAssignmentsForStaff(member, 1)[0];

              return (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectMember(member)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      selectedId === member.id
                        ? "border-brand-core/40 bg-brand-core-muted/20"
                        : "border-line bg-surface-base hover:border-brand-core/20"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{member.fullName}</p>
                        <p className="text-sm text-ink-secondary">{member.email}</p>
                        <p className="mt-1 text-xs text-ink-secondary">
                          {member.roleLabel} · {member.ward} · {member.shiftStart}–{member.shiftEnd}
                        </p>
                        {upcoming ? (
                          <p className="mt-1 text-xs text-brand-core">
                            {copy.nextShiftLabel}: {upcoming.date} · {upcoming.ward} ·{" "}
                            {upcoming.shiftStart}–{upcoming.shiftEnd}
                          </p>
                        ) : null}
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            online
                              ? "bg-brand-core-muted text-brand-core"
                              : "bg-surface-card text-ink-secondary ring-1 ring-line"
                          }`}
                        >
                          {online ? copy.statusOnline : copy.statusOffline}
                        </span>
                        {login ? (
                          <p className="mt-2 text-xs text-ink-secondary" suppressHydrationWarning>
                            {copy.signedInAt(formatTimestamp(new Date(login.loggedInAt)).relative)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
                      {activity.recentEvents} {copy.eventsThisShift} ·{" "}
                      {formatLastActivity(activity.lastEventMinutesAgo)}
                      {activity.lastEventSummary ? ` — ${activity.lastEventSummary}` : ""}
                    </p>
                    {missedAcks > 0 ? (
                      <p className="mt-2 text-xs font-medium text-critical">
                        {missedAcks} missed or pending acknowledgement{missedAcks === 1 ? "" : "s"}
                      </p>
                    ) : null}
                    <Link
                      href={`/admin/audit?staff=${encodeURIComponent(member.email)}`}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-block text-xs font-medium text-brand-core hover:underline"
                    >
                      {copy.viewAuditCta} →
                    </Link>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="space-y-6 xl:col-span-5">
          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.detailsTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.detailsBody}</p>

            {!selectedMember ? (
              <p className="mt-6 text-sm leading-relaxed text-ink-secondary">{copy.selectStaff}</p>
            ) : (
              <form onSubmit={handleSaveDetails} className={`mt-6 ${signupFormStackClassName}`}>
                <div>
                  <label htmlFor="staff-full-name" className="block text-sm font-medium text-ink-primary">
                    {copy.fullNameLabel}
                  </label>
                  <input
                    id="staff-full-name"
                    value={editFullName}
                    onChange={(event) => setEditFullName(event.target.value)}
                    className={signupInputClassName}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="staff-email" className="block text-sm font-medium text-ink-primary">
                    {copy.emailLabel}
                  </label>
                  <input
                    id="staff-email"
                    type="email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className={signupInputClassName}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="staff-role" className="block text-sm font-medium text-ink-primary">
                    {copy.roleLabel}
                  </label>
                  <select
                    id="staff-role"
                    value={editRoleLabel}
                    onChange={(event) => setEditRoleLabel(event.target.value)}
                    className={signupInputClassName}
                    required
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {detailsError ? (
                  <p className="text-sm text-critical" role="alert">
                    {detailsError}
                  </p>
                ) : null}

                {detailsMessage ? (
                  <p className="text-sm text-brand-core" role="status">
                    {detailsMessage}
                  </p>
                ) : null}

                <button type="submit" className={`${signupPrimaryButtonClassName} max-w-xs`}>
                  {copy.saveDetailsCta}
                </button>
              </form>
            )}
          </section>

          <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.shiftTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.shiftBody}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.schedule.publishedBody}</p>

            {!selectedMember ? (
              <p className="mt-6 text-sm leading-relaxed text-ink-secondary">{copy.selectStaff}</p>
            ) : (
              <form onSubmit={handleSaveShift} className={`mt-6 ${signupFormStackClassName}`}>
                <div>
                  <label htmlFor="staff-shift-ward" className="block text-sm font-medium text-ink-primary">
                    {copy.wardLabel}
                  </label>
                  {wards.length > 0 ? (
                    <select
                      id="staff-shift-ward"
                      value={editWard}
                      onChange={(event) => setEditWard(event.target.value)}
                      className={signupInputClassName}
                    >
                      {wards.map((ward) => (
                        <option key={ward} value={ward}>
                          {ward}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="staff-shift-ward"
                      value={editWard}
                      onChange={(event) => setEditWard(event.target.value)}
                      className={signupInputClassName}
                    />
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="staff-shift-start"
                      className="block text-sm font-medium text-ink-primary"
                    >
                      {copy.shiftStartLabel}
                    </label>
                    <input
                      id="staff-shift-start"
                      type="time"
                      value={editShiftStart}
                      onChange={(event) => setEditShiftStart(event.target.value)}
                      className={signupInputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="staff-shift-end" className="block text-sm font-medium text-ink-primary">
                      {copy.shiftEndLabel}
                    </label>
                    <input
                      id="staff-shift-end"
                      type="time"
                      value={editShiftEnd}
                      onChange={(event) => setEditShiftEnd(event.target.value)}
                      className={signupInputClassName}
                      required
                    />
                  </div>
                </div>

                {shiftError ? (
                  <p className="text-sm text-critical" role="alert">
                    {shiftError}
                  </p>
                ) : null}

                {shiftMessage ? (
                  <p className="text-sm text-brand-core" role="status">
                    {shiftMessage}
                  </p>
                ) : null}

                <button type="submit" className={`${signupSecondaryButtonClassName} max-w-xs`}>
                  {copy.saveShiftCta}
                </button>
              </form>
            )}
          </section>

          {selectedMember && selectedActivity ? (
            <section className="mt-6 rounded-xl border border-line bg-surface-base p-6">
              <h3 className="font-display text-base font-semibold text-ink-primary">
                {copy.activityTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.activityBody}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-ink-secondary">{copy.activityEventsLabel}</dt>
                  <dd className="font-medium text-ink-primary">{selectedActivity.recentEvents}</dd>
                </div>
                <div>
                  <dt className="text-ink-secondary">{copy.activityLastLabel}</dt>
                  <dd className="font-medium text-ink-primary">
                    {selectedActivity.lastEventSummary ?? copy.activityNone}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-ink-secondary">{copy.activityNote}</p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
