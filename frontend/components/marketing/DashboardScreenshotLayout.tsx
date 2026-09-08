"use client";

import { PreviewAppNav } from "@/components/marketing/PreviewAppNav";

interface DashboardScreenshotLayoutProps {
  children: React.ReactNode;
}

export function DashboardScreenshotLayout({ children }: DashboardScreenshotLayoutProps) {
  return (
    <div className="flex h-full bg-surface-base">
      <PreviewAppNav />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
