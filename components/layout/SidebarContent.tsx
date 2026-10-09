"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import { navConfig } from "@/lib/navigation";
import { assetCategories } from "@/lib/asset-config";
import { SidebarSection } from "./SidebarSection";
import { MessageCircle, MoreVertical, Pin, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useConversations, type Conversation } from "@/lib/conversations-context";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { isAIVisible } from "@/lib/features";

type SidebarContentProps = Record<string, never>;

function ConversationItem({
  conv,
  isActive,
  pinned,
  onDelete,
  onRename,
  onTogglePin,
}: {
  conv: Conversation;
  isActive: boolean;
  pinned: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(conv.title);
  // Encerra a edição uma única vez: o blur disparado ao desmontar o Input (após
  // Enter ou Esc) não deve salvar de novo nem salvar uma edição cancelada.
  const renameDoneRef = useRef(false);
  const router = useRouter();

  function startRename() {
    renameDoneRef.current = false;
    setNewTitle(conv.title);
    setRenaming(true);
  }

  function cancelRename() {
    renameDoneRef.current = true;
    setRenaming(false);
    setNewTitle(conv.title);
  }

  async function handleDelete() {
    onDelete(conv.id); // remove imediato sem flash
    if (window.location.pathname === `/chat/${conv.id}`) {
      router.push("/");
    }
    fetch(`/api/conversations/${conv.id}`, { method: "DELETE" });
  }

  async function handleRename() {
    if (renameDoneRef.current) return;
    renameDoneRef.current = true;
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === conv.title) {
      setRenaming(false);
      setNewTitle(conv.title);
      return;
    }
    setRenaming(false);
    onRename(conv.id, trimmed); // atualiza imediato sem flash
    fetch(`/api/conversations/${conv.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
  }

  const RowIcon = pinned ? Pin : MessageCircle;

  if (renaming) {
    return (
      <div className="flex h-9 items-center gap-2 px-1">
        <RowIcon aria-hidden="true" className="ml-2 size-4 flex-shrink-0 text-muted-foreground" />
        <Input
          autoFocus
          aria-label="Renomear conversa"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              // Cancela só a edição (sem salvar) e não fecha o Sheet que a contém.
              e.preventDefault();
              e.stopPropagation();
              cancelRename();
            }
          }}
          className="h-9 min-w-0 flex-1"
        />
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={`/chat/${conv.id}`}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg px-3 pr-10 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isActive
            ? "bg-primary/10 text-link font-medium"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
        )}
        title={conv.title}
        aria-current={isActive ? "page" : undefined}
      >
        <RowIcon aria-hidden="true" className="size-4 flex-shrink-0 opacity-70" />
        <span className="truncate">{conv.title}</span>
      </Link>

      <DropdownMenu className="absolute right-0 top-0">
        <DropdownMenuTrigger
          aria-label="Opções da conversa"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "text-muted-foreground md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
          )}
        >
          <MoreVertical aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => onTogglePin(conv.id)}>
            <Pin aria-hidden="true" />
            {pinned ? "Desafixar" : "Fixar"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={startRename}>
            <Pencil aria-hidden="true" />
            Renomear
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
            <Trash2 aria-hidden="true" />
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ConversationList() {
  const pathname = usePathname();
  const { conversations, loading, deleteConversation, renameConversation, togglePin } = useConversations();

  if (loading) {
    return (
      <div className="space-y-1 px-1">
        {[1, 2].map((i) => (
          <div key={i} className="h-9 rounded-lg bg-accent/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="px-3 text-sm text-muted-foreground">
        Nenhuma conversa ainda. Converse com a IA para criar históricos aqui.
      </p>
    );
  }

  const sorted = [
    ...conversations.filter((c) => c.pinned),
    ...conversations.filter((c) => !c.pinned),
  ];

  return (
    <div className="space-y-0.5">
      {sorted.map((conv, idx) => {
        const prevWasPinned = idx > 0 && sorted[idx - 1].pinned;
        const showDivider = !conv.pinned && prevWasPinned;
        return (
          <div key={conv.id}>
            {showDivider && (
              <hr className="my-1.5 border-border" />
            )}
            <ConversationItem
              conv={conv}
              isActive={pathname === `/chat/${conv.id}`}
              pinned={conv.pinned}
              onDelete={deleteConversation}
              onRename={renameConversation}
              onTogglePin={togglePin}
            />
          </div>
        );
      })}
    </div>
  );
}

export function SidebarContent(_props: SidebarContentProps) {
  const pathname = usePathname();
  const currentSlug = pathname.startsWith("/docs/")
    ? pathname.slice("/docs/".length)
    : "";

  return (
    <>
      {isAIVisible && (pathname === "/" || pathname.startsWith("/chat")) ? (
        <ConversationList />
      ) : pathname.startsWith("/assets") ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Categorias
          </p>
          <div className="space-y-0.5">
            {assetCategories.map((category) => {
              const isActive = pathname === `/assets/${category.slug}` || (pathname === "/assets" && category.slug === "logotipos");
              const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[category.icon];
              return (
                <Link
                  key={category.slug}
                  href={`/assets/${category.slug}`}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-primary/10 text-link font-medium"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon size={16} />}
                  {category.label}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {navConfig.map((section) => (
            <div key={section.title}>
              <SidebarSection section={section} currentSlug={currentSlug} />
              {section.dividerAfter && <hr className="my-2 border-border" />}
            </div>
          ))}
        </>
      )}
    </>
  );
}
