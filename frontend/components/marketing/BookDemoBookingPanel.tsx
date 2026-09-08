"use client";

import Link from "next/link";
import { useState } from "react";
import { BookDemoFollowUpForm } from "@/components/marketing/BookDemoFollowUpForm";
import { BookDemoManualForm } from "@/components/marketing/BookDemoManualForm";
import { DemoSlotPicker } from "@/components/marketing/DemoSlotPicker";
import type { BookDemoMode } from "@/lib/book-demo-config";
import type { DemoSlotSelection } from "@/lib/demo-scheduling";
import { formatDemoSlotSummary } from "@/lib/demo-scheduling";
import { DemoBookingRulesPanel } from "@/components/marketing/DemoBookingRulesPanel";
import { bookDemoPanelCopy } from "@/lib/book-demo-content";
import { cn } from "@/lib/design-system/cn";

type CalendarStep = "schedule" | "follow-up" | "done";
type ManualStep = "form" | "done";

export function BookDemoBookingPanel() {
  const copy = bookDemoPanelCopy;
  const [mode, setMode] = useState<BookDemoMode>("calendar");
  const [calendarStep, setCalendarStep] = useState<CalendarStep>("schedule");
  const [manualStep, setManualStep] = useState<ManualStep>("form");
  const [booking, setBooking] = useState<DemoSlotSelection | null>(null);
  const [confirmedSummary, setConfirmedSummary] = useState("");

  function resetCalendarFlow() {
    setCalendarStep("schedule");
    setBooking(null);
  }

  function switchMode(next: BookDemoMode) {
    setMode(next);
    if (next === "calendar") {
      setManualStep("form");
      setConfirmedSummary("");
    } else {
      resetCalendarFlow();
    }
  }

  if (mode === "calendar" && calendarStep === "done") {
    return (
      <SuccessState
        title={copy.calendarSuccessTitle}
        body={copy.calendarSuccessBody(confirmedSummary || "your selected time")}
      />
    );
  }

  if (mode === "manual" && manualStep === "done") {
    return (
      <SuccessState
        title={copy.manualSuccessTitle}
        body={copy.manualSuccessBody}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-card shadow-[0_20px_60px_-20px_rgba(26,29,35,0.15)]">
      <div className="border-b border-line bg-[linear-gradient(135deg,rgba(43,95,107,0.08),rgba(247,248,250,0.9))] px-4 py-4 md:px-6 md:py-5">
        <div className="grid w-full grid-cols-2 gap-2">
          <ModeButton
            active={mode === "calendar"}
            title={copy.modeCalendarTitle}
            hint={copy.modeCalendarHint}
            onClick={() => switchMode("calendar")}
          />
          <ModeButton
            active={mode === "manual"}
            title={copy.modeManualTitle}
            hint={copy.modeManualHint}
            onClick={() => switchMode("manual")}
          />
        </div>
        <p className="mt-2 text-center text-xs leading-relaxed text-ink-secondary sm:hidden">
          {mode === "calendar" ? copy.modeCalendarHint : copy.modeManualHint}
        </p>
      </div>

      <div className="p-4 md:p-6">
        {mode === "calendar" ? (
          calendarStep === "schedule" ? (
            <div className="space-y-4">
              <StepHeading label={copy.calendarStepLabel} />
              <div className="lg:hidden">
                <DemoBookingRulesPanel compact />
              </div>
              <DemoSlotPicker
                timeLayout="scroll"
                confirmLabel={copy.slotContinue}
                initialSelection={booking}
                onConfirm={(selection) => {
                  setBooking(selection);
                  setCalendarStep("follow-up");
                }}
              />
              <p className="text-center text-xs leading-relaxed text-ink-secondary">
                After you pick a slot, we&apos;ll ask a few quick prep questions — ward size,
                colleagues to invite, and anything we should know.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <StepHeading label={copy.followUpStepLabel} />
                <h2 className="mt-2 font-display text-lg font-semibold text-ink-primary sm:text-xl">
                  {copy.followUpTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {copy.followUpSubtitle}
                </p>
              </div>
              {booking ? (
                <BookDemoFollowUpForm
                  booking={booking}
                  onSubmit={() => {
                    setConfirmedSummary(formatDemoSlotSummary(booking));
                    setCalendarStep("done");
                  }}
                />
              ) : null}
              <button
                type="button"
                onClick={() => setCalendarStep("schedule")}
                className="inline-flex h-11 w-full touch-manipulation items-center justify-center rounded-md border border-line bg-surface-base text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-brand-core sm:hover:underline"
              >
                ← Back to calendar
              </button>
            </div>
          )
        ) : (
          <div className="space-y-5">
            <div>
              <StepHeading label={copy.manualStepLabel} />
              <h2 className="mt-2 font-display text-lg font-semibold text-ink-primary sm:text-xl">
                {copy.manualTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {copy.manualSubtitle}
              </p>
            </div>
            <BookDemoManualForm onSubmit={() => setManualStep("done")} />
          </div>
        )}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  title,
  hint,
  onClick,
}: {
  active: boolean;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full min-w-0 rounded-xl border px-3 py-2.5 text-left transition-colors touch-manipulation sm:px-4 sm:py-3",
        active
          ? "border-brand-core bg-surface-card shadow-sm"
          : "border-line/80 bg-surface-card/70 hover:border-line hover:bg-surface-card",
      )}
    >
      <span
        className={cn(
          "block text-sm font-semibold",
          active ? "text-brand-core" : "text-ink-primary",
        )}
      >
        {title}
      </span>
      <span className="mt-1 hidden text-xs leading-relaxed text-ink-secondary sm:block">
        {hint}
      </span>
    </button>
  );
}

function StepHeading({ label }: { label: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
      {label}
    </p>
  );
}

function SuccessState({ title, body }: { title: string; body: string }) {
  const copy = bookDemoPanelCopy;

  return (
    <div className="rounded-2xl border border-line bg-surface-card p-6 text-center md:p-10">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-core-muted">
        <span className="text-lg text-brand-core" aria-hidden="true">
          ✓
        </span>
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold text-ink-primary">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-secondary md:text-base">
        {body}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
      >
        {copy.backHome}
      </Link>
    </div>
  );
}
