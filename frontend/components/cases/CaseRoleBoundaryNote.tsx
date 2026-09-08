export function CaseRoleBoundaryNote() {
  return (
    <div className="rounded-lg border border-line bg-surface-base px-4 py-3">
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
        Your role on this case
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
        <li>You can add follow-up notes and trigger or reopen cases.</li>
        <li>Support team updates (lab, pharmacy) appear on this case when the doctor pages them.</li>
        <li>Marking a case fully resolved requires clinical sign-off — not available here.</li>
        <li>Medication orders and resource requests are handled by pharmacy and front desk once triggered.</li>
      </ul>
    </div>
  );
}
