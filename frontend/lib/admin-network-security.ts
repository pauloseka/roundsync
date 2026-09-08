import { getSignUpSession, saveNetworkSecurityData } from "@/lib/signup-session";

export type DevicePolicyMode = "open" | "registered_only" | "registered_and_in_network";
export type OutOfNetworkAction = "block" | "alert_only";

export interface NetworkSecurityPolicy {
  enabled: boolean;
  allowedCidrs: string[];
  requireVpn: boolean;
  deviceMode: DevicePolicyMode;
  outOfNetworkAction: OutOfNetworkAction;
  alertEmails: string[];
}

export type RegisteredDeviceStatus = "pending" | "approved" | "revoked";

export interface RegisteredDevice {
  id: string;
  label: string;
  platform: string;
  lastSeenIp: string;
  registeredByEmail: string;
  registeredByName: string;
  registeredAt: string;
  lastSeenAt: string;
  status: RegisteredDeviceStatus;
  wardHint?: string;
}

export type SecurityEventType =
  | "access_blocked_out_of_network"
  | "access_attempt_out_of_network"
  | "unregistered_device_attempt"
  | "device_approved"
  | "device_revoked";

export interface SecurityAuditEvent {
  id: string;
  type: SecurityEventType;
  actorEmail: string | null;
  actorName: string | null;
  ipAddress: string;
  deviceLabel: string | null;
  occurredAt: string;
  summary: string;
}

const DEFAULT_POLICY: NetworkSecurityPolicy = {
  enabled: false,
  allowedCidrs: ["10.0.0.0/8", "172.16.0.0/12"],
  requireVpn: false,
  deviceMode: "registered_and_in_network",
  outOfNetworkAction: "block",
  alertEmails: [],
};

const DEVICE_SEED: RegisteredDevice[] = [
  {
    id: "device-ward-4b-ipad",
    label: "Ward 4B — shared iPad",
    platform: "iPadOS 17 · Safari",
    lastSeenIp: "10.42.18.22",
    registeredByEmail: "sarah@citygeneral.org",
    registeredByName: "Sarah Mitchell",
    registeredAt: "2026-08-01T07:12:00.000Z",
    lastSeenAt: "2026-08-12T14:05:00.000Z",
    status: "approved",
    wardHint: "Surgical 4B",
  },
  {
    id: "device-nurses-station",
    label: "Nurses' station PC",
    platform: "Windows 11 · Chrome",
    lastSeenIp: "10.42.18.41",
    registeredByEmail: "amaka.okafor@hospital.org",
    registeredByName: "Amaka Okafor",
    registeredAt: "2026-07-28T09:00:00.000Z",
    lastSeenAt: "2026-08-12T13:58:00.000Z",
    status: "approved",
    wardHint: "Ward 4B — Medical",
  },
  {
    id: "device-pending-android",
    label: "Android phone",
    platform: "Android 14 · Chrome",
    lastSeenIp: "203.0.113.88",
    registeredByEmail: "dr.patel@citygeneral.org",
    registeredByName: "Dr. Patel",
    registeredAt: "2026-08-12T11:20:00.000Z",
    lastSeenAt: "2026-08-12T11:20:00.000Z",
    status: "pending",
  },
  {
    id: "device-pending-laptop",
    label: "Personal MacBook",
    platform: "macOS 15 · Safari",
    lastSeenIp: "198.51.100.14",
    registeredByEmail: "dr.adeyemi@citygeneral.org",
    registeredByName: "Dr. Adeyemi",
    registeredAt: "2026-08-11T18:45:00.000Z",
    lastSeenAt: "2026-08-11T18:45:00.000Z",
    status: "pending",
  },
];

