"use client";

import { useState } from "react";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupPrimaryButtonClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import {
  SHIFT_SCHEDULE_CSV_HEADER,
  exampleShiftScheduleCsv,
  getShiftSchedule,
  importAndAutoAssignSchedule,
  type ShiftAssignment,
} from "@/lib/admin-shift-schedule";
import { getOrganizationWards } from "@/lib/signup-session";
import { signUpCopy } from "@/lib/signup-content";

interface ShiftScheduleSectionProps {
  onScheduleChange?: () => void;
}

export function ShiftScheduleSection({ onScheduleChange }: ShiftScheduleSectionProps) {
  const copy = signUpCopy.adminStaff.schedule;
  const [csvInput, setCsvInput] = useState(() => exampleShiftScheduleCsv(getOrganizationWards()));
  const [requirements, setRequirements] = useState(() => getShiftSchedule().requirements);
  const [assignments, setAssignments] = useState(() => getShiftSchedule().assignments);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  function refreshSchedule() {
    const schedule = getShiftSchedule();
    setRequirements(schedule.requirements);
    setAssignments(schedule.assignments);
    onScheduleChange?.();
  }

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setImporting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const result = importAndAutoAssignSchedule(csvInput);
    setImporting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(
      copy.importSuccess(result.requirements, result.assigned, result.unfilled),
    );
    refreshSchedule();
  }

  function handleLoadExample() {
    setCsvInput(exampleShiftScheduleCsv(getOrganizationWards()));
    setError(null);
    setSuccess(null);
  }

  const assignmentByRequirement = new Map<string, ShiftAssignment[]>();
  for (const assignment of assignments) {
    const list = assignmentByRequirement.get(assignment.requirementId) ?? [];
    list.push(assignment);
    assignmentByRequirement.set(assignment.requirementId, list);
  }

  return (
    <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
      <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.body}</p>

      <form onSubmit={handleImport} className={`mt-6 ${signupFormStackClassName}`}>
        <div>
          <label htmlFor="shift-schedule-csv" className="block text-sm font-medium text-ink-primary">
            {copy.csvLabel}
          </label>
          <p className="mt-1 font-mono text-xs text-ink-secondary">{SHIFT_SCHEDULE_CSV_HEADER}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.csvHint}</p>
          <textarea
            id="shift-schedule-csv"
            value={csvInput}
            onChange={(event) => setCsvInput(event.target.value)}
            rows={8}
            className={`${signupInputClassName} mt-3 font-mono text-xs leading-relaxed`}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={importing}
            className={`${signupPrimaryButtonClassName} max-w-xs`}
          >
            {importing ? copy.importing : copy.importCta}
          </button>
          <button
            type="button"
            onClick={handleLoadExample}
            className={`${signupSecondaryButtonClassName} max-w-xs`}
          >
            {copy.exampleCta}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 text-sm text-brand-core" role="status">
          {success}
        </p>
      ) : null}

      {requirements.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-ink-primary">{copy.publishedTitle}</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{copy.publishedBody}</p>

          <ul className="mt-4 space-y-3">
            {requirements.map((requirement) => {
              const filled = assignmentByRequirement.get(requirement.id) ?? [];
              const unfilled = Math.max(0, requirement.headcount - filled.length);

              return (
                <li
                  key={requirement.id}
                  className="rounded-lg border border-line bg-surface-base p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink-primary">
                        {requirement.date} · {requirement.ward}
                      </p>
                      <p className="text-sm text-ink-secondary">
                        {requirement.roleLabel} · {requirement.shiftStart}–{requirement.shiftEnd} ·{" "}
                        {copy.headcount(requirement.headcount)}
                      </p>
                    </div>
                    {unfilled > 0 ? (
                      <span className="shrink-0 rounded-full bg-critical/10 px-2.5 py-0.5 text-xs font-medium text-critical">
                        {copy.unfilled(unfilled)}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-brand-core-muted px-2.5 py-0.5 text-xs font-medium text-brand-core">
                        {copy.fullyStaffed}
                      </span>
                    )}
                  </div>

                  {filled.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                      {filled.map((assignment) => (
                        <li key={assignment.id} className="text-xs text-ink-secondary">
                          {copy.assignedTo(assignment.staffName, assignment.staffEmail)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-ink-secondary">{copy.noAssignments}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
