import type { MarketingArticleContent, MarketingDetailPageContent } from "@/lib/marketing-pages/types";
import { toArticle } from "@/lib/marketing-pages/to-article";
import {
  accountabilityPoints,
  flowSteps,
  platformPillars,
  productCapabilities,
  roles,
  successMetrics,
} from "@/lib/product-data";

export const productPages: Record<string, MarketingDetailPageContent> = {
  platform: {
    slug: "platform",
    eyebrow: "Platform",
    title: "Platform overview",
    intro:
      "RoundSync unifies daily ward care and crisis coordination on one system — with separate signals, shared patient context, and routing that reaches the right person instead of the whole unit.",
    metaTitle: "Platform overview — RoundSync",
    metaDescription:
      "How RoundSync unifies routine shift work and emergency coordination without conflating them — one patient record, role-scoped views, and relevance-based routing.",
    sections: [
      {
        title: "Built for how wards actually run",
        description:
          "Hospital teams juggle scheduled care and unplanned escalation at the same time. RoundSync keeps both on one coordinated record without turning every notification into a crisis.",
        items: platformPillars,
      },
      {
        title: "Core capabilities",
        items: productCapabilities,
      },
    ],
  },
  "emergency-routing": {
    slug: "emergency-routing",
    eyebrow: "Product",
    title: "Emergency routing",
    intro:
      "When a patient status changes, RoundSync widens coordination deliberately — trigger, route, respond, and resolve with automatic escalation if nobody acts in time.",
    metaTitle: "Emergency routing — RoundSync",
    metaDescription:
      "Trigger, route, respond, resolve — RoundSync emergency coordination with automatic escalation when first responders time out.",
    sections: [
      {
        title: "The four-stage flow",
        description:
          "Every open case moves through the same coordination stages so teams know what stage they're in and what happens next.",
        items: flowSteps.map((step) => ({
          title: step.label,
          body: step.detail,
        })),
      },
      {
        title: "What makes routing work",
        items: [
          {
            title: "Role and relevance, not broadcast",
            body: "On-call doctors, pharmacy, and front desk are pulled in based on what the situation needs — not a ward-wide pager blast.",
          },
          {
            title: "Context travels with the alert",
            body: "Patient history, the nurse's note, and urgency level arrive together so responders don't reconstruct the story mid-handoff.",
          },
          {
            title: "Automatic escalation paths",
            body: "If the first responder doesn't acknowledge within a defined window, the case moves up the chain visibly — no silent failures.",
          },
        ],
      },
    ],
  },
  "shift-assignments": {
    slug: "shift-assignments",
    eyebrow: "Product",
    title: "Shift-aware assignments",
    intro:
      "Ownership in RoundSync follows active shifts, not static nurse IDs — so patients and open cases always have someone responsible, even at handoff.",
    metaTitle: "Shift-aware assignments — RoundSync",
    metaDescription:
      "RoundSync assigns patients and cases to active shifts so handoffs don't orphan coordination when staff rotate.",
    sections: [
      {
        title: "Why shift-aware ownership matters",
        items: [
          {
            title: "Handoffs without gaps",
            body: "When a shift ends, responsibility transfers to the incoming team with context intact — not a list of orphaned cases.",
          },
          {
            title: "Assignment rotates with the ward",
            body: "Bedside ownership, open tasks, and active cases follow whoever is on duty — not a fixed row in a spreadsheet.",
          },
          {
            title: "Visible at shift change",
            body: "Outgoing and incoming staff see what's pending before the ward goes quiet — reducing 'I thought you had it' moments.",
          },
        ],
      },
      {
        title: "How it works in practice",
        items: [
          platformPillars.find((p) => p.title === "Shift-aware ownership")!,
          {
            title: "Audit trail across shifts",
            body: "Every acknowledgment and escalation is logged with actor and timestamp — so accountability continues across shift boundaries.",
          },
        ],
      },
    ],
  },
  "audit-trail": {
    slug: "audit-trail",
    eyebrow: "Trust & compliance",
    title: "Audit trail",
    intro:
      "Every acknowledgment, escalation, and handoff in RoundSync is logged with actor and timestamp — so you can reconstruct coordination after the fact.",
    metaTitle: "Audit trail — RoundSync",
    metaDescription:
      "Full coordination audit trail — every acknowledgment and escalation logged with actor, action, and timestamp.",
    sections: [
      {
        title: "Accountability built in",
        description:
          "In a hospital, unclear handoffs have consequences. RoundSync makes every step in a coordination chain visible and attributable.",
        items: accountabilityPoints,
      },
      {
        title: "What gets recorded",
        items: [
          {
            title: "Actor, action, and time",
            body: "Each step shows who acted, what they did, and when — relative and absolute timestamps for review and training.",
          },
          {
            title: "Escalation history",
            body: "When a case widens automatically, the trail shows who was notified, when, and whether they acknowledged.",
          },
          {
            title: "History that continues",
            body: "Resolved cases stay on record. If a patient relapses, prior coordination history travels forward instead of starting over.",
          },
        ],
      },
    ],
  },
  permissions: {
    slug: "permissions",
    eyebrow: "Trust & compliance",
    title: "Permission boundaries",
    intro:
      "Clinical detail stays with clinical roles. Operations sees resources and staffing — enforced at the system level, not filtered in the UI.",
    metaTitle: "Permission boundaries — RoundSync",
    metaDescription:
      "Role-scoped views and permission-gated coordination — clinical detail for clinical staff, operational views for admin and front desk.",
    sections: [
      {
        title: "Scoped by role, enforced by the system",
        items: [
          productCapabilities.find((c) => c.title === "Permission-gated views")!,
          {
            title: "Clinical vs operational separation",
            body: "Nurses and doctors see patient context needed to act. Administrators configure wards and staff — they don't browse diagnoses.",
          },
          {
            title: "No shared inbox noise",
            body: "Each person sees only what they need to act on — permission-gated coordination, not a single feed filtered by guesswork.",
          },
        ],
      },
      {
        title: "Role views at a glance",
        description: "Same patient, different lens — one coordinated record.",
        items: roles.map((r) => ({ title: r.role, body: r.detail })),
      },
    ],
  },
  "escalation-paths": {
    slug: "escalation-paths",
    eyebrow: "Trust & compliance",
    title: "Escalation paths",
    intro:
      "When coordination stalls, RoundSync escalates visibly — configurable first-response windows and fallback chains so cases don't sit unanswered.",
    metaTitle: "Escalation paths — RoundSync",
    metaDescription:
      "Configurable escalation paths with first-response windows and visible fallback chains when coordination stalls.",
    sections: [
      {
        title: "Escalation with a failure path",
        items: [
          productCapabilities.find((c) => c.title === "Configurable escalation paths")!,
          accountabilityPoints.find((p) => p.title === "Escalation when coordination stalls")!,
          {
            title: "Per case type routing",
            body: "Clinical, medication, and resource requests can each follow different chains — a pharmacy timeout doesn't look like a code blue.",
          },
        ],
      },
      {
        title: "What teams see when time runs out",
        items: [
          {
            title: "Visible chain widening",
            body: "Everyone on the case sees who was notified next and why — escalation is transparent, not a background process.",
          },
          {
            title: "Logged for review",
            body: "Missed acknowledgments and automatic widenings appear in the audit trail for shift debriefs and policy tuning.",
          },
        ],
      },
    ],
  },
  "design-principles": {
    slug: "design-principles",
    eyebrow: "Product",
    title: "Design principles",
    intro:
      "RoundSync is designed around a simple idea: get the right person involved at the right time — with a clear path when they don't respond.",
    metaTitle: "Design principles — RoundSync",
    metaDescription:
      "RoundSync design principles — right person, right time, separate routine from urgent, and escalation with accountability.",
    sections: [
      {
        title: "Principles we build on",
        items: [
          {
            title: "Right person, right time",
            body: "Route to relevance — not everyone on the ward. Reduce alert fatigue by design, not by turning notifications off.",
          },
          {
            title: "Routine and urgent, separated",
            body: "My Tasks and Active Cases run on parallel tracks with distinct signals — a due medication never reads like a crisis.",
          },
          {
            title: "Escalation with a failure path",
            body: "Every coordination chain has a next step if the first responder times out — visibly, not silently.",
          },
          {
            title: "Accountability by default",
            body: "Every handoff is logged. Teams can reconstruct what happened without relying on memory or hallway conversations.",
          },
        ],
      },
    ],
  },
};

