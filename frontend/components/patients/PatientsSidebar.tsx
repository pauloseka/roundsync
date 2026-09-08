"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { patientsCopy } from "@/lib/content/copy";
import {
  getPatientRosterCounts,
  type PatientRosterFilter,
} from "@/lib/patients";
import { shiftContext, shiftPatients } from "@/lib/mock-data";

interface PatientsSidebarProps {
  filter: PatientRosterFilter;
  onFilterChange: (filter: PatientRosterFilter) => void;
}

export function PatientsSidebar({ filter, onFilterChange }: PatientsSidebarProps) {
  const { activeCasePatientIds } = useCases();
  const copy = patientsCopy;
  const counts = getPatientRosterCounts(shiftPatients, activeCasePatientIds);

  const filters: { id: PatientRosterFilter; label: string; count?: number }[] = [
    { id: "all", label: copy.filters.all, count: counts.total },
    { id: "warnings", label: copy.filters.warnings, count: counts.warnings },
    { id: "on_case", label: copy.filters.on_case, count: counts.onCase },
  ];

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {copy.sidebar.wardLabel}
        </p>
        <p className="mt-2 font-display text-base font-semibold text-ink-primary">
          {shiftContext.ward}
        </p>
        <p className="mt-1 text-sm text-ink-secondary">
          {shiftContext.shiftStart}–{shiftContext.shiftEnd} shift
        </p>
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {copy.sidebar.summaryLabel}
        </p>
        <dl className="mt-4 grid grid-cols-1 gap-3">
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">{copy.sidebar.totalLabel}</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {counts.total}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">
              {copy.sidebar.warningsLabel}
            </dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {counts.warnings}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">
              {copy.sidebar.onCaseLabel}
            </dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {counts.onCase}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Filter
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {filters.map((item) => {
            const active = filter === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange(item.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "border-brand-core/40 bg-brand-core-muted/30 font-semibold text-brand-core"
                    : "border-line bg-surface-base font-medium text-ink-primary hover:bg-surface-card"
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined ? (
                  <span className="font-mono text-xs">{item.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <PatientRoleBoundaryNote />
    </aside>
  );
}

export function PatientRoleBoundaryNote() {
  const copy = patientsCopy.boundary;

  return (
    <div className="rounded-lg border border-line bg-surface-base px-4 py-3">
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
        {copy.title}
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
        {copy.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link
        href="/cases"
        className="mt-3 inline-block text-sm font-medium text-brand-core hover:underline"
      >
        Go to Active cases →
      </Link>
    </div>
  );
}
