export type SubscriptionTierId = "clinic" | "hospital" | "network";
export type BillingCycle = "monthly" | "annual";
export type SubscriptionStatus = "none" | "trial" | "active";

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  tagline: string;
  seatLimit: number | null;
  wardLimit: number | null;
  monthlyPrice: number | null;
  annualPrice: number | null;
  selfServe: boolean;
  highlights: string[];
}

export interface SubscriptionAddOn {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "clinic",
    name: "Clinic",
    tagline: "Small teams, occasional emergencies",
    seatLimit: 50,
    wardLimit: 2,
    monthlyPrice: 49,
    annualPrice: 470,
    selfServe: true,
    highlights: [
      "Core emergency flow",
      "Basic audit trail",
      "Up to 2 wards",
      "Standard on-call rota",
    ],
  },
  {
    id: "hospital",
    name: "Hospital",
    tagline: "Daily escalations, full handoff automation",
    seatLimit: 300,
    wardLimit: null,
    monthlyPrice: 149,
    annualPrice: 1430,
    selfServe: true,
    highlights: [
      "Full escalation ladder",
      "Unlimited wards",
      "Shift-handoff automation",
      "Priority alert routing",
      "Analytics dashboard",
    ],
  },
  {
    id: "network",
    name: "Network",
    tagline: "Multi-facility, enterprise scale",
    seatLimit: null,
    wardLimit: null,
    monthlyPrice: null,
    annualPrice: null,
    selfServe: false,
    highlights: [
      "Multi-facility management",
      "EHR integration",
      "SLA-backed support",
      "Dedicated onboarding",
      "Custom escalation per department",
    ],
  },
];

export const subscriptionAddOns: SubscriptionAddOn[] = [
  {
    id: "analytics",
    name: "Advanced Analytics & Compliance Exports",
    description: "Audit-ready exports and deeper reporting for internal reviews.",
    monthlyPrice: 29,
  },
  {
    id: "ehr",
    name: "EHR / System Integration",
    description: "Connect RoundSync to your existing patient records system.",
    monthlyPrice: 79,
  },
  {
    id: "support-sla",
    name: "Priority Support SLA",
    description: "Guaranteed response time for critical issues.",
    monthlyPrice: 49,
  },
];

export function getTierById(tierId: SubscriptionTierId): SubscriptionTier {
  const tier = subscriptionTiers.find((item) => item.id === tierId);
  if (!tier) {
    throw new Error(`Unknown subscription tier: ${tierId}`);
  }
  return tier;
}

export function recommendTier(
  staff: number,
  wards: number,
  multiLocation: boolean,
): SubscriptionTierId {
  if (multiLocation || staff > 300 || wards > 20) {
    return "network";
  }
  if (staff > 50 || wards > 2) {
    return "hospital";
  }
  return "clinic";
}

export function buildRecommendationReason(
  staff: number,
  wards: number,
  multiLocation: boolean,
  tierId: SubscriptionTierId,
): string {
  const tier = getTierById(tierId);
  const locationNote = multiLocation ? " across multiple locations" : "";
  return `Based on ~${staff} staff across ${wards} ward${wards === 1 ? "" : "s"}${locationNote}, we recommend ${tier.name}.`;
}

export function formatPrice(amount: number | null): string {
  if (amount === null) return "Custom";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCheckoutTotal(
  tierId: SubscriptionTierId,
  billingCycle: BillingCycle,
  seatCount: number,
  addOnIds: string[],
): number | null {
  const tier = getTierById(tierId);
  if (!tier.selfServe) return null;

  const base =
    billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  if (base === null) return null;

  const addOnTotal = addOnIds.reduce((sum, id) => {
    const addOn = subscriptionAddOns.find((item) => item.id === id);
    if (!addOn) return sum;
    const scaled =
      billingCycle === "monthly"
        ? addOn.monthlyPrice
        : addOn.monthlyPrice * 12 * 0.9;
    return sum + scaled;
  }, 0);

  return base + addOnTotal;
}
