# RoundSync — Subscription Offering & Paywall Design

---

## 1. What Happens When You Log In Without an Active Subscription

Two different screens, based on role — this matters more than it looks:

### If you're the org admin
Lands on the actual **Subscription/Upgrade page**. This is the one that needs to stand out.

**What stands out on this page:**
- **Status banner at the top** — plain language, not jargon: "Your RoundSync account needs a plan to go live" or "Your trial ends in 2 days" — never a cold "402 Payment Required" energy
- **Recommended plan pre-selected**, based on the hospital size they entered at signup (see tiers below) — reduces decision fatigue, they're not choosing blind
- **Seat counter tied to actual invited staff** — "You've already invited 14 people — the Standard plan covers up to 50" — makes the price feel matched to their real usage, not abstract
- **One dominant CTA** ("Activate Plan"), secondary link for "Talk to sales" if they're enterprise-scale — same one-primary-action principle as the rest of the product
- **No dark patterns** — clear monthly vs annual toggle, visible total, no hidden fees surprise at checkout. Hospitals procure carefully; a shady checkout kills trust immediately

### If you're anyone else (nurse, doctor, pharmacist, etc.)
Lands on a **neutral holding screen**, not billing:
> "Your organization's RoundSync account isn't active yet. Contact your admin to get started."
No pricing, no CTA to pay — they have no authority to act on it, showing them a paywall would just be noise and could look like a broken product.

---

## 2. Plan Tiers — Scaled by Hospital Size & Mode of Operation

Two variables matter more than headcount alone: **facility size** (how many staff/seats) and **operational intensity** (how emergency-heavy the workload is). A 40-bed rural clinic and a 40-person outpatient diagnostic center are similar in size but need very different feature depth.

### Tier 1 — Clinic (small facilities, lower emergency volume)
**Fits:** Clinics, small private hospitals, outpatient centers — under ~50 staff, emergencies are occasional, not constant.
**Includes:** Core emergency flow (trigger → routing → response → resolution), basic audit trail, up to 2 wards, standard on-call rota (no complex escalation ladder needed at this scale).
**Excludes:** Multi-facility support, advanced analytics — genuinely unnecessary at this scale, and stripping it keeps the price honest.

### Tier 2 — Hospital (standard, mid-size, moderate-to-high emergency volume)
**Fits:** General hospitals, ERs, ICUs — 50-300 staff, emergencies are a regular, expected part of daily operation.
**Includes:** Everything in Clinic, plus full escalation ladder (backup responder chains), unlimited wards, shift-handoff automation, priority alert routing, standard analytics dashboard (response times, escalation frequency).
**This is the core plan** — most of what we designed (shift handoff, on-call rota logic, relapse handling) earns its keep specifically at this tier's operational intensity.

### Tier 3 — Network (multi-facility, high-acuity, enterprise)
**Fits:** Hospital groups/chains, trauma centers, teaching hospitals — 300+ staff, possibly multiple physical locations under one organization.
**Includes:** Everything in Hospital, plus multi-facility management (separate wards/rotas per location, cross-facility patient transfer coordination), EHR/system integration, SLA-backed priority support, dedicated onboarding, custom escalation logic per department.
**Sold via sales conversation, not self-serve checkout** — enterprise procurement expects a real conversation, not a credit card form.

---

## 3. Add-ons (any tier, sold separately for consistent recurring revenue)

- **Advanced Analytics & Compliance Exports** — deeper reporting for internal reviews, audit-ready exports
- **EHR/System Integration** — connects RoundSync to their existing patient records system, priced as implementation + ongoing fee
- **Priority Support SLA** — guaranteed response time for critical issues, meaningful in healthcare specifically because downtime during a real emergency has real stakes
- **Additional Facility** — for Network-tier clients expanding to a new location, priced per facility rather than folded into a flat multi-facility fee

---

## 4. How Size/Mode Gets Determined

At signup (before payment), the admin answers 2-3 quick questions: how many staff will be invited, how many wards/departments, single location or multiple. RoundSync recommends a tier from that — same principle as the Escalation Modal, minimal friction, smart defaults, not a long form. This recommendation maps directly to `org_subscriptions.seats_purchased` and can flag when actual usage (staff invited) starts approaching the tier's ceiling, prompting an upgrade nudge later — a natural, non-pushy upsell moment instead of a hard wall.
