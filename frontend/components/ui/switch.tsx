"use client";

import { cn } from "@/lib/design-system/cn";

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
}

export function Switch({ id, checked, onChange, disabled = false, label, hint }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || hint) && (
        <div className="min-w-0">
          {label ? (
            <label htmlFor={id} className="block text-sm font-medium text-ink-primary">
              {label}
            </label>
          ) : null}
          {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{hint}</p> : null}
        </div>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 rs-focus-ring",
          checked ? "bg-brand-core" : "bg-line",
        )}
      >
        <span
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-secondary">{label}</span>
        <div className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
}

const stackGaps = { sm: "space-y-3", md: "space-y-6", lg: "space-y-8" };

export function Stack({ gap = "md", className, ...props }: StackProps) {
  return <div className={cn(stackGaps[gap], className)} {...props} />;
}
