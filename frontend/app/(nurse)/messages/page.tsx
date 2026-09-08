import type { Metadata } from "next";
import { MessagesInboxClient } from "@/components/messages/MessagesInboxClient";

export const metadata: Metadata = {
  title: "Messages — RoundSync",
  description:
    "Care-team message threads — handoffs, lab results, and ward updates separate from active case coordination.",
};

export default function MessagesPage() {
  return <MessagesInboxClient />;
}
