import {
  getTierById,
  recommendTier,
  type BillingCycle,
  type SubscriptionStatus,
  type SubscriptionTierId,
} from "@/lib/signup-data";
import type { ActiveShiftContext, StaffMember, StaffPresence } from "@/lib/admin-staff";
import { applyStaffSignIn } from "@/lib/admin-staff";
import type {
  NetworkSecurityPolicy,
  RegisteredDevice,
  SecurityAuditEvent,
} from "@/lib/admin-network-security";
import type { ShiftAssignment, ShiftRequirement } from "@/lib/admin-shift-schedule";
import {
  SIGNUP_HREF,
  SIGNUP_ORG_HREF,
  SUBSCRIPTION_HREF,
  SIGNUP_VERIFY_HREF,
  DASHBOARD_HREF,
  type SignupStepId,
} from "@/lib/signup-routes";

const SESSION_KEY = "roundsync_signup_session";
export const TRIAL_DAYS = 5;
const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

export interface SignUpAccount {
  fullName: string;
  email: string;
}

export interface SignUpOrganization {
  hospitalName: string;
  staffExpected: number;
  wardCount: number;
  wardNames: string[];
  multiLocation: boolean;
}

export const ALL_WARDS_ASSIGNMENT = "All wards";

export function buildDefaultWardNames(count: number): string[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => `Ward ${index + 1}`);
}

export function getOrganizationWards(): string[] {
  const org = readSession().organization;
  if (!org) return [];

  const named = org.wardNames?.map((name) => name.trim()).filter(Boolean);
  if (named && named.length > 0) return named;

  if (org.wardCount > 0) return buildDefaultWardNames(org.wardCount);
  return [];
}

export function updateOrganizationWards(
  wardNames: string[],
): { ok: true } | { ok: false; message: string } {
  const session = readSession();
  if (!session.organization) {
    return { ok: false, message: "Organisation not configured yet." };
  }

  const trimmed = wardNames.map((name) => name.trim()).filter(Boolean);
  if (trimmed.length === 0) {
    return { ok: false, message: "Add at least one ward or department name." };
  }

  writeSession({
    ...session,
    organization: {
      ...session.organization,
      wardNames: trimmed,
      wardCount: trimmed.length,
    },
  });

  return { ok: true };
}

export interface OrgAdministrator {
  email: string;
  fullName: string;
  isPrimary: boolean;
  addedAt: string;
}

export interface SignUpSession {
  account: SignUpAccount | null;
  signedInEmail: string | null;
  emailVerified: boolean;
  organization: SignUpOrganization | null;
  orgAdministrators: OrgAdministrator[];
  staffRoster?: StaffMember[];
  staffPresence?: StaffPresence[];
  activeShift?: ActiveShiftContext | null;
  shiftRequirements?: ShiftRequirement[];
  shiftAssignments?: ShiftAssignment[];
  networkSecurityPolicy?: NetworkSecurityPolicy;
  registeredDevices?: RegisteredDevice[];
  securityEvents?: SecurityAuditEvent[];
  recommendedTierId: SubscriptionTierId | null;
  selectedTierId: SubscriptionTierId | null;
  billingCycle: BillingCycle;
  selectedAddOnIds: string[];
  subscriptionStatus: SubscriptionStatus;
  trialStartedAt: string | null;
  seatsPurchased: number | null;
  showInviteStaffPrompt: boolean;
}

const defaultSession: SignUpSession = {
  account: null,
  signedInEmail: null,
  emailVerified: false,
  organization: null,
  orgAdministrators: [],
  recommendedTierId: null,
  selectedTierId: null,
  billingCycle: "monthly",
  selectedAddOnIds: [],
  subscriptionStatus: "none",
  trialStartedAt: null,
  seatsPurchased: null,
  showInviteStaffPrompt: false,
};

function readSession(): SignUpSession {
  if (typeof window === "undefined") return { ...defaultSession };
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { ...defaultSession };
    return { ...defaultSession, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSession };
  }
}