export const solutionsPages: Record<string, MarketingDetailPageContent> = {
  "role-views": {
    slug: "role-views",
    eyebrow: "Solutions",
    title: "Role-scoped views",
    intro:
      "Each role sees only what they need to act on — permission-gated coordination on one patient record, not a single shared inbox.",
    metaTitle: "Role-scoped views — RoundSync",
    metaDescription:
      "Same patient, different lens — how RoundSync scopes coordination for nursing, clinical, pharmacy, and front desk teams.",
    sections: [
      {
        title: "By care role",
        items: roles.map((r) => ({
          title: r.role,
          body: `${r.summary} ${r.detail}`,
        })),
      },
    ],
  },
  "nursing-teams": {
    slug: "nursing-teams",
    eyebrow: "Solutions",
    title: "Nursing teams",
    intro:
      "Nurses coordinate the full shift — assigned patients, due routine work, and open cases in one place, with two-tap escalation when coordination needs to widen.",
    metaTitle: "Nursing teams — RoundSync",
    metaDescription:
      "RoundSync for nursing teams — flag crises in two taps, track open cases, and work scheduled care without alert fatigue.",
    sections: [
      {
        title: "Built for bedside coordination",
        items: [
          {
            title: roles.find((r) => r.role === "Nursing teams")!.role,
            body: roles.find((r) => r.role === "Nursing teams")!.detail,
          },
          {
            title: "My Tasks vs Active Cases",
            body: "Planned care and unplanned coordination run on separate tracks — distinct signals so teams never conflate a medication reminder with a crisis.",
          },
          {
            title: "Shift handoff support",
            body: "Outgoing and incoming nurses see pending cases and tasks before the ward goes quiet — reducing gaps at shift change.",
          },
        ],
      },
    ],
  },
  "clinical-staff": {
    slug: "clinical-staff",
    eyebrow: "Solutions",
    title: "Clinical staff",
    intro:
      "Doctors and advanced practitioners get immediate alerts with full patient context and one-tap acknowledgment — no hunting across systems mid-handoff.",
    metaTitle: "Clinical staff — RoundSync",
    metaDescription:
      "RoundSync for clinical staff — escalations with patient history, nurse notes, and actions scoped to your role.",
    sections: [
      {
        title: "Respond with context",
        items: [
          {
            title: roles.find((r) => r.role === "Clinical staff")!.role,
            body: roles.find((r) => r.role === "Clinical staff")!.detail,
          },
          {
            title: "On-call routing",
            body: "Escalations reach the right on-call coverage based on case type and urgency — not a ward-wide broadcast.",
          },
        ],
      },
    ],
  },
  pharmacy: {
    slug: "pharmacy",
    eyebrow: "Solutions",
    title: "Pharmacy",
    intro:
      "Pharmacy joins the coordination chain only when medication is part of the response — with enough context to prepare without back-and-forth.",
    metaTitle: "Pharmacy — RoundSync",
    metaDescription:
      "RoundSync for pharmacy — pulled into cases when meds matter, with context to act without unnecessary alerts.",
    sections: [
      {
        title: "In the loop when it counts",
        items: [
          {
            title: roles.find((r) => r.role === "Pharmacy")!.role,
            body: roles.find((r) => r.role === "Pharmacy")!.detail,
          },
          {
            title: "Separate from clinical noise",
            body: "Pharmacy isn't copied on every ward alert — only cases where medication is relevant to the response.",
          },
        ],
      },
    ],
  },
  "front-desk": {
    slug: "front-desk",
    eyebrow: "Solutions",
    title: "Front desk & operations",
    intro:
      "Coordinate room, equipment, and logistics requests without exposure to clinical detail outside your permission boundary.",
    metaTitle: "Front desk & operations — RoundSync",
    metaDescription:
      "RoundSync for front desk and operations — resource coordination without clinical noise.",
    sections: [
      {
        title: "Resources, not diagnoses",
        items: [
          {
            title: roles.find((r) => r.role === "Front desk & operations")!.role,
            body: roles.find((r) => r.role === "Front desk & operations")!.detail,
          },
          {
            title: "Operational requests routed cleanly",
            body: "Bed moves, equipment, and staffing logistics get their own coordination path — separate from clinical escalation.",
          },
        ],
      },
    ],
  },
  "alert-fatigue": {
    slug: "alert-fatigue",
    eyebrow: "Solutions",
    title: "Alert fatigue",
    intro:
      "RoundSync reduces noise by routing to the right person instead of broadcasting to everyone — relevance by design, not by muting alerts.",
    metaTitle: "Alert fatigue — RoundSync",
    metaDescription:
      "Reduce hospital alert fatigue — route coordination to the right role instead of ward-wide broadcasts.",
    sections: [
      {
        title: "Less noise, same urgency when it matters",
        items: [
          {
            title: "Route to relevance",
            body: "When a case escalates, only roles that need to act are notified — pharmacy for meds, front desk for beds, on-call for clinical.",
          },
          {
            title: "Separate routine from crisis",
            body: "Scheduled tasks and open cases use distinct signals — a due medication never pings like a code situation.",
          },
          platformPillars.find((p) => p.title === "Routing by relevance")!,
        ],
      },
    ],
  },
  "broken-handoffs": {
    slug: "broken-handoffs",
    eyebrow: "Solutions",
    title: "Broken handoffs",
    intro:
      "Context travels with the alert in RoundSync — patient history, the nurse's note, and next actions arrive together so nobody reconstructs the story mid-crisis.",
    metaTitle: "Broken handoffs — RoundSync",
    metaDescription:
      "Fix broken clinical handoffs — shared patient context and audit trails so coordination doesn't reset every escalation.",
    sections: [
      {
        title: "Handoffs that carry context",
        items: [
          {
            title: "One coordinated record",
            body: "Every role works from the same patient timeline — acknowledgments, notes, and escalations in one place.",
          },
          accountabilityPoints.find((p) => p.title === "Every handoff logged")!,
          {
            title: "History that continues",
            body: "If a patient relapses, prior coordination history travels forward — teams don't start from zero.",
          },
        ],
      },
    ],
  },
  "shift-change-gaps": {
    slug: "shift-change-gaps",
    eyebrow: "Solutions",
    title: "Shift change gaps",
    intro:
      "Assignment in RoundSync rotates with the ward shift — patients and open cases follow active staff, not a fixed nurse ID that clocked out hours ago.",
    metaTitle: "Shift change gaps — RoundSync",
    metaDescription:
      "Close shift change gaps — shift-aware ownership so handoffs don't orphan patients or open cases.",
    sections: [
      {
        title: "Ownership that follows the shift",
        items: [
          platformPillars.find((p) => p.title === "Shift-aware ownership")!,
          {
            title: "Structured handoff window",
            body: "Teams review pending cases and tasks at shift change — what's open, who's taking it, and what still needs acknowledgment.",
          },
          {
            title: "Audit across boundaries",
            body: "Actions taken on the previous shift remain visible — accountability doesn't reset when the clock hits seven.",
          },
        ],
      },
    ],
  },
};

