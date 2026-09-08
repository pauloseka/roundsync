export const DUE_SOON_WINDOW_MINUTES = 30;

export const tasksCopy = {
  pageSubtitle:
    "Scheduled medications, vitals checks, and care rounds — planned care for the shift, separate from anything going wrong.",
  dashboardWidget: {
    title: "Tasks due soon",
    description:
      "Scheduled care on your shift — medications, vitals checks, and rounds. Patients with open cases are in Active cases.",
    empty: "Nothing due in the next window.",
    linkLabel: "Full checklist",
  },
  sections: {
    overdue: {
      label: "Overdue",
      description: "Tasks past their due time — work through these first.",
      empty: "Nothing overdue on your shift.",
    },
    due_soon: {
      label: "Due soon",
      description: `Due within the next ${DUE_SOON_WINDOW_MINUTES} minutes on your shift.`,
      empty: "Nothing due in the next window.",
    },
    pending: {
      label: "Upcoming",
      description: "Scheduled later on your shift — planned care, not urgent.",
      empty: "No upcoming tasks scheduled.",
    },
    completed: {
      label: "Completed",
      description: "Routine care you've already finished this shift.",
      empty: "Nothing completed yet.",
    },
  },
} as const;

export const casesCopy = {
  pageSubtitle:
    "Open emergency cases on your shift — track who's responded and what's still waiting.",
  dashboardWidget: {
    title: "Active cases",
    description:
      "Open escalations on your shift — urgency, summary, and time open. Anything case-related lives here.",
    empty: "No open cases on your shift.",
    linkLabel: "Full queue",
  },
  sections: {
    escalated: {
      label: "Escalated",
      description: "No response in time — routed to backup or supervisor.",
      empty: "No escalated cases right now.",
    },
    open: {
      label: "Open",
      description: "Active cases awaiting response or coordination.",
      empty: "No open cases right now.",
    },
    reopened: {
      label: "Reopened",
      description: "Previously resolved cases where the patient has relapsed.",
      empty: "No reopened cases right now.",
    },
  },
  supportComms: {
    title: "Support team updates",
    description:
      "Lab, pharmacy, and other replies when the doctor paged them about this patient — kept on the case, not in your general inbox.",
    empty: "No support-team messages for this patient yet.",
    pagedLabel: "Paged via case",
    viewThread: "View thread",
  },
} as const;

export const clinicalWarningsCopy = {
  dashboardWidget: {
    title: "Clinical warnings",
    description:
      "Patients whose vitals are trending concerning but don't have a formal case open yet. Early signal to watch before it becomes an emergency.",
    empty: "No early warnings on your shift right now.",
    linkLabel: "View patients",
  },
} as const;

export const quickAlertCopy = {
  pickUrgencyLabel: "Trigger alert",
  recommended: "recommended",
  triggerButton: "Trigger alert",
  confirmTitle: (patientName: string) => `Alert for ${patientName}?`,
  confirmDescription: (urgencyLabel: string, note: string) =>
    `${urgencyLabel} alert routes to on-call immediately. ${note}`,
  confirmButton: (urgency: "critical" | "urgent" | "moderate") =>
    `Send ${urgency === "critical" ? "critical" : urgency === "urgent" ? "urgent" : "moderate"} alert`,
  cancelButton: "Cancel",
} as const;

