"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { deferStateUpdate } from "@/lib/defer-state-update";
import { AuditEntryItem } from "@/components/audit/AuditEntryItem";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { signupInputClassName } from "@/components/signup/signup-form-styles";
import { getStaffRoster, type StaffMember } from "@/lib/admin-staff";
import {
  filterAdminAuditEntries,
  formatAlertStatus,
  formatEscalationReason,
  getAdminAuditFilterCounts,
  getAdminAuditWardOptions,
  getDefaultAuditDateRange,
  getEscalationIncidents,
  getMissedAcknowledgements,
  getStaffEscalationSteps,
  getStaffMissedAcknowledgements,
  type AdminAuditCategoryFilter,
  type AdminAuditDateRange,
  type AdminAuditTimeFilter,
} from "@/lib/admin-audit";
import { signUpCopy } from "@/lib/signup-content";

function findStaffByEmail(staff: StaffMember[], email: string | null): StaffMember | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return staff.find((member) => member.email === normalized) ?? null;
}

const categoryFilters: AdminAuditCategoryFilter[] = [
  "all",
  "cases",
  "tasks",
  "escalations",
  "acknowledgements",
];

const categoryLabelKeys: Record<AdminAuditCategoryFilter, string> = {
  all: signUpCopy.adminAudit.categoryAll,
  cases: signUpCopy.adminAudit.categoryCases,
  tasks: signUpCopy.adminAudit.categoryTasks,
  escalations: signUpCopy.adminAudit.categoryEscalations,
  acknowledgements: signUpCopy.adminAudit.categoryAcknowledgements,
};

