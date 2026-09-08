# RoundSync — User Flow & Screen Map (LOCKED)
### Reference this for every screen design/build prompt

Scenario used throughout: Nurse Amaka flags a crash in Patient X's vitals.

---

## Flow: Trigger → Routing → Response → Resolution

```
[1] Login/Role Auth
        ↓
[2] Nurse Dashboard (Patient List)
        ↓
[3] Patient Detail View
        ↓
[4] Escalation Modal ─────────── TRIGGER
        ↓
[5] System Routing (background, no UI)
        ↓
        ├──────────────┬─────────────────┐
        ↓              ↓                 ↓
[6] Doctor Alert   [8] Pharmacist    [9] Front Desk/Admin
    (conditional: meds)  (conditional: resource)
        ↓
[7] Doctor Patient Context View
        ↓
[10] Escalation Path (only if no response in time window)
        ↓
[11] Resolution Screen
        ↓
[12] Audit Trail / Case Log
```

---

## Screen-by-Screen Spec

### 1. Login / Role Auth
- **Who:** All roles
- **Action:** Authenticate → Supabase checks `role_id` → routes to correct dashboard
- **Build note:** No role picker on login — role is fixed to account, not selected by user (security principle, not just UX)

### 2. Nurse Dashboard (Patient List)
- **Who:** Nurse
- **Shows:** Assigned patients only (ward-scoped via RLS), sorted by acuity/last-updated
- **Action:** Tap a patient → Screen 3

### 3. Patient Detail View
- **Who:** Nurse (also reused, role-scoped, for Doctor in Screen 7)
- **Shows:** Vitals, history, assigned team — fields conditionally rendered by role (`RoleScopedCard`)
- **Action:** Tap "Flag Urgent" → Screen 4

### 4. Escalation Modal — THE TRIGGER
- **Who:** Nurse (or any care staff)
- **Action:** Select urgency level (`critical`/`urgent`/`moderate`) + optional note → Confirm
- **Result:** Creates a row in `cases`, fires routing logic
- **Build note:** This is the single most important interaction in the product — must be fast, max 2 taps to fire

### 5. System Routing — NO UI, BACKGROUND STATE
- **Logic:** Determines relevant doctor (on-call + ward match), pharmacist (only if `requires_medication`), front desk (only if `requires_resource`)
- **Build note:** This is where `case_alerts` rows get created — worth showing as a diagram in the case study even though there's no screen

### 6. Doctor Alert (Push/Banner)
- **Who:** Doctor
- **Shows:** `AlertBanner` — full-screen or persistent banner, non-dismissible without action
- **Action:** "Acknowledge" (primary) or "Escalate to Specialist" (secondary) → Screen 7

### 7. Doctor Patient Context View
- **Who:** Doctor
- **Shows:** Same `PatientDetailView` component as Screen 3, role-scoped to doctor fields + Amaka's note
- **Action:** Order medication (→ triggers Screen 8) and/or request resource (→ triggers Screen 9), or resolve directly (→ Screen 11)

### 8. Pharmacist Alert — CONDITIONAL
- **Who:** Pharmacist
- **Fires only if:** doctor ordered medication
- **Action:** Acknowledge → prepare/dispense → updates `medication_orders.status`

### 9. Front Desk/Admin View — CONDITIONAL
- **Who:** Front desk / Admin
- **Fires only if:** resource requested
- **Shows:** Resource request only — zero clinical detail (permission boundary)
- **Action:** Mark resource ready → updates `resource_requests.status`

### 10. Escalation Path — SYSTEM STATE, CONDITIONAL
- **Trigger:** No acknowledgment within defined time window
- **Action:** Auto-escalates to backup doctor/supervisor, logs to `escalation_log`
- **Build note:** This is the `EscalationTrail` component's real-world function — visualize the chain

### 11. Resolution Screen
- **Who:** Whoever closes the loop (usually doctor)
- **Action:** Mark case resolved → timestamp written → `cases.status = resolved`

### 12. Audit Trail / Case Log
- **Who:** Any role with permission for that case (RLS-scoped)
- **Shows:** Full `AuditRow` list — actor, action, relative + absolute timestamp
- **Build note:** This is your accountability proof — the screen that shows you designed for real-world liability, not just happy-path UX

---

## Build Priority Order (for portfolio, not full build)

Design/code these first — they carry the most case-study weight:
1. Screen 4 (Escalation Modal) — the trigger, fastest interaction
2. Screen 6 (Doctor Alert) — highest stakes, proves urgency design system
3. Screen 10 (Escalation Path) / EscalationTrail — proves systems thinking beyond happy path
4. Screen 12 (Audit Trail) — proves accountability thinking

Screens 8, 9 (pharmacist/front desk) can stay as lighter secondary screens or even just described in the case study rather than fully built — they prove the branching logic exists without needing full production polish.
