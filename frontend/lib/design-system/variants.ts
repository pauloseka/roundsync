import { cn } from "@/lib/design-system/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 rs-focus-ring";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-core text-white hover:bg-brand-core/90",
  secondary: "border border-line bg-surface-base text-ink-primary hover:bg-surface-card",
  ghost: "text-ink-secondary hover:bg-surface-base hover:text-ink-primary",
  destructive: "bg-danger text-white hover:bg-danger/90",
  link: "h-auto p-0 text-brand-core underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm font-semibold",
  lg: "h-12 px-5 text-sm font-semibold",
};

export function buttonClassName(options: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  const { variant = "primary", size = "md", fullWidth = false, className } = options;
  return cn(
    base,
    variants[variant],
    variant === "link" ? "" : sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export const inputClassName = cn(
  "w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary",
  "outline-none transition-colors placeholder:text-ink-secondary/60",
  "focus:border-brand-core focus:ring-1 focus:ring-brand-core",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

export const inputLgClassName = cn(inputClassName, "mt-2 px-3.5 py-3");

export const labelClassName = "block text-sm font-medium text-ink-primary";

export const hintClassName = "mt-1 text-xs leading-relaxed text-ink-secondary";

export const errorClassName = "mt-1.5 text-sm text-critical";

export const formStackClassName = "space-y-6";

/** Standard page padding inside the ward/admin app shell. */
export const appShellPageClassName =
  "flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7";

export const appShellInsetClassName = "px-4 py-4 sm:px-6 sm:py-6";

export type CardVariant = "default" | "raised" | "inset" | "interactive";

const cardVariants: Record<CardVariant, string> = {
  default: "rounded-xl border border-line bg-surface-card",
  raised: "rounded-xl border border-line bg-surface-card shadow-sm",
  inset: "rounded-lg border border-line bg-surface-base",
  interactive:
    "rounded-xl border border-line bg-surface-card transition-colors hover:border-brand-core/20 hover:bg-surface-base",
};

export function cardClassName(options: { variant?: CardVariant; className?: string }) {
  return cn(cardVariants[options.variant ?? "default"], options.className);
}

export type BadgeTone =
  | "neutral"
  | "brand"
  | "critical"
  | "urgent"
  | "moderate"
  | "resolved"
  | "info"
  | "warning"
  | "danger";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-base text-ink-secondary ring-1 ring-line",
  brand: "bg-brand-core-muted text-brand-core",
  critical: "bg-critical-muted text-critical",
  urgent: "bg-urgent-muted text-urgent",
  moderate: "bg-moderate-muted text-moderate",
  resolved: "bg-resolved-muted text-resolved",
  info: "bg-info-muted text-info",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
};

export function badgeClassName(tone: BadgeTone = "neutral") {
  return cn(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
    badgeTones[tone],
  );
}

export const eyebrowClassName =
  "font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary";

export const sectionTitleClassName = "font-display text-lg font-semibold text-ink-primary";

export const sectionBodyClassName = "mt-2 text-sm leading-relaxed text-ink-secondary";

export const panelPadding = "p-5 md:p-6 lg:p-8";

export const pageHeaderClassName = "max-w-3xl";

export const pageTitleClassName = "mt-1 font-display text-2xl font-semibold text-ink-primary md:text-3xl";

export const pageSubtitleClassName = "mt-2 text-sm leading-relaxed text-ink-secondary md:text-base";

/** Backward-compatible exports (replaces signup-form-styles) */
export const signupInputClassName = inputLgClassName;
export const signupFormStackClassName = formStackClassName;
export const signupPrimaryButtonClassName = buttonClassName({ variant: "primary", fullWidth: true });
export const signupSecondaryButtonClassName = buttonClassName({
  variant: "secondary",
  fullWidth: true,
});
