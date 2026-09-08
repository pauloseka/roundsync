import type { Metadata } from "next";
import { SubscriptionPageClient } from "@/components/subscription/SubscriptionPageClient";

export const metadata: Metadata = {
  title: "Choose a plan — RoundSync",
  description:
    "Choose a RoundSync plan or start a free trial — checkout comes next when you're ready to pay.",
};

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
