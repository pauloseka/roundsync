"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useWardOperations } from "@/components/ward/WardOperationsStore";
import {
  acceptAllHandoffs as acceptAllHandoffsRecords,
  acceptHandoffRecord,
  buildTriggeredCase,
  createNoteId,
  getActiveCaseCount,
  getActiveCasePatientIds,
  getActiveCases,
  getAllCaseSections,
  getCaseBadgeUrgency,
  getCaseById,
  getCaseForPatient,
  getDashboardCasePreviews,
  getHandoffSummary,
  getPendingHandoffCases,
  getResolvedCases,
  reopenCaseRecord,
  type EmergencyCase,
  type TriggerCaseInput,
} from "@/lib/cases";
import { getPatientsBlockedForNewCase } from "@/lib/case-relapse";
import { initialCases, getPatientsAvailableForNewCase } from "@/lib/cases-seed";
import { shiftContext } from "@/lib/mock-data";

interface CasesContextValue {
  cases: EmergencyCase[];
  activeCases: EmergencyCase[];
  resolvedCases: EmergencyCase[];
  activeCasePatientIds: Set<string>;
  activeCaseCount: number;
  caseBadgeUrgency: ReturnType<typeof getCaseBadgeUrgency>;
  dashboardPreview: ReturnType<typeof getDashboardCasePreviews>;
  sections: ReturnType<typeof getAllCaseSections>;
  pendingHandoffs: EmergencyCase[];
  handoffSummary: ReturnType<typeof getHandoffSummary>;
  patientsBlockedForNewCase: ReturnType<typeof getPatientsBlockedForNewCase>;
  getCase: (caseId: string) => EmergencyCase | undefined;
  getPatientCase: (patientId: string) => EmergencyCase | undefined;
  patientsAvailableForNewCase: ReturnType<typeof getPatientsAvailableForNewCase>;
  addNote: (caseId: string, note: string) => void;
  triggerCase: (input: TriggerCaseInput) => string | null;
  reopenCase: (caseId: string, triggerNote: string) => void;
  acceptHandoff: (caseId: string) => void;
  acceptAllHandoffs: () => void;
}

const CasesContext = createContext<CasesContextValue | null>(null);

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<EmergencyCase[]>(initialCases);
  const { onCallOverrideId } = useWardOperations();

  const activeCases = useMemo(() => getActiveCases(cases), [cases]);
  const resolvedCases = useMemo(() => getResolvedCases(cases), [cases]);
  const activeCasePatientIds = useMemo(() => getActiveCasePatientIds(cases), [cases]);
  const sections = useMemo(() => getAllCaseSections(cases), [cases]);
  const dashboardPreview = useMemo(() => getDashboardCasePreviews(cases), [cases]);
  const pendingHandoffs = useMemo(() => getPendingHandoffCases(cases), [cases]);
  const handoffSummary = useMemo(() => getHandoffSummary(cases), [cases]);
  const patientsBlockedForNewCase = useMemo(() => getPatientsBlockedForNewCase(cases), [cases]);

  const addNote = useCallback((caseId: string, note: string) => {
    const trimmed = note.trim();
    if (!trimmed) return;

    setCases((current) =>
      current.map((caseItem) =>
        caseItem.id === caseId
          ? {
              ...caseItem,
              notes: [
                {
                  id: createNoteId(),
                  authorName: shiftContext.nurseName,
                  authorRole: "RN",
                  note: trimmed,
                  createdMinutesAgo: 0,
                },
                ...caseItem.notes,
              ],
            }
          : caseItem,
      ),
    );
  }, []);

  const triggerCase = useCallback(
    (input: TriggerCaseInput) => {
      const patients = getPatientsAvailableForNewCase(cases);
      const patient = patients.find((item) => item.id === input.patientId);
      if (!patient || !input.triggerNote.trim()) return null;

      const newCase = buildTriggeredCase(input, patient, onCallOverrideId);
      setCases((current) => [newCase, ...current]);
      return newCase.id;
    },
    [cases, onCallOverrideId],
  );

  const reopenCase = useCallback(
    (caseId: string, triggerNote: string) => {
      const trimmed = triggerNote.trim();
      if (!trimmed) return;

      setCases((current) =>
        current.map((caseItem) =>
          caseItem.id === caseId && caseItem.status === "resolved"
            ? reopenCaseRecord(caseItem, trimmed, onCallOverrideId)
            : caseItem,
        ),
      );
    },
    [onCallOverrideId],
  );

  const acceptHandoff = useCallback((caseId: string) => {
    setCases((current) =>
      current.map((caseItem) =>
        caseItem.id === caseId && caseItem.handoff?.status === "pending"
          ? acceptHandoffRecord(caseItem)
          : caseItem,
      ),
    );
  }, []);

  const acceptAllHandoffs = useCallback(() => {
    setCases((current) => acceptAllHandoffsRecords(current));
  }, []);

  const value = useMemo(
    (): CasesContextValue => ({
      cases,
      activeCases,
      resolvedCases,
      activeCasePatientIds,
      activeCaseCount: getActiveCaseCount(cases),
      caseBadgeUrgency: getCaseBadgeUrgency(cases),
      dashboardPreview,
      sections,
      pendingHandoffs,
      handoffSummary,
      patientsBlockedForNewCase,
      getCase: (caseId) => getCaseById(cases, caseId),
      getPatientCase: (patientId) => getCaseForPatient(cases, patientId),
      patientsAvailableForNewCase: getPatientsAvailableForNewCase(cases),
      addNote,
      triggerCase,
      reopenCase,
      acceptHandoff,
      acceptAllHandoffs,
    }),
    [
      cases,
      activeCases,
      resolvedCases,
      activeCasePatientIds,
      dashboardPreview,
      sections,
      pendingHandoffs,
      handoffSummary,
      patientsBlockedForNewCase,
      addNote,
      triggerCase,
      reopenCase,
      acceptHandoff,
      acceptAllHandoffs,
    ],
  );

  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
}

export function useCases() {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error("useCases must be used within CasesProvider");
  }
  return context;
}
