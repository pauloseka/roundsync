import { redirect } from "next/navigation";
import { SUBSCRIPTION_HREF } from "@/lib/signup-routes";

export default function SignUpPlanRedirectPage() {
  redirect(SUBSCRIPTION_HREF);
}
