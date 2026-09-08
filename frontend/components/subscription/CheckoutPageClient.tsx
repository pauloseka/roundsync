"use client";

import Link from "next/link";
import { useState } from "react";
import { signupPrimaryButtonClassName } from "@/components/signup/signup-form-styles";
import { CardPaymentFields } from "@/components/checkout/CardPaymentFields";
import { SubscriptionPageHeader } from "@/components/subscription/SubscriptionPageHeader";
import { useCheckoutGuard } from "@/components/subscription/useCheckoutGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { signUpCopy } from "@/lib/signup-content";
import {
  calculateCheckoutTotal,
  formatPrice,
  getTierById,
  subscriptionAddOns,
  type BillingCycle,
} from "@/lib/signup-data";
import { SUBSCRIPTION_HREF, ADMIN_HREF } from "@/lib/signup-routes";
import {
  activateSubscription,
  getSignUpSession,
  setBillingCycle,
  setSelectedAddOns,
} from "@/lib/signup-session";
import {
  simulatePaymentCharge,
  type CardPaymentDetails,
} from "@/lib/card-payment";

type PaymentStatus = "idle" | "processing" | "success" | "failed";

const emptyPaymentDetails: CardPaymentDetails = {
  cardDigits: "",
  expiry: "",
  cvc: "",
  brand: "unknown",
};

