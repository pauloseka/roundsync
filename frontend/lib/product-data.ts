export const platformPillars = [
  {
    title: "One patient, every role",
    body: "Nurses, doctors, pharmacists, and front desk work from the same coordinated record — each with a view scoped to what they need to act on.",
  },
  {
    title: "Routine and urgent, separated",
    body: "Scheduled care and open cases run on parallel tracks with distinct signals — so a due medication never reads like a crisis.",
  },
  {
    title: "Routing by relevance",
    body: "When a case escalates, coordination reaches the on-call doctor, pharmacist, or admin based on what the situation actually needs — not a ward-wide broadcast.",
  },
  {
    title: "Shift-aware ownership",
    body: "Responsibility follows active shifts, not static assignments — so handoffs at shift change don't leave patients or cases without an owner.",
  },
];

export const flowSteps = [
  {
    label: "Escalate",
    detail:
      "Care staff flags a change in patient status — two taps, with urgency level and optional note.",
  },
  {
    label: "Route",
    detail:
      "RoundSync determines who needs to coordinate next: on-call doctor, pharmacy, or front desk — by role and relevance.",
  },
  {
    label: "Respond",
    detail:
      "Each role acknowledges with full patient context already attached — no hunting across systems mid-handoff.",
  },
  {
    label: "Resolve",
    detail:
      "The case closes with a complete coordination trail — who acted, when, and what happened next.",
  },
];

export const roles = [
  {
    role: "Nursing teams",
    summary: "Coordinate the shift, not just react to it.",
    detail:
      "See assigned patients, due routine work, and open cases in one place — escalate when coordination needs to widen.",
  },
  {
    role: "Clinical staff",
    summary: "Context arrives with the handoff.",
    detail:
      "Respond to escalations with patient history, the nurse's note, and next actions scoped to your role — not the whole chart.",
  },
  {
    role: "Pharmacy",
    summary: "Pulled in only when meds matter.",
    detail:
      "Join the coordination chain when medication is part of the response — with enough context to prepare without back-and-forth.",
  },
  {
    role: "Front desk & operations",
    summary: "Resources, not clinical noise.",
    detail:
      "Coordinate room, equipment, and logistics requests without exposure to detail outside your permission boundary.",
  },
];

export const accountabilityPoints = [
  {
    title: "Every handoff logged",
    body: "Actor, action, and timestamp — relative and absolute — for every step in a coordination chain.",
  },
  {
    title: "Escalation when coordination stalls",
    body: "If the first responder doesn't act within a defined window, the case moves up automatically — visibly, not silently.",
  },
  {
    title: "History that continues",
    body: "Resolved cases stay on record. If a patient relapses, the coordination history travels forward instead of starting over.",
  },
];

export const successMetrics = [
  { metric: "Time to first acknowledgment", label: "Coordination speed" },
  { metric: "Noise reduction across roles", label: "Relevance routing" },
  { metric: "Full audit trail clarity", label: "Handoff accountability" },
];

export const productCapabilities = [
  {
    title: "My Tasks vs Active Cases",
    body: "Planned care and unplanned coordination run on separate tracks — distinct signals, so teams never conflate a medication reminder with a crisis.",
  },
  {
    title: "Permission-gated views",
    body: "Clinical detail stays with clinical roles. Operations sees resources and staffing — enforced at the system level, not filtered in the UI.",
  },
  {
    title: "Configurable escalation paths",
    body: "First-response windows and fallback chains per case type — clinical, medication, and resource requests can each route differently.",
  },
];
