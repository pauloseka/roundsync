import { TaskListItem } from "@/components/tasks/TaskListItem";
import type { ScheduledTask } from "@/lib/scheduled-tasks";

interface TaskRowProps {
  task: ScheduledTask;
}

export function TaskRow({ task }: TaskRowProps) {
  const completed = task.status === "completed";

  return (
    <li
      className={`rounded-lg border border-line bg-surface-base px-3 py-3 ${
        completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <TaskListItem task={task} variant="full" />
      </div>
    </li>
  );
}
