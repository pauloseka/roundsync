export interface HelpGuideSection {
  heading: string;
  body: string;
}

export interface HelpGuide {
  id: string;
  audience: string;
  title: string;
  summary: string;
  readTime: string;
  sections: HelpGuideSection[];
}

export const helpCentreAudiences = [
  "Administrators",
  "Shift leads",
  "IT teams",
  "All staff",
] as const;

export type HelpCentreAudience = (typeof helpCentreAudiences)[number];

export const helpGuides: HelpGuide[] = [
  {
    id: "configure-escalation",
    audience: "Administrators",
    title: "Configuring escalation paths",
    summary:
      "Set up who gets notified first, escalation windows, and fallback chains for each ward.",
    readTime: "8 min read",
    sections: [
      {
        heading: "Before you start",
        body: "Gather your ward's on-call rota, role list, and current escalation policy. You'll configure one path per case type — clinical response, medication, and resource requests can each route differently.",
      },
      {
        heading: "Define the first responder",
        body: "For each case type, assign the primary role — typically on-call clinical staff for emergencies, pharmacy when medication is flagged, or front desk for resource requests. RoundSync routes to active shift holders, not static user IDs.",
      },
      {
        heading: "Set escalation windows",
        body: "Choose how long the first responder has to acknowledge before the case escalates. Ward leads often start with 2–5 minutes for critical cases and adjust based on observed response times in the audit trail.",
      },
      {
        heading: "Add fallback roles",
        body: "Chain one or more fallback roles in order. If the first responder times out, RoundSync notifies the next role automatically — every step logged with timestamp and actor.",
      },
    ],
  },
  {
    id: "roles-permissions",
    audience: "Administrators",
    title: "Managing roles and permissions",
    summary:
      "Scope what each role can see and do — clinical detail stays with clinical roles.",
    readTime: "6 min read",
    sections: [
      {
        heading: "Role templates",
        body: "RoundSync ships with role templates for nursing, clinical staff, pharmacy, front desk, and administration. Start from a template and adjust permissions to match your hospital's policy.",
      },
      {
        heading: "Permission boundaries",
        body: "Permissions control view access, not just UI filters. Administrators see operational data — staffing, resources — without clinical diagnoses. Nurses and doctors see full patient coordination context for assigned wards.",
      },
      {
        heading: "Assigning staff to roles",
        body: "Assign users to one primary role per ward. Staff with multiple responsibilities can hold secondary roles, but each session uses the active role context to prevent permission bleed.",
      },
    ],
  },
  {
    id: "onboarding-staff",
    audience: "Administrators",
    title: "Onboarding new ward staff",
    summary:
      "Provision accounts, assign wards, and get new team members oriented on day one.",
    readTime: "5 min read",
    sections: [
      {
        heading: "Create the account",
        body: "Add the user with their work email, assign their ward and role, and set their shift schedule. They'll receive an invite to set credentials and complete role-specific orientation.",
      },
      {
        heading: "Shift assignment",
        body: "Link the user to their active shift pattern so patient ownership and case routing follow them during their hours — not when they're off duty.",
      },
      {
        heading: "First-day checklist",
        body: "New staff should review My Tasks vs Active Cases, practice acknowledging a test case in sandbox mode, and confirm their notification preferences in Settings.",
      },
    ],
  },
  {
    id: "shift-handoffs",
    audience: "Shift leads",
    title: "Running shift handoffs",
    summary:
      "Transfer open cases and patient ownership cleanly when one shift ends and the next begins.",
    readTime: "7 min read",
    sections: [
      {
        heading: "Pre-handoff review",
        body: "Before shift change, outgoing staff review open cases on the Dashboard. Each case shows urgency, time elapsed, and who's acknowledged — flag anything that needs verbal briefing.",
      },
      {
        heading: "Ownership transfer",
        body: "When the new shift activates, patient assignment rotates automatically. Open cases stay linked to the patient; incoming staff see full coordination history without re-entering context.",
      },
      {
        heading: "Verbal + system handoff",
        body: "Use the Dashboard as your handoff board — walk through open cases with the incoming lead. Add a case note for anything that needs emphasis; notes become part of the audit record.",
      },
    ],
  },
  {
    id: "shift-change-cases",
    audience: "Shift leads",
    title: "Reviewing open cases at shift change",
    summary:
      "What incoming shift leads should check before taking responsibility for the ward.",
    readTime: "4 min read",
    sections: [
      {
        heading: "Open case queue",
        body: "Start on Active Cases filtered to your ward. Sort by urgency and time elapsed — red-capable badges indicate cases that haven't been acknowledged or are escalated.",
      },
      {
        heading: "Unacknowledged alerts",
        body: "Any case without a first acknowledgment needs immediate attention. Check whether escalation has fired and who is currently responsible.",
      },
      {
        heading: "Routine work overlap",
        body: "Cross-check My Tasks for overdue items on your assigned patients. Routine tasks and open cases run on separate tracks — both need coverage at handoff.",
      },
    ],
  },
  {
    id: "on-call-schedules",
    audience: "Shift leads",
    title: "Setting on-call schedules",
    summary:
      "Keep routing accurate by keeping on-call rota in sync with who's actually covering.",
    readTime: "5 min read",
    sections: [
      {
        heading: "Rota vs shift assignment",
        body: "On-call schedules determine who receives first-response alerts outside routine shift patterns — e.g. weekend cover or night float. Shift assignment handles day-to-day ward ownership.",
      },
      {
        heading: "Updating the rota",
        body: "Update on-call entries when cover changes — swap shifts, leave, or locum cover. Stale rota is the most common cause of misrouted alerts.",
      },
      {
        heading: "Escalation fallback",
        body: "If on-call staff don't acknowledge, escalation paths use the configured fallback chain — not the full ward broadcast.",
      },
    ],
  },
  {
    id: "deployment-overview",
    audience: "IT teams",
    title: "Deployment overview",
    summary:
      "Architecture, hosting options, and what IT needs for a ward rollout.",
    readTime: "10 min read",
    sections: [
      {
        heading: "Deployment model",
        body: "RoundSync deploys per organization — dedicated instance with configurable data residency. Single-ward pilots run on the same architecture as full rollouts, scaled to scope.",
      },
      {
        heading: "Network requirements",
        body: "Staff devices need HTTPS access to the RoundSync instance. Push notifications require compatible mobile browsers or the native app where deployed. Document firewall allowlists during onboarding.",
      },
      {
        heading: "Identity and access",
        body: "Support email/password provisioning out of the box. SSO and directory sync are available for enterprise deployments — discuss requirements with our team during implementation.",
      },
    ],
  },
  {
    id: "security-compliance",
    audience: "IT teams",
    title: "Security and data residency",
    summary:
      "Documentation for procurement, security review, and compliance teams.",
    readTime: "8 min read",
    sections: [
      {
        heading: "Data handling",
        body: "Coordination data includes patient context scoped by role. Audit logs capture every acknowledgment, escalation, and configuration change — retained per your deployment policy.",
      },
      {
        heading: "Access controls",
        body: "Role-based permissions are enforced server-side. Session management, password policy, and admin action logging are configurable per organization.",
      },
      {
        heading: "Compliance documentation",
        body: "Security questionnaires, deployment architecture diagrams, and data processing documentation are available on request — contact support or your account team.",
      },
    ],
  },
  {
    id: "user-provisioning",
    audience: "IT teams",
    title: "User provisioning at scale",
    summary:
      "Bulk import, directory sync, and deprovisioning when staff leave.",
    readTime: "6 min read",
    sections: [
      {
        heading: "Bulk import",
        body: "Import users via CSV with ward, role, and email mapping. Validate in staging before applying to production — our onboarding team can assist with the first import.",
      },
      {
        heading: "Deprovisioning",
        body: "Deactivate accounts when staff leave; open cases on their assigned patients transfer to the active shift owner automatically. Audit trail retains historical attribution.",
      },
      {
        heading: "Directory sync",
        body: "Enterprise deployments can sync with Active Directory or SAML identity providers — reducing manual provisioning overhead for large hospital groups.",
      },
    ],
  },
  {
    id: "getting-started",
    audience: "All staff",
    title: "Getting started with RoundSync",
    summary:
      "Orientation for new users — navigation, notifications, and your first shift.",
    readTime: "5 min read",
    sections: [
      {
        heading: "Your dashboard",
        body: "The Dashboard shows your assigned patients for the active shift — vitals flags, due tasks, and open cases at a glance. It's your orientation screen, not your working checklist.",
      },
      {
        heading: "Navigation basics",
        body: "My Tasks is planned care. Active Cases is unplanned coordination. Messages is informal team chat. Patients is lookup and reference. Each serves a different job — don't conflate them.",
      },
      {
        heading: "Notifications",
        body: "Configure alert sound and scope in Settings. Critical case alerts use urgency colors; routine task reminders stay neutral — by design, so you don't become numb to red.",
      },
    ],
  },
  {
    id: "tasks-vs-cases",
    audience: "All staff",
    title: "My Tasks vs Active Cases",
    summary:
      "Why routine work and emergencies are separate — and why that matters.",
    readTime: "4 min read",
    sections: [
      {
        heading: "My Tasks — planned care",
        body: "Medication times, vitals checks, care rounds. Sorted by due time, neutral badges. Nothing is wrong — it's just due.",
      },
      {
        heading: "Active Cases — unplanned coordination",
        body: "Something changed in patient status. Urgency-colored, routed to the right roles, with escalation if nobody acts. This is the emergency queue.",
      },
      {
        heading: "Why they're separate",
        body: "Mixing the two causes alert fatigue — nurses ignoring red because it showed up on a medication reminder. RoundSync keeps the signals distinct so each one means what it should.",
      },
    ],
  },
  {
    id: "role-scoped-views",
    audience: "All staff",
    title: "Understanding your role-scoped view",
    summary:
      "Why you see different information than colleagues on the same ward.",
    readTime: "3 min read",
    sections: [
      {
        heading: "Same patient, different lens",
        body: "Every role works from the same coordinated record, but each person sees only what they need to act on. Pharmacy isn't on every alert; front desk doesn't see diagnoses.",
      },
      {
        heading: "When you're pulled in",
        body: "You receive alerts when routing determines your role is relevant — on-call status, case type, and escalation chain. If you're not involved, you won't get the noise.",
      },
      {
        heading: "Trust the routing",
        body: "If you think you should have been notified and weren't, check with your shift lead or administrator — routing config may need updating, not a bug in your view.",
      },
    ],
  },
];

export function filterHelpGuides(query: string, audience?: string): HelpGuide[] {
  const normalized = query.trim().toLowerCase();

  return helpGuides.filter((guide) => {
    const matchesAudience = !audience || guide.audience === audience;
    if (!matchesAudience) return false;
    if (!normalized) return true;

    const searchable = [
      guide.title,
      guide.summary,
      guide.audience,
      ...guide.sections.flatMap((s) => [s.heading, s.body]),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalized);
  });
}
