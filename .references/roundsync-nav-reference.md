# RoundSync — Nav Bar Reference
### What each item contains, and how similar-seeming items differ

Written from the nurse's view (first build target). Doctor/pharmacist/front desk/admin see the same shell with different items active — noted where relevant.

---

## 1. Dashboard

**Contains:** Her assigned patient list for the current active shift (derived from `shifts`, not a static assignment). Each row shows patient name, ward, a vitals status flag, and a combined glance at anything due — routine tasks coming up AND any open case tied to that patient.

**Purpose:** The "walk in and see everything at a glance" screen. It's a summary view, not a working list — she comes here to orient herself at the start of a shift or between rounds.

---

## 2. My Tasks

**Contains:** Scheduled, routine care work — medication administration times, vitals checks, care rounds. Pulled from `scheduled_tasks`, sorted by due time. Badge shows count due soon/overdue, in neutral gray/amber — never red.

**Purpose:** Her actual checklist for the shift. This is where she works through planned care, independent of anything going wrong.

---

## 3. Active Cases

**Contains:** Every open emergency case relevant to her (from `cases`, status `open`/`escalated`/`reopened`). Each shows patient, urgency level (color chip), time elapsed, and live status of who's responded. Badge is urgency-colored — this is the only nav item allowed to show red.

**Purpose:** The emergency queue. Something has already gone wrong, and this is where she tracks it in real time.

---

## 4. Messages

**Contains:** Care-team communication threads — non-urgent questions or updates, tied to a patient or a general team thread. Badge is neutral blue, unread count only.

**Purpose:** Conversational, not procedural. For things that don't need a formal case or a task entry, just a quick human exchange.

---

## 5. Patients

**Contains:** The full patient roster she has access to on her ward — searchable/filterable, broader than Dashboard's shift-specific view. Same Patient Detail View as Dashboard when clicked into.

**Purpose:** Lookup and reference, not a working queue. She comes here to search, not to act.

---

## 6. Audit Trail

**Contains:** A permission-scoped historical log — every case action and task completion she was part of, pulled from `audit_log`. Chronological, timestamped (relative + absolute), expandable per entry.

**Purpose:** The record of what already happened. Read-only, backward-looking, exists for accountability.

---

## 7. Settings (bottom-anchored)

**Contains:** Alert preferences (sound, tone per urgency level), notification scope (ward-only vs broader), display (light/dark), profile info, account/security.

**Purpose:** How she experiences the app, not what she's working on. Deliberately separated from the work group above.

---

## Peculiar overlaps — where two items look similar but aren't

**Dashboard vs. Patients**
Both show patient lists, but Dashboard is a *live working summary* (shift-scoped, mixed with tasks/cases), while Patients is a *static reference roster* (broader, searchable, no task/case data mixed in). If you're checking "what's going on right now," you use Dashboard. If you're looking someone up, you use Patients.

**Active Cases vs. My Tasks**
The most important distinction in the whole nav. Active Cases is unplanned and urgent — something is actively wrong. My Tasks is planned and routine — nothing is wrong, it's just due. This is why their badge colors are deliberately different (red-capable vs. neutral gray/amber) — conflating them risks a nurse misreading a medication reminder as a crisis, or worse, becoming numb to red because it shows up too often.

**Messages vs. Case Notes** *(case notes aren't a nav item, they live inside a specific case)*
Messages are informal, ongoing, and not tied to any one event — closer to a conversation. Case Notes are locked to a specific case's timeline, part of the formal record, and can't exist without an active case. If it needs to be searchable later as "what did the doctor say during that emergency," it's a case note. If it's just "can you check on bed 4," it's a message.

**Active Cases vs. Audit Trail**
Both relate to emergencies, but Active Cases is *live and actionable* — things she can still respond to. Audit Trail is *historical and read-only* — things that already happened. Once a case resolves, it effectively moves from one to the other conceptually, though the same underlying case can still be reopened from either.

**Settings vs. Profile**
Not two separate nav items, but worth noting: profile info lives *inside* Settings rather than as its own top-level item, since editing your name/credentials is infrequent — it doesn't deserve competing for space with things she uses every shift.
