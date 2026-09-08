/** Minimum lead time before a demo can be booked. */
export const MIN_BOOKING_LEAD_HOURS = 24;

export const DEMO_SLOT_DURATION_MINUTES = 30;

export const DEMO_BOOKING_HORIZON_DAYS = 42;

/** Weekday demo hours in the booker's selected timezone. */
export const DEMO_BOOKING_HOURS = {
  days: "Monday – Friday",
  start: "09:00",
  end: "17:00",
  slotMinutes: DEMO_SLOT_DURATION_MINUTES,
  lunchBreak: "12:00 – 12:30",
} as const;

export const DEMO_BLOCK_RULES = [
  "Weekends are unavailable.",
  "The 7th of each month is a team off-site (no demos).",
  "Some slots are already booked — shown crossed out.",
  "Bookings must be at least 24 hours from now.",
] as const;

/** Weekday demo hours — lunch excluded from slot list. */
export const DEMO_SLOT_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

export type DemoSlotTime = (typeof DEMO_SLOT_TIMES)[number];

export type DemoDateStatus =
  | "available"
  | "past"
  | "outside_horizon"
  | "weekend"
  | "team_offsite"
  | "fully_booked";

export type DemoSlotBlockReason = "booked" | "too_soon";

export const DEMO_TIMEZONE_OPTIONS = [
  { id: "Europe/London", city: "London" },
  { id: "Europe/Dublin", city: "Dublin" },
  { id: "Europe/Paris", city: "Paris" },
  { id: "Europe/Berlin", city: "Berlin" },
  { id: "Africa/Lagos", city: "Lagos" },
  { id: "America/New_York", city: "New York" },
  { id: "America/Chicago", city: "Chicago" },
  { id: "America/Los_Angeles", city: "Los Angeles" },
  { id: "Asia/Dubai", city: "Dubai" },
  { id: "Asia/Singapore", city: "Singapore" },
  { id: "Australia/Sydney", city: "Sydney" },
] as const;

export interface DemoSlotSelection {
  dateKey: string;
  time: DemoSlotTime;
  timezone: string;
  startTime: string;
  endTime: string;
  attendeeName?: string;
  attendeeEmail?: string;
}

export interface DemoCalendarDay {
  dateKey: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  status: DemoDateStatus;
  isSelectable: boolean;
}

export interface DemoTimeSlotOption {
  time: DemoSlotTime;
  available: boolean;
  reason?: DemoSlotBlockReason;
}

export function defaultDemoTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Europe/London";
  }
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getTimezoneOffsetMinutes(timezone: string, reference: Date) {
  const utc = new Date(reference.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(reference.toLocaleString("en-US", { timeZone: timezone }));
  return Math.round((local.getTime() - utc.getTime()) / 60000);
}

function formatOffsetMinutes(offsetMinutes: number) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  if (minutes === 0) return `UTC${sign}${hours}`;
  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

/** Always returns a UTC± offset label, e.g. UTC+1 or UTC-5. */
export function getUtcOffsetLabel(timezone: string, reference = new Date()) {
  try {
    return formatOffsetMinutes(getTimezoneOffsetMinutes(timezone, reference));
  } catch {
    return "UTC+0";
  }
}

export function formatTimezoneLabel(timezone: string, reference = new Date()) {
  const city =
    DEMO_TIMEZONE_OPTIONS.find((option) => option.id === timezone)?.city ??
    timezone.replace(/_/g, " ");
  return `${getUtcOffsetLabel(timezone, reference)} · ${city}`;
}

/** Convert wall-clock in `timezone` to UTC instant. */
export function zonedDateTimeToUtc(dateKey: string, time: string, timezone: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0, 0);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let utcTime = utcGuess;
  for (let i = 0; i < 3; i += 1) {
    const parts = formatter.formatToParts(new Date(utcTime));
    const values: Record<string, string> = {};
    for (const part of parts) {
      if (part.type !== "literal") values[part.type] = part.value;
    }

    const asUtc = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    );

    utcTime += Date.UTC(year, month - 1, day, hour, minute) - asUtc;
  }

  return new Date(utcTime);
}

export function minBookingInstant(from = new Date()) {
  return new Date(from.getTime() + MIN_BOOKING_LEAD_HOURS * 60 * 60 * 1000);
}

function isWeekend(dateKey: string) {
  const day = parseDateKey(dateKey).getDay();
  return day === 0 || day === 6;
}

function isTeamOffsite(dateKey: string) {
  return parseDateKey(dateKey).getDate() === 7;
}

export function getDateStatus(
  dateKey: string,
  timezone: string,
  now = new Date(),
): DemoDateStatus {
  const date = startOfDay(parseDateKey(dateKey));
  const today = startOfDay(now);
  const horizonEnd = addDays(today, DEMO_BOOKING_HORIZON_DAYS);

  if (date < today) return "past";
  if (date > horizonEnd) return "outside_horizon";
  if (isWeekend(dateKey)) return "weekend";
  if (isTeamOffsite(dateKey)) return "team_offsite";
  if (!dateHasAvailability(dateKey, timezone, now)) return "fully_booked";
  return "available";
}

