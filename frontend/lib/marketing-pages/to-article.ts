import type {
  ArticleSection,
  ArticleSubsection,
  MarketingArticleContent,
  MarketingDetailPageContent,
} from "@/lib/marketing-pages/types";
import { estimateReadingTime, slugifyHeading } from "@/lib/marketing-pages/headings";

const pageContext: Record<string, string> = {
  platform:
    "ward teams balancing scheduled medications, admissions, and the occasional rapid response on the same floor",
  "emergency-routing":
    "a nurse notices a change in status and needs the right people involved within minutes, not after a phone tree",
  "shift-assignments":
    "shift change at 19:00 when outgoing staff hand off open cases and bedside ownership",
  "audit-trail":
    "morning debriefs, incident reviews, and procurement questions about how coordination actually worked",
  permissions:
    "front desk staff who need bed logistics without clinical detail, and clinicians who need patient context without admin noise",
  "escalation-paths":
    "a medication case waiting on pharmacy while the on-call doctor assumes someone else picked it up",
  "design-principles":
    "teams evaluating whether a coordination tool will reduce noise or just move it to a new screen",
  "role-views":
    "the same patient record viewed by nursing, pharmacy, and operations — each with different jobs to do",
  "nursing-teams":
    "a charge nurse juggling due tasks, open cases, and new admissions on a single shift",
  "clinical-staff":
    "an on-call doctor responding between rooms with only seconds to understand what changed",
  pharmacy:
    "pharmacy technicians pulled into cases only when medication is part of the response",
  "front-desk":
    "bed management and equipment requests that must not leak sensitive clinical detail",
  "alert-fatigue":
    "staff who have learned to ignore ward-wide pings because most of them were not for them",
  "broken-handoffs":
    "responders joining mid-case and spending the first minutes reconstructing what already happened",
  "shift-change-gaps":
    "patients whose open cases still list a nurse who clocked out two hours ago",
  "success-metrics":
    "clinical ops leads proving that a pilot reduced noise without slowing crisis response",
  "how-it-works":
    "teams learning RoundSync for the first time and needing a clear mental model of escalation",
};