export const patientsCopy = {
  pageSubtitle:
    "Ward roster lookup — vitals, early warnings, and who's on an active case. Reference only; routine work lives in Tasks and escalations in Active cases.",
  searchPlaceholder: "Search by name, bed, or ID…",
  searchLabel: "Search ward roster",
  filters: {
    all: "All",
    warnings: "Early warnings",
    on_case: "On active case",
  },
  roster: {
    label: "Ward roster",
    description: "Your assigned patients this shift — tap a row for vitals context and links.",
    empty: "No patients match your search or filter.",
  },
  detail: {
    backLabel: "← Patients",
    vitalsLabel: "Vitals status",
    lastUpdatedLabel: "Last vitals update",
    earlyWarningLabel: "Early warning",
    activeCaseLabel: "Active case",
    noActiveCase: "No open case for this patient.",
    openCaseCta: "Open active case",
    triggerCaseCta: "Trigger case",
    tasksLabel: "Scheduled tasks",
    tasksDescription: "Planned care on your shift — complete these from My Tasks.",
    tasksEmpty: "No scheduled tasks for this patient.",
    viewTasksCta: "View in My Tasks",
  },
  sidebar: {
    wardLabel: "Your ward",
    summaryLabel: "Roster summary",
    totalLabel: "Assigned",
    warningsLabel: "Early warnings",
    onCaseLabel: "On active case",
  },
  boundary: {
    title: "Your role on Patients",
    items: [
      "This page is for lookup — bed location, vitals status, and who's already on a case.",
      "Early warnings are pre-case signals; trigger an Active case if coordination needs to widen.",
      "Complete scheduled care from My Tasks — don't use this page as a checklist.",
      "Clinical escalation and support-team replies stay on the active case once opened.",
    ],
  },
} as const;

export const auditCopy = {
  pageSubtitle:
    "Permission-scoped history for your shift — case actions and task completions you triggered or participated in. Read-only and timestamped for accountability.",
  searchLabel: "Search activity",
  searchPlaceholder: "Search by patient, case, or action…",
  filters: {
    all: "All activity",
    cases: "Case actions",
    tasks: "Task completions",
  },
  log: {
    label: "Activity log",
    description: "Newest first — expand an entry for full context. You cannot edit or delete audit records.",
    empty: "No audit entries match your search or filter.",
    readOnlyLabel: "Read-only",
    expandLabel: "Show details",
    collapseLabel: "Hide details",
  },
  sidebar: {
    scopeLabel: "Your scope",
    scopeDescription:
      "Entries where you acted, plus responses on cases you opened — scoped to your role permissions.",
    summaryLabel: "This shift",
    totalLabel: "Total entries",
    casesLabel: "Case actions",
    tasksLabel: "Task completions",
  },
  boundary: {
    title: "About the audit trail",
    items: [
      "Every entry is immutable — a record of what already happened, not a place to take action.",
      "Case coordination continues in Active cases; this page is for review and handoff accountability.",
      "Timestamps show relative and absolute time so you can reconstruct sequence during debriefs.",
      "If something is missing, contact your ward lead — retention follows your hospital's policy.",
    ],
  },
} as const;

