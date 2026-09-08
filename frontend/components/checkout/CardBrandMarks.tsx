import type { CardBrand } from "@/lib/card-payment";
import { cardBrandInfo } from "@/lib/card-payment";

function VisaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" fillOpacity="0.95" />
    </svg>
  );
}

function AmexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        AMEX
      </text>
    </svg>
  );
}

const brandMarks: Record<Exclude<CardBrand, "unknown">, typeof VisaMark> = {
  visa: VisaMark,
  mastercard: MastercardMark,
  amex: AmexMark,
};

interface AcceptedCardsProps {
  detectedBrand: CardBrand;
}

export function AcceptedCards({ detectedBrand }: AcceptedCardsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(cardBrandInfo) as Exclude<CardBrand, "unknown">[]).map((brand) => {
        const Mark = brandMarks[brand];
        const active = detectedBrand === brand;
        const label = cardBrandInfo[brand].label;

        return (
          <div
            key={brand}
            className={`flex items-center gap-2 rounded-md border px-2 py-1 transition-opacity ${
              detectedBrand === "unknown" || active
                ? "border-line bg-surface-base opacity-100"
                : "border-transparent bg-transparent opacity-35"
            } ${active ? "ring-1 ring-brand-core/40" : ""}`}
            title={label}
          >
            <Mark className="h-5 w-8 shrink-0" />
            <span className="hidden text-[11px] font-medium text-ink-secondary sm:inline">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DetectedCardBrand({ brand }: { brand: CardBrand }) {
  if (brand === "unknown") return null;

  const Mark = brandMarks[brand];
  const label = cardBrandInfo[brand].label;

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <Mark className="h-6 w-9 shrink-0" />
      <span className="text-xs font-medium text-ink-secondary">{label}</span>
    </div>
  );
}
