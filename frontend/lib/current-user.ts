import { getStaffMemberByEmail } from "@/lib/admin-staff";
import { shiftContext as demoShiftContext } from "@/lib/mock-data";
import {
  getCurrentUserEmail,
  getOrganizationWards,
  getSignUpSession,
  isOrgAdministrator,
} from "@/lib/signup-session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Single source of truth for the signed-in person's display name across admin and ward UI. */
export function getCurrentUserDisplayName(email?: string): string | null {
  const session = getSignUpSession();
  const normalized = normalizeEmail(
    email ?? getCurrentUserEmail() ?? session.account?.email ?? "",
  );
  if (!normalized) return null;

  const orgAdmin = session.orgAdministrators.find((admin) => admin.email === normalized);
  if (orgAdmin?.fullName.trim()) return orgAdmin.fullName.trim();

  if (
    session.account &&
    normalizeEmail(session.account.email) === normalized &&
    session.account.fullName.trim()
  ) {
    return session.account.fullName.trim();
  }

  const staff = getStaffMemberByEmail(normalized);
  if (staff?.fullName.trim()) return staff.fullName.trim();

  return normalized;
}

export function getCurrentUserWardLabel(): string {
  const session = getSignUpSession();
  const email = getCurrentUserEmail();

  if (session.activeShift?.ward) return session.activeShift.ward;

  if (email) {
    const staff = getStaffMemberByEmail(email);
    if (staff?.ward) return staff.ward;
  }

  const orgWards = getOrganizationWards();
  if (orgWards.length > 0) return orgWards[0];

  return demoShiftContext.ward;
}

export function getCurrentUserRoleLabel(): { role: string; abbrev: string } {
  const email = getCurrentUserEmail();

  if (email) {
    const staff = getStaffMemberByEmail(email);
    if (staff?.roleLabel) {
      const abbrev = staff.roleLabel.split("/")[0]?.trim() || staff.roleLabel;
      return { role: staff.roleLabel, abbrev };
    }
  }

  if (email && isOrgAdministrator(email)) {
    return { role: "Organisation administrator", abbrev: "Admin" };
  }

  return { role: "Registered Nurse", abbrev: "RN" };
}

export function getCurrentUserNavSubtitle(): string {
  const name = getCurrentUserDisplayName();
  const ward = getCurrentUserWardLabel();
  if (name) return `${name} · ${ward}`;
  return ward;
}
