"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DASHBOARD_HREF } from "@/lib/signup-routes";
import { canAccessStep, getResumeSignupHref, hasProductAccess } from "@/lib/signup-session";
import type { SignupStepId } from "@/lib/signup-routes";

export function useSignUpGuard(step: SignupStepId) {
  const router = useRouter();
  const ready = !hasProductAccess() && canAccessStep(step);

  useEffect(() => {
    if (hasProductAccess()) {
      router.replace(DASHBOARD_HREF);
      return;
    }
    if (!canAccessStep(step)) {
      router.replace(getResumeSignupHref());
    }
  }, [router, step]);

  return ready;
}
