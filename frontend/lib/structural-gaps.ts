/**
 * RoundSync structural gap solutions — where to find each implementation.
 *
 * 1. Shift ends mid-case → lib/handoff.ts
 *    UI: components/handoff/ShiftHandoffPanel.tsx (Dashboard)
 *        components/cases/CaseOwnershipChip.tsx (case cards)
 *
 * 2. Resolved case relapses → lib/case-relapse.ts
 *    UI: components/cases/RelapseSuggestionPanel.tsx
 *        Active Cases → Reopened section (lib/cases.ts getAllCaseSections)
 *
 * 3. On-call without manual checkbox → lib/on-call-rota.ts
 *    UI: components/on-call/OnCallRotaPanel.tsx (Cases sidebar)
 *        components/ward/WardOperationsStore.tsx (override state)
 *
 * Copy strings: lib/content/copy.ts (handoffCopy, relapseCopy, onCallCopy)
 * Seed data: lib/cases-seed.ts (pending handoffs, reopened case-003, resolved case-004)
 */

export { getHandoffSummary, getPendingHandoffCases } from "@/lib/handoff";
export {
  getRecentlyResolvedCase,
  shouldSuggestReopen,
  RELAPSE_REOPEN_WINDOW_MINUTES,
} from "@/lib/case-relapse";
export { assessOnCallRota, resolveAlertRecipient } from "@/lib/on-call-rota";
