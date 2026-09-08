"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SUBSCRIPTION_HREF,
  SIGNUP_PENDING_HREF,
} from "@/lib/signup-routes";
import {
  hasProductAccess,
  isCurrentUserOrgAdmin,
} from "@/lib/signup-session";

export function useAdminGuard() {
  const router = useRouter();
  const ready = hasProductAccess() && isCurrentUserOrgAdmin();

  useEffect(() => {
    if (!hasProductAccess()) {
      router.replace(SUBSCRIPTION_HREF);
      return;
    }
    if (!isCurrentUserOrgAdmin()) {
      router.replace(SIGNUP_PENDING_HREF);
    }
  }, [router]);

  return ready;
}

export function useIsOrgAdmin() {
  return isCurrentUserOrgAdmin();
}
