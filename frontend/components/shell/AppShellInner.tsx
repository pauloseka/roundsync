"use client";

import { usePathname } from "next/navigation";
import { AdminAppNav } from "@/components/shell/AdminAppNav";
import { AdminTabletGuard } from "@/components/shell/AdminTabletGuard";
import { AdminTopBar } from "@/components/shell/AdminTopBar";
import { AppNav } from "@/components/shell/AppNav";
import { MobileAdminHeader } from "@/components/shell/MobileAdminHeader";
import { MobileWardHeader } from "@/components/shell/MobileWardHeader";
import { MobileWardNav } from "@/components/shell/MobileWardNav";
import { TopBar } from "@/components/shell/TopBar";
import { useCases } from "@/components/cases/CasesStore";
import { useMessages } from "@/components/messages/MessagesStore";
import { getActiveShiftContext } from "@/lib/admin-staff";
import { isAdminShellRoute, isAdminDashboardRoute } from "@/lib/admin-nav";
import {
  getActionableTaskCount,
  getTaskBadgeVariant,
} from "@/lib/scheduled-tasks";
import { useIsTabletUp } from "@/lib/hooks/useMediaQuery";
import { isCurrentUserOrgAdmin } from "@/lib/signup-session";
import { cn } from "@/lib/design-system/cn";

interface AppShellInnerProps {
  children: React.ReactNode;
}

export function AppShellInner({ children }: AppShellInnerProps) {
  const pathname = usePathname();
  const isTabletUp = useIsTabletUp();
  const { activeCaseCount, caseBadgeUrgency } = useCases();
  const { unreadCount: unreadMessageCount } = useMessages();
  const isOrgAdmin = isCurrentUserOrgAdmin();
  const shift = getActiveShiftContext();

  const showAdminShell = isOrgAdmin && isAdminShellRoute(pathname);

  const badges = {
    myTasks: getActionableTaskCount(),
    myTasksTone: getTaskBadgeVariant(),
    activeCases: activeCaseCount,
    activeCasesUrgency: caseBadgeUrgency,
    messages: unreadMessageCount,
  };

  if (showAdminShell) {
    return (
      <AdminTabletGuard>
        <div className="flex h-dvh overflow-hidden bg-surface-base">
          {isTabletUp ? <AdminAppNav /> : null}
          <div className="flex min-h-0 flex-1 flex-col">
            {isTabletUp ? (
              <AdminTopBar />
            ) : isAdminDashboardRoute(pathname) ? null : (
              <MobileAdminHeader />
            )}
            <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </AdminTabletGuard>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-base">
      {isTabletUp ? <AppNav badges={badges} /> : null}
      <div className="flex min-h-0 flex-1 flex-col">
        {isTabletUp ? <TopBar shift={shift} /> : <MobileWardHeader shift={shift} />}
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            !isTabletUp && "pb-[calc(4.25rem+env(safe-area-inset-bottom))]",
          )}
        >
          {children}
        </main>
        {!isTabletUp ? <MobileWardNav badges={badges} isOrgAdmin={isOrgAdmin} /> : null}
      </div>
    </div>
  );
}