function isSlotBlocked(dateKey: string, time: DemoSlotTime) {
  const seed = `${dateKey}-${time}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 11)) % 997;
  }
  return hash % 5 === 0;
}

export function isSlotTooSoon(
  dateKey: string,
  time: DemoSlotTime,
  timezone: string,
  now = new Date(),
) {
  const slotStart = zonedDateTimeToUtc(dateKey, time, timezone);
  return slotStart.getTime() < minBookingInstant(now).getTime();
}

export function getSlotAvailability(
  dateKey: string,
  time: DemoSlotTime,
  timezone: string,
  now = new Date(),
): DemoTimeSlotOption {
  if (isWeekend(dateKey) || isTeamOffsite(dateKey)) {
    return { time, available: false, reason: "booked" };
  }
  if (isSlotBlocked(dateKey, time)) {
    return { time, available: false, reason: "booked" };
  }
  if (isSlotTooSoon(dateKey, time, timezone, now)) {
    return { time, available: false, reason: "too_soon" };
  }
  return { time, available: true };
}

export function getSlotsForDate(dateKey: string, timezone: string, now = new Date()) {
  return DEMO_SLOT_TIMES.map((time) => getSlotAvailability(dateKey, time, timezone, now));
}

export function dateHasAvailability(dateKey: string, timezone: string, now = new Date()) {
  const date = startOfDay(parseDateKey(dateKey));
  const today = startOfDay(now);
  const horizonEnd = addDays(today, DEMO_BOOKING_HORIZON_DAYS);

  if (date < today || date > horizonEnd) return false;
  if (isWeekend(dateKey) || isTeamOffsite(dateKey)) return false;
  return getSlotsForDate(dateKey, timezone, now).some((slot) => slot.available);
}

export function buildCalendarMonth(
  monthDate: Date,
  timezone: string,
  now = new Date(),
): DemoCalendarDay[] {
  const monthStart = startOfMonth(monthDate);
  const gridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
  const todayKey = toDateKey(now);

  const days: DemoCalendarDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = addDays(gridStart, i);
    const dateKey = toDateKey(date);
    const inMonth = date.getMonth() === monthDate.getMonth();
    const status = inMonth ? getDateStatus(dateKey, timezone, now) : "outside_horizon";

    days.push({
      dateKey,
      day: date.getDate(),
      inMonth,
      isToday: dateKey === todayKey,
      status,
      isSelectable: inMonth && status === "available",
    });
  }

  return days;
}

export function buildDemoSlotSelection(
  dateKey: string,
  time: DemoSlotTime,
  timezone: string,
): DemoSlotSelection {
  const start = zonedDateTimeToUtc(dateKey, time, timezone);
  const end = new Date(start.getTime() + DEMO_SLOT_DURATION_MINUTES * 60 * 1000);

  return {
    dateKey,
    time,
    timezone,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

export function formatDemoSlotSummary(selection: DemoSlotSelection) {
  const start = new Date(selection.startTime);
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    timeZone: selection.timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(start);
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    timeZone: selection.timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(start);
  const offset = getUtcOffsetLabel(selection.timezone, start);
  return `${dateLabel} at ${timeLabel} (${offset})`;
}

export function listTimezoneOptions(reference = new Date()) {
  const detected = defaultDemoTimezone();
  const base = DEMO_TIMEZONE_OPTIONS.map((option) => ({
    id: option.id,
    offset: getUtcOffsetLabel(option.id, reference),
    city:
      DEMO_TIMEZONE_OPTIONS.find((entry) => entry.id === option.id)?.city ??
      option.id.replace(/_/g, " "),
    label: formatTimezoneLabel(option.id, reference),
  }));

  if (DEMO_TIMEZONE_OPTIONS.some((option) => option.id === detected)) {
    return base;
  }

  return [
    {
      id: detected,
      offset: getUtcOffsetLabel(detected, reference),
      city: detected.replace(/_/g, " "),
      label: formatTimezoneLabel(detected, reference),
    },
    ...base,
  ];
}

export function isValidDemoBooking(selection: DemoSlotSelection, now = new Date()) {
  const availability = getSlotAvailability(selection.dateKey, selection.time, selection.timezone, now);
  return availability.available;
}

export function formatBookingHoursLabel() {
  return `${DEMO_BOOKING_HOURS.days}, ${DEMO_BOOKING_HOURS.start}–${DEMO_BOOKING_HOURS.end} (${DEMO_BOOKING_HOURS.slotMinutes}-min slots, lunch ${DEMO_BOOKING_HOURS.lunchBreak})`;
}
