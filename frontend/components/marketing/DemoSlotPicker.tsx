"use client";

import { useMemo, useState } from "react";
import {
  buildCalendarMonth,
  buildDemoSlotSelection,
  defaultDemoTimezone,
  formatDemoSlotSummary,
  getSlotsForDate,
  listTimezoneOptions,
  parseDateKey,
  startOfMonth,
  type DemoDateStatus,
  type DemoSlotBlockReason,
  type DemoSlotSelection,
  type DemoSlotTime,
} from "@/lib/demo-scheduling";
import { bookDemoPanelCopy } from "@/lib/book-demo-content";
import { DemoBookingRulesPanel } from "@/components/marketing/DemoBookingRulesPanel";
import { cn } from "@/lib/design-system/cn";
import { inputClassName } from "@/lib/design-system/variants";

const WEEKDAY_LABELS = [
  { short: "M", long: "Mon" },
  { short: "T", long: "Tue" },
  { short: "W", long: "Wed" },
  { short: "T", long: "Thu" },
  { short: "F", long: "Fri" },
  { short: "S", long: "Sat" },
  { short: "S", long: "Sun" },
] as const;

interface DemoSlotPickerProps {
  onConfirm: (selection: DemoSlotSelection) => void;
  onSelectionChange?: (selection: DemoSlotSelection | null) => void;
  confirmLabel?: string;
  showConfirmButton?: boolean;
  initialTimezone?: string;
  initialSelection?: DemoSlotSelection | null;
  size?: "default" | "large";
  timeLayout?: "grid" | "scroll";
  showRules?: boolean;
}

