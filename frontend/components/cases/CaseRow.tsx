"use client";

import Link from "next/link";
import { CaseListItem } from "@/components/cases/CaseListItem";
import type { EmergencyCase } from "@/lib/cases-types";

interface CaseRowProps {
  caseItem: EmergencyCase;
}

export function CaseRow({ caseItem }: CaseRowProps) {
  return (
    <li>
      <Link
        href={`/cases/${caseItem.id}`}
        className="block rounded-lg border border-line bg-surface-base px-3 py-3 transition-colors hover:border-brand-core/30 hover:bg-brand-core-muted/20"
      >
        <CaseListItem caseItem={caseItem} variant="full" />
      </Link>
    </li>
  );
}
