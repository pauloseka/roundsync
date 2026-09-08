import type { Metadata } from "next";
import { SignUpVerifyEmailStep } from "@/components/signup/SignUpVerifyEmailStep";

export const metadata: Metadata = {
  title: "Verify email — RoundSync",
  description: "Confirm your work email before setting up your organisation on RoundSync.",
};

export default function SignUpVerifyEmailPage() {
  return <SignUpVerifyEmailStep />;
}
