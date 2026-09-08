import { signUpCopy } from "@/lib/signup-content";
import { formatPrice, type SubscriptionTier } from "@/lib/signup-data";

interface PlanTierCardProps {
  tier: SubscriptionTier;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}

export function PlanTierCard({ tier, selected, recommended, onSelect }: PlanTierCardProps) {
  const planCopy = signUpCopy.plan;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-full w-full flex-col rounded-2xl border p-6 text-left transition-colors md:p-8 ${
        selected
          ? "border-brand-core bg-brand-core-muted/30 ring-1 ring-brand-core"
          : "border-line bg-surface-card hover:border-brand-core/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold text-ink-primary">{tier.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{tier.tagline}</p>
        </div>
        {recommended ? (
          <span className="shrink-0 rounded-full bg-brand-core px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
            Recommended
          </span>
        ) : null}
      </div>

      <p className="mt-8 font-display text-3xl font-semibold text-ink-primary">
        {tier.selfServe ? (
          <>
            {formatPrice(tier.monthlyPrice)}
            <span className="text-base font-normal text-ink-secondary"> / mo</span>
          </>
        ) : (
          <span className="text-lg">Talk to sales</span>
        )}
      </p>

      <div className="mt-8 flex-1 border-t border-line pt-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {planCopy.includesLabel}
        </p>
        <ul className="mt-4 space-y-2.5">
          {tier.highlights.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink-secondary">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
