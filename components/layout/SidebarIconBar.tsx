"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, FileText, MessageCircle, House, Plus } from "lucide-react";
import { isAIVisible } from "@/lib/features";
import { navConfig } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const firstDocHref = navConfig[0]?.items[0] ? `/docs/${navConfig[0].items[0].slug}` : "/";

export function SidebarIconBar() {
  const pathname = usePathname();

  const isActive = (pattern: string) => {
    if (pattern === "/") return pathname === "/";
    return pathname.startsWith(pattern);
  };

  const iconClass = (pattern: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      isActive(pattern) ? "bg-primary/15 text-link" : "text-muted-foreground"
    );

  const homeLabel = isAIVisible ? "Chat com a IA" : "Início";

  return (
    <div className="mb-4 flex items-center gap-1">
      <Link
        href="/assets"
        title="Ativos da marca"
        aria-label="Ativos da marca"
        aria-current={isActive("/assets") ? "page" : undefined}
        className={iconClass("/assets")}
      >
        <Folder aria-hidden="true" />
      </Link>
      <Link
        href={firstDocHref}
        title="Conteúdo"
        aria-label="Conteúdo"
        aria-current={isActive("/docs") ? "page" : undefined}
        className={iconClass("/docs")}
      >
        <FileText aria-hidden="true" />
      </Link>
      <Link
        href="/"
        title={homeLabel}
        aria-label={homeLabel}
        aria-current={isActive("/") ? "page" : undefined}
        className={iconClass("/")}
      >
        {isAIVisible ? <MessageCircle aria-hidden="true" /> : <House aria-hidden="true" />}
      </Link>
      {isAIVisible && (
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
