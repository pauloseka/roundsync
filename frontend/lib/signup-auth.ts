import {
  ADMIN_HREF,
  DASHBOARD_HREF,
  SIGNUP_ORG_HREF,
  SIGNUP_PENDING_HREF,
  SIGNUP_VERIFY_HREF,
  SUBSCRIPTION_HREF,
} from "@/lib/signup-routes";
import {
  getSignUpSession,
  hasProductAccess,
  isOrgAdministrator,
  isTrialExpired,
  markUserSignedIn,
  needsAdminSetup,
} from "@/lib/signup-session";

export function resolvePostAuthRoute(email: string): string {
  markUserSignedIn(email);

  if (hasProductAccess()) {
    if (needsAdminSetup() && isOrgAdministrator(email)) {
      return ADMIN_HREF;
    }
    return DASHBOARD_HREF;
  }

  if (isTrialExpired() && isOrgAdministrator(email)) {
    return SUBSCRIPTION_HREF;
  }

  if (isOrgAdministrator(email)) {
    const session = getSignUpSession();
    if (session.account && !session.emailVerified) return SIGNUP_VERIFY_HREF;
    if (session.account && !session.organization) return SIGNUP_ORG_HREF;
    return SUBSCRIPTION_HREF;
  }

  return SIGNUP_PENDING_HREF;
}
