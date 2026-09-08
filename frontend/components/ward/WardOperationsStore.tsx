"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  assessOnCallRota,
  loggedInClinicians,
  resolveAlertRecipient,
  type OnCallClinician,
  type StaleRotaAssessment,
} from "@/lib/on-call-rota";

interface WardOperationsContextValue {
  wardCode: string;
  onCallOverrideId: string | null;
  activeOnCall: OnCallClinician;
  staleRota: StaleRotaAssessment;
  confirmOnCallOverride: (clinicianId: string) => void;
  clearOnCallOverride: () => void;
}

const WardOperationsContext = createContext<WardOperationsContextValue | null>(null);

const DEFAULT_WARD = "4B";

export function WardOperationsProvider({ children }: { children: ReactNode }) {
  const [onCallOverrideId, setOnCallOverrideId] = useState<string | null>(null);

  const staleRota = useMemo(
    () => assessOnCallRota(DEFAULT_WARD, onCallOverrideId),
    [onCallOverrideId],
  );

  const activeOnCall = useMemo(
    () => resolveAlertRecipient(DEFAULT_WARD, onCallOverrideId),
    [onCallOverrideId],
  );

  const confirmOnCallOverride = useCallback((clinicianId: string) => {
    setOnCallOverrideId(clinicianId);
  }, []);

  const clearOnCallOverride = useCallback(() => {
    setOnCallOverrideId(null);
  }, []);

  const value = useMemo(
    (): WardOperationsContextValue => ({
      wardCode: DEFAULT_WARD,
      onCallOverrideId,
      activeOnCall,
      staleRota,
      confirmOnCallOverride,
      clearOnCallOverride,
    }),
    [onCallOverrideId, activeOnCall, staleRota, confirmOnCallOverride, clearOnCallOverride],
  );

  return (
    <WardOperationsContext.Provider value={value}>{children}</WardOperationsContext.Provider>
  );
}

export function useWardOperations() {
  const context = useContext(WardOperationsContext);
  if (!context) {
    throw new Error("useWardOperations must be used within WardOperationsProvider");
  }
  return context;
}

export { loggedInClinicians };
