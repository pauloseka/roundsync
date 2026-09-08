"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DASHBOARD_HREF } from "@/lib/signup-routes";
import {
  canAccessSubscription,
  getResumeSignupHref,
  isSubscriptionActive,
} from "@/lib/signup-session";

export function useSubscriptionGuard() {
  const router = useRouter();
  const ready = !isSubscriptionActive() && canAccessSubscription();

  useEffect(() => {
    if (isSubscriptionActive()) {
      router.replace(DASHBOARD_HREF);
      return;
    }
    if (!canAccessSubscription()) {
      router.replace(getResumeSignupHref());
    }
  }, [router]);

  return ready;
}
