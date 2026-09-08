"use client";

import Link from "next/link";
import { CaseSectionPanel } from "@/components/cases/CaseSectionPanel";
import { CasesQueueSidebar } from "@/components/cases/CasesQueueSidebar";
import { ReopenCaseForm } from "@/components/cases/ReopenCaseForm";
import { useCases } from "@/components/cases/CasesStore";
import { casesCopy } from "@/lib/content/copy";
import { formatMessageAgo } from "@/lib/dashboard-data";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import { formatPatientLocation } from "@/lib/format-patient";

export function CasesQueueClient() {
  const { sections, resolvedCases, reopenCase } = useCases();
  const escalated = sections.find((section) => section.id === "escalated")!;
  const open = sections.find((section) => section.id === "open")!;
  const reopened = sections.find((section) => section.id === "reopened")!;
  const copy = casesCopy.sections;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          Active Cases
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-primary">
              Emergency queue
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              {casesCopy.pageSubtitle}
            </p>
          </div>
          <Link
            href="/cases/new"
            className="shrink-0 rounded-lg bg-brand-core px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Trigger new case
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-6">
          <CaseSectionPanel
            title={copy.escalated.label}
            description={copy.escalated.description}
            cases={escalated.cases}
            emptyMessage={copy.escalated.empty}
          />
          <CaseSectionPanel
            title={copy.open.label}
            description={copy.open.description}
            cases={open.cases}
            emptyMessage={copy.open.empty}
          />
        </div>
        <div className="flex flex-col gap-6 xl:col-span-3">
          <CaseSectionPanel
            title={copy.reopened.label}
            description={copy.reopened.description}
            cases={reopened.cases}
            emptyMessage={copy.reopened.empty}
          />

          <section className="rounded-xl border border-line bg-surface-card p-5">
            <h2 className="font-display text-base font-semibold text-ink-primary">
              Recently resolved
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Reopen if the patient relapses — keeps history on the same case row.
            </p>
            {resolvedCases.length === 0 ? (
              <p className="mt-4 text-sm text-ink-secondary">No resolved cases to reopen.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {resolvedCases.map((caseItem) => (
                  <li
                    key={caseItem.id}
                    className="rounded-lg border border-line bg-surface-base px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold text-ink-primary">
                          {caseItem.patientName}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-ink-secondary">
                          {formatPatientLocation(caseItem)}
                        </p>
                      </div>
                      <UrgencyChip level={caseItem.urgencyLevel} />
                    </div>
                    <p className="mt-2 text-sm text-ink-secondary">{caseItem.summary}</p>
                    {caseItem.resolvedMinutesAgo !== undefined ? (
                      <p className="mt-2 font-mono text-xs text-ink-secondary">
                        Resolved {formatMessageAgo(caseItem.resolvedMinutesAgo)}
                      </p>
                    ) : null}
                    <div className="mt-3">
                      <ReopenCaseForm
                        caseItem={caseItem}
                        onReopen={(note) => reopenCase(caseItem.id, note)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="xl:col-span-3">
          <CasesQueueSidebar />
        </div>
      </div>
    </div>
  );
}
