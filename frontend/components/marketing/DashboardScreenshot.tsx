import { CasesProvider } from "@/components/cases/CasesStore";
import { WardOperationsProvider } from "@/components/ward/WardOperationsStore";
import { DashboardTriage } from "@/components/dashboard/DashboardTriage";
import { MessagesProvider } from "@/components/messages/MessagesStore";
import { DashboardScreenshotLayout } from "@/components/marketing/DashboardScreenshotLayout";
import { TopBar } from "@/components/shell/TopBar";
import { shiftContext } from "@/lib/mock-data";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 960;

const scaleExpression = `min(calc(100cqw / ${CANVAS_WIDTH}px), calc(100cqh / ${CANVAS_HEIGHT}px))`;

export function DashboardScreenshot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`@container flex h-full w-full items-end justify-center [container-type:size] ${className}`}
      style={{ ["--screenshot-scale" as string]: scaleExpression }}
      aria-hidden="true"
    >
      <div
        className="overflow-hidden rounded-xl border border-line bg-surface-card shadow-[0_24px_64px_-12px_rgba(26,29,35,0.18)]"
        style={{
          width: `calc(${CANVAS_WIDTH}px * var(--screenshot-scale))`,
          height: `calc(${CANVAS_HEIGHT}px * var(--screenshot-scale))`,
        }}
      >
        <div
          className="pointer-events-none origin-top-left select-none"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: "scale(var(--screenshot-scale))",
          }}
        >
          <div className="flex h-10 items-center gap-2 border-b border-line bg-surface-base px-4">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-1 font-mono text-xs text-ink-secondary">app.roundsync.com</span>
          </div>

          <div className="h-[920px] overflow-hidden">
            <WardOperationsProvider>
              <CasesProvider>
                <MessagesProvider>
                  <DashboardScreenshotLayout>
                    <TopBar shift={shiftContext} />
                    <div className="h-[calc(920px-4.75rem)] overflow-hidden">
                      <DashboardTriage />
                    </div>
                  </DashboardScreenshotLayout>
                </MessagesProvider>
              </CasesProvider>
            </WardOperationsProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
