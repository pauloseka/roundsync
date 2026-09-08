import { getStaffMemberByEmail } from "@/lib/admin-staff";
import {
  getCurrentUserDisplayName,
  getCurrentUserRoleLabel,
  getCurrentUserWardLabel,
} from "@/lib/current-user";
import { shiftContext as demoShiftContext } from "@/lib/mock-data";
import { getCurrentUserEmail } from "@/lib/signup-session";

export function getUserProfile() {
  const email = getCurrentUserEmail() ?? "amaka.okafor@hospital.org";
  const name = getCurrentUserDisplayName() ?? "Staff member";
  const ward = getCurrentUserWardLabel();
  const { role, abbrev } = getCurrentUserRoleLabel();
  const staff = getStaffMemberByEmail(email);

  return {
    name,
    role,
    roleAbbrev: abbrev,
    ward,
    email,
    employeeId: staff ? staff.id.replace(/^staff-/, "").toUpperCase() : "—",
    authMethod: "Hospital single sign-on",
    shiftWindow: staff
      ? `${staff.shiftStart}–${staff.shiftEnd}`
      : `${demoShiftContext.shiftStart}–${demoShiftContext.shiftEnd}`,
  };
}

/** @deprecated Use getUserProfile() for session-aware profile data. */
export const userProfile = getUserProfile();
