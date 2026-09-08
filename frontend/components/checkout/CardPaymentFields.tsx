"use client";

import { useState } from "react";
import { signupInputClassName } from "@/components/signup/signup-form-styles";
import { AcceptedCards, DetectedCardBrand } from "@/components/checkout/CardBrandMarks";
import {
  formatCardNumberInput,
  formatCvcInput,
  formatExpiryInput,
  getCardNumberPlaceholder,
  getCvcDigitLimit,
  type CardBrand,
  type CardPaymentDetails,
} from "@/lib/card-payment";
import { signUpCopy } from "@/lib/signup-content";

interface CardPaymentFieldsProps {
  onDetailsChange?: (details: CardPaymentDetails) => void;
  disabled?: boolean;
}

export function CardPaymentFields({ onDetailsChange, disabled = false }: CardPaymentFieldsProps) {
  const checkoutCopy = signUpCopy.checkout;
  const [cardNumber, setCardNumber] = useState("");
  const [cardBrand, setCardBrand] = useState<CardBrand>("unknown");
  const [cardDigits, setCardDigits] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  function emitDetails(next: Partial<CardPaymentDetails> & { cardDigits: string; brand: CardBrand }) {
    onDetailsChange?.({
      cardDigits: next.cardDigits,
      expiry: next.expiry ?? expiry,
      cvc: next.cvc ?? cvc,
      brand: next.brand,
    });
  }

  function handleCardNumberChange(value: string) {
    const { formatted, brand, digits } = formatCardNumberInput(value);
    setCardNumber(formatted);
    setCardBrand(brand);
    setCardDigits(digits);
    setCvc((current) => {
      const nextCvc = formatCvcInput(current, brand);
      emitDetails({ cardDigits: digits, brand, cvc: nextCvc });
      return nextCvc;
    });
  }

  function handleExpiryChange(value: string) {
    const nextExpiry = formatExpiryInput(value);
    setExpiry(nextExpiry);
    emitDetails({ cardDigits, brand: cardBrand, expiry: nextExpiry });
  }

  function handleCvcChange(value: string) {
    const nextCvc = formatCvcInput(value, cardBrand);
    setCvc(nextCvc);
    emitDetails({ cardDigits, brand: cardBrand, cvc: nextCvc });
  }

  const cvcPlaceholder = getCvcDigitLimit(cardBrand) === 4 ? "1234" : "123";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-primary">{checkoutCopy.paymentTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{checkoutCopy.paymentNote}</p>
        </div>
        <div className="sm:text-right">
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
            {checkoutCopy.acceptedCards}
          </p>
          <AcceptedCards detectedBrand={cardBrand} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="checkout-card" className="block text-sm font-medium text-ink-primary">
              {checkoutCopy.cardNumber}
            </label>
            <DetectedCardBrand brand={cardBrand} />
          </div>
          <input
            id="checkout-card"
            inputMode="numeric"
            autoComplete="cc-number"
            className={signupInputClassName}
            placeholder={getCardNumberPlaceholder(cardBrand)}
            value={cardNumber}
            onChange={(event) => handleCardNumberChange(event.target.value)}
            required
            disabled={disabled}
            aria-describedby="checkout-card-hint"
          />
          <p id="checkout-card-hint" className="mt-2 text-xs text-ink-secondary">
            {checkoutCopy.cardNumberHint}
          </p>
        </div>

        <div>
          <label htmlFor="checkout-expiry" className="block text-sm font-medium text-ink-primary">
            {checkoutCopy.expiry}
          </label>
          <input
            id="checkout-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            className={signupInputClassName}
            placeholder="MM / YY"
            value={expiry}
            onChange={(event) => handleExpiryChange(event.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div>
          <label htmlFor="checkout-cvc" className="block text-sm font-medium text-ink-primary">
            {checkoutCopy.cvc}
          </label>
          <input
            id="checkout-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            className={signupInputClassName}
            placeholder={cvcPlaceholder}
            value={cvc}
            onChange={(event) => handleCvcChange(event.target.value)}
            maxLength={getCvcDigitLimit(cardBrand)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
