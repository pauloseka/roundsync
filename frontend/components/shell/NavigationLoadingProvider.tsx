"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { deferStateUpdate } from "@/lib/defer-state-update";
import { loadingCopy } from "@/lib/loading-content";

const SHOW_DELAY_MS = 180;
const SLOW_HINT_MS = 3500;

function isInternalNavigation(href: string, pathname: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin && url.pathname !== pathname;
  } catch {
    return false;
  }
}

export function NavigationLoadingProvider() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [slow, setSlow] = useState(false);
  const [offline, setOffline] = useState(
    () => typeof window !== "undefined" && !navigator.onLine,
  );

  useEffect(() => {
    function updateOnlineStatus() {
      setOffline(!navigator.onLine);
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    deferStateUpdate(() => {
      setPending(false);
      setVisible(false);
      setSlow(false);
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavigation(href, pathname)) return;

      setPending(true);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    if (!pending) {
      deferStateUpdate(() => {
        setVisible(false);
        setSlow(false);
      });
      return;
    }

    const showTimer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_HINT_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(slowTimer);
    };
  }, [pending]);

  if (!visible && !offline) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-surface-base/95 backdrop-blur-[2px]">
      <LoadingScreen
        variant="full"
        message={offline ? loadingCopy.offlineTitle : loadingCopy.default}
        slow={slow && !offline}
        offline={offline}
      />
    </div>
  );
}
