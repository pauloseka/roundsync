"use client";

import Link from "next/link";
import { useState } from "react";
import { pricingPageCopy } from "@/lib/pricing-content";
import {
  formatPrice,
  subscriptionAddOns,
  subscriptionTiers,
  type BillingCycle,
  type SubscriptionTier,
} from "@/lib/signup-data";
import {
  BOOK_DEMO_HREF,
  SIGN_UP_HREF,
  TALK_TO_SALES_HREF,
} from "@/lib/marketing-nav";

function PricingTierCard({
  tier,
  billingCycle,
  highlighted,
}: {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  highlighted?: boolean;
}) {
  const copy = pricingPageCopy;
  const price =
    billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  const priceSuffix =
    billingCycle === "monthly" ? "/ mo" : "/ yr";

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 sm:p-6 md:p-8 ${
        highlighted
          ? "border-brand-core bg-brand-core-muted/30 ring-1 ring-brand-core"
          : "border-line bg-surface-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-primary">{tier.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{tier.tagline}</p>
        </div>
        {highlighted ? (
          <span className="shrink-0 rounded-full bg-brand-core px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
            {copy.mostPopular}
          </span>
        ) : null}
      </div>

      <p className="mt-8 font-display text-3xl font-semibold text-ink-primary">
        {tier.selfServe ? (
          <>
            {formatPrice(price)}
            <span className="text-base font-normal text-ink-secondary">{priceSuffix}</span>
          </>
        ) : (
          <span className="text-lg">Custom pricing</span>
        )}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm text-ink-secondary">
        <li>{copy.seatsLabel(tier.seatLimit)}</li>
        <li>{copy.wardsLabel(tier.wardLimit)}</li>
      </ul>

      <div className="mt-8 flex-1 border-t border-line pt-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {copy.includesLabel}
        </p>
        <ul className="mt-4 space-y-2.5">
          {tier.highlights.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink-secondary">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {tier.selfServe ? (
          <Link
            href={SIGN_UP_HREF}
            className={`inline-flex h-11 w-full items-center justify-center rounded-md text-sm font-semibold transition-colors ${
              highlighted
                ? "bg-brand-core text-white hover:bg-brand-core/90"
                : "border border-line bg-surface-base text-ink-primary hover:bg-surface-card"
            }`}
          >
            {copy.ctaSelfServe}
          </Link>
        ) : (
          <Link
            href={TALK_TO_SALES_HREF}
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-base text-sm font-semibold text-ink-primary transition-colors hover:bg-surface-card"
          >
            {copy.ctaSales}
          </Link>
        )}
      </div>
    </article>
  );
}

export function PricingPageClient() {
  const copy = pricingPageCopy;
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <>
      <section className="border-b border-line bg-surface-card px-page py-10 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-primary sm:text-4xl md:text-5xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:mt-4 sm:text-base md:text-lg">
            {copy.subtitle}
          </p>

          <div className="mt-6 inline-flex max-w-full flex-wrap justify-center rounded-lg border border-line bg-surface-base p-1 sm:mt-8">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-surface-card text-ink-primary shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {copy.billingMonthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                billingCycle === "annual"
                  ? "bg-surface-card text-ink-primary shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {copy.billingAnnual}
              <span className="ml-1.5 font-mono text-[10px] uppercase tracking-wide text-brand-core">
                {copy.billingAnnualSave}
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="px-page py-12 md:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              highlighted={tier.id === "hospital"}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-base px-page py-16 md:py-20">
        <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-3xl">
          {copy.addOnsTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
          {copy.addOnsSubtitle}
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {subscriptionAddOns.map((addOn) => (
            <li
              key={addOn.id}
              className="rounded-xl border border-line bg-surface-card p-6"
            >
              <h3 className="font-display text-base font-semibold text-ink-primary">
                {addOn.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {addOn.description}
              </p>
              <p className="mt-4 font-display text-lg font-semibold text-ink-primary">
                {formatPrice(addOn.monthlyPrice)}
                <span className="text-sm font-normal text-ink-secondary"> / mo</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-surface-card px-page py-16 md:py-20">
        <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-3xl">
          {copy.compareTitle}
        </h2>
        <div className="mt-6 space-y-3 md:hidden">
          {copy.compareRows.map((row) => (
            <div key={row.feature} className="rounded-xl border border-line bg-surface-base p-4">
              <p className="text-sm font-medium text-ink-primary">{row.feature}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { label: "Clinic", included: row.clinic },
                  { label: "Hospital", included: row.hospital },
                  { label: "Network", included: row.network },
                ].map((tier) => (
                  <div key={tier.label}>
                    <dt className="font-mono uppercase tracking-wide text-ink-secondary">
                      {tier.label}
                    </dt>
                    <dd className="mt-1 text-base text-ink-secondary">
                      {tier.included ? (
                        <span className="text-brand-core" aria-label="Included">
                          ✓
                        </span>
                      ) : (
                        <span className="text-ink-tertiary" aria-label="Not included">
                          —
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-8 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">
                  Feature
                </th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">
                  Clinic
                </th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">
                  Hospital
                </th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">
                  Network
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.compareRows.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-primary">{row.feature}</td>
                  {[row.clinic, row.hospital, row.network].map((included, index) => (
                    <td key={index} className="px-4 py-3 text-ink-secondary">
                      {included ? (
                        <span className="text-brand-core" aria-label="Included">
                          ✓
                        </span>
                      ) : (
                        <span className="text-ink-tertiary" aria-label="Not included">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-line bg-surface-base px-page py-16 md:py-20">
        <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-3xl">
          {copy.faqTitle}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.faqs.map((faq) => (
            <li
              key={faq.question}
              className="rounded-xl border border-line bg-surface-card p-6"
            >
              <h3 className="font-display text-base font-semibold text-ink-primary">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-surface-card px-page py-16 md:py-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-line bg-surface-base p-8 text-center md:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink-primary">
            {copy.trialTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary md:text-base">
            {copy.trialBody}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={SIGN_UP_HREF}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 sm:w-auto"
            >
              {copy.trialCta}
            </Link>
            <Link
              href={BOOK_DEMO_HREF}
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-card px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
            >
              Book a demo
            </Link>
            <Link
              href={TALK_TO_SALES_HREF}
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-line bg-surface-card px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-base sm:w-auto"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
