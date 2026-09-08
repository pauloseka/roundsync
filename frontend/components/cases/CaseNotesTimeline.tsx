import { formatMessageAgo } from "@/lib/dashboard-data";
import type { CaseNote } from "@/lib/cases-types";

interface CaseNotesTimelineProps {
  notes: CaseNote[];
}

export function CaseNotesTimeline({ notes }: CaseNotesTimelineProps) {
  if (notes.length === 0) {
    return <p className="text-sm text-ink-secondary">No follow-up notes yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="rounded-lg border border-line bg-surface-base px-3 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink-primary">{note.authorName}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-secondary">{note.authorRole}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-ink-secondary">
              {formatMessageAgo(note.createdMinutesAgo)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{note.note}</p>
        </li>
      ))}
    </ul>
  );
}
