"use client";

import Link from "next/link";
import { auditCopy } from "@/lib/content/copy";
import { auditLog } from "@/lib/audit-seed";
import { getAuditTrailCounts, type AuditTrailFilter } from "@/lib/audit";
import { shiftContext } from "@/lib/mock-data";

interface AuditSidebarProps {
  filter: AuditTrailFilter;
  onFilterChange: (filter: AuditTrailFilter) => void;
}

export function AuditSidebar({ filter, onFilterChange }: AuditSidebarProps) {
  const copy = auditCopy;
  const counts = getAuditTrailCounts(auditLog);

  const filters: { id: AuditTrailFilter; label: string; count: number }[] = [
    { id: "all", label: copy.filters.all, count: counts.total },
    { id: "cases", label: copy.filters.cases, count: counts.cases },
    { id: "tasks", label: copy.filters.tasks, count: counts.tasks },
  ];

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-surface-card p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {copy.sidebar.scopeLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          {copy.sidebar.scopeDescription}
        </p>
        <p className="mt-3 font-display text-sm font-semibold text-ink-primary">
          {shiftContext.nurseName}
        </p>
        <p className="mt-0.5 font-mono text-xs text-ink-secondary">RN · {shiftContext.ward}</p>
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
            <dt className="font-mono text-[11px] text-ink-secondary">{copy.sidebar.casesLabel}</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {counts.cases}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-surface-base px-3 py-2.5">
            <dt className="font-mono text-[11px] text-ink-secondary">{copy.sidebar.tasksLabel}</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink-primary">
              {counts.tasks}
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
                <span className="font-mono text-xs">{item.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <AuditRoleBoundaryNote />
    </aside>
  );
}

export function AuditRoleBoundaryNote() {
  const copy = auditCopy.boundary;

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