export function CheckoutPageClient() {
  const ready = useCheckoutGuard();
  const checkoutCopy = signUpCopy.checkout;

  const session = getSignUpSession();
  const selectedTierId = session.selectedTierId ?? "hospital";
  const staffExpected = session.organization?.staffExpected ?? 0;
  const orgName = session.organization?.hospitalName ?? "";
  const [billingCycle, setBillingCycleState] = useState<BillingCycle>(session.billingCycle ?? "monthly");
  const [selectedAddOnIds, setSelectedAddOnIdsState] = useState<string[]>(session.selectedAddOnIds ?? []);
  const [paymentDetails, setPaymentDetails] = useState<CardPaymentDetails>(emptyPaymentDetails);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!ready) return <PageLoadingFallback />;

  const selectedTier = getTierById(selectedTierId);
  const total = calculateCheckoutTotal(
    selectedTierId,
    billingCycle,
    staffExpected,
    selectedAddOnIds,
  );
  const isProcessing = paymentStatus === "processing";
  const isComplete = paymentStatus === "success";

  function handleBillingChange(cycle: BillingCycle) {
    if (isProcessing || isComplete) return;
    setBillingCycleState(cycle);
    setBillingCycle(cycle);
  }

  function toggleAddOn(id: string) {
    if (isProcessing || isComplete) return;
    const next = selectedAddOnIds.includes(id)
      ? selectedAddOnIds.filter((item) => item !== id)
      : [...selectedAddOnIds, id];
    setSelectedAddOnIdsState(next);
    setSelectedAddOns(next);
  }

  function handlePaymentDetailsChange(details: CardPaymentDetails) {
    setPaymentDetails(details);
    if (paymentStatus === "failed") {
      setPaymentStatus("idle");
      setPaymentError(null);
    }
  }

  async function handleActivate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessing || isComplete) return;

    setPaymentStatus("processing");
    setPaymentError(null);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = simulatePaymentCharge(paymentDetails);

    if (!result.ok) {
      setPaymentStatus("failed");
      setPaymentError(result.message);
      return;
    }

    activateSubscription();
    setPaymentStatus("success");
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <SubscriptionPageHeader
        orgName={orgName}
        backHref={SUBSCRIPTION_HREF}
        backLabel="Change plan"
        showBackToWard
      />

      <main className="mx-auto max-w-6xl px-page py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <section className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core">
            {checkoutCopy.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-primary md:text-4xl">
            {checkoutCopy.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary">{checkoutCopy.subtitle}</p>
        </section>

        {paymentStatus === "success" ? (
          <div className="mt-12 md:mt-16">
            <div className="mx-auto max-w-lg rounded-2xl border border-brand-core/30 bg-brand-core-muted/40 p-8 text-center md:p-10">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-core/15">
                <span className="text-xl text-brand-core" aria-hidden="true">
                  ✓
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink-primary">
                {checkoutCopy.paymentSuccessTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary md:text-base">
                {checkoutCopy.paymentSuccessBody}
              </p>
              <Link
                href={ADMIN_HREF}
                className={`${signupPrimaryButtonClassName} mx-auto mt-8 max-w-xs`}
              >
                {checkoutCopy.paymentSuccessCta}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="mt-12 md:mt-16">
            {paymentStatus === "failed" && paymentError ? (
              <div
                className="mb-6 rounded-xl border border-critical/30 bg-critical-muted p-5 md:p-6"
                role="alert"
              >
                <p className="font-display text-base font-semibold text-critical">
                  {checkoutCopy.paymentFailedTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-primary">{paymentError}</p>
                <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
                  {checkoutCopy.paymentFailedHint}
                </p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-line bg-surface-card p-8 md:p-10">
              <div className="grid gap-10 xl:grid-cols-[1fr_280px] xl:gap-12">
                <div className="space-y-10">
                  <div>
                    <p className="text-sm font-medium text-ink-primary">Billing cycle</p>
                    <div className="mt-3 inline-flex rounded-lg border border-line p-1">
                      <button
                        type="button"
                        onClick={() => handleBillingChange("monthly")}
                        disabled={isProcessing}
                        className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                          billingCycle === "monthly"
                            ? "bg-brand-core text-white"
                            : "text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        {checkoutCopy.billingMonthly}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBillingChange("annual")}
                        disabled={isProcessing}
                        className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                          billingCycle === "annual"
                            ? "bg-brand-core text-white"
                            : "text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        {checkoutCopy.billingAnnual}{" "}
                        <span className="text-xs opacity-80">({checkoutCopy.billingAnnualSave})</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink-primary">{checkoutCopy.addOnsTitle}</p>
                    <p className="mt-1 text-sm text-ink-secondary">{checkoutCopy.addOnsDescription}</p>
                    <ul className="mt-4 space-y-3">
                      {subscriptionAddOns.map((addOn) => (
                        <li key={addOn.id}>
                          <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-line p-4 transition-colors hover:border-brand-core/30">
                            <input
                              type="checkbox"
                              checked={selectedAddOnIds.includes(addOn.id)}
                              onChange={() => toggleAddOn(addOn.id)}
                              disabled={isProcessing}
                              className="mt-0.5 size-4 rounded border-line text-brand-core focus:ring-brand-core disabled:cursor-not-allowed"
                            />
                            <span>
                              <span className="block text-sm font-medium text-ink-primary">
                                {addOn.name}
                              </span>
                              <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
                                {addOn.description} · {formatPrice(addOn.monthlyPrice)}/mo
                              </span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CardPaymentFields
                    onDetailsChange={handlePaymentDetailsChange}
                    disabled={isProcessing}
                  />
                </div>

                <aside className="h-fit rounded-2xl border border-line bg-surface-base p-6 md:p-7">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                    {checkoutCopy.orderSummary}
                  </p>
                  <p className="mt-4 font-display text-xl font-semibold text-ink-primary">
                    {selectedTier.name} plan
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {staffExpected} seats · {billingCycle === "monthly" ? "Monthly" : "Annual"}
                  </p>
                  <div className="mt-6 border-t border-line pt-6">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                      {checkoutCopy.dueToday}
                    </p>
                    <p className="mt-2 font-display text-3xl font-semibold text-ink-primary">
                      {total !== null ? formatPrice(total) : "—"}
                    </p>
                  </div>
                  <Link
                    href={SUBSCRIPTION_HREF}
                    className="mt-4 inline-block text-sm font-medium text-brand-core hover:underline"
                  >
                    Change plan
                  </Link>
                </aside>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`${signupPrimaryButtonClassName} mt-10 max-w-md`}
              >
                {isProcessing ? checkoutCopy.processing : checkoutCopy.activatePlan}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
