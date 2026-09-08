"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  signupPrimaryButtonClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { PlanTierCard } from "@/components/subscription/PlanTierCard";
import { SubscriptionPageHeader } from "@/components/subscription/SubscriptionPageHeader";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { useSubscriptionGuard } from "@/components/subscription/useSubscriptionGuard";
import { signUpCopy } from "@/lib/signup-content";
import {
  buildRecommendationReason,
  getTierById,
  subscriptionTiers,
  type SubscriptionTierId,
} from "@/lib/signup-data";
import { TALK_TO_SALES_HREF } from "@/lib/marketing-nav";
import { CHECKOUT_HREF, ADMIN_HREF, DASHBOARD_HREF } from "@/lib/signup-routes";
import {
  TRIAL_DAYS,
  canStartFreeTrial,
  getSignUpSession,
  getTrialDaysRemaining,
  hasProductAccess,
  isCurrentUserOrgAdmin,
  isTrialActive,
  isTrialExpired,
  selectTier,
  startFreeTrial,
} from "@/lib/signup-session";

export function SubscriptionPageClient() {
  const router = useRouter();
  const ready = useSubscriptionGuard();
  const copy = signUpCopy.subscription;
  const trialCopy = signUpCopy.trial;
  const planCopy = signUpCopy.plan;

  const showTrialOption = canStartFreeTrial();
  const isOrgAdmin = isCurrentUserOrgAdmin();
  const productAccess = hasProductAccess();
  const session = getSignUpSession();

  const [selectedTierId, setSelectedTierId] = useState<SubscriptionTierId>(
    () => session.selectedTierId ?? "hospital",
  );
  const recommendationReason =
    session.organization && session.recommendedTierId
      ? buildRecommendationReason(
          session.organization.staffExpected,
          session.organization.wardCount,
          session.organization.multiLocation,
          session.recommendedTierId,
        )
      : "";
  const staffExpected = session.organization?.staffExpected ?? 0;
  const orgName = session.organization?.hospitalName ?? "";
  const [startingTrial, setStartingTrial] = useState(false);

  const trialActive = isTrialActive();
  const trialExpired = isTrialExpired();
  const daysLeft = getTrialDaysRemaining();
  const dayLabel = daysLeft === 1 ? trialCopy.daySingular : trialCopy.dayPlural;

  const statusLabel = trialActive
    ? trialCopy.bannerLabel
    : trialExpired
      ? copy.statusLabel
      : showTrialOption
        ? trialCopy.choiceLabel
        : copy.statusLabel;
  const statusTitle = trialActive
    ? trialCopy.subscriptionActiveTitle(daysLeft, dayLabel)
    : trialExpired
      ? trialCopy.subscriptionExpiredTitle
      : showTrialOption
        ? trialCopy.choiceTitle(TRIAL_DAYS)
        : copy.statusTitle;
  const statusBody = trialActive
    ? trialCopy.subscriptionActiveBody
    : trialExpired
      ? trialCopy.subscriptionExpiredBody
      : showTrialOption
        ? trialCopy.choiceBody
        : copy.statusBody;

  if (!ready) return <PageLoadingFallback />;

  const selectedTier = getTierById(selectedTierId);
  const showBackLink = isOrgAdmin ? productAccess : trialActive;
  const backHref = isOrgAdmin ? ADMIN_HREF : DASHBOARD_HREF;
  const backLabel = isOrgAdmin ? copy.backToAdmin : copy.backToWard;

  function handleSelectTier(tierId: SubscriptionTierId) {
    setSelectedTierId(tierId);
    selectTier(tierId);
  }

  async function handleStartTrial() {
    if (!showTrialOption) return;

    setStartingTrial(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    startFreeTrial();
    setStartingTrial(false);
    router.push(ADMIN_HREF);
  }

  function handleContinueToCheckout() {
    if (!selectedTier.selfServe) return;
    selectTier(selectedTierId);
    router.push(CHECKOUT_HREF);
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <SubscriptionPageHeader
        orgName={orgName}
        showBackToWard={showBackLink}
        backHref={backHref}
        backLabel={backLabel}
      />

      <main className="mx-auto max-w-6xl px-page py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand-core">
            {statusLabel}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-primary md:text-4xl">
            {statusTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-secondary">
            {statusBody}
          </p>
        </section>

        <section className="mt-16 space-y-16 md:mt-20 md:space-y-20">
          {showTrialOption ? (
            <div className="rounded-2xl border border-dashed border-brand-core/35 bg-brand-core-muted/20 p-8 md:p-10">
              <div className="mx-auto max-w-2xl text-center">
                <p className="font-display text-xl font-semibold text-ink-primary md:text-2xl">
                  {trialCopy.startTrialTitle(TRIAL_DAYS)}
                </p>
                <p className="mt-4 text-base leading-relaxed text-ink-secondary">
                  {trialCopy.startTrialBody}
                </p>
                <button
                  type="button"
                  onClick={handleStartTrial}
                  disabled={startingTrial}
                  className={`${signupSecondaryButtonClassName} mx-auto mt-8 max-w-sm border-brand-core/30 bg-surface-card hover:bg-brand-core-muted/30`}
                >
                  {startingTrial ? trialCopy.startingTrial : trialCopy.startTrialCta(TRIAL_DAYS)}
                </button>
              </div>
            </div>
          ) : null}

          {showTrialOption ? (
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-line" aria-hidden="true" />
              <p className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                {trialCopy.orChoosePlan}
              </p>
              <div className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
          ) : null}

          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold text-ink-primary md:text-[1.75rem]">
                {copy.pageTitle}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-secondary">{copy.pageSubtitle}</p>
            </div>

            {recommendationReason ? (
              <div className="rounded-xl border border-line bg-surface-card p-6 md:max-w-3xl">
                <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
                  {planCopy.recommendationPrefix}
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-primary">
                  {recommendationReason}
                </p>
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-3">
              {subscriptionTiers.map((tier) => (
                <PlanTierCard
                  key={tier.id}
                  tier={tier}
                  selected={selectedTierId === tier.id}
                  recommended={getSignUpSession().recommendedTierId === tier.id}
                  onSelect={() => handleSelectTier(tier.id)}
                />
              ))}
            </div>

            <p className="text-sm leading-relaxed text-ink-secondary">
              {planCopy.seatUsage(staffExpected, selectedTier.seatLimit)}
            </p>

            {selectedTier.selfServe ? (
              <button
                type="button"
                onClick={handleContinueToCheckout}
                className={`${signupPrimaryButtonClassName} max-w-md`}
              >
                {planCopy.continueCheckout}
              </button>
            ) : (
              <Link
                href={`${TALK_TO_SALES_HREF}?from=subscription`}
                className={`${signupPrimaryButtonClassName} block max-w-md text-center`}
              >
                {planCopy.talkToSales}
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
