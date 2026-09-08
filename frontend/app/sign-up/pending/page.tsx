import type { Metadata } from "next";
import { SignUpPendingClient } from "@/components/signup/SignUpPendingClient";

export const metadata: Metadata = {
  title: "Account pending — RoundSync",
  description:
    "Your organisation's RoundSync account isn't active yet. Contact your administrator.",
};

export default function SignUpPendingPage() {
  return <SignUpPendingClient />;
}
