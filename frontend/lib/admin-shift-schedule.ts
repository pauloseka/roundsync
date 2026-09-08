import { getStaffRoster, type StaffMember } from "@/lib/admin-staff";
import { getSignUpSession, saveShiftScheduleData } from "@/lib/signup-session";

export interface ShiftRequirement {
  id: string;
  date: string;
  ward: string;
  roleLabel: string;
  shiftStart: string;
  shiftEnd: string;
  headcount: number;
}

export interface ShiftAssignment {
  id: string;
  requirementId: string;
  staffId: string;
  staffEmail: string;
  staffName: string;
  date: string;
  ward: string;
  roleLabel: string;
  shiftStart: string;
  shiftEnd: string;
}

export type ImportShiftScheduleResult =
  | {
      ok: true;
      requirements: number;
      assigned: number;
      unfilled: number;
    }
  | {
      ok: false;
      message: string;
    };

const CSV_HEADER = "date,ward,role,shift_start,shift_end,headcount";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeRole(role: string) {
  return role.trim().toLowerCase();
}

function roleMatches(staffRole: string, requiredRole: string) {
  const staff = normalizeRole(staffRole);
  const required = normalizeRole(requiredRole);
  if (staff.includes(required) || required.includes(staff)) return true;

  const staffTokens = staff.split(/[\s/]+/);
  const requiredTokens = required.split(/[\s/]+/);
  return requiredTokens.some((token) => token.length > 1 && staffTokens.includes(token));
}

function parseTimeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
}

function shiftsOverlap(
  a: { date: string; shiftStart: string; shiftEnd: string },
  b: { date: string; shiftStart: string; shiftEnd: string },
): boolean {
  if (a.date !== b.date) return false;

  const aStart = parseTimeToMinutes(a.shiftStart);
  const aEnd = parseTimeToMinutes(a.shiftEnd);
  const bStart = parseTimeToMinutes(b.shiftStart);
  const bEnd = parseTimeToMinutes(b.shiftEnd);

  const aEndAdjusted = aEnd <= aStart ? aEnd + 24 * 60 : aEnd;
  const bEndAdjusted = bEnd <= bStart ? bEnd + 24 * 60 : bEnd;

  return aStart < bEndAdjusted && bStart < aEndAdjusted;
}

function parseCsvLine(line: string, lineNumber: number): ShiftRequirement | { error: string } {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return { error: "" };

  const parts = trimmed.split(",").map((part) => part.trim());
  if (parts.length < 6) {
    return { error: `Line ${lineNumber}: expected 6 columns (date, ward, role, start, end, headcount).` };
  }

  const [date, ward, roleLabel, shiftStart, shiftEnd, headcountRaw] = parts;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: `Line ${lineNumber}: date must be YYYY-MM-DD.` };
  }

  const headcount = Number(headcountRaw);
  if (!Number.isFinite(headcount) || headcount < 1) {
    return { error: `Line ${lineNumber}: headcount must be at least 1.` };
  }

  if (!shiftStart || !shiftEnd) {
    return { error: `Line ${lineNumber}: shift start and end are required.` };
  }

  return {
    id: createId("req"),
    date,
    ward,
    roleLabel,
    shiftStart,
    shiftEnd,
    headcount,
  };
}

export function parseShiftScheduleCsv(input: string): {
  requirements: ShiftRequirement[];
  error: string | null;
} {
  const lines = input.split(/\r?\n/);
  const requirements: ShiftRequirement[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;
    const lower = line.trim().toLowerCase();

    if (lower.startsWith("date,") && lower.includes("headcount")) continue;

    const parsed = parseCsvLine(line, lineNumber);
    if ("error" in parsed) {
      if (parsed.error) return { requirements: [], error: parsed.error };
      continue;
    }

    requirements.push(parsed);
  }

  if (requirements.length === 0) {
    return { requirements: [], error: "Add at least one shift row to import." };
  }

  return { requirements, error: null };
}

