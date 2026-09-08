"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignUpShell } from "@/components/signup/SignUpShell";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupPrimaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { useSignUpGuard } from "@/components/signup/useSignUpGuard";
import { PageLoadingFallback } from "@/components/ui/LoadingScreen";
import { signUpCopy } from "@/lib/signup-content";
import { SUBSCRIPTION_HREF } from "@/lib/signup-routes";
import { buildDefaultWardNames, saveSignUpOrganization } from "@/lib/signup-session";

function resizeWardNames(current: string[], count: number): string[] {
  if (count <= 0) return [];
  if (current.length === count) return current;

  const defaults = buildDefaultWardNames(count);
  if (current.length < count) {
    return Array.from({ length: count }, (_, index) => current[index] ?? defaults[index]);
  }

  return current.slice(0, count);
}

export function SignUpOrganizationStep() {
  const router = useRouter();
  const ready = useSignUpGuard("organization");
  const copy = signUpCopy.organization;
  const [hospitalName, setHospitalName] = useState("");
  const [staffExpected, setStaffExpected] = useState("50");
  const [wardCount, setWardCount] = useState("4");
  const [wardNames, setWardNames] = useState<string[]>(() => buildDefaultWardNames(4));
  const [multiLocation, setMultiLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleWardCountChange(value: string) {
    setWardCount(value);
    const count = Number(value);
    if (!Number.isFinite(count) || count < 1) return;
    setWardNames((prev) => resizeWardNames(prev, count));
  }

  if (!ready) return <PageLoadingFallback />;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const staff = Number(staffExpected);
    const wards = Number(wardCount);

    if (!hospitalName.trim()) {
      setError("Enter your hospital or organisation name.");
      setSubmitting(false);
      return;
    }

    if (!Number.isFinite(staff) || staff < 1 || !Number.isFinite(wards) || wards < 1) {
      setError("Enter valid staff and ward counts.");
      setSubmitting(false);
      return;
    }

    const trimmedNames = wardNames.map((name) => name.trim());
    if (trimmedNames.some((name) => !name)) {
      setError("Name each ward or department — use your hospital's existing labels.");
      setSubmitting(false);
      return;
    }

    saveSignUpOrganization({
      hospitalName: hospitalName.trim(),
      staffExpected: staff,
      wardCount: wards,
      wardNames: trimmedNames,
      multiLocation,
    });

    setSubmitting(false);
    router.push(SUBSCRIPTION_HREF);
  }

  function handleWardNameChange(index: number, value: string) {
    setWardNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  }

  return (
    <SignUpShell
      step="organization"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      wide
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className={signupFormStackClassName}>
          <div>
            <label htmlFor="signup-hospital" className="block text-sm font-medium text-ink-primary">
              {copy.hospitalLabel}
            </label>
            <input
              id="signup-hospital"
              value={hospitalName}
              onChange={(event) => setHospitalName(event.target.value)}
              className={signupInputClassName}
              placeholder="City General Hospital"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="signup-staff" className="block text-sm font-medium text-ink-primary">
                {copy.staffLabel}
              </label>
              <input
                id="signup-staff"
                type="number"
                min={1}
                value={staffExpected}
                onChange={(event) => setStaffExpected(event.target.value)}
                className={signupInputClassName}
                required
              />
              <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{copy.staffHint}</p>
            </div>
            <div>
              <label htmlFor="signup-wards" className="block text-sm font-medium text-ink-primary">
                {copy.wardsLabel}
              </label>
              <input
                id="signup-wards"
                type="number"
                min={1}
                value={wardCount}
                onChange={(event) => handleWardCountChange(event.target.value)}
                className={signupInputClassName}
                required
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-primary">{copy.wardNamesLabel}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{copy.wardNamesHint}</p>
            <div className="mt-4 space-y-4">
              {wardNames.map((name, index) => (
                <div key={`signup-ward-${index}`}>
                  <label
                    htmlFor={`signup-ward-name-${index}`}
                    className="block text-sm font-medium text-ink-primary"
                  >
                    Ward / department {index + 1}
                  </label>
                  <input
                    id={`signup-ward-name-${index}`}
                    value={name}
                    onChange={(event) => handleWardNameChange(index, event.target.value)}
                    className={signupInputClassName}
                    placeholder={copy.wardNamePlaceholder}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={multiLocation}
              onChange={(event) => setMultiLocation(event.target.checked)}
              className="mt-0.5 size-4 rounded border-line text-brand-core focus:ring-brand-core"
            />
            <span className="text-sm leading-relaxed text-ink-secondary">
              {copy.multiLocationLabel}
            </span>
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-critical" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={`${signupPrimaryButtonClassName} mt-8`}
        >
          {submitting ? "Saving…" : copy.cta}
        </button>
      </form>
    </SignUpShell>
  );
}
