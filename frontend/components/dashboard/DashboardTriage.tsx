import { AdminInviteStaffBanner } from "@/components/signup/AdminInviteStaffBanner";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { ActiveCasesSnapshot } from "@/components/dashboard/ActiveCasesSnapshot";
import { FlaggedPatients } from "@/components/dashboard/FlaggedPatients";
import { ShiftHandoffBanner, ShiftHandoffPanel } from "@/components/handoff/ShiftHandoffPanel";
import { ShiftContextBar } from "@/components/dashboard/ShiftContextBar";
import { TasksDueSoon } from "@/components/dashboard/TasksDueSoon";
import { UnreadMessagesPreview } from "@/components/dashboard/UnreadMessagesPreview";
import { shiftContext } from "@/lib/mock-data";

export function DashboardTriage() {
  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
          Dashboard
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
          Your shift at a glance
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
          Cases, tasks, messages, and early warnings — previews to orient you. Open the nav for the full view.
        </p>
      </header>

      <ShiftContextBar shift={shiftContext} />

      <TrialBanner />

      <AdminInviteStaffBanner />

      <ShiftHandoffBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <ShiftHandoffPanel />
          <ActiveCasesSnapshot />
          <UnreadMessagesPreview />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <TasksDueSoon />
          <FlaggedPatients />
        </div>
      </div>
    </div>
  );
}
