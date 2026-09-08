"use client";

import { useSyncExternalStore } from "react";

function subscribeMediaQuery(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getMediaQuerySnapshot(query: string) {
  return window.matchMedia(query).matches;
}

/** Returns `true` when the viewport is at least `minWidth` pixels wide. */
export function useMinWidth(minWidth: number, fallback = true) {
  const query = `(min-width: ${minWidth}px)`;

  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    () => fallback,
  );
}

/** Tablet minimum used for organisation admin screens (768px / Tailwind `md`). */
export function useIsTabletUp(fallback = true) {
  return useMinWidth(768, fallback);
}
