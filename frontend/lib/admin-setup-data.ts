export type AdminRoleId =
  | "nursing"
  | "clinical"
  | "pharmacy"
  | "front_desk"
  | "ward_admin";

export type AdminPermissionScope = "ward_only" | "extended" | "operations";

export interface AdminRoleTemplate {
  id: AdminRoleId;
  label: string;
  abbrev: string;
  description: string;
  permissions: string[];
}

export interface AdminInviteDraft {
  id: string;
  email: string;
  fullName: string;
  roleId: AdminRoleId;
  ward: string;
  permissionScope: AdminPermissionScope;
  status: "draft" | "sent";
}

export const adminRoleTemplates: AdminRoleTemplate[] = [
  {
    id: "nursing",
    label: "Nursing",
    abbrev: "RN / HCA",
    description: "Shift tasks, patient flags, case acknowledgment, and ward handoffs.",
    permissions: [
      "Assigned ward patients and tasks",
      "Raise and acknowledge cases",
      "Clinical coordination context",
    ],
  },
  {
    id: "clinical",
    label: "Clinical staff",
    abbrev: "On-call",
    description: "Escalation response with full patient history for assigned wards.",
    permissions: [
      "Escalated case queue",
      "Full coordination context",
      "Acknowledge and resolve cases",
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    abbrev: "Pharm",
    description: "Pulled in only when medication is part of the response.",
    permissions: [
      "Medication-relevant case detail",
      "Pharmacy-specific alerts",
      "No unrelated clinical noise",
    ],
  },
  {
    id: "front_desk",
    label: "Front desk & operations",
    abbrev: "Ops",
    description: "Resource and logistics requests without clinical diagnoses.",
    permissions: [
      "Room and equipment requests",
      "Operational staffing views",
      "No clinical diagnoses",
    ],
  },
  {
    id: "ward_admin",
    label: "Ward administration",
    abbrev: "Admin",
    description: "Provision users, configure wards, and manage permission boundaries.",
    permissions: [
      "Invite and assign staff",
      "Ward and escalation configuration",
      "Operational audit views",
    ],
  },
];

export const adminPermissionScopes: {
  id: AdminPermissionScope;
  label: string;
  description: string;
}[] = [
  {
    id: "ward_only",
    label: "Ward only",
    description: "Access limited to their assigned ward — default for most clinical roles.",
  },
  {
    id: "extended",
    label: "Extended",
    description: "Cross-ward visibility for shift leads and covering clinicians.",
  },
  {
    id: "operations",
    label: "Operations",
    description: "Resource and staffing views without clinical detail — for front desk and admin.",
  },
];

export function getAdminRoleById(id: AdminRoleId): AdminRoleTemplate {
  return adminRoleTemplates.find((role) => role.id === id) ?? adminRoleTemplates[0];
}
