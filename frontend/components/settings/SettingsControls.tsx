"use client";

interface SettingsToggleProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  id,
  label,
  hint,
  checked,
  onChange,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-ink-primary">
          {label}
        </label>
        {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{hint}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? "bg-brand-core" : "bg-line"
        }`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="rounded-xl border border-line bg-surface-card p-5">
      <h2 className="font-display text-base font-semibold text-ink-primary">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const selectClassName =
  "mt-1.5 w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-brand-core focus:ring-1 focus:ring-brand-core disabled:cursor-not-allowed disabled:opacity-60";

interface SettingsSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function SettingsSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
}: SettingsSelectProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-ink-primary">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={selectClassName}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface SettingsRadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description: string }[];
}

export function SettingsRadioGroup({ name, value, onChange, options }: SettingsRadioGroupProps) {
  return (
    <fieldset className="space-y-2 border-0 p-0">
      {options.map((option) => {
        const id = `${name}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={id}
            className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-3 transition-colors ${
              value === option.value
                ? "border-brand-core/40 bg-brand-core-muted/30"
                : "border-line bg-surface-base hover:bg-surface-card"
            }`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-0.5 size-4 accent-brand-core"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink-primary">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-secondary">
                {option.description}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

interface SettingsSegmentedControlProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SettingsSegmentedControl({
  name,
  value,
  onChange,
  options,
}: SettingsSegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="inline-flex w-full rounded-lg border border-line bg-surface-base p-1"
    >
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-core text-white"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
