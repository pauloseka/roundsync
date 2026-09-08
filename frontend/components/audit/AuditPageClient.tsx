"use client";

import { useMemo, useState } from "react";
import { AuditEntryItem } from "@/components/audit/AuditEntryItem";
import { AuditSidebar } from "@/components/audit/AuditSidebar";
import { PanelHeaderTooltip } from "@/components/ui/PanelHeaderTooltip";
import { auditCopy } from "@/lib/content/copy";
import { auditLog } from "@/lib/audit-seed";
import { filterAuditLog, sortAuditLog, type AuditTrailFilter } from "@/lib/audit";

const inputClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function AuditPageClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AuditTrailFilter>("all");
  const copy = auditCopy;

  const entries = useMemo(() => {
    const filtered = filterAuditLog(auditLog, { query, filter });
    return sortAuditLog(filtered);
  }, [query, filter]);

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          Audit Trail
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
          Activity history
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{copy.pageSubtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <section className="rounded-xl border border-line bg-surface-card p-5">
            <label htmlFor="audit-search" className="block text-sm font-medium text-ink-primary">
              {copy.searchLabel}
            </label>
            <input
              id="audit-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className={inputClassName}
              autoComplete="off"
            />

            <div className="mt-4 flex flex-wrap gap-2 xl:hidden">
              {(["all", "cases", "tasks"] as const).map((filterId) => (
                <button
                  key={filterId}
                  type="button"
                  onClick={() => setFilter(filterId)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === filterId
                      ? "bg-brand-core text-white"
                      : "bg-surface-base text-ink-secondary ring-1 ring-line"
                  }`}
                >
                  {copy.filters[filterId]}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col overflow-visible rounded-xl border border-line bg-surface-card">
            <PanelHeaderTooltip
              description={copy.log.description}
              className="cursor-help border-b border-line px-5 py-3.5"
            >
              <header className="flex items-center justify-between gap-3">
                <h2 className="font-display text-base font-semibold text-ink-primary">
                  {copy.log.label}
                </h2>
                <span className="font-mono text-xs text-ink-secondary">{entries.length}</span>
              </header>
            </PanelHeaderTooltip>

            <div className="p-5">
              {entries.length === 0 ? (
                <p className="text-sm text-ink-secondary">{copy.log.empty}</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <AuditEntryItem entry={entry} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="xl:col-span-5">
          <AuditSidebar filter={filter} onFilterChange={setFilter} />
        </div>
      </div>
    </div>
  );
}
