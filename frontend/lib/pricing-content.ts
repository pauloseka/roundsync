export const pricingPageCopy = {
  eyebrow: "Pricing",
  title: "Plans that scale with your wards",
  subtitle:
    "Self-serve for single hospitals. Custom terms for networks and health systems. Every tier includes core emergency routing, audit trails, and shift-aware assignments.",
  billingMonthly: "Monthly",
  billingAnnual: "Annual",
  billingAnnualSave: "Save 10%",
  includesLabel: "Includes",
  seatsLabel: (limit: number | null) =>
    limit ? `Up to ${limit} seats` : "Unlimited seats",
  wardsLabel: (limit: number | null) =>
    limit ? `Up to ${limit} wards` : "Unlimited wards",
  mostPopular: "Most popular",
  ctaSelfServe: "Get started",
  ctaSales: "Talk to sales",
  addOnsTitle: "Optional add-ons",
  addOnsSubtitle:
    "Extend your deployment with analytics, integrations, and priority support — add at checkout or later from admin settings.",
  faqTitle: "Pricing questions",
  trialTitle: "Not ready to commit?",
  trialBody:
    "Start a 5-day free trial after sign-up — full ward access with no card required. Choose or activate a plan before the trial ends.",
  trialCta: "Start free trial",
  compareTitle: "What's included at every tier",
  compareRows: [
    { feature: "Emergency routing & escalation", clinic: true, hospital: true, network: true },
    { feature: "Shift-aware assignments", clinic: true, hospital: true, network: true },
    { feature: "Audit trail & accountability", clinic: true, hospital: true, network: true },
    { feature: "Unlimited wards", clinic: false, hospital: true, network: true },
    { feature: "Analytics dashboard", clinic: false, hospital: true, network: true },
    { feature: "Multi-facility management", clinic: false, hospital: false, network: true },
    { feature: "EHR integration", clinic: false, hospital: false, network: true },
    { feature: "Dedicated onboarding", clinic: false, hospital: false, network: true },
  ],
  faqs: [
    {
      question: "How is RoundSync priced?",
      answer:
        "Licensing is based on ward count and roles in scope. Clinic and Hospital tiers are self-serve; Network pricing is tailored to multi-facility deployments.",
    },
    {
      question: "Can we run a pilot before a full rollout?",
      answer:
        "Yes. Most customers start with a single-ward pilot. Pilots include onboarding support and success metrics review before expanding.",
    },
    {
      question: "What contract terms are available?",
      answer:
        "Monthly and annual billing for self-serve tiers. Annual saves 10%. Health systems can discuss multi-year terms with sales.",
    },
  ],
} as const;
