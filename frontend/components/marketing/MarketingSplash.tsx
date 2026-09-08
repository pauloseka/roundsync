"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";

type SplashPhase = "splash" | "exit" | "done";

const HOLD_MS = 320;
const EXIT_MS = 480;

interface MarketingSplashProps {
  children: ReactNode;
}

export function MarketingSplash({ children }: MarketingSplashProps) {
  const [phase, setPhase] = useState<SplashPhase>("splash");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase("exit"), HOLD_MS);
    const doneTimer = window.setTimeout(() => setPhase("done"), HOLD_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  const showOverlay = phase !== "done";
  const isExiting = phase === "exit";

  const splashTiming = { "--splash-exit-ms": `${EXIT_MS}ms` } as React.CSSProperties;

  return (
    <>
      <div
        className={`marketing-splash-content ${
          isExiting || phase === "done" ? "marketing-splash-content--reveal" : ""
        }`}
        style={splashTiming}
        aria-hidden={phase === "splash"}
      >
        {children}
      </div>

      {showOverlay ? (
        <div
          className={`marketing-splash-curtain fixed inset-0 z-50 flex motion-reduce:hidden items-center justify-center bg-brand-core ${
            isExiting ? "marketing-splash-curtain--exit" : ""
          }`}
          style={splashTiming}
          aria-hidden={isExiting}
        >
          <div
            className={`marketing-splash-logo ${
              phase === "splash" ? "marketing-splash-logo--in" : "marketing-splash-logo--out"
            }`}
          >
            <RoundSyncLogo
              variant="light"
              markClassName="size-14"
              textClassName="font-display text-3xl font-semibold text-white"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
