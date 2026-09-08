import { TaskSectionPanel } from "@/components/tasks/TaskSectionPanel";
import { tasksCopy } from "@/lib/content/copy";
import { getAllTaskSections, getScheduledTasks } from "@/lib/scheduled-tasks";

export function TasksChecklist() {
  const sections = getAllTaskSections(getScheduledTasks());
  const overdue = sections.find((section) => section.id === "overdue")!;
  const dueSoon = sections.find((section) => section.id === "due_soon")!;
  const upcoming = sections.find((section) => section.id === "pending")!;
  const completed = sections.find((section) => section.id === "completed")!;
  const copy = tasksCopy.sections;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          My Tasks
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
          Your shift checklist
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
          {tasksCopy.pageSubtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <TaskSectionPanel
            title={copy.overdue.label}
            description={copy.overdue.description}
            tasks={overdue.tasks}
            emptyMessage={copy.overdue.empty}
          />
          <TaskSectionPanel
            title={copy.due_soon.label}
            description={copy.due_soon.description}
            tasks={dueSoon.tasks}
            emptyMessage={copy.due_soon.empty}
          />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <TaskSectionPanel
            title={copy.pending.label}
            description={copy.pending.description}
            tasks={upcoming.tasks}
            emptyMessage={copy.pending.empty}
          />
          <TaskSectionPanel
            title={copy.completed.label}
            description={copy.completed.description}
            tasks={completed.tasks}
            emptyMessage={copy.completed.empty}
          />
        </div>
      </div>
    </div>
  );
}
