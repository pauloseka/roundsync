import type { Metadata } from "next";
import { SignUpAccountStep } from "@/components/signup/SignUpAccountStep";

export const metadata: Metadata = {
  title: "Sign up — RoundSync",
  description:
    "Create your RoundSync account — work email, verification, then organisation setup.",
};

export default function SignUpPage() {
  return <SignUpAccountStep />;
}
