"use client";

import { useEffect, useState } from "react";
import { deferStateUpdate } from "@/lib/defer-state-update";

/** True only after the component has mounted — safe gate for localStorage/session UI. */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    deferStateUpdate(() => setMounted(true));
  }, []);

  return mounted;
}
