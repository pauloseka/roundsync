"use client";

import { useState } from "react";
import type { EmergencyCase } from "@/lib/cases-types";

interface ReopenCaseFormProps {
  caseItem: EmergencyCase;
  onReopen: (triggerNote: string) => void;
}

export function ReopenCaseForm({ caseItem, onReopen }: ReopenCaseFormProps) {
  const [triggerNote, setTriggerNote] = useState("");
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-sm font-medium text-brand-core hover:underline"
      >
        Reopen case for {caseItem.patientName}
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!triggerNote.trim()) return;
        onReopen(triggerNote);
        setTriggerNote("");
        setExpanded(false);
      }}
      className="flex flex-col gap-3 rounded-lg border border-line bg-surface-base px-3 py-3"
    >
      <p className="text-sm font-medium text-ink-primary">
        Reopen {caseItem.patientName}&apos;s case
      </p>
      <textarea
        value={triggerNote}
        onChange={(event) => setTriggerNote(event.target.value)}
        rows={3}
        placeholder="Why is this case being reopened? e.g. patient relapsed"
        className="rounded-lg border border-line bg-surface-card px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-secondary focus:border-brand-core focus:outline-none"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-brand-core px-3 py-1.5 text-sm font-medium text-white"
        >
          Reopen case
        </button>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
