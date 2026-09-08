import type { CaseUrgency } from "@/lib/mock-data";

const urgencyConfig: Record<
  CaseUrgency,
  { label: string; bg: string; text: string; icon: string }
> = {
  critical: {
    label: "Critical",
    bg: "bg-critical-muted",
    text: "text-critical",
    icon: "●",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-urgent-muted",
    text: "text-urgent",
    icon: "▲",
  },
  moderate: {
    label: "Moderate",
    bg: "bg-moderate-muted",
    text: "text-moderate",
    icon: "◆",
  },
};

interface UrgencyChipProps {
  level: CaseUrgency;
  className?: string;
}

export function UrgencyChip({ level, className = "" }: UrgencyChipProps) {
  const config = urgencyConfig[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <span aria-hidden="true" className="text-[10px] leading-none">
        {config.icon}
      </span>
      {config.label}
    </span>
  );
}
