"use client";

import { useMemo, useState } from "react";
import {
  signupFormStackClassName,
  signupInputClassName,
  signupSecondaryButtonClassName,
} from "@/components/signup/signup-form-styles";
import { signUpCopy } from "@/lib/signup-content";
import { getOrganizationWards, updateOrganizationWards } from "@/lib/signup-session";

const WARD_LIST_COLLAPSE_THRESHOLD = 4;

interface WardNamesSectionProps {
  onWardsChange?: (wards: string[]) => void;
}

export function WardNamesSection({ onWardsChange }: WardNamesSectionProps) {
  const copy = signUpCopy.adminSetup;
  const [wardNames, setWardNames] = useState(() => {
    const wards = getOrganizationWards();
    return wards.length > 0 ? wards : [""];
  });
  const [expanded, setExpanded] = useState(() => {
    const wards = getOrganizationWards();
    return wards.length < WARD_LIST_COLLAPSE_THRESHOLD;
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filledNames = useMemo(
    () => wardNames.map((name) => name.trim()).filter(Boolean),
    [wardNames],
  );

  const canCollapse = filledNames.length >= WARD_LIST_COLLAPSE_THRESHOLD;

  function persistWards(next: string[]) {
    setError(null);
    setSuccess(null);

    const result = updateOrganizationWards(next);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const saved = getOrganizationWards();
    setWardNames(saved);
    setSuccess(copy.wardsSaved);
    onWardsChange?.(saved);
  }

  function handleNameChange(index: number, value: string) {
    setWardNames((prev) => prev.map((name, i) => (i === index ? value : name)));
    setSuccess(null);
  }

  function handleNameBlur() {
    if (wardNames.some((name) => !name.trim())) return;
    persistWards(wardNames);
  }

  function handleAddWard() {
    setExpanded(true);
    setWardNames((prev) => [...prev, ""]);
    setSuccess(null);
    setError(null);
  }

  function handleRemoveWard(index: number) {
    if (wardNames.length <= 1) return;
    persistWards(wardNames.filter((_, i) => i !== index));
  }

  return (
    <section className="rounded-xl border border-line bg-surface-card p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold text-ink-primary">{copy.wardsSectionTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.wardsSectionBody}</p>
          {!expanded && filledNames.length > 0 ? (
            <p className="mt-3 text-sm text-ink-primary">
              <span className="font-medium">{filledNames.length} configured:</span>{" "}
              <span className="text-ink-secondary">{copy.wardsCollapsedSummary(filledNames)}</span>
            </p>
          ) : null}
        </div>

        {canCollapse ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            className="shrink-0 text-sm font-medium text-brand-core hover:underline"
          >
            {expanded ? copy.wardsCollapse : copy.wardsExpand(filledNames.length)}
          </button>
        ) : null}
      </div>

      {expanded ? (
        <>
          <div className={`mt-6 ${signupFormStackClassName}`}>
            {wardNames.map((name, index) => (
              <div key={`ward-${index}`} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor={`admin-ward-name-${index}`}
                    className="block text-sm font-medium text-ink-primary"
                  >
                    Ward / department {index + 1}
                  </label>
                  <input
                    id={`admin-ward-name-${index}`}
                    value={name}
                    onChange={(event) => handleNameChange(index, event.target.value)}
                    onBlur={handleNameBlur}
                    className={signupInputClassName}
                    placeholder="Surgical 4B, Emergency, ICU…"
                  />
                </div>
                {wardNames.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveWard(index)}
                    className="text-sm font-medium text-ink-secondary hover:text-critical sm:mb-2.5"
                  >
                    {copy.wardsRemove}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : null}

      {error ? (
        <p className={`text-sm text-critical ${expanded ? "mt-4" : "mt-3"}`} role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className={`text-sm text-brand-core ${expanded ? "mt-4" : "mt-3"}`} role="status">
          {success}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleAddWard}
        className={`${signupSecondaryButtonClassName} ${expanded ? "mt-6" : "mt-4"} max-w-xs`}
      >
        {copy.wardsAddCta}
      </button>
    </section>
  );
}
