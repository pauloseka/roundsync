"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { SIGNUP_PENDING_HREF, SUBSCRIPTION_HREF } from "@/lib/signup-routes";
import {
  getCurrentUserEmail,
  hasProductAccess,
  isCurrentUserOrgAdmin,
} from "@/lib/signup-session";

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const allowed = hasProductAccess();

  useEffect(() => {
    if (allowed) return;

    const email = getCurrentUserEmail();
    if (!email) {
      router.replace("/sign-in");
      return;
    }

    if (isCurrentUserOrgAdmin()) {
      router.replace(SUBSCRIPTION_HREF);
      return;
    }

    router.replace(SIGNUP_PENDING_HREF);
  }, [pathname, router, allowed]);

  if (!allowed) {
    return <PageLoadingFallback message="Checking access…" />;
  }

  return <>{children}</>;
}
