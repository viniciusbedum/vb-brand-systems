import type { Meta, StoryObj } from "@storybook/react";
import { brand } from "@/brand/config";
import { ConversationsProvider } from "@/lib/conversations-context";
import { CollapsibleAppShell } from "./CollapsibleAppShell";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarIconBar } from "./SidebarIconBar";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarToggleButton } from "./SidebarToggleButton";

// O AppShell real usa o Sidebar (Server Component com Supabase). Aqui montamos
// a mesma estrutura com as partes de cliente, sem backend.
function ShellPreview({ children }: { children: React.ReactNode }) {
  const sidebar = (
    <aside
      className="glass flex h-full w-full flex-col rounded-xl"
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
  );

  return (
    <ConversationsProvider>
      <div className="h-screen">
        <CollapsibleAppShell sidebar={sidebar}>{children}</CollapsibleAppShell>
      </div>
    </ConversationsProvider>
  );
}

const meta: Meta<typeof ShellPreview> = {
  title: "Layout/AppShell",
  component: ShellPreview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  parameters: { nextjs: { navigation: { pathname: "/docs/introducao" } } },
  args: {
    children: (
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-4 text-4xl font-bold">Introdução</h1>
        <p className="text-muted-foreground">Conteúdo de exemplo dentro do AppShell.</p>
      </main>
    ),
  },
};

export const Home: Story = {
  parameters: { nextjs: { navigation: { pathname: "/" } } },
  args: {
    children: (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Área central da home.</p>
      </main>
    ),
  },
};
