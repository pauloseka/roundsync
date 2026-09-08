export type BookDemoMode = "calendar" | "manual";

export const demoRoleOptions = [
  "Nurse manager / Ward lead",
  "Clinical director",
  "Hospital operations",
  "IT / Digital health",
  "Administration",
  "Other",
] as const;

export const demoWardSizeOptions = [
  "Under 50 beds",
  "50–150 beds",
  "150–300 beds",
  "300+ beds",
  "Not sure yet",
] as const;

export type { DemoSlotSelection } from "@/lib/demo-scheduling";

export interface BookDemoSubmission {
  mode: BookDemoMode;
  name: string;
  email: string;
  organization: string;
  role: string;
  wardSize: string;
  message: string;
  guestEmails: string[];
  slot?: import("@/lib/demo-scheduling").DemoSlotSelection;
}
