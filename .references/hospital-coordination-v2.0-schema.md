# Database Schema: Emergency Case Coordination
### Supabase / Postgres — Hospital Management Platform

Built directly off the PRD (trigger → routing → response → resolution) and the 12-screen app flow.

---

## Entity Overview

| Table | Purpose |
|---|---|
| `users` | Every person in the system — auth + role |
| `roles` | Defines permission scope per role |
| `patients` | Patient records (minimal, case-study scope) |
| `cases` | An emergency event — the core object the whole flow revolves around |
| `case_alerts` | Who was routed/alerted for a given case, and their response |
| `case_notes` | Context/notes attached to a case (nurse's note, doctor's update, etc.) |
| `medication_orders` | Conditional — only exists if doctor orders meds mid-case |
| `resource_requests` | Conditional — room/equipment needs, visible to front desk/admin |
| `escalation_log` | Tracks auto-escalations when no one responds in time |
| `audit_log` | Full timestamped trail — screen 12, the accountability record |
| `shifts` | Tracks who's on duty, which ward, and when — drives patient/case handoff and real on-call status |
| `scheduled_tasks` | Routine care work (scheduled meds, vitals checks) — separate from emergency cases entirely |
| `message_threads` | Groups conversations — auto-created per patient, or manually started for team-wide chat |
| `messages` | Non-urgent care-team communication, tied to a patient or team thread |
| `user_preferences` | Per-user alert/display settings — sound, theme, notification scope |

---

## Table Definitions

### `roles`
```sql
create table roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null, -- 'nurse', 'doctor', 'specialist', 'pharmacist', 'front_desk', 'admin'
  permissions jsonb not null -- scopes what this role can see/do
);
```

### `users`
```sql
create table users (
  id uuid primary key references auth.users(id),
  full_name text not null,
  role_id uuid references roles(id) not null,
  ward text, -- default/home ward, actual live assignment comes from shifts
  created_at timestamptz default now()
);
```
Note: `is_on_call` boolean removed — on-call status is now derived from `shifts` (does this user have an active shift right now), not a manually toggled flag.

### `patients`
```sql
create table patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  ward text,
  vitals jsonb, -- last known vitals snapshot
  created_at timestamptz default now()
);
```
Note: `assigned_nurse_id` / `assigned_doctor_id` removed as permanent fields. "Who's responsible for this patient" is now derived from whoever has an active shift on this patient's ward — see `shifts` below. This is the fix for the shift-handoff gap: assignment follows the shift, not a static row.

### `shifts`
Drives real-time patient/case ownership and true on-call status. Solves both the shift-handoff gap and the static on-call flag gap.
```sql
create table shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  ward text not null,
  starts_at timestamptz not null,
  ends_at timestamptz, -- null while shift is active
  status text default 'active' -- 'active', 'handed_off'
);
```
"Who's assigned to this patient right now" = query `shifts` for an active shift matching the patient's ward, joined to `users.role_id` for nurse vs doctor. Simpler than it sounds: one active shift per person per ward at a time.

### `cases`
The core object — created the moment a nurse flags urgent (Screen 4, the trigger).
```sql
create table cases (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  triggered_by uuid references users(id) not null, -- e.g. Amaka
  urgency_level text not null, -- 'critical', 'urgent', 'moderate'
  status text not null default 'open', -- 'open', 'acknowledged', 'escalated', 'resolved', 'reopened'
  requires_medication boolean default false,
  requires_resource boolean default false,
  created_at timestamptz default now(),
  resolved_at timestamptz,
  resolved_by uuid references users(id),
  reopened_at timestamptz,
  reopened_by uuid references users(id)
);
```
Note: added `reopened` status + `reopened_at`/`reopened_by` — fixes the dead-end gap where a resolved case had no path back if the patient relapsed. Full history stays on the same case row instead of forcing a duplicate.

### `case_alerts`
Screen 5–7: every person the system routed this case to, and their response.
```sql
create table case_alerts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  recipient_id uuid references users(id) not null,
  alert_role text not null, -- role at time of alert, for audit clarity
  status text not null default 'pending', -- 'pending', 'acknowledged', 'escalated', 'timed_out'
  sent_at timestamptz default now(),
  acknowledged_at timestamptz
);
```

### `case_notes`
Context traveling with the alert — Amaka's note, doctor's update, etc.
```sql
create table case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  author_id uuid references users(id) not null,
  note text not null,
  created_at timestamptz default now()
);
```

### `medication_orders`
Conditional — Screen 8, only exists if doctor orders meds.
```sql
create table medication_orders (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  ordered_by uuid references users(id) not null, -- doctor
  medication text not null,
  dosage text,
  status text default 'pending', -- 'pending', 'prepared', 'dispensed'
  pharmacist_id uuid references users(id),
  created_at timestamptz default now()
);
```

### `resource_requests`
Conditional — Screen 9, room/equipment, visible to front desk/admin only.
```sql
create table resource_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  requested_by uuid references users(id) not null,
  resource_type text not null, -- 'room', 'equipment', etc.
  status text default 'pending', -- 'pending', 'ready'
  handled_by uuid references users(id),
  created_at timestamptz default now()
);
```

