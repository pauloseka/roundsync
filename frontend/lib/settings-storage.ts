import {
  defaultUserSettings,
  type DisplayMode,
  type UserSettings,
} from "@/lib/settings-types";

const STORAGE_KEY = "roundsync-settings";

export function loadUserSettings(): UserSettings {
  if (typeof window === "undefined") return defaultUserSettings;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserSettings;

    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      alerts: { ...defaultUserSettings.alerts, ...parsed.alerts },
      notificationScope: parsed.notificationScope ?? defaultUserSettings.notificationScope,
      displayMode: parsed.displayMode ?? defaultUserSettings.displayMode,
    };
  } catch {
    return defaultUserSettings;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function applyDisplayMode(mode: DisplayMode): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("dark");

  if (mode === "dark") {
    root.classList.add("dark");
    return;
  }

  if (mode === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

export function watchSystemDisplayMode(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);

  return () => media.removeEventListener("change", onChange);
}
