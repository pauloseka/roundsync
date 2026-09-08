"use client";

import Link from "next/link";
import { useState } from "react";
import { useCases } from "@/components/cases/CasesStore";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { relapseCopy } from "@/lib/content/copy";
import { getRecentlyResolvedCase } from "@/lib/case-relapse";
import type { EmergencyCase } from "@/lib/cases-types";

interface RelapseSuggestionPanelProps {
  patientId: string;
  patientName: string;
  variant?: "banner" | "inline";
  className?: string;
}

export function RelapseSuggestionPanel({
  patientId,
  patientName,
  variant = "banner",
  className = "",
}: RelapseSuggestionPanelProps) {
  const { cases, reopenCase } = useCases();
  const resolvedCase = getRecentlyResolvedCase(cases, patientId);
  const [expanded, setExpanded] = useState(false);
  const [triggerNote, setTriggerNote] = useState("");

  if (!resolvedCase) {
    return null;
  }

  const shellClassName =
    variant === "banner"
      ? "rounded-lg border border-brand-core/25 bg-brand-core-muted/30 px-4 py-3"
      : "rounded-lg border border-line bg-surface-base px-4 py-3";

  return (
    <div className={`${shellClassName} ${className}`}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-brand-core">
        {relapseCopy.eyebrow}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink-primary">
        {relapseCopy.title(patientName, resolvedCase.id)}
      </p>
      <p className="mt-1 text-sm text-ink-secondary">
        {relapseCopy.body(resolvedCase.resolvedMinutesAgo ?? 0, resolvedCase.summary)}
      </p>

      {!expanded ? (
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-lg bg-brand-core px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-core/90"
          >
            {relapseCopy.reopenCta}
          </button>
          <Link
            href={`/cases/${resolvedCase.id}`}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-primary hover:bg-surface-card"
          >
            {relapseCopy.viewResolvedCta}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!triggerNote.trim()) return;
            reopenCase(resolvedCase.id, triggerNote);
            setTriggerNote("");
            setExpanded(false);
          }}
          className="mt-3 flex flex-col gap-2"
        >
          <textarea
            value={triggerNote}
            onChange={(event) => setTriggerNote(event.target.value)}
            rows={3}
            placeholder={relapseCopy.notePlaceholder}
            className="rounded-lg border border-line bg-surface-card px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary focus:border-brand-core focus:outline-none"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-core px-3 py-1.5 text-sm font-medium text-white"
            >
              {relapseCopy.confirmReopenCta}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function RelapseResolvedNote({ caseItem }: { caseItem: EmergencyCase }) {
  if (caseItem.status !== "reopened" || !caseItem.reopenedAfterResolvedMinutesAgo) {
    return null;
  }

  return (
    <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
      {relapseCopy.reopenedNote(
        caseItem.reopenedAfterResolvedMinutesAgo,
        caseItem.priorResolutionSummary,
      )}
    </p>
  );
}

export function RelapseTimingLabel({ resolvedMinutesAgo }: { resolvedMinutesAgo: number }) {
  return (
    <span className="font-mono text-xs text-ink-secondary">
      Resolved {formatMessageAgo(resolvedMinutesAgo)}
    </span>
  );
}
