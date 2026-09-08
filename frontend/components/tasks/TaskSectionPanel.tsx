import { TaskRow } from "@/components/tasks/TaskRow";
import { PanelHeaderTooltip } from "@/components/ui/PanelHeaderTooltip";
import type { ScheduledTask } from "@/lib/scheduled-tasks";

interface TaskSectionPanelProps {
  title: string;
  description: string;
  tasks: ScheduledTask[];
  emptyMessage: string;
}

export function TaskSectionPanel({
  title,
  description,
  tasks,
  emptyMessage,
}: TaskSectionPanelProps) {
  return (
    <section className="flex flex-col overflow-visible rounded-xl border border-line bg-surface-card">
      <PanelHeaderTooltip
        description={description}
        className="cursor-help border-b border-line px-5 py-3.5"
      >
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-ink-primary">{title}</h2>
          <span className="font-mono text-xs text-ink-secondary">{tasks.length}</span>
        </header>
      </PanelHeaderTooltip>

      <div className="p-5">
        {tasks.length === 0 ? (
          <p className="text-sm text-ink-secondary">{emptyMessage}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