export function AdminAuditPageClient() {
  const ready = useAdminGuard();
  const copy = signUpCopy.adminAudit;
  const searchParams = useSearchParams();
  const staffEmailParam = searchParams.get("staff");

  const [staff, setStaff] = useState(() => getStaffRoster());
  const [selectedEmail, setSelectedEmail] = useState(() => {
    const roster = getStaffRoster();
    return findStaffByEmail(roster, staffEmailParam)?.email ?? "";
  });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AdminAuditCategoryFilter>("all");
  const [ward, setWard] = useState("");
  const [time, setTime] = useState<AdminAuditTimeFilter>("all");
  const [dateRange, setDateRange] = useState<AdminAuditDateRange>(() => getDefaultAuditDateRange());

  useEffect(() => {
    deferStateUpdate(() => {
      const roster = getStaffRoster();
      setStaff(roster);
      const fromUrl = findStaffByEmail(roster, staffEmailParam);
      setSelectedEmail(fromUrl?.email ?? "");
    });
  }, [staffEmailParam]);

  const selectedMember = useMemo(
    () => staff.find((member) => member.email === selectedEmail) ?? null,
    [staff, selectedEmail],
  );

  const wardOptions = useMemo(() => getAdminAuditWardOptions(selectedMember), [selectedMember]);

  const customRangeInvalid =
    time === "custom" && dateRange.from && dateRange.to && dateRange.from > dateRange.to;

  const filterCounts = useMemo(
    () => getAdminAuditFilterCounts(selectedMember, ward, time, dateRange),
    [selectedMember, ward, time, dateRange],
  );

  const auditEntries = useMemo(
    () =>
      filterAdminAuditEntries({
        staff: selectedMember,
        query,
        category,
        ward,
        time,
        dateRange: time === "custom" ? dateRange : undefined,
      }),
    [selectedMember, query, category, ward, time, dateRange],
  );

  const escalationIncidents = useMemo(() => getEscalationIncidents(), []);
  const missedAcks = useMemo(
    () => (selectedMember ? getStaffMissedAcknowledgements(selectedMember) : getMissedAcknowledgements()),
    [selectedMember],
  );
  const staffEscalationSteps = useMemo(
    () => (selectedMember ? getStaffEscalationSteps(selectedMember) : []),
    [selectedMember],
  );

  const hasActiveFilters =
    selectedEmail !== "" ||
    query !== "" ||
    category !== "all" ||
    ward !== "" ||
    time !== "all";

  function handleClearFilters() {
    setSelectedEmail("");
    setQuery("");
    setCategory("all");
    setWard("");
    setTime("all");
    setDateRange(getDefaultAuditDateRange());
  }

  function handleTimeChange(next: AdminAuditTimeFilter) {
    setTime(next);
    if (next === "custom" && (!dateRange.from || !dateRange.to)) {
      setDateRange(getDefaultAuditDateRange());
    }
  }

  if (!ready) return <PageLoadingFallback variant="embedded" />;

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

      <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.filterTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.filterBody}</p>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="shrink-0 text-sm font-medium text-brand-core hover:underline"
            >
              {copy.clearFilters}
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="admin-audit-search" className="block text-sm font-medium text-ink-primary">
              {copy.searchLabel}
            </label>
            <input
              id="admin-audit-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className={signupInputClassName}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="admin-audit-staff" className="block text-sm font-medium text-ink-primary">
              {copy.staffLabel}
            </label>
            <select
              id="admin-audit-staff"
              value={selectedEmail}
              onChange={(event) => setSelectedEmail(event.target.value)}
              className={signupInputClassName}
            >
              <option value="">{copy.allStaffOption}</option>
              {staff.map((member) => (
                <option key={member.id} value={member.email}>
                  {member.fullName} · {member.roleLabel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-audit-ward" className="block text-sm font-medium text-ink-primary">
              {copy.wardLabel}
            </label>
            <select
              id="admin-audit-ward"
              value={ward}
              onChange={(event) => setWard(event.target.value)}
              className={signupInputClassName}
            >
              <option value="">{copy.allWardsOption}</option>
              {wardOptions.map((option) => (
                <option key={option} value={option}>
                  Ward {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-audit-time" className="block text-sm font-medium text-ink-primary">
              {copy.timeLabel}
            </label>
            <select
              id="admin-audit-time"
              value={time}
              onChange={(event) => handleTimeChange(event.target.value as AdminAuditTimeFilter)}
              className={signupInputClassName}
            >
              <option value="all">{copy.timeAll}</option>
              <option value="1h">{copy.time1h}</option>
              <option value="8h">{copy.time8h}</option>
              <option value="24h">{copy.time24h}</option>
              <option value="custom">{copy.timeCustom}</option>
            </select>
          </div>
        </div>

        {time === "custom" ? (
          <div className="mt-6 rounded-lg border border-line bg-surface-base p-4">
            <p className="text-sm leading-relaxed text-ink-secondary">{copy.customRangeHint}</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="admin-audit-from" className="block text-sm font-medium text-ink-primary">
                  {copy.dateFromLabel}
                </label>
                <input
                  id="admin-audit-from"
                  type="date"
                  value={dateRange.from}
                  onChange={(event) =>
                    setDateRange((current) => ({ ...current, from: event.target.value }))
                  }
                  className={signupInputClassName}
                />
              </div>
              <div>
                <label htmlFor="admin-audit-to" className="block text-sm font-medium text-ink-primary">
                  {copy.dateToLabel}
                </label>
                <input
                  id="admin-audit-to"
                  type="date"
                  value={dateRange.to}
                  onChange={(event) =>
                    setDateRange((current) => ({ ...current, to: event.target.value }))
                  }
                  className={signupInputClassName}
                />
              </div>
            </div>
            {customRangeInvalid ? (
              <p className="mt-3 text-sm text-critical" role="alert">
                {copy.customRangeInvalid}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6">
          <p className="text-sm font-medium text-ink-primary">{copy.categoryLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryFilters.map((filterId) => {
              const active = category === filterId;
              const count = filterCounts[filterId];

              return (
                <button
                  key={filterId}
                  type="button"
                  onClick={() => setCategory(filterId)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-core text-white"
                      : "bg-surface-base text-ink-secondary ring-1 ring-line hover:text-ink-primary"
                  }`}
                >
                  {categoryLabelKeys[filterId]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-primary">
              {selectedMember ? copy.userAuditTitle(selectedMember.fullName) : copy.orgAuditTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.userAuditBody}</p>
          </div>
          <p className="font-mono text-xs text-ink-secondary">{copy.resultsCount(auditEntries.length)}</p>
        </div>

        {auditEntries.length === 0 ? (
          <div className="mt-4">
            <p className="text-sm text-ink-secondary">{copy.userAuditEmpty}</p>
            {hasActiveFilters ? (
              <p className="mt-2 text-sm text-ink-secondary">{copy.noResultsHint}</p>
            ) : null}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {auditEntries.map((entry) => (
              <li key={entry.id}>
                <AuditEntryItem entry={entry} adminContext />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-critical/25 bg-critical/5 p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.missedTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.missedBody}</p>

        {missedAcks.length === 0 ? (
          <p className="mt-4 text-sm text-ink-secondary">{copy.missedEmpty}</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {missedAcks.map((incident) => (
              <li
                key={incident.id}
                className="rounded-lg border border-line bg-surface-card p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">
                      {incident.recipientName} · {incident.role}
                    </p>
                    <p className="mt-1 text-sm text-ink-secondary">
                      {incident.patientName} · Ward {incident.ward} · {incident.caseId}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                      {incident.reason}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      incident.status === "timed_out"
                        ? "bg-critical/15 text-critical"
                        : "bg-surface-base text-ink-secondary ring-1 ring-line"
                    }`}
                  >
                    {formatAlertStatus(incident.status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-primary">
                  <span className="font-medium">{copy.suggestedActionLabel}:</span>{" "}
                  {incident.suggestedAction}
                </p>
                <p className="mt-2 font-mono text-xs text-ink-secondary">
                  {copy.sentMinutesAgo(incident.sentMinutesAgo)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.escalationTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.escalationBody}</p>

        {selectedMember && staffEscalationSteps.length > 0 ? (
          <p className="mt-4 text-sm text-ink-primary">
            {copy.staffEscalationIntro(selectedMember.fullName, staffEscalationSteps.length)}
          </p>
        ) : null}

        {escalationIncidents.length === 0 ? (
          <p className="mt-4 text-sm text-ink-secondary">{copy.escalationEmpty}</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {escalationIncidents.map((incident) => (
              <li key={incident.caseId} className="rounded-lg border border-line bg-surface-base p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">{incident.summary}</p>
                    <p className="text-sm text-ink-secondary">
                      {incident.patientName} · Ward {incident.ward} · Bed {incident.bed}
                    </p>
                  </div>
                  <Link
                    href={`/admin/cases/${incident.caseId}`}
                    className="text-sm font-medium text-brand-core hover:underline"
                  >
                    {copy.reviewCase}
                  </Link>
                </div>

                <ol className="mt-5 space-y-4 border-l-2 border-brand-core/25 pl-5">
                  {incident.alerts.map((alert) => (
                    <li key={alert.id} className="relative">
                      <span
                        className="absolute -left-[1.35rem] top-1 size-2.5 rounded-full bg-surface-card ring-2 ring-brand-core/40"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-ink-primary">
                        {alert.recipientName} · {alert.role}
                      </p>
                      <p className="text-xs text-ink-secondary">
                        {copy.alertSent(alert.sentMinutesAgo)} · {formatAlertStatus(alert.status)}
                        {alert.acknowledgedMinutesAgo != null
                          ? ` · ${copy.acknowledgedMinutesAgo(alert.acknowledgedMinutesAgo)}`
                          : ""}
                      </p>
                    </li>
                  ))}

                  {incident.steps.map((step) => (
                    <li key={step.id} className="relative">
                      <span
                        className="absolute -left-[1.35rem] top-1 size-2.5 rounded-full bg-brand-core ring-2 ring-brand-core/30"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-ink-primary">
                        {copy.escalatedFromTo(step.fromRecipientName, step.toRecipientName)}
                      </p>
                      <p className="text-xs text-ink-secondary">
                        {step.fromRole} → {step.toRole} · {formatEscalationReason(step.reason)} ·{" "}
                        {copy.escalatedMinutesAgo(step.escalatedMinutesAgo)}
                      </p>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
