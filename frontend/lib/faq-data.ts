export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqCategories = [
  "Platform & routing",
  "Roles & permissions",
  "Shifts & handoffs",
  "Onboarding & setup",
  "Security & compliance",
  "Pricing & licensing",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export const faqItems: FaqItem[] = [
  {
    id: "routing-decision",
    category: "Platform & routing",
    question: "How does RoundSync decide who to involve in a case?",
    answer:
      "Routing considers role, on-call status, ward, and what the case requires — medication, resources, or clinical response. The goal is coordinated involvement, not alerting everyone on the floor.",
  },
  {
    id: "routine-vs-emergency",
    category: "Platform & routing",
    question: "How are routine tasks kept separate from emergencies?",
    answer:
      "Scheduled care and open cases use different flows and different visual signals. My Tasks handles planned work; Active Cases tracks unplanned coordination — so teams don't conflate the two.",
  },
  {
    id: "escalation-timeout",
    category: "Platform & routing",
    question: "What happens if nobody acknowledges an alert?",
    answer:
      "Escalation paths are configured per ward. If the first responder doesn't acknowledge within the set window, RoundSync escalates to the next role in the chain — with every step logged in the audit trail.",
  },
  {
    id: "broadcast-vs-targeted",
    category: "Platform & routing",
    question: "Does RoundSync broadcast alerts to the whole ward?",
    answer:
      "No. Alerts route to roles relevant to the case — on-call doctor, pharmacy when medication is involved, front desk for resource requests. Ward-wide broadcasts are avoided by design to reduce alert fatigue.",
  },
  {
    id: "case-reopen",
    category: "Platform & routing",
    question: "Can a resolved case be reopened?",
    answer:
      "Yes. If a patient's situation changes, staff can reopen a case and the full coordination history travels forward — so responders don't start from zero.",
  },
  {
    id: "shift-end-cases",
    category: "Shifts & handoffs",
    question: "What happens to open cases when a shift ends?",
    answer:
      "Ownership follows active shifts, not permanent assignments. When responsibility transfers, the coordination record stays intact — the next shift picks up with full context.",
  },
  {
    id: "shift-assignment",
    category: "Shifts & handoffs",
    question: "How does shift-aware assignment work?",
    answer:
      "Patient ownership is derived from active shift schedules, not static nurse IDs. When a shift changes, assignment rotates automatically — open cases and tasks stay linked to the patient, not an individual who has left.",
  },
  {
    id: "handoff-context",
    category: "Shifts & handoffs",
    question: "Do handoffs include case history?",
    answer:
      "Yes. Incoming shift staff see open cases, recent acknowledgments, and escalation history for their assigned patients — without hunting through messages or paper notes.",
  },
  {
    id: "role-views",
    category: "Roles & permissions",
    question: "Do all roles see the same patient information?",
    answer:
      "No. Each role gets a permission-scoped view — nurses see clinical coordination, pharmacy sees medication-relevant detail, front desk sees resource requests without clinical diagnoses. Same patient, different lens.",
  },
  {
    id: "admin-clinical-access",
    category: "Roles & permissions",
    question: "Can administrators see clinical diagnoses?",
    answer:
      "Administrators and operations staff see resource and coordination data — room requests, equipment, staffing — not clinical detail. Permission boundaries are enforced at the system level, not by UI filtering alone.",
  },
  {
    id: "pharmacy-involvement",
    category: "Roles & permissions",
    question: "When is pharmacy pulled into a case?",
    answer:
      "Only when medication is part of the response. Pharmacy isn't on every alert — they're routed in when the case type or escalation requires it.",
  },
  {
    id: "audit-trail",
    category: "Security & compliance",
    question: "Can we see who acknowledged what, and when?",
    answer:
      "Yes. Every acknowledgment, escalation, and resolution is logged in the audit trail — searchable, timestamped, and attributable to the actor and role.",
  },
  {
    id: "audit-retention",
    category: "Security & compliance",
    question: "How long is audit data retained?",
    answer:
      "Retention policies are configurable per deployment. Standard configurations retain full audit history for compliance review — contact our team for specifics aligned to your hospital's requirements.",
  },
  {
    id: "data-hosting",
    category: "Security & compliance",
    question: "Where is patient and coordination data stored?",
    answer:
      "RoundSync is deployed per organization with data residency options discussed during onboarding. Security documentation and deployment architecture are available for procurement and IT review.",
  },
  {
    id: "onboarding-timeline",
    category: "Onboarding & setup",
    question: "How long does onboarding typically take?",
    answer:
      "Single-ward pilots often go live in a few weeks. Multi-ward rollouts depend on scope, role configuration, and integration requirements — we align timelines during sales conversations.",
  },
  {
    id: "ward-configuration",
    category: "Onboarding & setup",
    question: "Do we configure escalation paths ourselves?",
    answer:
      "Initial escalation chains are set up with our team during onboarding — based on your ward structure, on-call schedules, and roles. Administrators can adjust windows and paths afterward within permission boundaries.",
  },
  {
    id: "training",
    category: "Onboarding & setup",
    question: "Is training included for ward staff?",
    answer:
      "Yes. Onboarding includes role-based training for nurses, clinical staff, and administrators. Materials are tailored to each role's view — not a generic product tour.",
  },
  {
    id: "ehr-integration",
    category: "Onboarding & setup",
    question: "Does RoundSync integrate with our EHR?",
    answer:
      "Integration options vary by EHR and deployment scope. Technology partnerships and custom integrations are handled through our partnerships team — reach out if you have specific systems in mind.",
  },
  {
    id: "pricing-model",
    category: "Pricing & licensing",
    question: "How is RoundSync priced?",
    answer:
      "Licensing is based on ward count and roles in scope. We offer pilot pricing for single-ward evaluations and volume terms for hospital groups — talk to sales for a quote tailored to your deployment.",
  },
  {
    id: "pilot-program",
    category: "Pricing & licensing",
    question: "Can we run a pilot before a full rollout?",
    answer:
      "Yes. Most customers start with a single-ward pilot to validate routing, handoffs, and adoption before expanding. Pilots include onboarding support and success metrics review.",
  },
  {
    id: "contract-length",
    category: "Pricing & licensing",
    question: "What contract terms are available?",
    answer:
      "Annual and multi-year terms are available. Procurement teams receive documentation for RFP and vendor evaluation — contact sales for commercial terms.",
  },
  {
    id: "messages-vs-cases",
    category: "Platform & routing",
    question: "What's the difference between Messages and Active Cases?",
    answer:
      "Messages are informal care-team communication — quick questions not tied to a formal event. Active Cases are procedural emergencies with routing, escalation, and audit requirements. If it needs to be reconstructable later, it's a case.",
  },
];

/** Subset shown on the marketing homepage. */
export const homepageFaqItems = faqItems.filter((item) =>
  ["routing-decision", "routine-vs-emergency", "shift-end-cases", "audit-trail"].includes(
    item.id,
  ),
);

export function filterFaqItems(query: string, category?: string): FaqItem[] {
  const normalized = query.trim().toLowerCase();

  return faqItems.filter((item) => {
    const matchesCategory = !category || item.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;

    return (
      item.question.toLowerCase().includes(normalized) ||
      item.answer.toLowerCase().includes(normalized) ||
      item.category.toLowerCase().includes(normalized)
    );
  });
}
