import { formatHandoffOwnership } from "@/lib/handoff";
import type { EmergencyCase } from "@/lib/cases-types";

interface CaseOwnershipChipProps {
  caseItem: EmergencyCase;
  className?: string;
}

export function CaseOwnershipChip({ caseItem, className = "" }: CaseOwnershipChipProps) {
  const isPending = caseItem.handoff?.status === "pending";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 font-mono text-[11px] font-medium ${
        isPending
          ? "bg-amber-50 text-task-overdue ring-1 ring-amber-200/80"
          : "bg-surface-base text-ink-secondary ring-1 ring-line"
      } ${className}`}
    >
      {formatHandoffOwnership(caseItem)}
    </span>
  );
}
