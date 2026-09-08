import { formatDueIn, formatDueTime } from "@/lib/format";
import type { ScheduledTaskStatus } from "@/lib/scheduled-tasks";

interface TaskDueBadgeProps {
  dueInMinutes: number;
  status: ScheduledTaskStatus;
  showAbsolute?: boolean;
}

export function TaskDueBadge({
  dueInMinutes,
  status,
  showAbsolute = true,
}: TaskDueBadgeProps) {
  const { absolute } = formatDueTime(dueInMinutes);
  const relative = formatDueIn(dueInMinutes);

  const tone =
    status === "overdue"
      ? "bg-amber-50 text-task-overdue"
      : status === "due_soon"
        ? "bg-amber-50/60 text-task-overdue"
        : status === "completed"
          ? "bg-surface-base text-ink-secondary"
          : "bg-surface-base text-task-neutral ring-1 ring-line";

  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      <span
        className={`rounded px-2 py-0.5 font-mono text-xs font-medium ${tone}`}
        suppressHydrationWarning
      >
        {relative}
      </span>
      {showAbsolute && status !== "completed" ? (
        <span className="font-mono text-[11px] text-ink-secondary" suppressHydrationWarning>
          {absolute}
        </span>
      ) : null}
    </div>
  );
}
