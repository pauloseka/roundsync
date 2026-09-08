import { DEMO_BLOCK_RULES, formatBookingHoursLabel } from "@/lib/demo-scheduling";
import { bookDemoPanelCopy } from "@/lib/book-demo-content";
import { cn } from "@/lib/design-system/cn";

interface DemoBookingRulesPanelProps {
  compact?: boolean;
}

export function DemoBookingRulesPanel({ compact = false }: DemoBookingRulesPanelProps) {
  const copy = bookDemoPanelCopy;

  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface-card/80 backdrop-blur-sm",
        compact ? "p-4" : "p-5",
      )}
    >
      <div className={compact ? "space-y-4" : "space-y-5"}>
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            {copy.bookingHoursTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            {formatBookingHoursLabel()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            {copy.blockedPatternsTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
            {DEMO_BLOCK_RULES.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="text-brand-core" aria-hidden="true">
                  ·
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
