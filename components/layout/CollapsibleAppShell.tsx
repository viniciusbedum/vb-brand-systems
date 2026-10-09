"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarSimple as PanelLeft } from "@/lib/icons";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { brand } from "@/brand/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ConversationList } from "./SidebarContent";
import { isAIVisible } from "@/lib/features";
import { TopBar } from "./TopBar";
import { SidebarIconBar } from "./SidebarIconBar";
import { MobileSectionNav } from "./MobileSectionNav";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;
    if (!header || !content) return;
    const measure = () => content.style.setProperty("--mobile-header-height", `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  /* Fecha o histórico ao navegar. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

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

      {isAIVisible && (
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen} title="Histórico de conversas">
          <div onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
          }}>
            <ConversationList />
          </div>
        </Dialog>
      )}

      {/* Área de conteúdo */}
      <div ref={contentRef} id="content-area" className="mobile-content-area flex-1 min-w-0 flex flex-col h-full">
        <header ref={headerRef} className="mobile-section-header md:hidden sticky top-0 z-30 shrink-0 min-w-0 backdrop-blur-md">
          <MobileSectionNav onOpenHistory={() => setMobileOpen(true)} />
        </header>
        <TopBar />
        {children}
      </div>
      <nav aria-label="Navegação rápida" className="mobile-bottom-nav fixed inset-x-4 z-40 flex justify-center md:hidden pointer-events-none [&>div]:pointer-events-auto">
        <SidebarIconBar mobile />
      </nav>
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
