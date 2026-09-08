"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DASHBOARD_HREF, SUBSCRIPTION_HREF } from "@/lib/signup-routes";
import {
  canAccessCheckout,
  canAccessSubscription,
  isSubscriptionActive,
} from "@/lib/signup-session";

export function useCheckoutGuard() {
  const router = useRouter();
  const ready = !isSubscriptionActive() && canAccessSubscription() && canAccessCheckout();

  useEffect(() => {
    if (isSubscriptionActive()) {
      router.replace(DASHBOARD_HREF);
      return;
    }
    if (!canAccessSubscription()) {
      router.replace(SUBSCRIPTION_HREF);
      return;
    }
    if (!canAccessCheckout()) {
      router.replace(SUBSCRIPTION_HREF);
    }
  }, [router]);

  return ready;
}
