import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageThreadView } from "@/components/messages/MessageThreadView";

export const metadata: Metadata = {
  title: "Message thread — RoundSync",
  description: "Care-team message thread — read history and reply with informal ward updates.",
};

interface MessageThreadPageProps {
  params: Promise<{ threadId: string }>;
}

function MessageThreadFallback() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6">
      <p className="text-sm text-ink-secondary">Loading thread…</p>
    </div>
  );
}

export default async function MessageThreadPage({ params }: MessageThreadPageProps) {
  const { threadId } = await params;

  return (
    <Suspense fallback={<MessageThreadFallback />}>
      <MessageThreadView threadId={threadId} />
    </Suspense>
  );
}
