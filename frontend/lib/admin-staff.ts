import { adminRoleTemplates } from "@/lib/admin-setup-data";
import { auditLog } from "@/lib/audit-seed";
import { getCurrentUserDisplayName } from "@/lib/current-user";
import { shiftContext as demoShiftContext } from "@/lib/mock-data";
import type { ShiftContext } from "@/lib/mock-data";
import { getSignUpSession, saveStaffRoster, saveShiftScheduleData } from "@/lib/signup-session";
import { getTodaysAssignmentForStaff } from "@/lib/admin-shift-schedule";

export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  roleLabel: string;
  ward: string;
  shiftStart: string;
  shiftEnd: string;
}

export interface StaffPresence {
  email: string;
  loggedInAt: string;
  ward: string;
}

export interface ActiveShiftContext {
  nurseName: string;
  ward: string;
  shiftStart: string;
  shiftEnd: string;
  loggedInAt: string;
}

export interface StaffActivitySnapshot {
  recentEvents: number;
  lastEventSummary: string | null;
  lastEventMinutesAgo: number | null;
}

const STAFF_ROSTER_SEED: StaffMember[] = [
  {
    id: "staff-amaka",
    email: "amaka.okafor@hospital.org",
    fullName: "Amaka Okafor",
    roleLabel: "RN",
    ward: "Ward 4B — Medical",
    shiftStart: "07:00",
    shiftEnd: "15:00",
  },
  {
    id: "staff-sarah",
    email: "sarah@citygeneral.org",
    fullName: "Sarah Mitchell",
    roleLabel: "RN / HCA",
    ward: "Surgical 4B",
    shiftStart: "07:00",
    shiftEnd: "19:00",
  },
  {
    id: "staff-patel",
    email: "dr.patel@citygeneral.org",
    fullName: "Dr. Patel",
    roleLabel: "On-call",
    ward: "Ward 4B — Medical",
    shiftStart: "08:00",
    shiftEnd: "20:00",
  },
  {
    id: "staff-adeyemi",
    email: "dr.adeyemi@citygeneral.org",
    fullName: "Dr. Adeyemi",
    roleLabel: "Backup on-call",
    ward: "Ward 4B — Medical",
    shiftStart: "20:00",
    shiftEnd: "08:00",
  },
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readStaffRoster(session: ReturnType<typeof getSignUpSession>): StaffMember[] {
  if (session.staffRoster && session.staffRoster.length > 0) {
    return session.staffRoster;
  }
  return STAFF_ROSTER_SEED;
}

export function getStaffRoster(): StaffMember[] {
  return readStaffRoster(getSignUpSession());
}

export function getStaffRoleOptions(): string[] {
  const fromRoster = getStaffRoster().map((member) => member.roleLabel);
  const fromTemplates = adminRoleTemplates.flatMap((role) => [role.label, role.abbrev]);
  return [...new Set([...fromRoster, ...fromTemplates])].sort();
}

export function getStaffMemberByEmail(email: string): StaffMember | undefined {
  const normalized = normalizeEmail(email);
  return getStaffRoster().find((member) => member.email === normalized);
}

export function updateStaffMember(
  id: string,
  updates: Partial<Pick<StaffMember, "fullName" | "email" | "roleLabel" | "ward" | "shiftStart" | "shiftEnd">>,
): { ok: true } | { ok: false; message: string } {
  const roster = getStaffRoster();
  const index = roster.findIndex((member) => member.id === id);

  if (index === -1) {
    return { ok: false, message: "Staff member not found." };
  }

  const current = roster[index];
  const nextEmail = updates.email !== undefined ? normalizeEmail(updates.email) : current.email;

  if (!nextEmail) {
    return { ok: false, message: "Work email is required." };
  }

  if (roster.some((member) => member.id !== id && member.email === nextEmail)) {
    return { ok: false, message: "Another staff member already uses this email." };
  }

  const nextName =
    updates.fullName !== undefined ? updates.fullName.trim() : current.fullName;
  if (!nextName) {
    return { ok: false, message: "Full name is required." };
  }

  const next = roster.map((member, memberIndex) =>
    memberIndex === index
      ? {
          ...member,
          fullName: nextName,
          email: nextEmail,
          roleLabel:
            updates.roleLabel !== undefined
              ? updates.roleLabel.trim() || member.roleLabel
              : member.roleLabel,
          ward: updates.ward !== undefined ? updates.ward.trim() || member.ward : member.ward,
          shiftStart:
            updates.shiftStart !== undefined
              ? updates.shiftStart.trim() || member.shiftStart
              : member.shiftStart,
          shiftEnd:
            updates.shiftEnd !== undefined
              ? updates.shiftEnd.trim() || member.shiftEnd
              : member.shiftEnd,
        }
      : member,
  );

  saveStaffRoster(next);

  if (current.email !== nextEmail || current.fullName !== nextName) {
    remapStaffIdentityInSchedule(current.email, nextEmail, nextName);
  }

  return { ok: true };
}

function remapStaffIdentityInSchedule(oldEmail: string, newEmail: string, newName: string) {
  const session = getSignUpSession();
  if (!session.shiftAssignments?.length) return;

  const normalizedOld = normalizeEmail(oldEmail);
  const normalizedNew = normalizeEmail(newEmail);

  const shiftAssignments = session.shiftAssignments.map((assignment) =>
    assignment.staffEmail === normalizedOld
      ? { ...assignment, staffEmail: normalizedNew, staffName: newName }
      : assignment,
  );

  saveShiftScheduleData(session.shiftRequirements ?? [], shiftAssignments);
}

export function applyStaffSignIn(
  session: ReturnType<typeof getSignUpSession>,
  email: string,
): {
  staffRoster: StaffMember[];
  staffPresence: StaffPresence[];
  activeShift: ActiveShiftContext | null;
} {
  const normalized = normalizeEmail(email);
  const roster = readStaffRoster(session);
  const member = roster.find((staff) => staff.email === normalized);
  const loggedInAt = new Date().toISOString();
  const staffPresence = [...(session.staffPresence ?? [])].filter(
    (entry) => entry.email !== normalized,
  );

  if (!member) {
    return {
      staffRoster: roster,
      staffPresence,
      activeShift: session.activeShift ?? null,
    };
  }

  const scheduled = getTodaysAssignmentForStaff(normalized);
  const shiftWard = scheduled?.ward ?? member.ward;
  const shiftStart = scheduled?.shiftStart ?? member.shiftStart;
  const shiftEnd = scheduled?.shiftEnd ?? member.shiftEnd;

  staffPresence.push({
    email: normalized,
    loggedInAt,
    ward: shiftWard,
  });

  const displayName = getCurrentUserDisplayName(normalized) ?? member.fullName;

  return {
    staffRoster: roster,
    staffPresence,
    activeShift: {
      nurseName: displayName,
      ward: shiftWard,
      shiftStart,
      shiftEnd,
      loggedInAt,
    },
  };
}

export function getStaffPresenceMap(): Map<string, StaffPresence> {
  const session = getSignUpSession();
  return new Map((session.staffPresence ?? []).map((entry) => [entry.email, entry]));
}

export function isStaffOnline(email: string): boolean {
  return getStaffPresenceMap().has(normalizeEmail(email));
}

export function getStaffActivity(member: StaffMember): StaffActivitySnapshot {
  const events = auditLog.filter(
    (entry) =>
      entry.actorName === member.fullName ||
      entry.details.some((detail) => detail.value.includes(member.fullName)),
  );

  if (events.length === 0) {
    return {
      recentEvents: 0,
      lastEventSummary: null,
      lastEventMinutesAgo: null,
    };
  }

  const latest = events.reduce((current, entry) =>
    entry.occurredMinutesAgo < current.occurredMinutesAgo ? entry : current,
  );

  return {
    recentEvents: events.length,
    lastEventSummary: latest.summary,
    lastEventMinutesAgo: latest.occurredMinutesAgo,
  };
}

export function toShiftContext(active: ActiveShiftContext): ShiftContext {
  return {
    nurseName: active.nurseName,
    ward: active.ward,
    shiftStart: active.shiftStart,
    shiftEnd: active.shiftEnd,
    loggedInAt: new Date(active.loggedInAt),
    handoffWindowActive: demoShiftContext.handoffWindowActive,
  };
}

export function getActiveShiftContext(): ShiftContext {
  const active = getSignUpSession().activeShift;
  const base = active ? toShiftContext(active) : demoShiftContext;
  const displayName = getCurrentUserDisplayName();
  return displayName ? { ...base, nurseName: displayName } : base;
}