const EVENT_SEED: SecurityAuditEvent[] = [
  {
    id: "sec-1",
    type: "access_blocked_out_of_network",
    actorEmail: "dr.adeyemi@citygeneral.org",
    actorName: "Dr. Adeyemi",
    ipAddress: "198.51.100.14",
    deviceLabel: "Personal MacBook",
    occurredAt: "2026-08-11T18:45:00.000Z",
    summary: "Sign-in blocked — IP not in allowed hospital ranges.",
  },
  {
    id: "sec-2",
    type: "unregistered_device_attempt",
    actorEmail: "dr.patel@citygeneral.org",
    actorName: "Dr. Patel",
    ipAddress: "203.0.113.88",
    deviceLabel: "Android phone",
    occurredAt: "2026-08-12T11:20:00.000Z",
    summary: "New device pending approval before ward access is granted.",
  },
  {
    id: "sec-3",
    type: "device_approved",
    actorEmail: null,
    actorName: "Sarah Mitchell",
    ipAddress: "10.42.18.22",
    deviceLabel: "Ward 4B — shared iPad",
    occurredAt: "2026-08-01T07:15:00.000Z",
    summary: "Device approved for Surgical 4B shared tablet.",
  },
];

function readPolicy(session: ReturnType<typeof getSignUpSession>): NetworkSecurityPolicy {
  if (!session.networkSecurityPolicy) return { ...DEFAULT_POLICY };
  return {
    ...DEFAULT_POLICY,
    ...session.networkSecurityPolicy,
    allowedCidrs: session.networkSecurityPolicy.allowedCidrs ?? DEFAULT_POLICY.allowedCidrs,
    alertEmails: session.networkSecurityPolicy.alertEmails ?? [],
  };
}

function readDevices(session: ReturnType<typeof getSignUpSession>): RegisteredDevice[] {
  if (session.registeredDevices && session.registeredDevices.length > 0) {
    return session.registeredDevices;
  }
  return DEVICE_SEED;
}

function readEvents(session: ReturnType<typeof getSignUpSession>): SecurityAuditEvent[] {
  if (session.securityEvents && session.securityEvents.length > 0) {
    return session.securityEvents;
  }
  return EVENT_SEED;
}

export function getNetworkSecurityPolicy(): NetworkSecurityPolicy {
  return readPolicy(getSignUpSession());
}

export function getRegisteredDevices(): RegisteredDevice[] {
  return readDevices(getSignUpSession());
}

