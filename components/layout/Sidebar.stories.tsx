import type { Meta, StoryObj } from "@storybook/react";
import { brand } from "@/brand/config";
import { ConversationsProvider } from "@/lib/conversations-context";
import { SidebarProvider } from "@/lib/sidebar-context";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarIconBar } from "./SidebarIconBar";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarToggleButton } from "./SidebarToggleButton";

// A Sidebar real é um Server Component (lê a sessão do Supabase). Esta história
// monta as mesmas partes de cliente, sem depender do Supabase.
function SidebarPreview() {
  return (
    <ConversationsProvider>
      <SidebarProvider>
        <div className="flex h-screen p-4">
          <aside
            className="glass flex h-full w-72 flex-col rounded-xl"
            aria-label="Navegação do Brand System"
          >
            <div className="flex h-14 flex-shrink-0 items-center gap-2 px-4">
              <span className="truncate text-sm font-heading font-bold tracking-[0.14em] select-none">
                {brand.wordmark}
              </span>
              <SidebarToggleButton />
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <SidebarSearch />
              <SidebarIconBar />
              <SidebarContent />
            </nav>
            <div className="flex-shrink-0 px-3 py-4">
              <SidebarFooter displayName="Visitante" email={null} role="staff" userId={null} />
            </div>
          </aside>
        </div>
      </SidebarProvider>
    </ConversationsProvider>
  );
}

const meta: Meta<typeof SidebarPreview> = {
  title: "Layout/Sidebar",
  component: SidebarPreview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  parameters: { nextjs: { navigation: { pathname: "/docs/introducao" } } },
};

export const Assets: Story = {
  parameters: { nextjs: { navigation: { pathname: "/assets/logotipos" } } },
};

export const Chat: Story = {
  parameters: { nextjs: { navigation: { pathname: "/chat" } } },
};