### `escalation_log`
Screen 10 — the failure path when no one responds in time.
```sql
create table escalation_log (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  original_alert_id uuid references case_alerts(id) not null,
  escalated_to uuid references users(id) not null,
  reason text default 'no_response_timeout',
  created_at timestamptz default now()
);
```

### `audit_log`
Screen 12 — full trail, queryable by anyone with permission.
```sql
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id), -- nullable now, see note
  task_id uuid references scheduled_tasks(id), -- nullable, logs routine task completions too
  actor_id uuid references users(id) not null,
  action text not null, -- 'triggered', 'acknowledged', 'escalated', 'medication_ordered', 'resolved', 'reopened', 'task_completed', 'shift_handoff', etc.
  metadata jsonb,
  created_at timestamptz default now()
);
```
Note: `case_id` is now nullable since audit_log also covers routine task completions and shift handoffs, not just emergency cases.

### `scheduled_tasks`
Routine care work — medication administration, vitals checks — completely separate from the emergency `cases` flow. Lives under "My Tasks" in the nav.
```sql
create table scheduled_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  task_type text not null, -- 'medication', 'vitals_check', 'care_round'
  description text,
  due_at timestamptz not null,
  status text default 'pending', -- 'pending', 'due_soon', 'overdue', 'completed'
  completed_by uuid references users(id),
  completed_at timestamptz,
  created_at timestamptz default now()
);
```
Note: status badges for this table must stay visually distinct from case urgency colors (gray/amber, never red) — otherwise a routine reminder could be mistaken for an emergency.

### `message_threads`
Resolves the auto-vs-manual decision. Patient threads are system-created; team threads are user-initiated.
```sql
create table message_threads (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id), -- not null = auto-created patient thread
  type text not null, -- 'patient' (auto), 'team' (manual)
  name text, -- only used for team threads, e.g. "Ward 3 — Night Shift"
  created_by uuid references users(id), -- null for auto patient threads, set for manual team threads
  created_at timestamptz default now()
);
```
Patient threads are created automatically via a trigger the moment a `patients` row is inserted — one thread per patient, always exists, never a manual step. Team threads are created explicitly when a user starts one, always has a `created_by` and a `name`.

### `messages`
Non-urgent care-team communication. Deliberately scoped to patient/team context, not open-ended chat.
```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references message_threads(id) not null,
  sender_id uuid references users(id) not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
```

### `user_preferences`
Per-user personalization — Settings nav.
```sql
create table user_preferences (
  user_id uuid primary key references users(id),
  alert_sound_enabled boolean default true,
  theme text default 'light', -- 'light', 'dark'
  notification_scope text default 'my_ward', -- 'my_ward', 'all_wards'
  updated_at timestamptz default now()
);
```

---

## Relationships (plain English)

- One **user** has one **role** — role determines what tables/rows they can even query (enforced via Supabase Row Level Security, not just app logic)
- One **user** has many **shifts** over time; only one active shift per ward at a time — this is what "assigned to a patient" actually derives from now, not a static foreign key
- One **patient** can have many **cases** over time (repeat emergencies), many **scheduled_tasks**, many **messages**
- One **case** has many **case_alerts** (fan-out to multiple roles), many **case_notes**, at most one active **medication_order** thread, at most one **resource_request** thread, and can move from `resolved` back to `reopened` without losing history
- **escalation_log** references the original alert that timed out — this is how you reconstruct "doctor didn't respond, so it went to backup doctor"
- **audit_log** is append-only and references either a case OR a task (nullable foreign keys) — one accountability record for both emergency and routine work
- **scheduled_tasks** and **messages** never reference `cases` — they're intentionally independent flows, per the scoping decision that RoundSync covers a nurse's full day, not just emergencies

---

## Row Level Security (RLS) — the permission engine

This is where "role-based access" actually gets enforced, not just designed:
- Nurses: read/write only patients where they have an active `shifts` row matching that ward — not a fixed assignment, so access naturally rotates at shift change
- Doctors: read/write cases they're alerted on, or where they have an active shift on that ward
- Pharmacists: read/write only `medication_orders` rows tied to cases they're alerted on — never see full patient vitals
- Front desk/admin: read/write only `resource_requests` — never see clinical notes or medication data
- Everyone: read `audit_log` rows only for cases/tasks they were part of (unless admin)
- Everyone: read/write their own `user_preferences` row only
- Messages: read/write only threads they're a sender in — patient threads scoped to their active shift/ward, team threads scoped to threads they were added to or created

This is the part worth screenshotting for your case study — it's the proof that "role-based" isn't just a login screen, it's baked into the data layer.

---

## Realtime (Supabase-specific)

Tables that need realtime subscriptions for the alert routing to actually feel live:
- `case_alerts` — doctor's screen listens for new rows where `recipient_id = me`
- `escalation_log` — backup doctor's screen listens for escalations routed to them
- `resource_requests` — front desk dashboard listens for new pending requests
- `messages` — unread badge and open threads update live

Everything else (notes, audit log, scheduled_tasks, shifts) can be fetched on-demand, no realtime needed — these aren't time-critical the way an emergency alert is.

---

All open schema decisions are now resolved.
