import { redirect } from "next/navigation";
import { CHECKOUT_HREF } from "@/lib/signup-routes";

export default function SignUpCheckoutRedirectPage() {
  redirect(CHECKOUT_HREF);
}
