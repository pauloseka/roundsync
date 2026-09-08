"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getSettingsClientSnapshot,
  getSettingsServerSnapshot,
  initSettingsStore,
  setDisplayMode,
  setNotificationScope,
  setSoundEnabled,
  setUrgencyTone,
  subscribeToSettings,
  watchSettingsSystemDisplayMode,
} from "@/lib/settings-store";
import type { AlertPreferences, AlertTone, DisplayMode, NotificationScope, UserSettings } from "@/lib/settings-types";

interface SettingsContextValue {
  settings: UserSettings;
  setSoundEnabled: (enabled: boolean) => void;
  setUrgencyTone: (urgency: "critical" | "urgent" | "moderate", tone: AlertTone) => void;
  setNotificationScope: (scope: NotificationScope) => void;
  setDisplayMode: (mode: DisplayMode) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settings = useSyncExternalStore(
    subscribeToSettings,
    getSettingsClientSnapshot,
    getSettingsServerSnapshot,
  );

  useEffect(() => {
    initSettingsStore();
  }, []);

  useEffect(() => {
    return watchSettingsSystemDisplayMode(settings);
  }, [settings]);

  const value = useMemo(
    (): SettingsContextValue => ({
      settings,
      setSoundEnabled,
      setUrgencyTone,
      setNotificationScope,
      setDisplayMode,
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

export type { AlertPreferences, UserSettings };
