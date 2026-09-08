"use client";

import { usePathname } from "next/navigation";
import { AdminTabletRequiredScreen } from "@/components/shell/AdminTabletRequiredScreen";
import { isAdminDashboardRoute } from "@/lib/admin-nav";
import { useIsTabletUp } from "@/lib/hooks/useMediaQuery";

interface AdminTabletGuardProps {
  children: React.ReactNode;
}

export function AdminTabletGuard({ children }: AdminTabletGuardProps) {
  const pathname = usePathname();
  const isTabletUp = useIsTabletUp();
  const requiresTablet = isAdminDashboardRoute(pathname);

  if (requiresTablet && !isTabletUp) {
    return <AdminTabletRequiredScreen />;
  }

  return children;
}
