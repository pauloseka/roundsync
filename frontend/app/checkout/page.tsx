import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/subscription/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout — RoundSync",
  description: "Confirm billing and activate your RoundSync plan.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
