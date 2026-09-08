export const BOOK_DEMO_HREF = "/book-a-demo";
export const CONTACT_SUPPORT_HREF = "/contact-support";
export const TALK_TO_SALES_HREF = "/talk-to-sales";
export const PARTNERSHIPS_HREF = "/partnerships";
export const FAQS_HREF = "/faqs";
export const HELP_CENTRE_HREF = "/help-centre";
export const IMPLEMENTATION_HREF = "/implementation";
export const HOW_IT_WORKS_HREF = "/how-it-works";
export const PRICING_HREF = "/pricing";
export const PRODUCT_HREF = "/product";
export const SIGN_IN_HREF = "/sign-in";
export const SIGN_UP_HREF = "/sign-up";
export const FORGOT_PASSWORD_HREF = "/forgot-password";

export const PRODUCT_PLATFORM_HREF = "/product/platform";
export const PRODUCT_EMERGENCY_ROUTING_HREF = "/product/emergency-routing";
export const PRODUCT_SHIFT_ASSIGNMENTS_HREF = "/product/shift-assignments";
export const PRODUCT_AUDIT_TRAIL_HREF = "/product/audit-trail";
export const PRODUCT_PERMISSIONS_HREF = "/product/permissions";
export const PRODUCT_ESCALATION_PATHS_HREF = "/product/escalation-paths";
export const PRODUCT_DESIGN_PRINCIPLES_HREF = "/product/design-principles";

export const SOLUTIONS_ROLE_VIEWS_HREF = "/solutions/role-views";
export const SOLUTIONS_NURSING_HREF = "/solutions/nursing-teams";
export const SOLUTIONS_CLINICAL_HREF = "/solutions/clinical-staff";
export const SOLUTIONS_PHARMACY_HREF = "/solutions/pharmacy";
export const SOLUTIONS_FRONT_DESK_HREF = "/solutions/front-desk";
export const SOLUTIONS_ALERT_FATIGUE_HREF = "/solutions/alert-fatigue";
export const SOLUTIONS_BROKEN_HANDOFFS_HREF = "/solutions/broken-handoffs";
export const SOLUTIONS_SHIFT_CHANGE_HREF = "/solutions/shift-change-gaps";

export const RESOURCES_SUCCESS_METRICS_HREF = "/resources/success-metrics";

export const SUBSCRIPTION_HREF = "/subscription";
export const CHECKOUT_HREF = "/checkout";

/** Nav CTA — action + noun; links to sign-up. */
export const ENTER_WARD_LABEL = "Enter ward";
export const ENTER_WARD_HREF = SIGN_UP_HREF;

export interface NavLinkItem {
  label: string;
  href: string;
  description: string;
}

export interface NavColumn {
  title: string;
  links: NavLinkItem[];
}

export interface NavDropdown {
  label: string;
  columns: NavColumn[];
  featured?: {
    title: string;
    body: string;
    href: string;
    cta: string;
  };
}

