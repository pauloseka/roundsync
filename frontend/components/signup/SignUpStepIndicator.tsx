import { signupSteps, type SignupStepId } from "@/lib/signup-routes";

interface SignUpStepIndicatorProps {
  currentStep: SignupStepId;
}

export function SignUpStepIndicator({ currentStep }: SignUpStepIndicatorProps) {
  const currentIndex = signupSteps.findIndex((step) => step.id === currentStep);

  return (
    <ol className="flex items-center gap-0" aria-label="Sign-up progress">
      {signupSteps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                  isCurrent
                    ? "bg-brand-core text-white"
                    : isComplete
                      ? "bg-brand-core-muted text-brand-core"
                      : "border border-line bg-surface-base text-ink-secondary/60"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {index + 1}
              </span>
              <span
                className={`hidden text-center font-mono text-[11px] font-medium uppercase tracking-wider sm:block sm:text-left ${
                  isCurrent
                    ? "text-brand-core"
                    : isComplete
                      ? "text-ink-secondary"
                      : "text-ink-secondary/50"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < signupSteps.length - 1 ? (
              <div
                className={`mx-2 hidden h-px flex-1 sm:mx-4 sm:block ${
                  isComplete ? "bg-brand-core/40" : "bg-line"
                }`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