export function getSecurityEvents(): SecurityAuditEvent[] {
  return readEvents(getSignUpSession()).sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export function saveNetworkSecurityPolicy(
  updates: Partial<NetworkSecurityPolicy>,
): { ok: true } | { ok: false; message: string } {
  const session = getSignUpSession();
  const current = readPolicy(session);
  const next = { ...current, ...updates };

  if (updates.allowedCidrs) {
    const invalid = updates.allowedCidrs.find((cidr) => !isValidCidr(cidr));
    if (invalid) {
      return { ok: false, message: `"${invalid}" is not a valid IP range (use CIDR, e.g. 10.0.0.0/8).` };
    }
  }

  saveNetworkSecurityData({
    networkSecurityPolicy: next,
    registeredDevices: readDevices(session),
    securityEvents: readEvents(session),
  });

  return { ok: true };
}

export function addAllowedCidr(cidr: string): { ok: true } | { ok: false; message: string } {
  const trimmed = cidr.trim();
  if (!trimmed) {
    return { ok: false, message: "Enter an IP range before adding." };
  }
  if (!isValidCidr(trimmed)) {
    return { ok: false, message: "Use CIDR notation, e.g. 10.42.0.0/16 or a single IP." };
  }

  const policy = getNetworkSecurityPolicy();
  if (policy.allowedCidrs.includes(trimmed)) {
    return { ok: false, message: "That range is already on the allowlist." };
  }

  return saveNetworkSecurityPolicy({ allowedCidrs: [...policy.allowedCidrs, trimmed] });
}

export function removeAllowedCidr(cidr: string): { ok: true } | { ok: false; message: string } {
  const policy = getNetworkSecurityPolicy();
  return saveNetworkSecurityPolicy({
    allowedCidrs: policy.allowedCidrs.filter((entry) => entry !== cidr),
  });
}

export function approveDevice(id: string): { ok: true } | { ok: false; message: string } {
  const session = getSignUpSession();
  const devices = readDevices(session);
  const device = devices.find((entry) => entry.id === id);

  if (!device) return { ok: false, message: "Device not found." };
  if (device.status !== "pending") {
    return { ok: false, message: "Only pending devices can be approved." };
  }

  const nextDevices = devices.map((entry) =>
    entry.id === id ? { ...entry, status: "approved" as const } : entry,
  );

  const event: SecurityAuditEvent = {
    id: `sec-${Date.now()}`,
    type: "device_approved",
    actorEmail: null,
    actorName: device.registeredByName,
    ipAddress: device.lastSeenIp,
    deviceLabel: device.label,
    occurredAt: new Date().toISOString(),
    summary: `Device approved — ${device.label} (${device.platform}).`,
  };

  saveNetworkSecurityData({
    networkSecurityPolicy: readPolicy(session),
    registeredDevices: nextDevices,
    securityEvents: [event, ...readEvents(session)],
  });

  return { ok: true };
}

export function rejectDevice(id: string): { ok: true } | { ok: false; message: string } {
  const session = getSignUpSession();
  const devices = readDevices(session);
  const device = devices.find((entry) => entry.id === id);

  if (!device) return { ok: false, message: "Device not found." };

  saveNetworkSecurityData({
    networkSecurityPolicy: readPolicy(session),
    registeredDevices: devices.filter((entry) => entry.id !== id),
    securityEvents: readEvents(session),
  });

  return { ok: true };
}

export function revokeDevice(id: string): { ok: true } | { ok: false; message: string } {
  const session = getSignUpSession();
  const devices = readDevices(session);
  const device = devices.find((entry) => entry.id === id);

  if (!device) return { ok: false, message: "Device not found." };
  if (device.status !== "approved") {
    return { ok: false, message: "Only approved devices can be revoked." };
  }

  const nextDevices = devices.map((entry) =>
    entry.id === id ? { ...entry, status: "revoked" as const } : entry,
  );

  const event: SecurityAuditEvent = {
    id: `sec-${Date.now()}`,
    type: "device_revoked",
    actorEmail: null,
    actorName: device.registeredByName,
    ipAddress: device.lastSeenIp,
    deviceLabel: device.label,
    occurredAt: new Date().toISOString(),
    summary: `Device revoked — ${device.label} can no longer sign in.`,
  };

  saveNetworkSecurityData({
    networkSecurityPolicy: readPolicy(session),
    registeredDevices: nextDevices,
    securityEvents: [event, ...readEvents(session)],
  });

  return { ok: true };
}

export function devicePolicyLabel(mode: DevicePolicyMode): string {
  switch (mode) {
    case "open":
      return "Open — any device can sign in";
    case "registered_only":
      return "Registered devices only";
    case "registered_and_in_network":
      return "Registered devices on hospital network";
  }
}

export function securityEventLabel(type: SecurityEventType): string {
  switch (type) {
    case "access_blocked_out_of_network":
      return "Blocked — out of network";
    case "access_attempt_out_of_network":
      return "Out-of-network attempt";
    case "unregistered_device_attempt":
      return "Unregistered device";
    case "device_approved":
      return "Device approved";
    case "device_revoked":
      return "Device revoked";
  }
}

function isValidCidr(value: string): boolean {
  const singleIp = /^(\d{1,3}\.){3}\d{1,3}$/;
  const cidr = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;

  if (singleIp.test(value)) {
    return value.split(".").every((octet) => {
      const num = Number(octet);
      return num >= 0 && num <= 255;
    });
  }

  if (!cidr.test(value)) return false;

  const [ip, prefix] = value.split("/");
  const prefixNum = Number(prefix);
  if (prefixNum < 0 || prefixNum > 32) return false;

  return ip.split(".").every((octet) => {
    const num = Number(octet);
    return num >= 0 && num <= 255;
  });
}
