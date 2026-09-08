import type { Metadata } from "next";
import { Suspense } from "react";
import { NewMessageClient } from "@/components/messages/NewMessageClient";

export const metadata: Metadata = {
  title: "New message — RoundSync",
  description: "Start a new care-team message to a department channel or colleague.",
};

export default function NewMessagePage() {
  return (
    <Suspense fallback={<div className="px-6 py-6 text-sm text-ink-secondary">Loading…</div>}>
      <NewMessageClient />
    </Suspense>
  );
}
