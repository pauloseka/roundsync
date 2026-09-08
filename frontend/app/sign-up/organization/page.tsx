import type { Metadata } from "next";
import { SignUpOrganizationStep } from "@/components/signup/SignUpOrganizationStep";

export const metadata: Metadata = {
  title: "Organisation setup — RoundSync",
  description:
    "Tell us about your hospital size and wards — we'll recommend the right RoundSync plan.",
};

export default function SignUpOrganizationPage() {
  return <SignUpOrganizationStep />;
}
