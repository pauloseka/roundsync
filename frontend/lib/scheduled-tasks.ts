import { DUE_SOON_WINDOW_MINUTES } from "@/lib/content/copy";
import { shiftPatients } from "@/lib/mock-data";

export type ScheduledTaskType = "medication" | "vitals_check" | "care_round";
export type ScheduledTaskStatus = "pending" | "due_soon" | "overdue" | "completed";

export interface ScheduledTask {
  id: string;
  patientId: string;
  patientName: string;
  ward: string;
  bed: string;
  taskType: ScheduledTaskType;
  description: string;
  dueInMinutes: number;
  status: ScheduledTaskStatus;
}

export const taskTypeLabel: Record<ScheduledTaskType, string> = {
  medication: "Medication",
  vitals_check: "Vitals check",
  care_round: "Care round",
};

interface ScheduledTaskSeed {
  id: string;
  patientId: string;
  taskType: ScheduledTaskType;
  description: string;
  dueInMinutes: number;
  completed?: boolean;
}

const taskSeeds: ScheduledTaskSeed[] = [
  {
    id: "task-001",
    patientId: "PT-2841",
    taskType: "vitals_check",
    description: "Vitals check",
    dueInMinutes: -8,
  },
  {
    id: "task-002",
    patientId: "PT-2756",
    taskType: "medication",
    description: "Medication — Lisinopril",
    dueInMinutes: -3,
  },
  {
    id: "task-003",
    patientId: "PT-2688",
    taskType: "medication",
    description: "Medication — Insulin",
    dueInMinutes: 6,
  },
  {
    id: "task-004",
    patientId: "PT-2903",
    taskType: "medication",
    description: "Medication — Metformin",
    dueInMinutes: 14,
  },
  {
    id: "task-005",
    patientId: "PT-3012",
    taskType: "vitals_check",
    description: "Vitals check",
    dueInMinutes: 30,
  },
  {
    id: "task-006",
    patientId: "PT-2903",
    taskType: "care_round",
    description: "Care round",
    dueInMinutes: 45,
  },
  {
    id: "task-007",
    patientId: "PT-3012",
    taskType: "care_round",
    description: "Wound dressing",
    dueInMinutes: 90,
  },
  {
    id: "task-008",
    patientId: "PT-2944",
    taskType: "care_round",
    description: "Care round",
    dueInMinutes: 120,
  },
  {
    id: "task-009",
    patientId: "PT-2756",
    taskType: "vitals_check",
    description: "Vitals check",
    dueInMinutes: -42,
    completed: true,
  },
];

const patientLookup = new Map(shiftPatients.map((patient) => [patient.id, patient]));

export function resolveTaskStatus(
  dueInMinutes: number,
  completed = false,
): ScheduledTaskStatus {
  if (completed) return "completed";
  if (dueInMinutes < 0) return "overdue";
  if (dueInMinutes <= DUE_SOON_WINDOW_MINUTES) return "due_soon";
  return "pending";
}

function buildScheduledTask(seed: ScheduledTaskSeed): ScheduledTask {
  const patient = patientLookup.get(seed.patientId);

  if (!patient) {
    throw new Error(`Unknown patient for scheduled task: ${seed.patientId}`);
  }

  return {
    id: seed.id,
    patientId: seed.patientId,
    patientName: patient.name,
    ward: patient.ward,
    bed: patient.bed,
    taskType: seed.taskType,
    description: seed.description,
    dueInMinutes: seed.dueInMinutes,
    status: resolveTaskStatus(seed.dueInMinutes, seed.completed),
  };
}

export const scheduledTasks: ScheduledTask[] = taskSeeds.map(buildScheduledTask);

export function sortScheduledTasksByDue(tasks: ScheduledTask[]): ScheduledTask[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    return a.dueInMinutes - b.dueInMinutes;
  });
}

export function getScheduledTasks(): ScheduledTask[] {
  return sortScheduledTasksByDue(scheduledTasks);
}

export function getTasksForPatient(patientId: string): ScheduledTask[] {
  return getScheduledTasks().filter(
    (task) => task.patientId === patientId && task.status !== "completed",
  );
}

export function getDashboardTaskPreviews(options: {
  excludePatientIds?: Set<string>;
  limit?: number;
}): { items: ScheduledTask[]; total: number } {
  const { excludePatientIds = new Set(), limit = 3 } = options;

  const items = getScheduledTasks().filter(
    (task) => task.status !== "completed" && !excludePatientIds.has(task.patientId),
  );

  return {
    items: items.slice(0, limit),
    total: items.length,
  };
}

export function getActionableTaskCount(tasks: ScheduledTask[] = scheduledTasks): number {
  return tasks.filter(
    (task) => task.status === "due_soon" || task.status === "overdue",
  ).length;
}

export function getTaskBadgeVariant(
  tasks: ScheduledTask[] = scheduledTasks,
): "neutral" | "amber" {
  return tasks.some((task) => task.status === "overdue") ? "amber" : "neutral";
}

export interface TaskSection {
  id: ScheduledTaskStatus;
  label: string;
  tasks: ScheduledTask[];
}

export function getAllTaskSections(tasks: ScheduledTask[]): TaskSection[] {
  const sorted = sortScheduledTasksByDue(tasks);

  return [
    {
      id: "overdue",
      label: "Overdue",
      tasks: sorted.filter((task) => task.status === "overdue"),
    },
    {
      id: "due_soon",
      label: "Due soon",
      tasks: sorted.filter((task) => task.status === "due_soon"),
    },
    {
      id: "pending",
      label: "Upcoming",
      tasks: sorted.filter((task) => task.status === "pending"),
    },
    {
      id: "completed",
      label: "Completed",
      tasks: sorted.filter((task) => task.status === "completed"),
    },
  ];
}
