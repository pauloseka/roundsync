import { getPasswordRequirementResults } from "@/lib/password-requirements";

interface PasswordRequirementsProps {
  password: string;
  title?: string;
}

function RequirementIcon({ met }: { met: boolean }) {
  if (met) {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-core text-[10px] text-white">
        ✓
      </span>
    );
  }

  return <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-secondary/40" aria-hidden="true" />;
}

export function PasswordRequirements({ password, title = "Password must include:" }: PasswordRequirementsProps) {
  const results = getPasswordRequirementResults(password);
  const showStatus = password.length > 0;

  return (
    <div
      className="mt-3 rounded-lg border border-line bg-surface-base px-3.5 py-3"
      aria-live="polite"
      aria-atomic="false"
    >
      <p className="text-xs font-medium text-ink-primary">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {results.map((requirement) => (
          <li
            key={requirement.id}
            className={`flex items-start gap-2 text-xs leading-relaxed ${
              showStatus && requirement.met ? "text-brand-core" : "text-ink-secondary"
            }`}
          >
            <RequirementIcon met={showStatus && requirement.met} />
            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
