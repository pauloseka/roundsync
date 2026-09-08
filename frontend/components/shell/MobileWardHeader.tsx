import type { ShiftContext } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/format";

interface MobileWardHeaderProps {
  shift: ShiftContext;
}

export function MobileWardHeader({ shift }: MobileWardHeaderProps) {
  const login = formatTimestamp(shift.loggedInAt);

  return (
    <header className="border-b border-line bg-surface-card px-4 py-3 md:hidden">
      <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
        {shift.ward}
      </p>
      <p className="mt-0.5 truncate font-display text-base font-semibold text-ink-primary">
        {shift.nurseName}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
        {shift.shiftStart} – {shift.shiftEnd}
        <span className="mx-1.5 text-line">·</span>
        <span suppressHydrationWarning>In {login.relative}</span>
      </p>
    </header>
  );
}
