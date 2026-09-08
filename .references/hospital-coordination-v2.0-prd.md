# PRD: Emergency Case Coordination Flow
### Hospital Management Platform — Portfolio Case Study

---

## 1. Overview

A role-based hospital coordination platform where every person touching a patient — doctor, nurse, pharmacist, front desk, admin — has a view of the system scoped to what they need to act on. Same patient, different lens, permission-gated.

The full platform covers a nurse's entire working day — routine care (scheduled medication, vitals checks, care rounds) alongside emergencies — since real coordination problems don't only happen during a crisis. The **case study deep-dive** focuses on one flow inside that system: **emergency case coordination** — the moment a patient's status escalates and multiple roles must sync fast, accurately, and without noise. Routine care is designed as a distinct, parallel flow so it never gets visually or logically confused with an emergency.

---

## 2. Problem Statement

When a patient's condition escalates, information needs to reach the right person, at the right permission level, fast enough to matter — without creating alert fatigue or breaking the chain of accountability.

Today (in most real hospital systems), this breaks down because:
- Alerts go to everyone or no one — no smart routing by role/relevance
- No clear record of who acknowledged what, and when
- Escalation paths aren't visible — if the first responder doesn't act, nothing happens next
- Cross-role handoffs (nurse → doctor → pharmacist → admin) lose context at each step
- Shift changes leave patients and open cases orphaned — nothing to reassign ownership when the responsible person's shift ends
- Resolved cases have no path back if a patient relapses, forcing a broken record instead of continuous history

---

## 3. Target Users (roles in this flow)

| Role | What they need in an emergency |
|---|---|
| Nurse | Fast way to flag/escalate a crisis with minimal friction |
| Doctor | Immediate, unmistakable alert with patient context, one-tap response |
| Specialist | Pulled in only when relevant, with enough context to act fast |
| Pharmacist | Alerted only if medication is involved in the response |
| Front desk/Admin | Visibility into resource needs (room, equipment) without clinical noise |

Access is role-scoped — each person sees only what's relevant to their job function.

---

## 4. Core User Flow

**Trigger → Routing → Response → Resolution**

1. **Trigger**: Nurse (or any care staff) flags patient status as urgent/critical
2. **Routing**: System determines who needs to know, based on role, on-call status, and relevance to the case
3. **Response**: Alerted roles acknowledge, act, or escalate if no response within a defined window
4. **Resolution**: Case is marked resolved, full action trail is logged for accountability

---

## 5. Success Metrics

- Time from trigger to first acknowledgment
- % of alerts acted on vs. escalated due to non-response
- Reduction in irrelevant alerts reaching uninvolved roles (noise reduction)
- Clarity of audit trail — can you reconstruct exactly who did what, when

---

## 6. Design Principles

- **Right person, right time** — no broadcast-to-everyone alerts
- **Escalation has a failure path** — if no response, system auto-escalates, doesn't just wait
- **Context travels with the alert** — no one has to go hunting for patient history mid-crisis
- **Accountability is visible** — every action is timestamped and attributable

---

## 7. Out of Scope (for this case study)

- Full EHR/patient records system
- Billing and insurance flows
- Open-ended team chat (messaging is scoped to patient/care-team context only, not general DMs)

---

## 8. Open Questions to Resolve in Design

- What triggers auto-escalation if no one responds — a timer? a supervisor override?
- How is "relevance" determined for routing (ward, specialty, current assignment)?
- What does the doctor's alert actually look like — modal, push, SMS fallback?
- How much patient context is shown at first glance vs. one tap deeper?
