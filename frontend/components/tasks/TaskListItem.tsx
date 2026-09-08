import { TaskDueBadge } from "@/components/tasks/TaskDueBadge";
import { formatPatientLocation } from "@/lib/format-patient";
import type { ScheduledTask } from "@/lib/scheduled-tasks";
import { taskTypeLabel } from "@/lib/scheduled-tasks";

interface TaskListItemProps {
  task: ScheduledTask;
  variant?: "compact" | "full";
}

export function TaskListItem({ task, variant = "full" }: TaskListItemProps) {
  const completed = task.status === "completed";

  if (variant === "compact") {
    return (
      <>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-primary">{task.description}</p>
          <p className="mt-0.5 font-display text-sm font-semibold text-ink-primary">
            {task.patientName}
          </p>
          <p className="mt-0.5 font-mono text-xs text-ink-secondary">
            {formatPatientLocation(task)}
          </p>
        </div>
        <TaskDueBadge
          dueInMinutes={task.dueInMinutes}
          status={task.status}
          showAbsolute={false}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary ring-1 ring-line">
            {taskTypeLabel[task.taskType]}
          </span>
          {completed ? (
            <span className="font-mono text-[11px] font-medium text-resolved">Done</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-medium text-ink-primary">{task.description}</p>
        <p className="mt-0.5 font-display text-sm font-semibold text-ink-primary">
          {task.patientName}
        </p>
        <p className="mt-0.5 font-mono text-xs text-ink-secondary">
          {formatPatientLocation(task)}
        </p>
      </div>
      <TaskDueBadge dueInMinutes={task.dueInMinutes} status={task.status} />
    </>
  );
}
