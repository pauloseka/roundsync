"use client";

import { useState } from "react";

interface AddCaseNoteFormProps {
  onSubmit: (note: string) => void;
}

export function AddCaseNoteForm({ onSubmit }: AddCaseNoteFormProps) {
  const [note, setNote] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;
    onSubmit(note);
    setNote("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Add follow-up note
        </span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder='e.g. "Vitals stabilizing" or "Still no response from doctor"'
          className="rounded-lg border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-secondary focus:border-brand-core focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={!note.trim()}
        className="self-start rounded-lg bg-brand-core px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add note
      </button>
    </form>
  );
}
