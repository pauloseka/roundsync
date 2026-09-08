import type { DemoDateStatus, DemoSlotBlockReason } from "@/lib/demo-scheduling";

export const bookDemoPanelCopy = {
  modeCalendarTitle: "Pick a time",
  modeCalendarHint: "Choose an open slot — at least 24 hours ahead.",
  modeManualTitle: "Send a request",
  modeManualHint: "No slot that works? We'll email you to schedule.",
  calendarStepLabel: "Step 1 · Choose a slot",
  followUpStepLabel: "Step 2 · Help us prep",
  manualStepLabel: "Your details",
  followUpTitle: "Almost done — help us tailor the session",
  followUpSubtitle:
    "Add context so we don't waste your first ten minutes on basics we could've read ahead.",
  manualTitle: "Tell us about your ward",
  manualSubtitle:
    "Share your details and we'll reach out within two business days to find a time that works — including colleagues you want on the call.",
  manualMessagePlaceholder:
    "Ward structure, coordination challenges, preferred days or times, roles to focus on…",
  manualPrivacyNote:
    "We'll only use this information to schedule your demo. No marketing lists.",
  selectDateHint: "Select an available date to see open times.",
  minLeadTimeHint: "Bookings must be at least 24 hours from now.",
  bookingHoursTitle: "Demo hours",
  blockedPatternsTitle: "When dates are unavailable",
  slotTooSoon: "This time is too soon — choose a slot at least 24 hours from now.",
  slotBooked: "This slot is already booked. Pick another time on this date or try a different day.",
  slotContinue: "Continue to details",
  guestEmailsLabel: "Colleagues to invite",
  guestEmailsHint: "Add work emails for anyone who should join the demo.",
  guestEmailsPlaceholder: "colleague@hospital.org",
  addGuestEmail: "Add another email",
  removeGuestEmail: "Remove",
  anythingElseLabel: "Anything else we should know?",
  anythingElsePlaceholder:
    "Ward structure, current coordination tools, escalation policies, procurement timeline…",
  submitFollowUp: "Send prep notes",
  submitManual: "Request demo",
  submitting: "Sending…",
  calendarSuccessTitle: "Demo scheduled",
  manualSuccessTitle: "Request received",
  calendarSuccessBody: (when: string) =>
    `You're on the calendar for ${when}. We've noted your prep details — see you soon.`,
  manualSuccessBody:
    "Thanks for reaching out. Our team will contact you within two business days to schedule a walkthrough tailored to your ward.",
  backHome: "Back to homepage",
  dateStatusMessage: (status: DemoDateStatus) => {
    switch (status) {
      case "weekend":
        return "Weekends are unavailable — demos run Monday to Friday only.";
      case "team_offsite":
        return "The 7th of each month is a team off-site day — no demos are scheduled.";
      case "fully_booked":
        return "This date is fully booked. Try another day with open slots.";
      case "past":
        return "This date is in the past.";
      case "outside_horizon":
        return "This date is outside our booking window (6 weeks ahead).";
      default:
        return "This date is unavailable.";
    }
  },
  slotStatusMessage: (reason: DemoSlotBlockReason) => {
    switch (reason) {
      case "too_soon":
        return bookDemoPanelCopy.slotTooSoon;
      case "booked":
        return bookDemoPanelCopy.slotBooked;
      default:
        return "This slot is unavailable.";
    }
  },
} as const;