const pageLedes: Record<string, string[]> = {
  platform: [
    "Most ward tools were built for either scheduled work or emergencies — not both at once. That split is why teams end up with parallel chat threads, whiteboard tallies, and pager broadcasts that all describe the same patient differently.",
    "RoundSync treats routine shift work and crisis coordination as parallel tracks on one patient record. The goal is not more notifications — it is the right notification, with shared context, when someone's job requires them to act.",
    "This guide explains the platform model ward by ward: what stays separate, what stays shared, and why that distinction reduces both alert fatigue and missed handoffs.",
  ],
  "emergency-routing": [
    "Emergency coordination fails in predictable ways: the wrong people get pinged, context arrives late, and nobody is sure who acknowledged what. RoundSync names those failure modes and designs around them.",
    "The product follows a deliberate four-stage flow — escalate, route, respond, resolve — with automatic widening when the first responder times out. Everyone on the case sees the same stage, not a private interpretation of it.",
  ],
  "shift-assignments": [
    "Spreadsheets assign nurses to patients. Reality assigns responsibility to whoever is on the floor right now. When those two diverge at shift change, cases stall and patients wait.",
    "RoundSync binds ownership to active shifts — bedside assignment, open tasks, and active cases rotate with the ward schedule instead of a static ID from yesterday.",
  ],
  "audit-trail": [
    "After a difficult shift, teams reconstruct events from memory, hallway conversations, and fragmented system logs. That is slow, incomplete, and risky when quality or compliance asks what happened.",
    "RoundSync records every acknowledgment and escalation as it happens — actor, action, timestamp — so the coordination story is already written when you need it.",
  ],
  permissions: [
    "Hospital software often solves access control by hiding buttons in the UI. That is not security — it is obscurity. A determined user or a misconfigured export can still leak what should stay clinical.",
    "RoundSync enforces permission boundaries at the system level. Clinical roles see clinical context. Operations sees logistics. Administrators configure the ward — they do not browse the chart.",
  ],
  "escalation-paths": [
    "The most dangerous moment in coordination is not the first alert — it is the silence after it. When nobody acknowledges, cases sit in limbo while everyone assumes someone else picked it up.",
    "Escalation paths in RoundSync are explicit, timed, and visible. If the first responder misses the window, the case widens automatically and logs who was notified next.",
  ],
  "design-principles": [
    "Features can be copied. Principles are harder — and they are what keep a product coherent as you add wards, roles, and policies.",
    "These are the ideas we return to when deciding what belongs in RoundSync and what belongs in a generic chat tool or EHR module.",
  ],
  "role-views": [
    "A single shared inbox sounds efficient until pharmacy reads a code narrative and front desk sees a diagnosis they should not. Same patient, different job — different lens.",
    "RoundSync scopes each role to what they need to act on, on one coordinated record, without asking humans to filter noise manually.",
  ],
  "nursing-teams": [
    "Nurses coordinate the shift — not just react to it. That means due medications, admissions, family updates, and the occasional rapid widening of coordination, often simultaneously.",
    "RoundSync gives nursing teams one place to see assigned patients, scheduled work, and open cases — with escalation in two taps when the situation needs more than the bedside.",
  ],
  "clinical-staff": [
    "On-call coverage means context must arrive fast and complete. Doctors cannot afford three minutes of chart archaeology before they understand why they were pulled in.",
    "RoundSync delivers escalations with patient history, the nurse's note, and next actions scoped to clinical roles — plus one-tap acknowledgment so the ward knows you are on it.",
  ],
  pharmacy: [
    "Pharmacy should not live inside every ward alert. They should appear when medication is part of the response — with enough detail to prepare, not enough noise to mute the channel.",
    "RoundSync pulls pharmacy into the coordination chain selectively, with context attached so technicians and pharmacists act without a string of phone calls.",
  ],
  "front-desk": [
    "Operations teams move beds, equipment, and people. They should not inherit clinical narratives to do it — and they should not be left out when logistics block care.",
    "RoundSync routes resource requests on their own path, with permission boundaries that keep clinical detail where it belongs.",
  ],
  "alert-fatigue": [
    "Alert fatigue is not laziness — it is adaptation. When most pings are irrelevant, teams learn to ignore the channel, including the ones that matter.",
    "RoundSync attacks fatigue structurally: route to relevance, separate routine from crisis, and escalate with a visible chain instead of broadcasting to the unit.",
  ],
  "broken-handoffs": [
    "Broken handoffs are expensive in time and trust. The next responder repeats questions the last person already answered — while the patient waits.",
    "RoundSync keeps context on the patient timeline so every widening of coordination starts from shared facts, not reconstructed guesses.",
  ],
  "shift-change-gaps": [
    "Shift change is when ownership is most fragile. Outgoing staff leave, incoming staff arrive, and open cases still list names from the previous rotation.",
    "RoundSync aligns assignment with the active shift and surfaces pending work at handoff so gaps are visible before they become incidents.",
  ],
  "success-metrics": [
    "Hospitals measure what they can defend in a pilot review: speed to acknowledgment, noise reduction, and whether the audit trail answers questions without a manual reconstruction.",
    "These are the outcomes RoundSync customers track — not vanity metrics, but signals that coordination is getting sharper and safer.",
  ],
  "how-it-works": [
    "If you are evaluating RoundSync, start here. This is the coordination model the rest of the product hangs on — how a bedside concern becomes a managed case with owners, timeouts, and a trail.",
    "The flow is intentionally simple to explain and strict to execute. That balance is what keeps wards aligned when adrenaline is high and minutes matter.",
  ],
};

function expandItemParagraphs(title: string, body: string, pageSlug: string): string[] {
  const context = pageContext[pageSlug] ?? "everyday ward coordination";
  return [
    body,
    `In practice, ${title.toLowerCase()} matters most during ${context}. Teams should not have to hunt across systems to understand why they were pulled in — the alert should carry enough context to act.`,
    `RoundSync makes that behavior default rather than a training exercise. When ${title.toLowerCase()} is working, staff describe the product as quiet until it needs to be loud — and specific about who must move next.`,
  ];
}

