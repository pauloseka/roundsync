import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";

export function MobileAdminHeader() {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-card px-4 py-3 md:hidden">
      <Link href="/" aria-label="RoundSync home" className="shrink-0">
        <RoundSyncLogo
          markClassName="size-7"
          textClassName="font-display text-base font-semibold text-brand-core"
        />
      </Link>
      <Link
        href="/dashboard"
        className="inline-flex h-9 touch-manipulation items-center justify-center rounded-md border border-line bg-surface-base px-3 text-xs font-medium text-ink-primary transition-colors hover:bg-surface-card"
      >
        Ward app
      </Link>
    </header>
  );
}
