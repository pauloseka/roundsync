"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { messagesCopy } from "@/lib/content/copy";
import { insertTextAtCursor } from "@/lib/message-compose";
import type { MessageIndividual } from "@/lib/messages-types";

interface MentionPickerProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  onBodyChange: (value: string) => void;
  individuals: MessageIndividual[];
  disabled?: boolean;
}

export function MentionPicker({
  textareaRef,
  body,
  onBodyChange,
  individuals,
  disabled = false,
}: MentionPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const copy = messagesCopy.compose;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function insertMention(individual: MessageIndividual) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const mention = `@${individual.name} `;
    const { nextValue, cursorPosition } = insertTextAtCursor(textarea, body, mention);
    onBodyChange(nextValue);
    setOpen(false);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        className="inline-flex size-9 items-center justify-center rounded-md border border-line bg-surface-base text-sm font-semibold text-brand-core transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-60"
        title={copy.mentionLabel}
      >
        @
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute bottom-full left-0 z-20 mb-2 w-56 overflow-hidden rounded-lg border border-line bg-surface-card shadow-lg"
        >
          <p className="border-b border-line px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
            {copy.mentionHeading}
          </p>
          <ul className="max-h-48 overflow-y-auto py-1">
            {individuals.map((individual) => (
              <li key={individual.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => insertMention(individual)}
                  className="flex w-full flex-col px-3 py-2 text-left transition-colors hover:bg-brand-core-muted/30"
                >
                  <span className="text-sm font-medium text-ink-primary">{individual.name}</span>
                  <span className="text-xs text-ink-secondary">{individual.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
