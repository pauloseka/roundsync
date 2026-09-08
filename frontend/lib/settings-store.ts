import {
  applyDisplayMode,
  loadUserSettings,
  saveUserSettings,
  watchSystemDisplayMode,
} from "@/lib/settings-storage";
import {
  defaultUserSettings,
  type AlertTone,
  type DisplayMode,
  type NotificationScope,
  type UserSettings,
} from "@/lib/settings-types";

const listeners = new Set<() => void>();
let cachedSnapshot: UserSettings = defaultUserSettings;

function syncCachedSnapshot(): UserSettings {
  cachedSnapshot = loadUserSettings();
  return cachedSnapshot;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeToSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSettingsServerSnapshot(): UserSettings {
  return defaultUserSettings;
}

export function getSettingsClientSnapshot(): UserSettings {
  return cachedSnapshot;
}

export function updateSettingsStore(updater: (current: UserSettings) => UserSettings): void {
  const current = syncCachedSnapshot();
  const next = updater(current);
  saveUserSettings(next);
  cachedSnapshot = next;
  applyDisplayMode(next.displayMode);
  emitChange();
}

export function setSoundEnabled(enabled: boolean): void {
  updateSettingsStore((current) => ({
    ...current,
    alerts: { ...current.alerts, soundEnabled: enabled },
  }));
}

export function setUrgencyTone(urgency: "critical" | "urgent" | "moderate", tone: AlertTone): void {
  updateSettingsStore((current) => ({
    ...current,
    alerts: {
      ...current.alerts,
      [`${urgency}Tone`]: tone,
    },
  }));
}

export function setNotificationScope(scope: NotificationScope): void {
  updateSettingsStore((current) => ({ ...current, notificationScope: scope }));
}

export function setDisplayMode(mode: DisplayMode): void {
  updateSettingsStore((current) => ({ ...current, displayMode: mode }));
}

export function initSettingsStore(): void {
  if (typeof window === "undefined") return;
  syncCachedSnapshot();
  applyDisplayMode(cachedSnapshot.displayMode);
}

export function watchSettingsSystemDisplayMode(settings: UserSettings): (() => void) | undefined {
  if (settings.displayMode !== "system") return undefined;
  return watchSystemDisplayMode(() => applyDisplayMode("system"));
}
