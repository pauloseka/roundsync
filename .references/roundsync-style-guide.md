# RoundSync — Style Guide & Pattern Library
### Reference this in every design/build prompt going forward

> **Evolved into the full design system:** see `frontend/docs/design-system/README.md` and the live internal reference at `/design-system`. CSS tokens live in `frontend/styles/tokens.css`; components in `frontend/components/ui/`.

---

## Design Thesis

RoundSync is used by people mid-shift, often tired, under fluorescent hospital lighting, glancing at a screen between patients — not sitting comfortably studying an interface. Every design decision optimizes for **scan speed and unambiguous urgency**, not aesthetic flourish. Calm by default, loud only when it needs to be.

This is the opposite of a SaaS dashboard that wants to look impressive. It wants to look *trustworthy and instantly readable* — closer to airport signage or a cockpit than a marketing site.

---

## 1. Color System

Named tokens — reference by name, not hex, in prompts.

| Token | Hex | Use |
|---|---|---|
| `--surface-base` | #F7F8FA | App background — soft, not stark white (reduces glare fatigue) |
| `--surface-card` | #FFFFFF | Cards, panels |
| `--ink-primary` | #1A1D23 | Primary text — near-black, not pure black (softer on tired eyes) |
| `--ink-secondary` | #5C6470 | Secondary text, labels, metadata |
| `--line` | #E2E5EA | Borders, dividers |
| `--brand-core` | #2B5F6B | Deep teal — trust, clinical calm. NOT default medical blue (#0066CC territory), a muted teal reads as considered, not templated |
| `--critical` | #D6432C | Life-threatening / emergency trigger state |
| `--urgent` | #E08A2C | Needs attention soon, not immediately life-threatening |
| `--moderate` | #2B6CB0 | Informational escalation, routine coordination |
| `--resolved` | #2F855A | Case closed, action completed |

**Rule:** Urgency colors are *reserved exclusively* for case status. Never reuse `--critical` for a decorative accent, a marketing CTA, or anything outside the alert system. The moment red appears anywhere else, it loses meaning — and in this product, that's a trust failure, not just a style inconsistency.

Avoid: gradients anywhere in the core app. A gradient hero is fine for a marketing/landing page around RoundSync, never inside the working product — gradients read as decorative, and decoration competes with urgency signaling.

---

## 2. Typography

| Role | Typeface | Why |
|---|---|---|
| Display / Headings | **General Sans** (or Aeonik if licensing allows) | Confident, geometric, not overused like Inter/Poppins — reads modern without screaming "AI-generated SaaS template" |
| Body / UI | **IBM Plex Sans** | Built for dense data-heavy interfaces (literally designed by IBM for enterprise software), exceptional legibility at small sizes, humanist warmth so it doesn't feel cold/clinical |
| Data / Timestamps / IDs | **IBM Plex Mono** | Tabular alignment for timestamps, patient IDs, vitals — monospace prevents misreading similar digits (6 vs 8, 1 vs 7) under stress |

**Type scale principle:** Fewer sizes, bigger jumps. In a scanning environment, subtle size differences (14px vs 15px) don't register. Use decisive jumps: 13 / 15 / 18 / 24 / 32. Every jump should mean something (this is more important, act on this first).

**Weight over color for hierarchy** where possible — bold + normal reads faster under stress than two shades of gray.

---

## 3. Layout Principles

**Information density is earned, not decorative.** Hospital staff need more data per screen than a typical consumer app (vitals, timestamps, role, case history) — don't force generous whitespace where it slows scanning. But group related data tightly and separate unrelated data with real space, not just a thin line — the *grouping* is the hierarchy.

**Left-to-right urgency scan pattern.** Most critical info (patient name, urgency level, time elapsed) always in the same top-left position across every screen, every role. Muscle memory matters more than novelty here — someone should be able to scan a screen they've never seen (new hire, different ward) and immediately find what matters.

**Status is a color chip + icon + word, always together.** Never color alone (colorblind accessibility, and color-only fails under stress/fast glance). Example: 🔴 "Critical" not just a red dot.

**One primary action per screen.** In an emergency flow, decision paralysis costs time. The doctor's alert screen has ONE dominant button (Acknowledge), secondary actions (Escalate, View Full Chart) are visually subordinate.

**Timestamps are always relative + absolute.** "2 min ago (14:32)" — relative for fast scanning, absolute for accountability/audit trail. This directly serves the PRD's accountability principle.

**No modals for critical alerts.** Modals can be dismissed accidentally or missed if attention is elsewhere. Critical alerts are full-screen takeovers or persistent banners that require explicit action to clear — never a toast that fades on its own.

---

## 4. Motion

Minimal, functional only:
- New critical alert: single sharp pulse on the status chip (not a looping animation — loops feel like decoration, and can numb urgency over time)
- Screen transitions: fast, no bounce/spring easing — a doctor doesn't need to enjoy a transition, they need the next screen
- Resolved state: one quiet checkmark settle, no celebration animation (this is a hospital, not a to-do app)

Avoid any animation that delays the user from seeing real content by more than ~150ms.

---

## 5. Component Patterns (reference these names in prompts)

- **UrgencyChip** — color + icon + label, used everywhere a case status appears
- **AlertBanner** — full-width, non-dismissible-without-action, for incoming critical alerts
- **RoleScopedCard** — patient info card that conditionally renders fields based on viewer's role (nurse sees vitals, front desk sees room status only)
- **AuditRow** — timestamp (relative + absolute) + actor + action, monospace for the data parts
- **EscalationTrail** — visual chain showing who was alerted → who responded → who it escalated to, if anyone timed out

---

## 6. What to Avoid (locked aversions)

- No gradient heroes inside the working app
- No Inter or Poppins as default typefaces
- No glassmorphism / frosted blur panels — reads as decorative trend, and blur reduces legibility, the opposite of this product's job
- No clichéd SaaS copy ("Empowering healthcare teams to..." — say what it does, not what it empowers)
- No color-only status indicators
- No modal-based critical alerts
- No celebratory/bouncy micro-interactions anywhere near emergency states

---

## Reference line for future prompts

*"Follow the RoundSync style guide: teal/ink neutral base, urgency colors reserved for status only, General Sans + IBM Plex Sans/Mono, left-anchored scan pattern, one primary action per screen, no modals for critical alerts."*
