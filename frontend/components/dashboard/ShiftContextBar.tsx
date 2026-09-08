import { shiftTeam } from "@/lib/dashboard-data";
import { PanelHeaderTooltip } from "@/components/ui/PanelHeaderTooltip";
import type { ShiftContext } from "@/lib/mock-data";
import { formatShiftRemaining } from "@/lib/format";

interface ShiftContextBarProps {
  shift: ShiftContext;
}

export function ShiftContextBar({ shift }: ShiftContextBarProps) {
  const remaining = formatShiftRemaining(shift.shiftEnd);
  const othersOnShift = shiftTeam.filter((member) => !member.isYou);

  return (
    <section className="overflow-visible rounded-xl border border-line bg-surface-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PanelHeaderTooltip
          description="Your ward, shift window, time remaining, and who's on shift with you."
          className="w-fit"
        >
          <div>
            <p className="cursor-help font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
              Shift context
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-ink-primary">{shift.ward}</p>
            <p className="mt-0.5 font-mono text-sm text-ink-secondary">
              {shift.shiftStart}–{shift.shiftEnd} ·{" "}
              <span className="font-medium text-ink-primary" suppressHydrationWarning>
                {remaining}
              </span>
            </p>
          </div>
        </PanelHeaderTooltip>

        <div className="md:text-right">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            On shift with
          </p>
          <ul className="mt-0.5 flex flex-wrap gap-2 md:justify-end">
            {othersOnShift.map((member) => (
              <li
                key={member.name}
                className="rounded-md border border-line bg-surface-base px-2.5 py-1 text-xs text-ink-primary"
              >
                <span className="font-medium">{member.name}</span>
                <span className="text-ink-secondary"> · {member.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
