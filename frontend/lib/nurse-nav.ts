import type { NavBadges } from "@/lib/mock-data";
import type { CaseBadgeUrgency } from "@/lib/cases";
import type { TaskBadgeTone } from "@/lib/nav-badges";

export type NurseNavBadgeVariant = "tasks" | "cases" | "messages";

export interface NurseNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: keyof NavBadges;
  badgeVariant?: NurseNavBadgeVariant;
}

export const nurseWorkNav: NurseNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "/icons/nav/dashboard.json",
  },
  {
    id: "tasks",
    label: "My Tasks",
    href: "/tasks",
    icon: "/icons/nav/tasks.json",
    badge: "myTasks",
    badgeVariant: "tasks",
  },
  {
    id: "cases",
    label: "Active Cases",
    href: "/cases",
    icon: "/icons/nav/cases.json",
    badge: "activeCases",
    badgeVariant: "cases",
  },
  {
    id: "messages",
    label: "Messages",
    href: "/messages",
    icon: "/icons/nav/messages.json",
    badge: "messages",
    badgeVariant: "messages",
  },
  {
    id: "patients",
    label: "Patients",
    href: "/patients",
    icon: "/icons/nav/patients.json",
  },
  {
    id: "audit",
    label: "Audit Trail",
    href: "/audit",
    icon: "/icons/nav/audit.json",
  },
];

export const nurseSettingsNav: NurseNavItem = {
  id: "settings",
  label: "Settings",
  href: "/settings",
  icon: "/icons/nav/settings.json",
};

export function navBadgeClassName(
  variant: NurseNavBadgeVariant,
  options: { taskTone?: TaskBadgeTone; caseUrgency?: CaseBadgeUrgency } = {},
): string {
  const { taskTone = "neutral", caseUrgency = "moderate" } = options;

  switch (variant) {
    case "tasks":
      return taskTone === "amber"
        ? "bg-amber-50 text-task-overdue"
        : "bg-surface-base text-task-neutral ring-1 ring-line";
    case "cases":
      switch (caseUrgency) {
        case "critical":
          return "bg-critical-muted text-critical";
        case "urgent":
          return "bg-urgent-muted text-urgent";
        case "moderate":
          return "bg-moderate-muted text-moderate";
      }
      break;
    case "messages":
      return "bg-moderate-muted text-message-unread";
  }
}
