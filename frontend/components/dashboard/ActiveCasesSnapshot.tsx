"use client";

import Link from "next/link";
import { CaseListItem } from "@/components/cases/CaseListItem";
import { useCases } from "@/components/cases/CasesStore";
import { DashboardItemList } from "@/components/dashboard/DashboardItemList";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { casesCopy } from "@/lib/content/copy";

interface ActiveCasesSnapshotProps {
  className?: string;
}

export function ActiveCasesSnapshot({ className = "" }: ActiveCasesSnapshotProps) {
  const { dashboardPreview } = useCases();
  const copy = casesCopy.dashboardWidget;
  const { items: cases, total } = dashboardPreview;

  return (
    <DashboardWidget
      title={copy.title}
      description={copy.description}
      href="/cases"
      linkLabel={copy.linkLabel}
      className={className}
      totalCount={total}
      previewCount={cases.length}
      tooltipAlign="right"
    >
      {cases.length === 0 ? (
        <p className="text-sm text-ink-secondary">{copy.empty}</p>
      ) : (
        <DashboardItemList>
          {cases.map((caseItem) => (
            <li key={caseItem.id}>
              <Link
                href={`/cases/${caseItem.id}`}
                className="block rounded-lg border border-line bg-surface-base px-3 py-3 transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/20"
              >
                <CaseListItem caseItem={caseItem} variant="compact" />
              </Link>
            </li>
          ))}
        </DashboardItemList>
      )}
    </DashboardWidget>
  );
}
