export const signUpCopy = {
  signInHasAccount: "Already have an account?",
  signUpNoAccount: "New to RoundSync?",

  account: {
    eyebrow: "Step 1",
    title: "Create your account",
    subtitle:
      "Full name, work email, and password. Use your real hospital email — it becomes your billing contact later.",
    fullNameLabel: "Full name",
    emailLabel: "Work email",
    emailHint: "Your hospital email address, not a personal account.",
    passwordLabel: "Password",
    passwordRequirementsTitle: "Password must include:",
    cta: "Continue",
  },

  verifyEmail: {
    eyebrow: "Step 2",
    title: "Verify your email",
    subtitle:
      "We sent a confirmation link to your inbox. Nothing else happens until this is done — it prevents typos and fake addresses from creating organisations.",
    sentTo: "Confirmation sent to",
    resend: "Resend confirmation email",
    resending: "Sending…",
    resent: "Confirmation email sent again.",
    resendCooldown: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = String(seconds % 60).padStart(2, "0");
      return `Resend in ${mins}:${secs}`;
    },
    devBypass: "I've verified my email",
    waiting: "Waiting for verification…",
  },

  organization: {
    eyebrow: "Step 3",
    title: "Set up your organisation",
    subtitle:
      "Hospital name and sizing — a few quick answers so we can recommend the right plan when you activate.",
    hospitalLabel: "Hospital / organisation name",
    staffLabel: "Staff you expect to invite",
    staffHint: "Rough headcount — you'll confirm seats when you choose or activate a plan.",
    wardsLabel: "How many wards / departments",
    wardNamesLabel: "Name each ward or department",
    wardNamesHint:
      "Use the labels your hospital already uses — surgical units, ED, ICU, or site-specific codes.",
    wardNamePlaceholder: "e.g. Surgical 4B, Emergency, ICU…",
    multiLocationLabel: "Multiple physical locations under one organisation",
    cta: "Continue to plans",
  },

  trial: {
    bannerLabel: "Free trial",
    choiceLabel: "Get started",
    choiceTitle: (days: number) => `Try RoundSync free for ${days} days`,
    choiceBody:
      "Start a free trial to explore the ward with no payment, or activate a plan now if you're ready to commit.",
    startTrialTitle: (days: number) => `Explore free for ${days} days`,
    startTrialBody:
      "Full ward access — cases, tasks, handoffs, and alerts. No card required. Choose a plan before the trial ends to keep going.",
    startTrialCta: (days: number) => `Start ${days}-day free trial`,
    startingTrial: "Starting trial…",
    orPayNow: "Or pay now",
    orChoosePlan: "Or choose a plan",
    bannerTitle: (days: number, dayLabel: string) =>
      `${days} ${dayLabel} left on your trial`,
    daySingular: "day",
    dayPlural: "days",
    bannerBody: (totalDays: number) =>
      `You're exploring RoundSync free for ${totalDays} days. Activate a plan anytime — or subscribe before the trial ends to keep your ward running.`,
    upgradeCta: "Choose a plan",
    subscriptionActiveTitle: (days: number, dayLabel: string) =>
      `${days} ${dayLabel} left in your free trial`,
    subscriptionActiveBody:
      "Your ward is live while you explore. Activate billing now to lock in your plan — no interruption when the trial ends.",
    subscriptionExpiredTitle: "Your free trial has ended",
    subscriptionExpiredBody:
      "Choose a plan and activate billing to keep using RoundSync. Your organisation data is saved — pick up where you left off.",
  },

  subscription: {
    statusLabel: "Subscription required",
    statusTitle: "Your RoundSync account needs a plan to go live",
    statusBody:
      "Choose a tier and activate billing to unlock the ward. Staff on your team won't be able to sign in until this is complete.",
    pageTitle: "Choose your plan",
    pageSubtitle:
      "One tier is pre-selected from your organisation setup. Switch anytime, then continue to checkout — or talk to sales at Network scale.",
    backToAdmin: "Back to admin",
    backToWard: "Back to ward",
  },

  plan: {
    recommendationPrefix: "Recommended for you",
    includesLabel: "Includes",
    seatUsage: (invited: number, limit: number | null) =>
      limit ? `Up to ${limit} seats · you've sized for ~${invited}` : "Unlimited seats",
    talkToSales: "Talk to sales",
    continueCheckout: "Continue to checkout",
  },

  checkout: {
    eyebrow: "Step 5",
    title: "Checkout",
    subtitle: "Confirm billing cycle and payment. Total shown upfront — no surprises at the end.",
    billingMonthly: "Monthly",
    billingAnnual: "Annual",
    billingAnnualSave: "Save 10%",
    seatsLabel: "Seats included",
    addOnsTitle: "Optional add-ons",
    addOnsDescription: "Add capabilities now or later from admin settings.",
    paymentTitle: "Payment details",
    paymentNote: "Secured by Stripe. Card details are not stored on RoundSync servers.",
    acceptedCards: "Accepted cards",
    cardNumber: "Card number",
    cardNumberHint: "Spaces are added automatically. We detect Visa, Mastercard, and American Express.",
    expiry: "Expiry",
    cvc: "CVC",
    activatePlan: "Activate plan",
    processing: "Processing…",
    paymentSuccessTitle: "Payment successful",
    paymentSuccessBody:
      "Your plan is active. You'll set up your ward team next — invites, roles, and permissions.",
    paymentSuccessCta: "Continue to team setup",
    paymentFailedTitle: "Payment failed",
    paymentFailedHint:
      "Prototype: use 4242 4242 4242 4242 to simulate success, or 4000 0000 0000 0002 to simulate a decline.",
    orderSummary: "Order summary",
    dueToday: "Due today",
  },

  confirmation: {
    title: "You're live",
    subtitle: "Payment succeeded. Your organisation is active — welcome to RoundSync.",
    cta: "Go to admin dashboard",
  },

  pending: {
    title: "Account not active yet",
    body: "Your organisation's RoundSync account isn't active yet. Contact your administrator to get started.",
    hint: "No pricing or payment options here — your admin handles organisation setup.",
    contactAdmin: "Contact your administrator",
    backHome: "Back to homepage",
  },

  sidebar: {
    account: {
      label: "Getting started",
      title: "One step at a time",
      body: "Account first, then verification, then your hospital details. We keep each step focused so setup never feels like a procurement form.",
    },
    verify: {
      label: "Email verification",
      title: "Confirm it's really you",
      body: "Standard Supabase auth confirmation. Org setup stays locked until your work email is verified.",
    },
    organization: {
      label: "Organisation setup",
      title: "Right-sized from day one",
      body: "Staff count and wards are saved now. Next you'll pick a plan — or start a 5-day free trial on the subscription page.",
    },
    plan: {
      label: "Plan recommendation",
      title: "Clinic, Hospital, or Network",
      body: "Pre-selected with plain reasoning. Network-scale orgs can talk to sales instead of self-serve checkout.",
    },
    checkout: {
      label: "Checkout",
      title: "Transparent pricing",
      body: "Monthly or annual, seats confirmed, total clear. Hospitals procure carefully — no dark patterns.",
    },
  },

  invitePrompt: {
    title: "Invite your first staff member",
    body: "Your organisation is live. The fastest way to see RoundSync work is to bring one nurse or shift lead onto the ward.",
    cta: "Set up team access",
    dismiss: "I'll do this later",
  },

  adminSetup: {
    eyebrow: "Administration",
    title: "Set up your ward team",
    subtitle:
      "Invite staff, assign roles, and define what each person can see. Permissions are enforced at the system level — not just hidden in the UI.",
    trialNote: (days: number) =>
      `Your ${days}-day trial is active. Complete team setup now so staff can join when invites go out.`,
    orgAdminsSectionTitle: "Organisation administrators",
    orgAdminsSectionBody:
      "More than one person usually runs provisioning — IT, ward leads, and operations. Add co-admins who can manage billing, invites, and org settings.",
    orgAdminsPrimaryLabel: "Primary admin",
    orgAdminsCoAdminLabel: "Co-admin",
    orgAdminsAddCta: "Add administrator",
    orgAdminsAdded: "Administrator added. They can sign in with their work email to access this panel.",
    orgAdminsRemove: "Remove",
    orgAdminsEmpty: "Only you have admin access so far — add a colleague to share organisation setup.",
    orgAdminsCurrentTitle: "Current administrators",
    wardsSectionTitle: "Wards & departments",
    wardsSectionBody:
      "These names appear when you assign staff. Match your hospital's structure — you can rename, add, or remove units anytime.",
    wardsAddCta: "Add ward",
    wardsRemove: "Remove",
    wardsSaved: "Ward list updated.",
    wardsEmpty: "Add at least one ward or department before inviting staff.",
    wardsCollapse: "Collapse list",
    wardsExpand: (count: number) => `Show all ${count} wards`,
    wardsCollapsedSummary: (names: string[]) => {
      const preview = names.slice(0, 3).join(", ");
      const remaining = names.length - 3;
      if (remaining <= 0) return preview;
      return `${preview}, and ${remaining} more`;
    },
    inviteSectionTitle: "Invite ward staff",
    inviteSectionBody:
      "Add work emails, pick a role template, and set ward scope. Invites include credentials setup and role-specific orientation.",
    fullNameLabel: "Full name",
    emailLabel: "Work email",
    roleLabel: "Role",
    wardLabel: "Ward assignment",
    scopeLabel: "Permission scope",
    addInviteCta: "Add to invite list",
    sendInvitesCta: "Send invites",
    sendingInvites: "Sending invites…",
    invitesSent: "Invites sent. Staff will receive email instructions to join.",
    pendingTitle: "Pending invites",
    pendingEmpty: "No invites yet — add your first team member above.",
    rolesSectionTitle: "Role templates",
    rolesSectionBody:
      "Each template defines a permission boundary. Adjust scope per person when clinical and operational access differ.",
  },

  adminStaff: {
    eyebrow: "Operations",
    title: "Staff & shifts",
    subtitle:
      "Go beyond invites — assign shift windows and wards, see who is signed in for their shift, and review recent activity from the audit trail.",
    rosterTitle: "Ward roster",
    rosterBody:
      "Select someone to edit their profile or shift. Invited staff appear here once added — you can update details anytime.",
    detailsTitle: "Staff details",
    detailsBody:
      "Name, work email, and role. Use the same email they sign in with — rota assignments stay linked if you change it.",
    fullNameLabel: "Full name",
    emailLabel: "Work email",
    roleLabel: "Role",
    saveDetailsCta: "Save details",
    detailsSaved: "Staff details updated.",
    selectStaff: "Select a team member to edit their details, shift, or review activity.",
    shiftTitle: "Shift assignment",
    shiftBody:
      "Default ward and hours when no rota slot applies — overridden by the published schedule on sign-in.",
    wardLabel: "Assigned ward",
    shiftStartLabel: "Shift start",
    shiftEndLabel: "Shift end",
    saveShiftCta: "Save shift",
    shiftSaved: "Shift updated. It applies on their next sign-in.",
    statusOnline: "Signed in",
    statusOffline: "Off shift",
    signedInAt: (relative: string) => `Signed in ${relative}`,
    eventsThisShift: "audit events this shift",
    activityTitle: "Recent activity",
    activityBody: "Summarised from the permission-scoped audit log — cases, tasks, and acknowledgements.",
    activityEventsLabel: "Events this shift",
    activityLastLabel: "Latest action",
    activityNone: "No recorded activity yet",
    activityNote:
      "Full org-wide audit views and exports are a backend concern — this prototype surfaces per-person signals admins need day to day.",
    viewAuditCta: "View audit & escalations",
    schedule: {
      title: "Monthly & weekly rota",
      body:
        "Paste shifts planned last week or last month — one row per ward, role, date, and hours. RoundSync auto-assigns available staff by role and avoids double-booking the same person.",
      csvLabel: "Shift schedule (CSV)",
      csvHint:
        "Use dates already agreed with your team. Headcount is how many people you need on that slot — auto-assign fills from your roster.",
      importCta: "Import & auto-assign",
      importing: "Assigning…",
      exampleCta: "Load example week",
      importSuccess: (requirements: number, assigned: number, unfilled: number) =>
        `Imported ${requirements} shift slot${requirements === 1 ? "" : "s"}, assigned ${assigned} staff${assigned === 1 ? "" : ""}${unfilled > 0 ? ` — ${unfilled} still unfilled (add staff or adjust roles)` : "."}`,
      publishedTitle: "Published schedule",
      publishedBody: "When staff sign in on a scheduled date, the ward app uses their assigned slot automatically.",
      headcount: (count: number) => `${count} needed`,
      unfilled: (count: number) => `${count} unfilled`,
      fullyStaffed: "Fully staffed",
      assignedTo: (name: string, email: string) => `${name} (${email})`,
      noAssignments: "No staff matched this slot — check roles on your roster.",
    },
    nextShiftLabel: "Next scheduled",
    todayShiftLabel: "Today's rota",
  },

  adminAudit: {
    eyebrow: "Compliance & routing",
    title: "Audit & escalations",
    subtitle:
      "Trace what a specific user did, follow how escalation paths moved between people, and spot who failed to acknowledge so you can act.",
    filterTitle: "Filters",
    filterBody: "Narrow the audit trail by person, event type, ward, or time window.",
    staffLabel: "Staff member",
    allStaffOption: "All staff (organisation view)",
    searchLabel: "Search audit trail",
    searchPlaceholder: "Patient, case ID, actor, or keyword…",
    categoryLabel: "Event type",
    categoryAll: "All events",
    categoryCases: "Cases",
    categoryTasks: "Tasks",
    categoryEscalations: "Escalations",
    categoryAcknowledgements: "Acknowledgements",
    wardLabel: "Ward",
    allWardsOption: "All wards",
    timeLabel: "Time window",
    timeAll: "All time",
    time1h: "Last hour",
    time8h: "Last 8 hours",
    time24h: "Last 24 hours",
    timeCustom: "Custom date range",
    dateFromLabel: "From",
    dateToLabel: "To",
    customRangeHint: "Pick any start and end date — e.g. last week’s rota or a full month review.",
    customRangeInvalid: "End date must be on or after the start date.",
    clearFilters: "Clear filters",
    resultsCount: (count: number) =>
      count === 1 ? "1 entry matches" : `${count} entries match`,
    noResultsHint: "Try widening the time window or clearing a filter.",
    missedTitle: "Acknowledgement gaps",
    missedBody:
      "Alerts that timed out or are still pending — use this to follow up with the recipient or adjust escalation windows.",
    missedEmpty: "No missed or pending acknowledgements in the current window.",
    suggestedActionLabel: "Suggested action",
    sentMinutesAgo: (minutes: number) =>
      minutes === 1 ? "Sent 1 minute ago" : `Sent ${minutes} minutes ago`,
    escalationTitle: "Escalation paths",
    escalationBody:
      "How alerts moved between recipients on active cases — including timeouts that triggered the next step in the chain.",
    escalationEmpty: "No escalation activity recorded yet.",
    staffEscalationIntro: (name: string, count: number) =>
      `${name} appears in ${count} escalation step${count === 1 ? "" : "s"} below.`,
    escalatedFromTo: (from: string, to: string) => `Escalated from ${from} to ${to}`,
    escalatedMinutesAgo: (minutes: number) =>
      minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`,
    alertSent: (minutes: number) =>
      minutes === 1 ? "Alert sent 1 minute ago" : `Alert sent ${minutes} minutes ago`,
    acknowledgedMinutesAgo: (minutes: number) =>
      minutes === 1 ? "Acknowledged 1 minute ago" : `Acknowledged ${minutes} minutes ago`,
    viewCase: "View case",
    reviewCase: "Review case",
    userAuditTitle: (name: string) => `Audit trail — ${name}`,
    orgAuditTitle: "Organisation audit trail",
    userAuditBody:
      "Read-only log of cases, notes, acknowledgements, and tasks — same records ward staff see, scoped here for admin review.",
    userAuditEmpty: "No audit entries match this filter.",
  },

  adminReview: {
    backToAudit: "← Audit & escalations",
    readOnlyBanner:
      "Administrator read-only view — for audit and oversight. Clinical actions stay in the ward app.",
    adminLabel: "Admin review",
    caseNotFound: "Case not found.",
    patientNotFound: "Patient not found.",
    triggerNoteTitle: "Original trigger note",
    triggeredBy: (name: string) => `Flagged by ${name}`,
    alertsTitle: "Alert responses",
    alertsBody: "Who was notified and whether they acknowledged in time.",
    escalationTitle: "Escalation trail",
    escalationBody: "How routing moved when acknowledgement windows expired.",
    notesTitle: "Follow-up notes",
    notesBody: "Clinical notes recorded on this case — read-only.",
    viewPatient: "Review patient",
    viewCase: "Review case",
    tasksReadOnlyBody: "Scheduled tasks on this patient — shown for context, not actionable here.",
  },

  adminNetworkSecurity: {
    eyebrow: "IT & access control",
    title: "Network & devices",
    subtitle:
      "Limit RoundSync to your hospital network and approved ward devices. Out-of-network or unregistered access attempts are logged and can trigger admin alerts.",
    prototypeNote:
      "Prototype settings — enforcement and real IP detection require a backend. This page shows how org admins configure policy and review devices.",
    networkTitle: "Network boundary",
    networkBody:
      "Define IP ranges for your secure network (on-prem Wi‑Fi, VPN egress, or site firewall). Sessions from outside these ranges are blocked or flagged per your policy.",
    networkEnabledLabel: "Enforce network boundary",
    networkEnabledHint: "When off, any IP can reach RoundSync — device rules still apply if enabled below.",
    cidrLabel: "Allowed IP ranges",
    cidrPlaceholder: "10.42.0.0/16",
    cidrHint: "One CIDR or single IP per line. Add hospital Wi‑Fi, VPN exit, and each site’s egress range.",
    addCidrCta: "Add range",
    removeCidr: "Remove",
    requireVpnLabel: "Require VPN gateway",
    requireVpnHint: "Only allow sign-in when traffic arrives via your hospital VPN exit IP (add those ranges above).",
    outOfNetworkLabel: "When access is outside allowed ranges",
    outOfNetworkBlock: "Block sign-in and alert admins",
    outOfNetworkAlert: "Allow sign-in but alert admins",
    deviceTitle: "Device policy",
    deviceBody:
      "Ward tablets and staff phones must be registered before they can access patient data. Admins approve new devices from the queue.",
    deviceModeOpen: "Open — any device",
    deviceModeOpenHint: "No device registration. Suitable only for pilots — not recommended for production.",
    deviceModeRegistered: "Registered devices only",
    deviceModeRegisteredHint: "New devices queue for admin approval. Works with remote/VPN access if network rules allow.",
    deviceModeBoth: "Registered + on hospital network",
    deviceModeBothHint: "Strongest ward posture — device must be approved and connect from an allowed IP range.",
    alertsTitle: "Security alerts",
    alertsBody: "Who gets notified when someone tries to sign in off-network or from an unapproved device.",
    alertEmailLabel: "Alert recipients",
    alertEmailPlaceholder: "security@hospital.org",
    addAlertEmailCta: "Add recipient",
    alertEmailHint: "Typically IT security, ward admin, or on-call. Separate multiple addresses.",
    savePolicyCta: "Save policy",
    policySaved: "Network and device policy saved.",
    pendingTitle: "Pending devices",
    pendingBody: "First sign-in from a new browser or tablet lands here until an admin approves it.",
    pendingEmpty: "No devices waiting for approval.",
    approvedTitle: "Approved devices",
    approvedBody: "Registered ward hardware and staff devices cleared for access.",
    approvedEmpty: "No approved devices yet — approve a pending device or wait for staff sign-in.",
    revokeCta: "Revoke",
    approveCta: "Approve",
    rejectCta: "Reject",
    revokedLabel: "Revoked",
    lastSeen: (relative: string) => `Last seen ${relative}`,
    registeredBy: (name: string) => `Registered by ${name}`,
    eventsTitle: "Recent security events",
    eventsBody: "Blocked access, new device attempts, and approval changes — newest first.",
    eventsEmpty: "No security events recorded yet.",
    viewAllAudit: "View in audit trail",
    eventTypes: {
      access_blocked_out_of_network: "Blocked — out of network",
      access_attempt_out_of_network: "Out-of-network attempt",
      unregistered_device_attempt: "Unregistered device",
      device_approved: "Device approved",
      device_revoked: "Device revoked",
    },
  },
};
