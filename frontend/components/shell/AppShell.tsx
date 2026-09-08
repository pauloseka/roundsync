import { CasesProvider } from "@/components/cases/CasesStore";
import { MessagesProvider } from "@/components/messages/MessagesStore";
import { SettingsProvider } from "@/components/settings/SettingsStore";
import { WardOperationsProvider } from "@/components/ward/WardOperationsStore";
import { AppShellInner } from "@/components/shell/AppShellInner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SettingsProvider>
      <WardOperationsProvider>
        <CasesProvider>
          <MessagesProvider>
            <AppShellInner>{children}</AppShellInner>
          </MessagesProvider>
        </CasesProvider>
      </WardOperationsProvider>
    </SettingsProvider>
  );
}
