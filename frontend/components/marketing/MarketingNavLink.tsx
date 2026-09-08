"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SmoothScrollLink } from "@/components/marketing/SmoothScrollLink";
import {
  getSectionHash,
  getSectionPath,
  isSectionLink,
  resolveMarketingHref,
} from "@/lib/marketing-links";

interface MarketingNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function MarketingNavLink({
  href,
  children,
  className,
  onNavigate,
}: MarketingNavLinkProps) {
  const pathname = usePathname();
  const sectionHash = getSectionHash(href);
  const sectionPath = getSectionPath(href);
  const resolvedHref = resolveMarketingHref(href);
  const isSamePageSection =
    sectionHash && sectionPath !== null && pathname === sectionPath;

  if (isSamePageSection) {
    return (
      <SmoothScrollLink
        href={`#${sectionHash}`}
        className={className}
        onNavigate={onNavigate}
      >
        {children}
      </SmoothScrollLink>
    );
  }

  if (isSectionLink(href) || href.startsWith("/")) {
    return (
      <Link href={resolvedHref} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
