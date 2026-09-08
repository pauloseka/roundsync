import { CaseOwnershipChip } from "@/components/cases/CaseOwnershipChip";
import { RelapseResolvedNote } from "@/components/cases/RelapseSuggestionPanel";
import { CaseResponseStatus, formatCaseElapsed } from "@/components/cases/CaseResponseStatus";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { formatPatientLocation } from "@/lib/format-patient";
import { caseStatusLabel, type EmergencyCase } from "@/lib/cases-types";

interface CaseListItemProps {
  caseItem: EmergencyCase;
  variant?: "compact" | "full";
}

export function CaseListItem({ caseItem, variant = "full" }: CaseListItemProps) {
  const primaryAlert = caseItem.alerts[0];

  if (variant === "compact") {
    return (
      <div className="flex w-full items-stretch justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyChip level={caseItem.urgencyLevel} />
            <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
              {caseStatusLabel[caseItem.status]}
            </span>
          </div>
          <p className="mt-2 font-display text-sm font-semibold text-ink-primary">
            {caseItem.patientName}
          </p>
          <p className="mt-0.5 font-mono text-xs text-ink-secondary">
            {formatPatientLocation(caseItem)}
          </p>
          <p className="mt-2 text-sm text-ink-secondary">{caseItem.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CaseOwnershipChip caseItem={caseItem} />
          </div>
          <RelapseResolvedNote caseItem={caseItem} />
          {primaryAlert ? (
            <div className="mt-2 min-w-0">
              <p className="text-sm font-medium text-ink-primary">{primaryAlert.recipientName}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-secondary">{primaryAlert.role}</p>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end self-stretch">
          <span className="font-mono text-xs text-ink-secondary">
            {formatCaseElapsed(caseItem.elapsedMinutes)}
          </span>
          {caseItem.alerts.length > 0 ? (
            <div className="mt-auto pt-2">
              <CaseResponseStatus alerts={caseItem.alerts} compact layout="status-column" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyChip level={caseItem.urgencyLevel} />
            <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
              {caseStatusLabel[caseItem.status]}
            </span>
          </div>
          <p className="mt-2 font-display text-sm font-semibold text-ink-primary">
            {caseItem.patientName}
          </p>
          <p className="mt-0.5 font-mono text-xs text-ink-secondary">
            {formatPatientLocation(caseItem)}
          </p>
          <p className="mt-2 text-sm text-ink-secondary">{caseItem.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CaseOwnershipChip caseItem={caseItem} />
          </div>
          <RelapseResolvedNote caseItem={caseItem} />
        </div>
        <span className="shrink-0 pt-0.5 font-mono text-xs text-ink-secondary">
          {formatCaseElapsed(caseItem.elapsedMinutes)}
        </span>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Response status
        </p>
        <div className="mt-2">
          <CaseResponseStatus alerts={caseItem.alerts} />
        </div>
      </div>
    </div>
  );
}