export const marketingNavDropdowns: NavDropdown[] = [
  {
    label: "Product",
    featured: {
      title: "Hospital coordination OS",
      body: "Routine shift work and emergency escalation in one system — separate signals, shared patient context.",
      href: PRODUCT_PLATFORM_HREF,
      cta: "Platform overview",
    },
    columns: [
      {
        title: "Platform",
        links: [
          {
            label: "Platform overview",
            href: PRODUCT_PLATFORM_HREF,
            description:
              "How RoundSync unifies daily care and crisis response without conflating them.",
          },
          {
            label: "Emergency routing",
            href: PRODUCT_EMERGENCY_ROUTING_HREF,
            description:
              "Trigger, route, respond, resolve — with automatic escalation if nobody acts.",
          },
          {
            label: "Shift-aware assignments",
            href: PRODUCT_SHIFT_ASSIGNMENTS_HREF,
            description:
              "Ownership follows active shifts, not static rows — so handoffs don't orphan cases.",
          },
        ],
      },
      {
        title: "Trust & compliance",
        links: [
          {
            label: "Audit trail",
            href: PRODUCT_AUDIT_TRAIL_HREF,
            description:
              "Every acknowledgment and escalation logged with actor and timestamp.",
          },
          {
            label: "Permission boundaries",
            href: PRODUCT_PERMISSIONS_HREF,
            description:
              "Clinical detail stays with clinical roles — admin sees resources, not diagnoses.",
          },
          {
            label: "Escalation paths",
            href: PRODUCT_ESCALATION_PATHS_HREF,
            description:
              "Visible chains when first responders time out — no silent failures.",
          },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    featured: {
      title: "Same patient, different lens",
      body: "Each role sees only what they need to act on — permission-gated, not filtered by guesswork.",
      href: SOLUTIONS_ROLE_VIEWS_HREF,
      cta: "See role views",
    },
    columns: [
      {
        title: "By care role",
        links: [
          {
            label: "Nursing teams",
            href: SOLUTIONS_NURSING_HREF,
            description:
              "Flag crises in two taps, track open cases, work scheduled care without alert fatigue.",
          },
          {
            label: "Clinical staff",
            href: SOLUTIONS_CLINICAL_HREF,
            description:
              "Immediate alerts with full patient context and one-tap acknowledgment.",
          },
          {
            label: "Pharmacy",
            href: SOLUTIONS_PHARMACY_HREF,
            description:
              "Pulled in only when medication is part of the response.",
          },
          {
            label: "Front desk & operations",
            href: SOLUTIONS_FRONT_DESK_HREF,
            description:
              "Resource requests — room, equipment — without clinical noise.",
          },
        ],
      },
      {
        title: "By problem",
        links: [
          {
            label: "Alert fatigue",
            href: SOLUTIONS_ALERT_FATIGUE_HREF,
            description:
              "Route to the right person instead of broadcasting to everyone.",
          },
          {
            label: "Broken handoffs",
            href: SOLUTIONS_BROKEN_HANDOFFS_HREF,
            description:
              "Context travels with the alert — no hunting for history mid-crisis.",
          },
          {
            label: "Shift change gaps",
            href: SOLUTIONS_SHIFT_CHANGE_HREF,
            description:
              "Assignment rotates with the ward shift, not a fixed nurse ID.",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        title: "Learn",
        links: [
          {
            label: "How it works",
            href: HOW_IT_WORKS_HREF,
            description:
              "Walk through the four-stage emergency coordination flow.",
          },
          {
            label: "Design principles",
            href: PRODUCT_DESIGN_PRINCIPLES_HREF,
            description:
              "Right person, right time — escalation with a failure path.",
          },
          {
            label: "Implementation",
            href: IMPLEMENTATION_HREF,
            description:
              "How we onboard wards, roles, and escalation windows.",
          },
        ],
      },
      {
        title: "Evaluate",
        links: [
          {
            label: "Pricing",
            href: PRICING_HREF,
            description:
              "Clinic, Hospital, and Network tiers — self-serve and enterprise options.",
          },
          {
            label: "Success metrics",
            href: RESOURCES_SUCCESS_METRICS_HREF,
            description:
              "Time to acknowledgment, noise reduction, audit clarity.",
          },
          {
            label: "Book a demo",
            href: BOOK_DEMO_HREF,
            description:
              "Tailored walkthrough for your ward structure and workflows.",
          },
        ],
      },
    ],
  },
  {
    label: "Support",
    columns: [
      {
        title: "Help",
        links: [
          {
            label: "FAQs",
            href: FAQS_HREF,
            description:
              "Common questions on routing, roles, escalation, and onboarding.",
          },
          {
            label: "Help centre",
            href: HELP_CENTRE_HREF,
            description:
              "Guides for administrators, shift leads, and IT teams.",
          },
          {
            label: "Contact support",
            href: CONTACT_SUPPORT_HREF,
            description:
              "Reach our team for technical issues and account questions.",
          },
        ],
      },
      {
        title: "Connect",
        links: [
          {
            label: "Talk to sales",
            href: TALK_TO_SALES_HREF,
            description:
              "Discuss deployment scope, timelines, and ward rollout.",
          },
          {
            label: "Partnerships",
            href: PARTNERSHIPS_HREF,
            description:
              "Integration and hospital group enquiries.",
          },
        ],
      },
    ],
  },
];
