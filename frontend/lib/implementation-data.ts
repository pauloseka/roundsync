export interface ImplementationPhase {
  id: string;
  label: string;
  duration: string;
  title: string;
  summary: string;
  deliverables: string[];
}

export interface ImplementationPillar {
  title: string;
  body: string;
}

export const implementationPhases: ImplementationPhase[] = [
  {
    id: "discovery",
    label: "Phase 1",
    duration: "Week 1",
    title: "Discovery & ward mapping",
    summary:
      "We document your ward structure, roles, on-call patterns, and current coordination workflows.",
    deliverables: [
      "Ward and site inventory",
      "Role matrix per ward",
      "Current escalation policy review",
      "Success metrics baseline",
    ],
  },
  {
    id: "configuration",
    label: "Phase 2",
    duration: "Weeks 1–2",
    title: "Configuration",
    summary:
      "Escalation paths, permission boundaries, and shift schedules are configured to match how your teams actually work.",
    deliverables: [
      "Escalation chains per case type",
      "Role permissions scoped to policy",
      "Shift and on-call rota setup",
      "Notification preferences by role",
    ],
  },
  {
    id: "pilot",
    label: "Phase 3",
    duration: "Weeks 2–4",
    title: "Pilot ward go-live",
    summary:
      "One ward goes live with full support — staff trained, sandbox cases run, and routing validated against real workflows.",
    deliverables: [
      "Role-based staff training",
      "Sandbox walkthroughs completed",
      "Pilot ward live with support coverage",
      "First-week routing review",
    ],
  },
  {
    id: "rollout",
    label: "Phase 4",
    duration: "Weeks 4–8",
    title: "Rollout & expansion",
    summary:
      "Pilot learnings applied as additional wards and roles come online — configuration refined from audit data.",
    deliverables: [
      "Phased ward activation plan",
      "Configuration adjustments from pilot",
      "IT provisioning at scale",
      "Shift lead handoff playbooks",
    ],
  },
  {
    id: "ongoing",
    label: "Phase 5",
    duration: "Ongoing",
    title: "Adoption & optimization",
    summary:
      "Success metrics reviewed, escalation windows tuned, and new staff onboarded through the help centre and support.",
    deliverables: [
      "Monthly metrics review",
      "Escalation window optimization",
      "New staff onboarding path",
      "Dedicated support channel",
    ],
  },
];

export const configurationPillars: ImplementationPillar[] = [
  {
    title: "Ward structure",
    body: "Sites, wards, and bed groupings mapped so patient ownership and routing stay ward-scoped — not hospital-wide noise.",
  },
  {
    title: "Roles & permissions",
    body: "Nursing, clinical, pharmacy, front desk, and admin each get a view scoped to what they need — enforced at the system level.",
  },
  {
    title: "Escalation windows",
    body: "First-response timeouts and fallback chains configured per case type — clinical, medication, and resource requests can each route differently.",
  },
  {
    title: "Shift-aware ownership",
    body: "Active shift schedules drive patient assignment so handoffs at shift change don't orphan open cases.",
  },
];
