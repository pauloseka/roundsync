"use client";

import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { NavLottieIcon } from "@/components/shell/NavLottieIcon";
import { useCases } from "@/components/cases/CasesStore";
import {
  getActionableTaskCount,
  getTaskBadgeVariant,
} from "@/lib/scheduled-tasks";
import { getUnreadMessageCount } from "@/lib/dashboard-data";
import {
  navBadgeClassName,
  nurseSettingsNav,
  nurseWorkNav,
  type NurseNavItem,
} from "@/lib/nurse-nav";

function PreviewNavLink({
  item,
  active,
  count,
  taskBadgeTone,
  caseBadgeUrgency,
}: {
  item: NurseNavItem;
  active: boolean;
  count: number;
  taskBadgeTone?: ReturnType<typeof getTaskBadgeVariant>;
  caseBadgeUrgency?: ReturnType<typeof useCases>["caseBadgeUrgency"];
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
        active
          ? "bg-brand-core-muted font-semibold text-brand-core"
          : "font-normal text-ink-secondary"
      }`}
    >
      <NavLottieIcon src={item.icon} active={active} label={item.label} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {count > 0 && item.badgeVariant ? (
        <span
          className={`min-w-5 shrink-0 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${navBadgeClassName(item.badgeVariant, {
            taskTone: taskBadgeTone,
            caseUrgency: caseBadgeUrgency,
          })}`}
        >
          {count}
        </span>
      ) : null}
    </div>
  );
}

export function PreviewAppNav() {
  const { activeCaseCount, caseBadgeUrgency, activeCasePatientIds } = useCases();

  const badges = {
    myTasks: getActionableTaskCount(),
    myTasksTone: getTaskBadgeVariant(),
    activeCases: activeCaseCount,
    activeCasesUrgency: caseBadgeUrgency,
    messages: getUnreadMessageCount(activeCasePatientIds),
  };

  return (
    <nav
      aria-hidden="true"
      className="flex w-60 shrink-0 flex-col border-r border-line bg-surface-card"
    >
      <div className="border-b border-line px-5 py-4">
        <RoundSyncLogo
          markClassName="size-7"
          textClassName="font-display text-lg font-semibold text-brand-core"
        />
        <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Nurse · Ward 4B
        </p>
      </div>

      <div className="flex flex-1 flex-col px-3 py-4">
        <p className="px-3 pb-2 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          Shift work
        </p>
        <ul className="space-y-1">
          {nurseWorkNav.map((item) => {
            const count = item.badge ? badges[item.badge] : 0;

            return (
              <li key={item.href}>
                <PreviewNavLink
                  item={item}
                  active={item.id === "dashboard"}
                  count={count}
                  taskBadgeTone={item.id === "tasks" ? badges.myTasksTone : undefined}
                  caseBadgeUrgency={item.id === "cases" ? badges.activeCasesUrgency : undefined}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto border-t border-line px-3 py-4">
        <PreviewNavLink item={nurseSettingsNav} active={false} count={0} />
      </div>
    </nav>
  );
}
