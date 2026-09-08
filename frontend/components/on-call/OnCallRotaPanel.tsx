"use client";

import { useWardOperations, loggedInClinicians } from "@/components/ward/WardOperationsStore";
import {
  getEscalationStepLabel,
  getScheduledBackupOnCall,
  getScheduledPrimaryOnCall,
  ON_CALL_ESCALATION_THRESHOLDS_MINUTES,
} from "@/lib/on-call-rota";
import { onCallCopy } from "@/lib/content/copy";

export function OnCallRotaPanel() {
  const { wardCode, activeOnCall, staleRota, onCallOverrideId, confirmOnCallOverride, clearOnCallOverride } =
    useWardOperations();
  const scheduled = getScheduledPrimaryOnCall(wardCode);
  const backup = getScheduledBackupOnCall(wardCode);
  const suggested = loggedInClinicians.find(
    (clinician) => clinician.name === staleRota.suggestedCoverName,
  );

  return (
    <section className="rounded-xl border border-line bg-surface-card p-5">
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
        {onCallCopy.panelEyebrow}
      </p>
      <h2 className="mt-1 font-display text-base font-semibold text-ink-primary">
        {onCallCopy.panelTitle}
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">{onCallCopy.panelDescription}</p>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-secondary">{onCallCopy.rotaLabel}</dt>
          <dd className="text-right font-medium text-ink-primary">{scheduled?.name ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-secondary">{onCallCopy.routingLabel}</dt>
          <dd className="text-right font-medium text-brand-core">{activeOnCall.name}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-secondary">{onCallCopy.backupLabel}</dt>
          <dd className="text-right font-medium text-ink-primary">{backup?.name ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-secondary">{onCallCopy.loggedInLabel}</dt>
          <dd className="text-right text-ink-primary">
            {staleRota.loggedInNames.length > 0
              ? staleRota.loggedInNames.join(", ")
              : onCallCopy.noneLoggedIn}
          </dd>
        </div>
      </dl>

      {staleRota.isStale && !onCallOverrideId ? (
        <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-3">
          <p className="text-sm font-medium text-ink-primary">{onCallCopy.staleTitle}</p>
          <p className="mt-1 text-sm text-ink-secondary">
            {onCallCopy.staleBody(staleRota.scheduledName, staleRota.suggestedCoverName ?? "—")}
          </p>
          {suggested ? (
            <button
              type="button"
              onClick={() => confirmOnCallOverride(suggested.id)}
              className="mt-3 rounded-lg bg-brand-core px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-core/90"
            >
              {onCallCopy.confirmCoverCta(suggested.name)}
            </button>
          ) : null}
        </div>
      ) : null}

      {onCallOverrideId ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-base px-3 py-2.5">
          <p className="text-sm text-ink-secondary">
            {onCallCopy.overrideActive(activeOnCall.name)}
          </p>
          <button
            type="button"
            onClick={clearOnCallOverride}
            className="text-sm font-medium text-brand-core hover:underline"
          >
            {onCallCopy.clearOverrideCta}
          </button>
        </div>
      ) : null}

      <div className="mt-4 border-t border-line pt-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {onCallCopy.escalationEyebrow}
        </p>
        <ul className="mt-2 space-y-1.5 text-xs text-ink-secondary">
          {ON_CALL_ESCALATION_THRESHOLDS_MINUTES.map((minutes) => (
            <li key={minutes}>
              <span className="font-mono text-ink-primary">T+{minutes}m</span> —{" "}
              {getEscalationStepLabel(minutes)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
