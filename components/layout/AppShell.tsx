import { Sidebar } from "./Sidebar";
import { CollapsibleAppShell } from "./CollapsibleAppShell";
import { ConversationsProvider } from "@/lib/conversations-context";
import { isAIVisible } from "@/lib/features";

export function AppShell({ children }: { children: React.ReactNode }) {
  const shell = (
    <CollapsibleAppShell sidebar={<Sidebar />}>
      {children}
    </CollapsibleAppShell>
  );

  return isAIVisible ? <ConversationsProvider>{shell}</ConversationsProvider> : shell;
}
