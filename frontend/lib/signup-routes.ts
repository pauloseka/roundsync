export const SIGNUP_HREF = "/sign-up";
export const SIGNUP_VERIFY_HREF = "/sign-up/verify-email";
export const SIGNUP_ORG_HREF = "/sign-up/organization";
export const SIGNUP_PENDING_HREF = "/sign-up/pending";
export const SUBSCRIPTION_HREF = "/subscription";
export const CHECKOUT_HREF = "/checkout";
export const ADMIN_HREF = "/admin";
export const DASHBOARD_HREF = "/dashboard";

/** @deprecated Use SUBSCRIPTION_HREF */
export const SIGNUP_PLAN_HREF = SUBSCRIPTION_HREF;
/** @deprecated Use CHECKOUT_HREF */
export const SIGNUP_CHECKOUT_HREF = CHECKOUT_HREF;

export const signupSteps = [
  { id: "account", label: "Account", href: SIGNUP_HREF },
  { id: "verify-email", label: "Verify email", href: SIGNUP_VERIFY_HREF },
  { id: "organization", label: "Organisation", href: SIGNUP_ORG_HREF },
] as const;

export type SignupStepId = (typeof signupSteps)[number]["id"];
