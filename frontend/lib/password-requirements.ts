export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "One special character (!@#$%^&* etc.)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export function getPasswordRequirementResults(password: string) {
  return passwordRequirements.map((requirement) => ({
    ...requirement,
    met: requirement.test(password),
  }));
}

export function isPasswordValid(password: string): boolean {
  return passwordRequirements.every((requirement) => requirement.test(password));
}

export function getPasswordValidationError(password: string): string | null {
  const unmet = getPasswordRequirementResults(password).find((item) => !item.met);
  return unmet ? `Password must include ${unmet.label.toLowerCase()}.` : null;
}