export function DemoSlotPicker({
  onConfirm,
  onSelectionChange,
  confirmLabel = "Continue",
  showConfirmButton = true,
  initialTimezone,
  initialSelection = null,
  size = "default",
  timeLayout = "grid",
  showRules = false,
}: DemoSlotPickerProps) {
  const copy = bookDemoPanelCopy;
  const isLarge = size === "large";
  const [now] = useState(() => new Date());
  const [timezone, setTimezone] = useState(
    initialTimezone ?? initialSelection?.timezone ?? defaultDemoTimezone(),
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    initialSelection
      ? startOfMonth(parseDateKey(initialSelection.dateKey))
      : startOfMonth(new Date()),
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    initialSelection?.dateKey ?? null,
  );
  const [selectedTime, setSelectedTime] = useState<DemoSlotTime | null>(
    initialSelection?.time ?? null,
  );
  const [feedback, setFeedback] = useState<{ tone: "info" | "error"; message: string } | null>(
    null,
  );

  const timezoneOptions = useMemo(() => listTimezoneOptions(now), [now]);
  const calendarDays = useMemo(
    () => buildCalendarMonth(visibleMonth, timezone, now),
    [visibleMonth, timezone, now],
  );

  const slots = useMemo(() => {
    if (!selectedDateKey) return [];
    return getSlotsForDate(selectedDateKey, timezone, now);
  }, [selectedDateKey, timezone, now]);

  const selection =
    selectedDateKey && selectedTime
      ? buildDemoSlotSelection(selectedDateKey, selectedTime, timezone)
      : null;

  const activeTimezone = timezoneOptions.find((option) => option.id === timezone);

  function notifySelection(nextDateKey: string | null, nextTime: DemoSlotTime | null, tz = timezone) {
    if (nextDateKey && nextTime) {
      onSelectionChange?.(buildDemoSlotSelection(nextDateKey, nextTime, tz));
      return;
    }
    onSelectionChange?.(null);
  }

  function handleTimezoneChange(nextTimezone: string) {
    setTimezone(nextTimezone);
    setSelectedDateKey(null);
    setSelectedTime(null);
    setFeedback(null);
    onSelectionChange?.(null);
  }

  function handleSelectDate(dateKey: string, status: DemoDateStatus) {
    if (status !== "available") {
      setFeedback({ tone: "error", message: copy.dateStatusMessage(status) });
      return;
    }

    setFeedback(null);
    setSelectedDateKey(dateKey);
    setSelectedTime(null);
    onSelectionChange?.(null);
  }

  function handleSelectTime(time: DemoSlotTime, available: boolean, reason?: DemoSlotBlockReason) {
    if (!available) {
      setFeedback({
        tone: "error",
        message: reason ? copy.slotStatusMessage(reason) : copy.slotBooked,
      });
      return;
    }

    setFeedback(null);
    setSelectedTime(time);
    if (selectedDateKey) {
      notifySelection(selectedDateKey, time);
    }
  }

  function shiftMonth(delta: number) {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  }

  function handleConfirm() {
    if (!selection) return;
    onConfirm(selection);
  }

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  return (
    <div className={cn("w-full space-y-4 sm:space-y-5", isLarge && "sm:space-y-6", selection && "pb-2 sm:pb-0")}>
      {showRules ? <DemoBookingRulesPanel /> : null}

      {feedback ? (
        <div
          role="alert"
          className={cn(
            "rounded-lg border px-4 py-3 text-sm",
            feedback.tone === "error"
              ? "border-danger/30 bg-danger-muted text-danger"
              : "border-line bg-surface-base text-ink-secondary",
          )}
        >
          {feedback.message}
        </div>
      ) : null}

      <div
        className={cn(
          "rounded-xl border border-line bg-surface-base",
          isLarge ? "p-4 md:p-5" : "p-3 md:p-4",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className={cn(
              "inline-flex items-center justify-center rounded-md border border-line text-ink-secondary transition-colors hover:bg-surface-card hover:text-ink-primary",
              isLarge ? "size-9 text-sm" : "size-8 text-sm",
            )}
            aria-label="Previous month"
          >
            ←
          </button>
          <p className={cn("font-display font-semibold text-ink-primary", isLarge ? "text-lg" : "text-base")}>
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className={cn(
              "inline-flex items-center justify-center rounded-md border border-line text-ink-secondary transition-colors hover:bg-surface-card hover:text-ink-primary",
              isLarge ? "size-9 text-sm" : "size-8 text-sm",
            )}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div
          className={cn(
            "mt-4 grid grid-cols-7 gap-0.5 text-center font-mono uppercase tracking-wide text-ink-secondary sm:gap-1",
            isLarge ? "text-xs" : "text-[10px] sm:text-[11px]",
          )}
        >
          {WEEKDAY_LABELS.map((label) => (
            <span key={label.long}>
              <span className="sm:hidden">{label.short}</span>
              <span className="hidden sm:inline">{label.long}</span>
            </span>
          ))}
        </div>

        <div className={cn("mt-2 grid grid-cols-7 gap-0.5 sm:gap-1", isLarge && "sm:gap-1.5")}>
          {calendarDays.map((day) => {
            const isSelected = day.dateKey === selectedDateKey;
            const isUnavailableFuture =
              day.inMonth &&
              day.status !== "available" &&
              day.status !== "past" &&
              day.status !== "outside_horizon";

            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => day.inMonth && handleSelectDate(day.dateKey, day.status)}
                className={cn(
                  "relative flex aspect-square w-full touch-manipulation items-center justify-center rounded-md transition-colors",
                  isLarge ? "text-sm sm:h-9" : "text-xs sm:h-8 sm:text-sm",
                  !day.inMonth && "pointer-events-none opacity-0",
                  day.inMonth && day.status === "past" && "cursor-default text-ink-tertiary/70",
                  day.inMonth &&
                    day.status === "outside_horizon" &&
                    "cursor-default text-ink-tertiary/50",
                  isUnavailableFuture &&
                    "cursor-pointer font-medium text-ink-tertiary line-through decoration-ink-tertiary hover:bg-surface-card",
                  day.isSelectable &&
                    "border border-transparent font-semibold text-ink-primary hover:border-brand-core/30 hover:bg-brand-core-muted/30",
                  isSelected && "border-brand-core bg-brand-core text-white decoration-transparent hover:bg-brand-core",
                  day.isToday && !isSelected && "ring-1 ring-brand-core/40",
                )}
                aria-label={
                  day.inMonth
                    ? `${parseDateKey(day.dateKey).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })} — ${day.status.replace("_", " ")}`
                    : undefined
                }
              >
                {day.day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs text-ink-secondary sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <LegendDot className="bg-brand-core" label="Available" />
          <LegendDot
            className="border border-line bg-surface-card line-through decoration-ink-tertiary"
            label="Unavailable"
          />
          <span className="leading-relaxed">{copy.minLeadTimeHint}</span>
        </div>
      </div>

      <div>
        <label htmlFor="demo-timezone" className="block text-sm font-medium text-ink-primary">
          Timezone
        </label>
        <p className="mt-1 text-xs text-ink-secondary">
          All times below use the UTC offset you select.
        </p>
        <select
          id="demo-timezone"
          value={timezone}
          onChange={(event) => handleTimezoneChange(event.target.value)}
          className={cn(inputClassName, "mt-2 font-mono text-base sm:text-sm")}
        >
          {timezoneOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.offset} · {option.city}
            </option>
          ))}
        </select>
        {activeTimezone ? (
          <p className="mt-2 hidden font-mono text-xs text-brand-core sm:block">
            Selected: {activeTimezone.offset} ({activeTimezone.city})
          </p>
        ) : null}
      </div>

      {selectedDateKey ? (
        <div>
          <p className={cn("font-medium text-ink-primary", isLarge ? "text-base" : "text-sm")}>
            Available times
          </p>
          <p className="mt-1 text-xs text-ink-secondary">
            {parseDateKey(selectedDateKey).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            · {activeTimezone?.offset}
          </p>
          <DemoTimeSlotList
            slots={slots}
            selectedTime={selectedTime}
            layout={timeLayout}
            isLarge={isLarge}
            onSelect={handleSelectTime}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-line px-4 py-3 text-sm text-ink-secondary">
          {copy.selectDateHint}
        </p>
      )}

      {selection ? (
        <div className="hidden rounded-lg border border-brand-core/25 bg-brand-core-muted/40 px-4 py-3 sm:block">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            Selected slot
          </p>
          <p className="mt-1 text-sm font-medium text-ink-primary">
            {formatDemoSlotSummary(selection)}
          </p>
        </div>
      ) : null}

      {showConfirmButton ? (
        <div
          className={cn(
            selection &&
              "sticky bottom-0 z-10 -mx-4 space-y-2 border-t border-line bg-surface-card/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:static sm:mx-0 sm:space-y-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pb-0 sm:backdrop-blur-none",
          )}
        >
          {selection ? (
            <p className="text-center text-xs font-medium text-ink-primary sm:hidden">
              {formatDemoSlotSummary(selection)}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!selection}
            onClick={handleConfirm}
            className="inline-flex h-11 w-full touch-manipulation items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DemoTimeSlotList({
  slots,
  selectedTime,
  layout,
  isLarge,
  onSelect,
}: {
  slots: ReturnType<typeof getSlotsForDate>;
  selectedTime: DemoSlotTime | null;
  layout: "grid" | "scroll";
  isLarge: boolean;
  onSelect: (time: DemoSlotTime, available: boolean, reason?: DemoSlotBlockReason) => void;
}) {
  const slotButtonClassName = (
    slot: ReturnType<typeof getSlotsForDate>[number],
    isSelected: boolean,
    compact?: boolean,
  ) =>
    cn(
      "touch-manipulation rounded-md border font-mono transition-colors",
      compact ? "px-3 py-3 text-sm" : isLarge ? "px-3 py-3 text-sm" : "px-2 py-2 text-sm",
      slot.available &&
        !isSelected &&
        "border-line bg-surface-base text-ink-primary hover:border-brand-core/40 hover:bg-brand-core-muted/20",
      !slot.available &&
        "cursor-pointer border-line/70 bg-surface-base/60 text-ink-tertiary line-through decoration-ink-tertiary hover:bg-surface-card",
      isSelected && "border-brand-core bg-brand-core text-white decoration-transparent",
    );

  if (layout === "scroll") {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
          {slots.map((slot) => {
            const isSelected = slot.time === selectedTime;

            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => onSelect(slot.time, slot.available, slot.reason)}
                className={slotButtonClassName(slot, isSelected, true)}
              >
                {slot.time}
              </button>
            );
          })}
        </div>

        <div className="relative mt-3 hidden sm:block">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 rounded-t-lg bg-gradient-to-b from-surface-base to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 rounded-b-lg bg-gradient-to-t from-surface-base to-transparent"
            aria-hidden="true"
          />
          <div
            className={cn(
              "max-h-64 overflow-y-auto rounded-lg border border-line bg-surface-base py-2",
              "scroll-smooth snap-y snap-mandatory [scrollbar-width:thin]",
            )}
            role="listbox"
            aria-label="Available times"
          >
            {slots.map((slot) => {
              const isSelected = slot.time === selectedTime;

              return (
                <button
                  key={slot.time}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(slot.time, slot.available, slot.reason)}
                  className={cn(
                    "mx-2 flex w-[calc(100%-1rem)] snap-center touch-manipulation items-center justify-between rounded-md border px-4 py-3 font-mono text-sm transition-colors",
                    slot.available &&
                      !isSelected &&
                      "border-transparent bg-transparent text-ink-primary hover:border-brand-core/30 hover:bg-brand-core-muted/25",
                    !slot.available &&
                      "cursor-pointer border-transparent text-ink-tertiary line-through decoration-ink-tertiary hover:bg-surface-card",
                    isSelected &&
                      "border-brand-core bg-brand-core text-white decoration-transparent",
                  )}
                >
                  <span>{slot.time}</span>
                  {!slot.available ? (
                    <span className="font-sans text-[11px] font-normal opacity-80">
                      {slot.reason === "too_soon" ? "Too soon" : "Booked"}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "mt-3 grid gap-2",
        isLarge ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-5" : "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;

        return (
          <button
            key={slot.time}
            type="button"
            onClick={() => onSelect(slot.time, slot.available, slot.reason)}
            className={slotButtonClassName(slot, isSelected)}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2.5 rounded-full", className)} aria-hidden="true" />
      {label}
    </span>
  );
}
