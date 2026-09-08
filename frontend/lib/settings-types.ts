import type { CaseUrgency } from "@/lib/mock-data";

export type NotificationScope = "ward_only" | "extended";
export type DisplayMode = "light" | "dark" | "system";
export type AlertTone = "chime" | "pulse" | "bell";

export interface AlertPreferences {
  soundEnabled: boolean;
  criticalTone: AlertTone;
  urgentTone: AlertTone;
  moderateTone: AlertTone;
}

export interface UserSettings {
  alerts: AlertPreferences;
  notificationScope: NotificationScope;
  displayMode: DisplayMode;
}

export type UrgencyToneKey = CaseUrgency;

export const defaultUserSettings: UserSettings = {
  alerts: {
    soundEnabled: true,
    criticalTone: "pulse",
    urgentTone: "bell",
    moderateTone: "chime",
  },
  notificationScope: "ward_only",
  displayMode: "light",
};
