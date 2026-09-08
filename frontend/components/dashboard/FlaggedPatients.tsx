"use client";

import Link from "next/link";
import { useCases } from "@/components/cases/CasesStore";
import { QuickAlertTrigger } from "@/components/cases/QuickAlertTrigger";
import { DashboardItemCard, DashboardItemList } from "@/components/dashboard/DashboardItemList";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { clinicalWarningsCopy } from "@/lib/content/copy";
import { formatMessageAgo, getClinicalWarningSnapshots } from "@/lib/dashboard-data";
import { formatPatientLocation } from "@/lib/format-patient";
import { getPatientById } from "@/lib/patients";
import { shiftPatients } from "@/lib/mock-data";
import { vitalsStatusLabel } from "@/lib/vitals";

interface FlaggedPatientsProps {
  className?: string;
}

export function FlaggedPatients({ className = "" }: FlaggedPatientsProps) {
  const { activeCasePatientIds } = useCases();
  const copy = clinicalWarningsCopy.dashboardWidget;
  const { items: warnings, total } = getClinicalWarningSnapshots(
    shiftPatients,
    2,
    activeCasePatientIds,
  );

  return (
    <DashboardWidget
      title={copy.title}
      description={copy.description}
      href="/patients"
      linkLabel={copy.linkLabel}
      className={className}
      totalCount={total}
      previewCount={warnings.length}
    >
      {warnings.length === 0 ? (
        <p className="text-sm text-ink-secondary">{copy.empty}</p>
      ) : (
        <DashboardItemList>
          {warnings.map((warning) => {
            const vitals = vitalsStatusLabel[warning.vitalsStatus];
            const patient = getPatientById(shiftPatients, warning.patientId);

            return (
              <DashboardItemCard key={warning.id} className="flex flex-col gap-0 p-0">
                <Link
                  href={`/patients/${warning.patientId}`}
                  className="block px-3 py-3 transition-colors hover:bg-brand-core-muted/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-ink-primary">
                        {warning.patientName}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-ink-secondary">
                        {formatPatientLocation(warning)}
                      </p>
                      <p className="mt-2 text-sm font-medium text-ink-primary">{warning.signal}</p>
                      <p className="mt-2 text-sm text-ink-secondary">{warning.trend}</p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${vitals.className}`}
                      >
                        {vitals.label}
                      </span>
                      <span className="text-right font-mono text-xs text-ink-secondary">
                        Flagged {formatMessageAgo(warning.flaggedMinutesAgo)}
                      </span>
                    </div>
                  </div>
                </Link>

                {patient ? (
                  <div className="border-t border-line px-3 py-3">
                    <QuickAlertTrigger patient={patient} layout="buttons" />
                  </div>
                ) : null}
              </DashboardItemCard>
            );
          })}
        </DashboardItemList>
      )}
    </DashboardWidget>
  );
}