export const resourcesPages: Record<string, MarketingDetailPageContent> = {
  "success-metrics": {
    slug: "success-metrics",
    eyebrow: "Resources",
    title: "Success metrics",
    intro:
      "Teams measure RoundSync on coordination speed, noise reduction, and audit clarity — the outcomes that matter when handoffs have consequences.",
    metaTitle: "Success metrics — RoundSync",
    metaDescription:
      "How hospitals measure RoundSync — time to acknowledgment, noise reduction, and audit trail clarity.",
    sections: [
      {
        title: "What teams track",
        items: successMetrics.map((m) => ({
          title: m.label,
          body: m.metric,
        })),
      },
      {
        title: "Why these metrics",
        items: [
          {
            title: "Speed without sacrificing clarity",
            body: "Faster acknowledgment means coordination widens sooner — but only to the roles that need to act.",
          },
          {
            title: "Noise as a leading indicator",
            body: "When irrelevant alerts drop, teams trust the signal — and respond faster when it matters.",
          },
          {
            title: "Audit for improvement",
            body: "Clear trails support shift debriefs, policy tuning, and procurement evidence — not just compliance checkboxes.",
          },
        ],
      },
    ],
  },
};

export const howItWorksPage: MarketingDetailPageContent = {
  slug: "how-it-works",
  eyebrow: "Resources",
  title: "How it works",
  intro:
    "Walk through the four-stage emergency coordination flow — from escalation to resolution, with automatic widening if coordination stalls.",
  metaTitle: "How it works — RoundSync",
  metaDescription:
    "Four stages when coordination needs to widen — escalate, route, respond, resolve, with automatic escalation paths.",
  sections: [
    {
      title: "Four stages when coordination needs to widen",
      description:
        "From escalation to resolution, every role stays in sync — with automatic escalation if coordination stalls.",
      items: flowSteps.map((step) => ({
        title: step.label,
        body: step.detail,
      })),
    },
    {
      title: "Parallel tracks on the ward",
      items: productCapabilities,
    },
  ],
};

export function getProductPage(slug: string): MarketingArticleContent | null {
  const page = productPages[slug];
  return page ? toArticle(page) : null;
}

export function getSolutionsPage(slug: string): MarketingArticleContent | null {
  const page = solutionsPages[slug];
  return page ? toArticle(page) : null;
}

export function getResourcesPage(slug: string): MarketingArticleContent | null {
  const page = resourcesPages[slug];
  return page ? toArticle(page) : null;
}

export function getHowItWorksPage(): MarketingArticleContent {
  return toArticle(howItWorksPage);
}

export const productPageSlugs = Object.keys(productPages);
export const solutionsPageSlugs = Object.keys(solutionsPages);
export const resourcesPageSlugs = Object.keys(resourcesPages);
