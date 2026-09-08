export const accessProfiles = [
  {
    id: "clinical",
    title: "Clinical staff",
    body: "Nurses, doctors, and pharmacy see assigned patients, shift tasks, and open cases — scoped to what your role needs to act on.",
  },
  {
    id: "admin",
    title: "IT & ward administration",
    body: "Provision users, configure wards, escalation paths, and permissions. Operational views stay separate from clinical diagnoses.",
  },
  {
    id: "dual",
    title: "More than one role",
    body: "Clinical lead with admin duties? Your account can hold multiple roles. Sign in once — RoundSync opens your primary role. Switch active role in Settings when your responsibilities change.",
  },
];

export const hospitalEmailSignIn = {
  id: "hospital",
  label: "Sign in with hospital email",
  description: "Use your @hospital.org address via your organisation's single sign-on",
} as const;

export type HospitalSsoProviderId = typeof hospitalEmailSignIn.id;

export const forgotPasswordSteps = [
  {
    id: "email",
    title: "Check your inbox",
    body: "We send a secure link to your hospital email. Links expire after 24 hours for ward security.",
  },
  {
    id: "sso",
    title: "Hospital SSO accounts",
    body: "If you sign in with your organisation's single sign-on, password resets are handled by your IT team — not RoundSync directly.",
  },
  {
    id: "support",
    title: "Still locked out?",
    body: "Ward administrators and our support team can verify your role assignment and restore access during business hours.",
  },
] as const;
