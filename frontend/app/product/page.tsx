import { redirect } from "next/navigation";
import { PRODUCT_PLATFORM_HREF } from "@/lib/marketing-nav";

export default function ProductIndexPage() {
  redirect(PRODUCT_PLATFORM_HREF);
}
