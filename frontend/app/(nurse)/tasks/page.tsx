import type { Metadata } from "next";
import { TasksChecklist } from "@/components/tasks/TasksChecklist";

export const metadata: Metadata = {
  title: "My Tasks — RoundSync",
  description:
    "Scheduled routine care for your shift — medications, vitals checks, and care rounds.",
};

export default function TasksPage() {
  return <TasksChecklist />;
}
