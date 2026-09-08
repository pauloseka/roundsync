"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 80;

export function MarketingHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    function scrollToHash() {
      const target = document.getElementById(hash);
      if (!target) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    const timeout = window.setTimeout(scrollToHash, 50);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}
