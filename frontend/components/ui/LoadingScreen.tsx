import { RoundSyncMark } from "@/components/brand/RoundSyncLogo";
import { loadingCopy } from "@/lib/loading-content";

export type LoadingScreenVariant = "full" | "embedded";

interface LoadingScreenProps {
  variant?: LoadingScreenVariant;
  message?: string;
  body?: string;
  slow?: boolean;
  offline?: boolean;
}

export function LoadingScreen({
  variant = "full",
  message = loadingCopy.default,
  body,
  slow = false,
  offline = false,
}: LoadingScreenProps) {
  const containerClassName =
    variant === "full"
      ? "flex min-h-screen w-full flex-col items-center justify-center bg-surface-base px-6"
      : "flex min-h-full w-full flex-col items-center justify-center bg-surface-base px-6 py-16";

  return (
    <div
      className={containerClassName}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={offline ? loadingCopy.offlineTitle : message}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-16 items-center justify-center">
          <span
            className="absolute inset-0 rounded-2xl border-2 border-brand-core/15 roundsync-loading-ring"
            aria-hidden="true"
          />
          <RoundSyncMark className="size-10 roundsync-loading-mark" />
        </div>

        <p className="mt-6 font-display text-lg font-semibold text-ink-primary">
          {offline ? loadingCopy.offlineTitle : message}
        </p>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
          {offline
            ? loadingCopy.offlineBody
            : slow
              ? loadingCopy.slowHint
              : body ?? loadingCopy.defaultBody}
        </p>

        {!offline ? (
          <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-brand-core roundsync-loading-dot" />
            <span className="size-1.5 rounded-full bg-brand-core roundsync-loading-dot roundsync-loading-dot--2" />
            <span className="size-1.5 rounded-full bg-brand-core roundsync-loading-dot roundsync-loading-dot--3" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PageLoadingFallback({
  variant = "full",
  message = loadingCopy.checkingAccess,
  body = loadingCopy.checkingAccessBody,
}: {
  variant?: LoadingScreenVariant;
  message?: string;
  body?: string;
}) {
  return <LoadingScreen variant={variant} message={message} body={body} />;
}
