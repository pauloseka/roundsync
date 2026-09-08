import { formatMessageAgo } from "@/lib/dashboard-data";
import {
  escalationReasonLabel,
  type EscalationStep,
} from "@/lib/cases-types";

interface EscalationTrailProps {
  steps: EscalationStep[];
}

export function EscalationTrail({ steps }: EscalationTrailProps) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-ink-secondary">No auto-escalations on this case.</p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className="rounded-lg border border-line bg-surface-base px-3 py-3"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            Escalation {index + 1}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-primary">
            <span className="font-medium">{step.fromRecipientName}</span>
            <span className="text-ink-secondary">({step.fromRole})</span>
            <span className="text-ink-secondary">→</span>
            <span className="font-medium">{step.toRecipientName}</span>
            <span className="text-ink-secondary">({step.toRole})</span>
          </div>
          <p className="mt-2 text-sm text-ink-secondary">
            {escalationReasonLabel[step.reason] ?? step.reason}
          </p>
          <p className="mt-2 font-mono text-xs text-ink-secondary">
            {formatMessageAgo(step.escalatedMinutesAgo)}
          </p>
        </li>
      ))}
    </ol>
  );
}
