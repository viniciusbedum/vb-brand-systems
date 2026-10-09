"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeft, Menu } from "lucide-react";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { brand } from "@/brand/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TopBar } from "./TopBar";

const wordmarkInitials = brand.wordmark.split(" ")[0];

function Shell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isOpen, toggle } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* Fecha o menu mobile ao navegar */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="app-shell flex h-full bg-background">
      {/* Desktop: coluna da sidebar (expandida ou recolhida) */}
      <div
        className={cn(
          "hidden md:block flex-shrink-0 h-full p-4 pr-0 transition-[width] duration-200 ease-in-out",
          isOpen ? "w-72" : "w-auto"
        )}
      >
        <div className={cn("h-full", isOpen ? "block" : "hidden")}>{sidebar}</div>
        {!isOpen && (
          <Button
            variant="ghost"
            aria-label="Expandir sidebar"
            onClick={toggle}
            className="glass h-12 rounded-xl px-3 text-foreground"
          >
            <span className="font-heading text-sm font-bold tracking-[0.14em] select-none">
              {wordmarkInitials}
            </span>
            <PanelLeft aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Mobile: sidebar dentro de um Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left" title="Menu de navegação">
        <div
          className="h-full px-3 pb-3 [&>aside]:rounded-[0] [&>aside]:border-0 [&>aside]:bg-transparent [&>aside]:shadow-none [&>aside]:backdrop-blur-none"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
          }}
        >
          {sidebar}
        </div>
      </Sheet>

      {/* Área de conteúdo */}
      <div id="content-area" className="flex-1 min-w-0 flex flex-col h-full">
        <header className="md:hidden sticky top-0 z-30 flex h-14 flex-shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen(true)}
            className="-ml-2"
          >
            <Menu aria-hidden="true" />
          </Button>
          <span className="truncate text-sm font-heading font-bold tracking-[0.14em] select-none">
            {brand.wordmark}
          </span>
        </header>
        <TopBar />
        {children}
      </div>
    </div>
  );
}

export function CollapsibleAppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Shell sidebar={sidebar}>{children}</Shell>
    </SidebarProvider>
  );
}
