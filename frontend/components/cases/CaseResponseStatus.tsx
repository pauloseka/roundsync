import { formatElapsed } from "@/lib/format";
import {
  alertStatusLabel,
  type CaseAlert,
  type CaseAlertStatus,
} from "@/lib/cases-types";

const alertTone: Record<CaseAlertStatus, string> = {
  pending: "bg-amber-50 text-task-overdue",
  acknowledged: "bg-resolved-muted text-resolved",
  escalated: "bg-urgent-muted text-urgent",
  timed_out: "bg-critical-muted text-critical",
};

function formatAlertTiming(alert: CaseAlert): string {
  if (alert.status === "acknowledged" && alert.acknowledgedMinutesAgo !== undefined) {
    const ack =
      alert.acknowledgedMinutesAgo === 1
        ? "1 min ago"
        : `${alert.acknowledgedMinutesAgo} min ago`;
    return `Ack ${ack}`;
  }

  const sent = alert.sentMinutesAgo === 1 ? "1 min ago" : `${alert.sentMinutesAgo} min ago`;
  return `Sent ${sent}`;
}

interface CaseResponseStatusProps {
  alerts: CaseAlert[];
  compact?: boolean;
  layout?: "inline" | "status-column";
}

export function CaseResponseStatus({
  alerts,
  compact = false,
  layout = "inline",
}: CaseResponseStatusProps) {
  const visibleAlerts = compact ? alerts.slice(0, 1) : alerts;

  if (layout === "status-column") {
    return (
      <ul className="flex flex-col items-end gap-1">
        {visibleAlerts.map((alert) => (
          <li key={alert.id} className="flex flex-col items-end gap-0.5">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${alertTone[alert.status]}`}
            >
              {alertStatusLabel[alert.status]}
            </span>
            <span className="text-right font-mono text-[11px] text-ink-secondary">
              {formatAlertTiming(alert)}
            </span>
          </li>
        ))}
        {compact && alerts.length > 1 ? (
          <li className="text-right font-mono text-[11px] text-ink-secondary">
            +{alerts.length - 1} more alerted
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <ul className={`flex w-full flex-col ${compact ? "gap-1" : "gap-2"}`}>
      {visibleAlerts.map((alert) => (
        <li
          key={alert.id}
          className="flex items-end justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-primary">{alert.recipientName}</p>
            <p className="mt-0.5 font-mono text-xs text-ink-secondary">{alert.role}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${alertTone[alert.status]}`}
            >
              {alertStatusLabel[alert.status]}
            </span>
            <span className="text-right font-mono text-[11px] text-ink-secondary">
              {formatAlertTiming(alert)}
            </span>
          </div>
        </li>
      ))}
      {compact && alerts.length > 1 ? (
        <li className="text-right font-mono text-[11px] text-ink-secondary">
          +{alerts.length - 1} more alerted
        </li>
      ) : null}
    </ul>
  );
}

export function formatCaseElapsed(elapsedMinutes: number): string {
  return `Open ${formatElapsed(elapsedMinutes)}`;
}