export const settingsCopy = {
  pageSubtitle:
    "How you experience RoundSync — alerts, notifications, display, and account. Work stays in the shift group above; settings are personal and separate.",
  alerts: {
    title: "Alert preferences",
    description: "Sound and tone for case urgency levels on this device.",
    soundLabel: "Alert sounds",
    soundHint: "Play a tone when a new case alert arrives.",
    toneHeading: "Tone per urgency",
    tones: {
      chime: "Chime",
      pulse: "Pulse",
      bell: "Bell",
    },
    urgency: {
      critical: "Critical",
      urgent: "Urgent",
      moderate: "Moderate",
    },
  },
  notifications: {
    title: "Notification scope",
    description: "Choose how wide non-case notifications reach you during a shift.",
    wardOnly: {
      label: "Ward only",
      description: "Messages and updates for Ward 4B and your assigned patients.",
    },
    extended: {
      label: "Broader coverage",
      description: "Include department channels and hospital-wide operational notices.",
    },
  },
  display: {
    title: "Display",
    description: "Choose light, dark, or match your system preference.",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  profile: {
    title: "Profile",
    description: "Your account details on this shift — managed by your hospital IT.",
    nameLabel: "Name",
    roleLabel: "Role",
    wardLabel: "Ward",
    emailLabel: "Email",
    employeeIdLabel: "Employee ID",
    managedNote: "Contact IT to update your name, role, or ward assignment.",
  },
  account: {
    title: "Account & security",
    description: "Sign-in method and password management for your organisation account.",
    authMethodLabel: "Sign-in method",
    changePasswordLabel: "Change password",
    changePasswordHint: "Update your password while signed in on this device.",
    signOutLabel: "Sign out",
    signOutHint: "End your session on this device — you'll return to the sign-in screen.",
  },
  changePassword: {
    backLabel: "← Settings",
    title: "Change password",
    subtitle:
      "Enter your current password, then choose a new one. You'll stay signed in after updating.",
    currentLabel: "Current password",
    newLabel: "New password",
    newHint: "At least 8 characters — mix letters and numbers where your hospital policy allows.",
    confirmLabel: "Confirm new password",
    saveLabel: "Update password",
    savingLabel: "Updating…",
    cancelLabel: "Cancel",
    successTitle: "Password updated",
    successBody: "Your new password is saved. Use it the next time you sign in on a shared workstation.",
    backToSettingsLabel: "Back to Settings",
    currentRequiredError: "Enter your current password.",
    tooShortError: "New password must be at least 8 characters.",
    mismatchError: "New passwords don't match.",
    sameAsCurrentError: "New password must be different from your current password.",
    ssoNote: "Accounts managed through hospital SSO may need IT to change credentials.",
    supportLinkLabel: "Contact support",
  },
  sidebar: {
    title: "Personal preferences",
    description:
      "These settings affect how the app feels and notifies you. They don't change cases, tasks, or patient assignments.",
    savedLabel: "Changes save automatically on this device.",
  },
  boundary: {
    title: "Separate from shift work",
    items: [
      "Dashboard, Tasks, Cases, Messages, Patients, and Audit Trail are your work surfaces.",
      "Settings only controls alerts, scope, display, and your account view.",
      "Escalation paths and permissions are configured by ward administration — not here.",
    ],
  },
} as const;

export const messagesCopy = {
  pageSubtitle:
    "Informal care-team threads — department channels, direct messages, and patient-linked updates. Open case coordination stays in Active cases.",
  dashboardWidget: {
    title: "Unread messages",
    description:
      "Unread threads from your team — handoffs, lab results, and ward updates. Case coordination for open escalations is in Active cases.",
    empty: "No unread threads.",
    linkLabel: "All messages",
  },
  sections: {
    unread: {
      label: "Unread",
      description: "Threads waiting for you — quick updates, not formal escalations.",
      empty: "You're caught up on messages.",
    },
    read: {
      label: "Earlier",
      description: "Threads you've already opened this shift.",
      empty: "No read threads yet.",
    },
    paused: {
      label: "Paused while case open",
      description:
        "Patient-linked threads are on the open case — lab and pharmacy replies appear under Support team updates.",
      empty: "No paused threads.",
    },
  },
  channels: {
    title: "Department channels",
    description: "Persistent threads for your ward, pharmacy, lab, and front desk.",
    newMessageLabel: "New message",
    noThreadLabel: "Start",
  },
  newMessage: {
    title: "New message",
    subtitle:
      "Search for a department channel or colleague. Patient linking only appears when the recipient supports it.",
    searchLabel: "To",
    searchPlaceholder: "Search colleagues or channels…",
    searchEmpty: "No colleagues or channels match your search.",
    channelsGroupLabel: "Channels",
    colleaguesGroupLabel: "Colleagues",
    channelBadge: "Channel",
    colleagueBadge: "Colleague",
    changeRecipientLabel: "Change",
    recipientRequiredError: "Choose a colleague or channel before sending.",
    patientLabel: "Patient (optional)",
    noPatientOption: "No patient linked",
    patientHint: "Link a patient when the message is about their care.",
    wardChannelHint:
      "Ward-wide channels don't link patients — use @ to mention a colleague who should see this.",
    activeCaseHint:
      "Patients with open cases are hidden here — use the active case for escalation and clinical coordination.",
    bodyLabel: "Message",
    bodyPlaceholder: "Write your message…",
    bodyPlaceholderWithMentions: "Write your message… use @ to mention a colleague",
    composeToolbarHint: "Use @ to mention a colleague, or attach photos and PDFs.",
    sendLabel: "Send message",
    sendingLabel: "Sending…",
    submitError: "Could not send this message. Try again.",
  },
  compose: {
    replyPlaceholder: "Reply to this thread…",
    replyPlaceholderWithMentions: "Reply… use @ to mention a colleague",
    mentionLabel: "Mention a colleague",
    mentionHeading: "Mention",
    replyToolbarHint: "Use @ to mention a colleague, or attach photos and PDFs.",
    attachLabel: "Add files",
    attachHint: "Photos, PDFs, or text files — up to 3 files, 10 MB each.",
    removeFileLabel: "Remove",
    sendLabel: "Send reply",
    sendingLabel: "Sending…",
    fileTypeError: "Only images, PDFs, and text files can be attached.",
    fileSizeError: "Each file must be 10 MB or smaller.",
    fileCountError: "You can attach up to 3 files per reply.",
    requireContentError: "Add a message or at least one file.",
  },
  navigation: {
    backToInbox: "← Messages",
    backToCase: "← Active case",
    openActiveCase: "Open active case",
    viewThread: "View thread",
  },
  boundary: {
    title: "Your role in messages",
    items: [
      "Messages are for informal updates — handoffs, lab results, visitor notices.",
      "Use department channels for ward-wide or service desk threads; use New message for a colleague directly.",
      "Attach photos or PDFs when a picture helps — wound sites, printed vitals, handoff notes.",
      "If something needs routing, escalation, or audit trail, trigger or update an Active case.",
      "You can't start medication orders or resource requests from here — those flow from cases.",
    ],
  },
} as const;

export const handoffCopy = {
  bannerEyebrow: "Shift handoff",
  bannerTitle: (count: number, shiftEnd: string) =>
    `${count} open ${count === 1 ? "case needs" : "cases need"} handoff before ${shiftEnd}`,
  bannerBody:
    "Cases stay on the patient — bedside ownership must transfer explicitly before your shift ends.",
  bannerCta: "Review handoff board",
  panelTitle: "Shift handoff board",
  panelDescription:
    "Accept ownership for open cases transferring to the incoming shift. Clinical responders stay on the alert chain until the case resolves.",
  outgoingLabel: "Outgoing",
  incomingLabel: "Incoming",
  incomingLeadLabel: "Incoming bedside lead",
  acceptCaseCta: "Accept handoff",
  acceptAllCta: (count: number) => `Accept all (${count})`,
  allAcceptedNote: "All open cases have an accepted bedside owner for the incoming shift.",
} as const;

export const onCallCopy = {
  panelEyebrow: "On-call routing",
  panelTitle: "Rota-driven alerts",
  panelDescription:
    "Scheduled rota routes first response — not a manual checkbox. Override only when cover changes.",
  rotaLabel: "Scheduled (rota)",
  routingLabel: "Routing alerts to",
  backupLabel: "Backup on-call",
  loggedInLabel: "Logged in on ward",
  noneLoggedIn: "No doctors logged in",
  staleTitle: "Stale rota detected",
  staleBody: (scheduled: string, suggested: string) =>
    `Rota lists ${scheduled}, but ${suggested} is the only doctor logged in on this ward.`,
  confirmCoverCta: (name: string) => `Confirm ${name} as on-call`,
  overrideActive: (name: string) => `Temporary cover active — routing to ${name}.`,
  clearOverrideCta: "Clear override",
  escalationEyebrow: "If nobody acks",
} as const;

export const relapseCopy = {
  eyebrow: "Relapse — reopen, don't fork",
  title: (patientName: string, caseId: string) =>
    `${patientName} had ${caseId} resolved recently`,
  body: (resolvedMinutesAgo: number, summary: string) => {
    const when =
      resolvedMinutesAgo === 1 ? "1 minute ago" : `${resolvedMinutesAgo} minutes ago`;
    return `Resolved ${when} — "${summary}". Reopen the same case to preserve the audit lineage.`;
  },
  reopenCta: "Reopen case",
  viewResolvedCta: "View resolved case",
  notePlaceholder: "Why is this case being reopened? e.g. vitals trending again",
  confirmReopenCta: "Confirm reopen",
  reopenedNote: (minutesAgo: number, priorSummary?: string) => {
    const when = minutesAgo === 1 ? "1 minute" : `${minutesAgo} minutes`;
    return priorSummary
      ? `Reopened after prior resolution ${when} ago — previously: "${priorSummary}".`
      : `Reopened after prior resolution ${when} ago.`;
  },
  triggerBlockedTitle: "Reopen required",
} as const;

export function viewAllLabel(totalCount: number): string {
  return `View all (${totalCount})`;
}
