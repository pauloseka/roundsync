export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export const adminOrganisationNav: AdminNavItem[] = [
  {
    id: "team",
    label: "Team & invites",
    href: "/admin",
    icon: "/icons/nav/patients.json",
    description: "Invite staff, assign roles, and set permission scope.",
  },
  {
    id: "staff",
    label: "Staff & shifts",
    href: "/admin/staff",
    icon: "/icons/nav/tasks.json",
    description: "Shift schedules, ward presence, and activity tracking.",
  },
  {
    id: "audit",
    label: "Audit & escalations",
    href: "/admin/audit",
    icon: "/icons/nav/cases.json",
    description: "Per-user audit trails, escalation paths, and missed acknowledgements.",
  },
  {
    id: "security",
    label: "Network & devices",
    href: "/admin/security",
    icon: "/icons/nav/settings.json",
    description: "Hospital network boundaries, permitted devices, and access alerts.",
  },
  {
    id: "billing",
    label: "Billing & plan",
    href: "/subscription",
    icon: "/icons/nav/dashboard.json",
    description: "Manage subscription, seats, and billing cycle.",
  },
];

export const adminAccountNav: AdminNavItem[] = [
  {
    id: "settings",
    label: "Account settings",
    href: "/settings",
    icon: "/icons/nav/settings.json",
    description: "Your profile, password, and notification preferences.",
  },
];

/** Same account — switches from org admin shell to the ward/clinical app. */
export const adminWardAppNav: AdminNavItem = {
  id: "ward-app",
  label: "Ward app",
  href: "/dashboard",
  icon: "/icons/nav/cases.json",
  description: "Open the clinical ward view with your same login.",
};

/** Shown in ward nav when the signed-in user is also an organisation admin. */
export const wardAdminPanelNav: AdminNavItem = {
  id: "admin-panel",
  label: "Organisation admin",
  href: "/admin",
  icon: "/icons/nav/settings.json",
  description: "Team setup, billing, and organisation settings.",
};

const ADMIN_SHELL_PREFIXES = ["/admin", "/subscription", "/checkout", "/settings"] as const;

/** Routes that require a tablet or larger viewport (organisation admin dashboard). */
export function isAdminDashboardRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** Organisation admins see the admin shell only on provisioning routes — not on ward/clinical pages. */
export function isAdminShellRoute(pathname: string): boolean {
  return ADMIN_SHELL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