export function autoAssignShifts(requirements: ShiftRequirement[]): ShiftAssignment[] {
  const staff = getStaffRoster();
  const assignments: ShiftAssignment[] = [];
  const assignmentCount = new Map<string, number>();

  for (const requirement of requirements) {
    const eligible = staff
      .filter((member) => roleMatches(member.roleLabel, requirement.roleLabel))
      .sort((a, b) => {
        const aCount = assignmentCount.get(a.id) ?? 0;
        const bCount = assignmentCount.get(b.id) ?? 0;
        return aCount - bCount;
      });

    let filled = 0;

    for (const member of eligible) {
      if (filled >= requirement.headcount) break;

      const hasConflict = assignments.some(
        (existing) =>
          existing.staffId === member.id && shiftsOverlap(existing, requirement),
      );

      if (hasConflict) continue;

      assignments.push({
        id: createId("asg"),
        requirementId: requirement.id,
        staffId: member.id,
        staffEmail: member.email,
        staffName: member.fullName,
        date: requirement.date,
        ward: requirement.ward,
        roleLabel: requirement.roleLabel,
        shiftStart: requirement.shiftStart,
        shiftEnd: requirement.shiftEnd,
      });

      assignmentCount.set(member.id, (assignmentCount.get(member.id) ?? 0) + 1);
      filled += 1;
    }
  }

  return assignments;
}

export function countUnfilledSlots(
  requirements: ShiftRequirement[],
  assignments: ShiftAssignment[],
): number {
  let unfilled = 0;

  for (const requirement of requirements) {
    const filled = assignments.filter((a) => a.requirementId === requirement.id).length;
    unfilled += Math.max(0, requirement.headcount - filled);
  }

  return unfilled;
}

export function getShiftSchedule(): {
  requirements: ShiftRequirement[];
  assignments: ShiftAssignment[];
} {
  const session = getSignUpSession();
  return {
    requirements: session.shiftRequirements ?? [],
    assignments: session.shiftAssignments ?? [],
  };
}

export function saveShiftSchedule(
  requirements: ShiftRequirement[],
  assignments: ShiftAssignment[],
) {
  saveShiftScheduleData(requirements, assignments);
}

export function importAndAutoAssignSchedule(csvInput: string): ImportShiftScheduleResult {
  const parsed = parseShiftScheduleCsv(csvInput);
  if (parsed.error) {
    return { ok: false, message: parsed.error };
  }

  const assignments = autoAssignShifts(parsed.requirements);
  saveShiftSchedule(parsed.requirements, assignments);

  const unfilled = countUnfilledSlots(parsed.requirements, assignments);

  return {
    ok: true,
    requirements: parsed.requirements.length,
    assigned: assignments.length,
    unfilled,
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAssignmentsForStaffOnDate(email: string, date: string): ShiftAssignment[] {
  const normalized = email.trim().toLowerCase();
  const { assignments } = getShiftSchedule();
  return assignments.filter(
    (assignment) => assignment.staffEmail === normalized && assignment.date === date,
  );
}

export function getTodaysAssignmentForStaff(email: string): ShiftAssignment | null {
  const today = getTodayDateString();
  const matches = getAssignmentsForStaffOnDate(email, today);
  if (matches.length === 0) return null;

  const nowMinutes = parseTimeToMinutes(
    `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`,
  );

  const inWindow = matches.find((assignment) => {
    const start = parseTimeToMinutes(assignment.shiftStart);
    const end = parseTimeToMinutes(assignment.shiftEnd);
    if (end <= start) return nowMinutes >= start || nowMinutes <= end;
    return nowMinutes >= start && nowMinutes <= end;
  });

  return inWindow ?? matches[0];
}

export function getUpcomingAssignmentsForStaff(member: StaffMember, limit = 5): ShiftAssignment[] {
  const today = getTodayDateString();
  const { assignments } = getShiftSchedule();

  return assignments
    .filter((assignment) => assignment.staffEmail === member.email && assignment.date >= today)
    .sort((a, b) => `${a.date}${a.shiftStart}`.localeCompare(`${b.date}${b.shiftStart}`))
    .slice(0, limit);
}

export function exampleShiftScheduleCsv(wards: string[]): string {
  const ward = wards[0] ?? "Ward 4B — Medical";
  const today = getTodayDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  return `${CSV_HEADER}
${today},${ward},RN,07:00,15:00,2
${today},${ward},On-call,08:00,20:00,1
${tomorrowStr},${ward},RN,15:00,23:00,1
${tomorrowStr},${ward},RN / HCA,07:00,19:00,1`;
}

export { CSV_HEADER as SHIFT_SCHEDULE_CSV_HEADER };
