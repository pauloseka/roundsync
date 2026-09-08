import { CaseRow } from "@/components/cases/CaseRow";
import { PanelHeaderTooltip } from "@/components/ui/PanelHeaderTooltip";
import type { EmergencyCase } from "@/lib/cases";

interface CaseSectionPanelProps {
  title: string;
  description: string;
  cases: EmergencyCase[];
  emptyMessage: string;
}

export function CaseSectionPanel({
  title,
  description,
  cases,
  emptyMessage,
}: CaseSectionPanelProps) {
  return (
    <section className="flex flex-col overflow-visible rounded-xl border border-line bg-surface-card">
      <PanelHeaderTooltip
        description={description}
        className="cursor-help border-b border-line px-5 py-3.5"
      >
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-ink-primary">{title}</h2>
          <span className="font-mono text-xs text-ink-secondary">{cases.length}</span>
        </header>
      </PanelHeaderTooltip>

      <div className="p-5">
        {cases.length === 0 ? (
          <p className="text-sm text-ink-secondary">{emptyMessage}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cases.map((caseItem) => (
              <CaseRow key={caseItem.id} caseItem={caseItem} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
