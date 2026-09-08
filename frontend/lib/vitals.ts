import type { VitalsStatus } from "@/lib/mock-data";

export const vitalsStatusLabel: Record<
  VitalsStatus,
  { label: string; className: string }
> = {
  watch: {
    label: "Watch",
    className: "bg-amber-50 text-task-overdue",
  },
  abnormal: {
    label: "Abnormal",
    className: "bg-moderate-muted text-moderate",
  },
  stable: {
    label: "Stable",
    className: "bg-surface-base text-ink-secondary",
  },
};
