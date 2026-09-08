"use client";

import { useCases } from "@/components/cases/CasesStore";
import { DashboardItemCard, DashboardItemList } from "@/components/dashboard/DashboardItemList";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { tasksCopy } from "@/lib/content/copy";
import { getDueTaskSnapshots } from "@/lib/dashboard-data";

interface TasksDueSoonProps {
  className?: string;
}

export function TasksDueSoon({ className = "" }: TasksDueSoonProps) {
  const { activeCasePatientIds } = useCases();
  const copy = tasksCopy.dashboardWidget;
  const { items: tasks, total } = getDueTaskSnapshots(3, activeCasePatientIds);

  return (
    <DashboardWidget
      title={copy.title}
      description={copy.description}
      href="/tasks"
      linkLabel={copy.linkLabel}
      className={className}
      totalCount={total}
      previewCount={tasks.length}
    >
      {tasks.length === 0 ? (
        <p className="text-sm text-ink-secondary">{copy.empty}</p>
      ) : (
        <DashboardItemList>
          {tasks.map((task) => (
            <DashboardItemCard
              key={task.id}
              className="flex items-start justify-between gap-3"
            >
              <TaskListItem task={task} variant="compact" />
            </DashboardItemCard>
          ))}
        </DashboardItemList>
      )}
    </DashboardWidget>
  );
}
