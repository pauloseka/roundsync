import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { DASHBOARD_HREF } from "@/lib/signup-routes";

interface SubscriptionPageHeaderProps {
  orgName?: string;
  showBackToWard?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function SubscriptionPageHeader({
  orgName,
  showBackToWard = false,
  backHref = DASHBOARD_HREF,
  backLabel = "Back to ward",
}: SubscriptionPageHeaderProps) {
  return (
    <header className="border-b border-line bg-surface-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-page py-5 md:px-10 lg:px-14">
        <Link href="/" aria-label="RoundSync home">
          <RoundSyncLogo
            markClassName="size-7"
            textClassName="font-display text-lg font-semibold text-brand-core"
          />
        </Link>
        <div className="flex items-center gap-4">
          {showBackToWard ? (
            <Link href={backHref} className="text-sm font-medium text-brand-core hover:underline">
              {backLabel}
            </Link>
          ) : null}
          {orgName ? (
            <p className="hidden text-sm text-ink-secondary sm:block">{orgName}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
