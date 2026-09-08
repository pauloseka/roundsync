"use client";

import Link from "next/link";
import { useState } from "react";
import { auditCopy } from "@/lib/content/copy";
import { auditKindLabel, formatAuditOccurred } from "@/lib/audit";
import { formatPatientLocation } from "@/lib/format-patient";
import type { AuditLogEntry } from "@/lib/audit-types";

interface AuditEntryItemProps {
  entry: AuditLogEntry;
  /** When true, case/patient links stay in the admin shell (read-only review). */
  adminContext?: boolean;
}

export function AuditEntryItem({ entry, adminContext = false }: AuditEntryItemProps) {
  const [expanded, setExpanded] = useState(false);
  const copy = auditCopy.log;
  const timestamp = formatAuditOccurred(entry.occurredMinutesAgo);
  const kindLabel = auditKindLabel[entry.kind];

  return (
    <article className="rounded-lg border border-line bg-surface-base">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-card"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
              {kindLabel}
            </span>
            <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
              {copy.readOnlyLabel}
            </span>
          </div>
          <p className="mt-2 font-display text-sm font-semibold text-ink-primary">{entry.summary}</p>
          <p className="mt-1 text-sm text-ink-secondary">
            {entry.actorName} · {entry.actorRole}
          </p>
          {entry.patientName && entry.ward && entry.bed && entry.patientId ? (
            <p className="mt-1 font-mono text-xs text-ink-secondary">
              {formatPatientLocation({
                ward: entry.ward,
                bed: entry.bed,
                id: entry.patientId,
              })}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-mono text-xs text-ink-secondary" suppressHydrationWarning>
            {timestamp.relative}
          </span>
          <span className="font-mono text-[11px] text-ink-secondary/80" suppressHydrationWarning>
            ({timestamp.absolute})
          </span>
          <span className="text-xs font-medium text-brand-core">
            {expanded ? copy.collapseLabel : copy.expandLabel}
          </span>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-line px-4 py-4">
          <dl className="space-y-3">
            {entry.details.map((detail) => (
              <div key={`${entry.id}-${detail.label}`}>
                <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-primary">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-3">
            {entry.caseId ? (
              <Link
                href={
                  adminContext ? `/admin/cases/${entry.caseId}` : `/cases/${entry.caseId}`
                }
                className="text-sm font-medium text-brand-core hover:underline"
              >
                {adminContext ? "Review case →" : "View case →"}
              </Link>
            ) : null}
            {entry.patientId ? (
              <Link
                href={
                  adminContext
                    ? `/admin/patients/${entry.patientId}`
                    : `/patients/${entry.patientId}`
                }
                className="text-sm font-medium text-brand-core hover:underline"
              >
                {adminContext ? "Review patient →" : "View patient →"}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
