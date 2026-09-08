import type { ShiftContext } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/format";

interface TopBarProps {
  shift: ShiftContext;
}

export function TopBar({ shift }: TopBarProps) {
  const login = formatTimestamp(shift.loggedInAt);

  return (
    <header className="hidden items-center justify-between gap-4 border-b border-line bg-surface-card px-4 py-3 md:flex md:px-6">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Current shift
        </p>
        <p className="mt-0.5 font-display text-lg font-semibold text-ink-primary">
          {shift.nurseName}
        </p>
        <p className="text-sm text-ink-secondary">{shift.ward}</p>
      </div>

      <p className="max-w-[min(100%,22rem)] shrink-0 text-right font-mono text-xs leading-relaxed text-ink-secondary sm:max-w-none sm:whitespace-nowrap">
        <span>
          Starts{" "}
          <span className="font-medium text-ink-primary">{shift.shiftStart}</span>
        </span>
        <span className="mx-2 text-line">·</span>
        <span>
          Ends{" "}
          <span className="font-medium text-ink-primary">{shift.shiftEnd}</span>
        </span>
        <span className="mx-2 text-line">·</span>
        <span suppressHydrationWarning>
          In{" "}
          <span className="font-medium text-ink-primary">{login.relative}</span>{" "}
          <span className="text-ink-secondary">({login.absolute})</span>
        </span>
      </p>
    </header>
  );
}
