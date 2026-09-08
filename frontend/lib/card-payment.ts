export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export const acceptedCardBrands: CardBrand[] = ["visa", "mastercard", "amex"];

export interface CardBrandInfo {
  id: CardBrand;
  label: string;
}

export const cardBrandInfo: Record<Exclude<CardBrand, "unknown">, CardBrandInfo> = {
  visa: { id: "visa", label: "Visa" },
  mastercard: { id: "mastercard", label: "Mastercard" },
  amex: { id: "amex", label: "American Express" },
};

export function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function detectCardBrand(digits: string): CardBrand {
  if (!digits) return "unknown";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  return "unknown";
}

export function getCardDigitLimit(brand: CardBrand): number {
  return brand === "amex" ? 15 : 16;
}

export function getCvcDigitLimit(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

export function formatCardNumber(digits: string, brand: CardBrand): string {
  if (!digits) return "";

  if (brand === "amex") {
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 10);
    const part3 = digits.slice(10, 15);
    return [part1, part2, part3].filter(Boolean).join(" ");
  }

  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

export function formatCardNumberInput(value: string): {
  digits: string;
  formatted: string;
  brand: CardBrand;
} {
  const rawDigits = stripDigits(value);
  const brand = detectCardBrand(rawDigits);
  const limit = brand === "amex" ? 15 : 16;
  const digits = rawDigits.slice(0, limit);
  const resolvedBrand = detectCardBrand(digits);

  return {
    digits,
    formatted: formatCardNumber(digits, resolvedBrand === "unknown" ? "visa" : resolvedBrand),
    brand: resolvedBrand,
  };
}

export function formatExpiryInput(value: string): string {
  const digits = stripDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function formatCvcInput(value: string, brand: CardBrand): string {
  return stripDigits(value).slice(0, getCvcDigitLimit(brand));
}

export function getCardNumberPlaceholder(brand: CardBrand): string {
  if (brand === "amex") return "3782 822463 10005";
  return "4242 4242 4242 4242";
}

export function isCardNumberComplete(digits: string, brand: CardBrand): boolean {
  if (brand === "unknown") return false;
  return digits.length === getCardDigitLimit(brand);
}

export interface CardPaymentDetails {
  cardDigits: string;
  expiry: string;
  cvc: string;
  brand: CardBrand;
}

export type PaymentChargeResult =
  | { ok: true }
  | { ok: false; message: string };

/** Prototype charge simulation — mirrors common Stripe test cards. */
export function simulatePaymentCharge(details: CardPaymentDetails): PaymentChargeResult {
  const { cardDigits, expiry, cvc, brand } = details;

  if (!isCardNumberComplete(cardDigits, brand)) {
    return { ok: false, message: "Enter a complete card number." };
  }

  const expiryDigits = stripDigits(expiry);
  if (expiryDigits.length !== 4) {
    return { ok: false, message: "Enter a valid expiry date (MM / YY)." };
  }

  const month = Number(expiryDigits.slice(0, 2));
  if (month < 1 || month > 12) {
    return { ok: false, message: "Enter a valid expiry month." };
  }

  const requiredCvcLength = getCvcDigitLimit(brand);
  if (cvc.length !== requiredCvcLength) {
    return {
      ok: false,
      message: `Enter the ${requiredCvcLength}-digit security code on your card.`,
    };
  }

  if (cardDigits === "4000000000000002" || cardDigits === "4000000000009995") {
    return {
      ok: false,
      message:
        "Your card was declined. Check the details or try a different card — your account has not been charged.",
    };
  }

  if (cardDigits.startsWith("4000000000000127")) {
    return {
      ok: false,
      message: "This card has expired. Use a different card to continue.",
    };
  }

  return { ok: true };
}