function buildSubsections(
  items: Array<{ title: string; body: string }>,
  pageSlug: string,
  sectionTitle: string,
): ArticleSubsection[] {
  return items.map((item, index) => {
    const baseId = slugifyHeading(item.title);
    const id = `${slugifyHeading(sectionTitle)}-${baseId}-${index}`;

    return {
      id,
      title: item.title,
      paragraphs: expandItemParagraphs(item.title, item.body, pageSlug),
      bullets:
        index === 0
          ? [
              "Who owns the next action after acknowledgment",
              "What context travels with the notification",
              "What happens automatically if nobody responds in time",
            ]
          : undefined,
    };
  });
}

function openingForSection(
  section: MarketingDetailPageContent["sections"][number],
  pageSlug: string,
): string[] {
  if (section.description) {
    return [
      section.description,
      `The sections below break down how this shows up in RoundSync — and what your ward should expect during ${pageContext[pageSlug] ?? "live use"}.`,
    ];
  }

  return [
    `This section covers the parts of ${section.title.toLowerCase()} that teams ask about most during demos and onboarding — not marketing abstractions, but the behaviors they will feel on shift.`,
  ];
}

function sectionCallout(sectionTitle: string, pageTitle: string) {
  return {
    label: "Ward takeaway",
    body: `When you read ${sectionTitle.toLowerCase()} in the context of ${pageTitle.toLowerCase()}, ask one question: does everyone who needs to act know they are responsible — and can they prove it afterward? RoundSync is built so the answer is yes.`,
  };
}

export function toArticle(page: MarketingDetailPageContent): MarketingArticleContent {
  const lede = pageLedes[page.slug] ?? [
    page.intro,
    `Below, we walk through the mechanics, the ward scenarios where it matters, and the details teams usually ask about in demos — written so clinical leads and IT can share the same understanding.`,
  ];

  const sections: ArticleSection[] = page.sections.map((section, sectionIndex) => {
    const sectionId = slugifyHeading(section.title);
    const subsections = buildSubsections(section.items, page.slug, section.title);

    return {
      id: sectionId,
      title: section.title,
      paragraphs: openingForSection(section, page.slug),
      subsections,
      callout: sectionIndex === 0 ? sectionCallout(section.title, page.title) : undefined,
    };
  });

  // Closing synthesis section for every article
  sections.push({
    id: "what-to-do-next",
    title: "What to do next on your ward",
    paragraphs: [
      `Understanding ${page.title.toLowerCase()} is only the first step. The useful test is a short pilot: pick one ward, one shift pattern, and one escalation path — then measure whether coordination widens to the right roles faster and with less noise.`,
      "RoundSync implementations typically start with role mapping and escalation windows, then expand once teams trust the signals. That sequence matters more than turning on every feature at once.",
    ],
    subsections: [
      {
        id: "what-to-do-next-demo",
        title: "See it with your workflows",
        paragraphs: [
          "Book a demo when you want a tailored walkthrough — ward structure, roles, and escalation policies included. We will map this article to your floor, not a generic template.",
        ],
        bullets: [
          "Bring your charge nurse or clinical ops lead",
          "Note one recurring handoff pain point",
          "Ask about audit and permission boundaries for your org",
        ],
      },
      {
        id: "what-to-do-next-rollout",
        title: "Plan a rollout conversation",
        paragraphs: [
          "Talk to sales when you are scoping multi-ward deployment, procurement, or network-wide governance. They will connect this product model to timeline, licensing, and implementation phases.",
        ],
      },
    ],
  });

  return {
    slug: page.slug,
    eyebrow: page.eyebrow,
    title: page.title,
    lede,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    sections,
    readingTimeMinutes: estimateReadingTime(sections, lede),
  };
}
