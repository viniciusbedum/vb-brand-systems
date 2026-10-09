"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, FileText, ChatCircle as MessageCircle, House, Plus } from "@/lib/icons";
import { isAIVisible } from "@/lib/features";
import { navConfig } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const firstDocHref = navConfig[0]?.items[0] ? `/docs/${navConfig[0].items[0].slug}` : "/";

export function SidebarIconBar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  const isActive = (pattern: string) => {
    if (pattern === "/") return pathname === "/" || pathname.startsWith("/chat");
    return pathname.startsWith(pattern);
  };

  const iconClass = (pattern: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      mobile && "h-12 w-20 flex-col gap-1 rounded-xl [&_svg]:size-6 text-xs",
      isActive(pattern) ? "bg-primary/15 text-link" : "text-muted-foreground"
    );

  const homeLabel = isAIVisible ? "Chat com a IA" : "Início";
  const scrollToTop = () => {
    if (mobile) window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className={cn("flex items-center gap-1", mobile ? "glass h-16 rounded-2xl px-2" : "mb-4")}>
      <Link
        href="/assets"
        onClick={scrollToTop}
        title="Ativos da marca"
        aria-label="Ativos da marca"
        aria-current={isActive("/assets") ? "page" : undefined}
        className={iconClass("/assets")}
      >
        <Folder aria-hidden="true" />
        {mobile && <span>Ativos</span>}
      </Link>
      <Link
        href={firstDocHref}
        onClick={scrollToTop}
        title="Conteúdo"
        aria-label="Conteúdo"
        aria-current={isActive("/docs") ? "page" : undefined}
        className={iconClass("/docs")}
      >
        <FileText aria-hidden="true" />
        {mobile && <span>Conteúdo</span>}
      </Link>
      <Link
        href="/"
        onClick={scrollToTop}
        title={homeLabel}
        aria-label={homeLabel}
        aria-current={isActive("/") ? "page" : undefined}
        className={iconClass("/")}
      >
        {isAIVisible ? <MessageCircle aria-hidden="true" /> : <House aria-hidden="true" />}
        {mobile && <span>{isAIVisible ? "Chat" : "Início"}</span>}
      </Link>
      {isAIVisible && !mobile && (
        <Link
          href="/chat"
          title="Nova conversa"
          aria-label="Nova conversa"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "ml-auto text-link"
          )}
        >
          <Plus aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
