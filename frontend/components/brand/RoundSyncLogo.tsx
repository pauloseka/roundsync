interface RoundSyncMarkProps {
  className?: string;
  variant?: "default" | "light";
}

export function RoundSyncMark({
  className = "size-8",
  variant = "default",
}: RoundSyncMarkProps) {
  const isLight = variant === "light";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {!isLight ? (
        <rect width="32" height="32" rx="8" className="fill-brand-core" />
      ) : null}
      <path
        d="M16 8.5a7.5 7.5 0 0 0-5.3 2.2l1.1 1.1A6 6 0 1 1 10 16H8.5a7.5 7.5 0 1 0 7.5-7.5Z"
        className="fill-white"
      />
      <path
        d="M22.8 11.7a6 6 0 0 1 .7 2.8c0 3.3-2.7 6-6 6h-.5v-1.5h.5a4.5 4.5 0 0 0 4.5-4.5c0-.8-.2-1.5-.5-2.2l1.3-1.1Z"
        className="fill-white"
      />
      <circle cx="16" cy="16" r="2" className="fill-white" />
    </svg>
  );
}

interface RoundSyncLogoProps {
  showText?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  variant?: "default" | "light";
}

export function RoundSyncLogo({
  showText = true,
  className = "",
  markClassName = "size-8",
  textClassName = "font-display text-xl font-semibold text-brand-core",
  variant = "default",
}: RoundSyncLogoProps) {
  const lightText =
    variant === "light"
      ? "font-display text-xl font-semibold text-white"
      : textClassName;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <RoundSyncMark className={markClassName} variant={variant} />
      {showText ? (
        <span className={variant === "light" ? lightText : textClassName}>
          RoundSync
        </span>
      ) : null}
    </span>
  );
}
