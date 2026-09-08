import { AppShell } from "@/components/shell/AppShell";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

export default function NurseAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionGate>
      <AppShell>{children}</AppShell>
    </SubscriptionGate>
  );
}