function writeSession(session: SignUpSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSignUpSession(): SignUpSession {
  return readSession();
}

export function getCurrentUserEmail(): string | null {
  const session = readSession();
  return session.signedInEmail ?? session.account?.email ?? null;
}

export function saveStaffRoster(roster: StaffMember[]) {
  const session = readSession();
  writeSession({ ...session, staffRoster: roster });
}

export function saveShiftScheduleData(
  requirements: ShiftRequirement[],
  assignments: ShiftAssignment[],
) {
  const session = readSession();
  writeSession({
    ...session,
    shiftRequirements: requirements,
    shiftAssignments: assignments,
  });
}

export function saveNetworkSecurityData(data: {
  networkSecurityPolicy: NetworkSecurityPolicy;
  registeredDevices: RegisteredDevice[];
  securityEvents: SecurityAuditEvent[];
}) {
  const session = readSession();
  writeSession({
    ...session,
    networkSecurityPolicy: data.networkSecurityPolicy,
    registeredDevices: data.registeredDevices,
    securityEvents: data.securityEvents,
  });
}

export function markUserSignedIn(email: string) {
  const session = readSession();
  const normalized = email.trim().toLowerCase();
  const staffUpdate = applyStaffSignIn(session, normalized);
  writeSession({
    ...session,
    signedInEmail: normalized,
    ...staffUpdate,
  });
}

export function saveSignUpAccount(account: SignUpAccount) {
  const session = readSession();
  writeSession({
    ...session,
    account,
    signedInEmail: account.email,
    emailVerified: false,
    organization: null,
    orgAdministrators: [],
    recommendedTierId: null,
    selectedTierId: null,
    subscriptionStatus: "none",
    trialStartedAt: null,
    seatsPurchased: null,
    showInviteStaffPrompt: false,
  });
}

export function markEmailVerified() {
  const session = readSession();
  writeSession({ ...session, emailVerified: true });
}

export function saveSignUpOrganization(organization: SignUpOrganization) {
  const session = readSession();
  const wardNames =
    organization.wardNames?.map((name) => name.trim()).filter(Boolean) ??
    buildDefaultWardNames(organization.wardCount);
  const wardCount = wardNames.length > 0 ? wardNames.length : organization.wardCount;
  const normalizedOrganization: SignUpOrganization = {
    ...organization,
    wardNames,
    wardCount,
  };
  const recommendedTierId = recommendTier(
    normalizedOrganization.staffExpected,
    normalizedOrganization.wardCount,
    normalizedOrganization.multiLocation,
  );
  writeSession({
    ...session,
    organization: normalizedOrganization,
    recommendedTierId,
    selectedTierId: recommendedTierId,
    seatsPurchased: normalizedOrganization.staffExpected,
    orgAdministrators: seedPrimaryOrgAdministrator(session),
  });
}

function normalizeOrgEmail(email: string) {
  return email.trim().toLowerCase();
}

function seedPrimaryOrgAdministrator(session: SignUpSession): OrgAdministrator[] {
  if (!session.account?.email) return session.orgAdministrators;

  const email = normalizeOrgEmail(session.account.email);
  const existing = session.orgAdministrators.find((admin) => admin.email === email);
  if (existing) {
    return session.orgAdministrators.map((admin) =>
      admin.email === email ? { ...admin, isPrimary: true } : admin,
    );
  }

  return [
    {
      email,
      fullName: session.account.fullName,
      isPrimary: true,
      addedAt: new Date().toISOString(),
    },
    ...session.orgAdministrators.filter((admin) => admin.email !== email),
  ];
}

export function startFreeTrial() {
  const session = readSession();
  writeSession({
    ...session,
    subscriptionStatus: "trial",
    trialStartedAt: new Date().toISOString(),
    showInviteStaffPrompt: true,
  });
}

export function canStartFreeTrial(): boolean {
  const session = readSession();
  return (
    Boolean(session.organization && session.emailVerified) &&
    session.subscriptionStatus === "none" &&
    session.trialStartedAt === null
  );
}

export function selectTier(tierId: SubscriptionTierId) {
  const session = readSession();
  writeSession({ ...session, selectedTierId: tierId });
}

export function setBillingCycle(cycle: BillingCycle) {
  const session = readSession();
  writeSession({ ...session, billingCycle: cycle });
}

export function setSelectedAddOns(addOnIds: string[]) {
  const session = readSession();
  writeSession({ ...session, selectedAddOnIds: addOnIds });
}

export function activateSubscription() {
  const session = readSession();
  writeSession({
    ...session,
    subscriptionStatus: "active",
    showInviteStaffPrompt: true,
  });
}

export function dismissInviteStaffPrompt() {
  const session = readSession();
  writeSession({ ...session, showInviteStaffPrompt: false });
}

export function needsAdminSetup(): boolean {
  const session = readSession();
  return Boolean(session.showInviteStaffPrompt && isCurrentUserOrgAdmin());
}

export function getTrialEndsAt(): Date | null {
  const session = readSession();
  if (!session.trialStartedAt) return null;
  return new Date(new Date(session.trialStartedAt).getTime() + TRIAL_MS);
}

export function isTrialActive(): boolean {
  const session = readSession();
  if (session.subscriptionStatus !== "trial" || !session.trialStartedAt) return false;
  const endsAt = getTrialEndsAt();
  return endsAt !== null && Date.now() < endsAt.getTime();
}

export function isTrialExpired(): boolean {
  const session = readSession();
  if (session.subscriptionStatus !== "trial" || !session.trialStartedAt) return false;
  return !isTrialActive();
}

export function getTrialDaysRemaining(): number {
  const endsAt = getTrialEndsAt();
  if (!endsAt || !isTrialActive()) return 0;
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
}

export function isSubscriptionActive(): boolean {
  return readSession().subscriptionStatus === "active";
}

export function hasProductAccess(): boolean {
  return isSubscriptionActive() || isTrialActive();
}

export function getOrgAdministrators(): OrgAdministrator[] {
  return readSession().orgAdministrators;
}

export function addOrgAdministrator(fullName: string, email: string): { ok: true } | { ok: false; message: string } {
  const session = readSession();
  const normalizedEmail = normalizeOrgEmail(email);
  const trimmedName = fullName.trim();

  if (!trimmedName || !normalizedEmail) {
    return { ok: false, message: "Enter a name and work email." };
  }

  if (session.orgAdministrators.some((admin) => admin.email === normalizedEmail)) {
    return { ok: false, message: "This person is already an organisation administrator." };
  }

  writeSession({
    ...session,
    orgAdministrators: [
      ...session.orgAdministrators,
      {
        email: normalizedEmail,
        fullName: trimmedName,
        isPrimary: false,
        addedAt: new Date().toISOString(),
      },
    ],
  });

  return { ok: true };
}

export function removeOrgAdministrator(email: string): { ok: true } | { ok: false; message: string } {
  const session = readSession();
  const normalizedEmail = normalizeOrgEmail(email);
  const target = session.orgAdministrators.find((admin) => admin.email === normalizedEmail);

  if (!target) {
    return { ok: false, message: "Administrator not found." };
  }

  if (target.isPrimary) {
    return { ok: false, message: "The primary administrator cannot be removed." };
  }

  writeSession({
    ...session,
    orgAdministrators: session.orgAdministrators.filter((admin) => admin.email !== normalizedEmail),
  });

  return { ok: true };
}

export function isOrgAdministrator(email: string): boolean {
  const normalized = normalizeOrgEmail(email);
  const session = readSession();

  if (session.orgAdministrators.some((admin) => admin.email === normalized)) {
    return true;
  }

  return isOrgAdminEmailLegacy(normalized);
}

function isOrgAdminEmailLegacy(email: string): boolean {
  return (
    email.includes("admin") ||
    email.startsWith("it@") ||
    email.includes("director@")
  );
}

/** @deprecated Use isOrgAdministrator */
export function isOrgAdminEmail(email: string): boolean {
  return isOrgAdministrator(email);
}

export function isCurrentUserOrgAdmin(): boolean {
  const email = getCurrentUserEmail();
  return email ? isOrgAdministrator(email) : false;
}

export function isCurrentUserPrimaryOrgAdmin(): boolean {
  const email = getCurrentUserEmail();
  if (!email) return false;
  const normalized = normalizeOrgEmail(email);
  return readSession().orgAdministrators.some(
    (admin) => admin.email === normalized && admin.isPrimary,
  );
}

export function canAccessSubscription(): boolean {
  const session = readSession();
  return Boolean(session.emailVerified && session.organization);
}

export function canAccessCheckout(): boolean {
  const session = readSession();
  if (!canAccessSubscription() || !session.selectedTierId) return false;
  return getTierById(session.selectedTierId).selfServe;
}

const stepOrder: SignupStepId[] = ["account", "verify-email", "organization"];

export function getFurthestAllowedStep(): SignupStepId {
  const session = readSession();
  if (!session.account) return "account";
  if (!session.emailVerified) return "verify-email";
  if (!session.organization) return "organization";
  return "organization";
}

export function canAccessStep(step: SignupStepId): boolean {
  const furthestIndex = stepOrder.indexOf(getFurthestAllowedStep());
  const stepIndex = stepOrder.indexOf(step);
  return stepIndex <= furthestIndex;
}

export function getResumeSignupHref(): string {
  const session = readSession();
  if (!session.account) return SIGNUP_HREF;
  if (!session.emailVerified) return SIGNUP_VERIFY_HREF;
  if (!session.organization) return SIGNUP_ORG_HREF;
  if (hasProductAccess()) return DASHBOARD_HREF;
  return SUBSCRIPTION_HREF;
}

export function getPostAuthHref(email: string): string {
  if (hasProductAccess()) return DASHBOARD_HREF;
  if (isOrgAdministrator(email)) return SUBSCRIPTION_HREF;
  return "/sign-up/pending";
}

/** @deprecated Use getResumeSignupHref */
export function getResumeHrefForAdmin(): string {
  return getResumeSignupHref();
}

export function getStepHref(step: SignupStepId): string {
  switch (step) {
    case "account":
      return SIGNUP_HREF;
    case "verify-email":
      return SIGNUP_VERIFY_HREF;
    case "organization":
      return SIGNUP_ORG_HREF;
    default:
      return SIGNUP_HREF;
  }
}
