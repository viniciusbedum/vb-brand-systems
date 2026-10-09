"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, ClockCounterClockwise, getNavigationIcon } from "@/lib/icons";
import { assetCategories } from "@/lib/asset-config";
import { findNavSection, navConfig } from "@/lib/navigation";
import { isAIVisible } from "@/lib/features";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type Category = { label: string; icon?: string; href?: string; active: boolean };

export function MobileSectionNav({ onOpenHistory }: { onOpenHistory: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const isAssets = pathname.startsWith("/assets");
  const isDocs = pathname.startsWith("/docs/");
  const slug = isDocs ? pathname.slice(6) : "";
  const section = findNavSection(slug);

  // Move somente a faixa horizontal, sem deslocar o conteúdo da página.
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[aria-current="page"], [aria-current="true"]');
    if (!rail || !active) return;
    const bounds = rail.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.left < bounds.left + 16) rail.scrollLeft += item.left - bounds.left - 16;
    else if (item.right > bounds.right - 16) rail.scrollLeft += item.right - bounds.right + 16;
  }, [pathname]);

  if (isAIVisible && (pathname === "/" || pathname.startsWith("/chat"))) {
    return (
      <nav aria-label="Ações do chat" className="flex gap-2 px-4 pb-3">
        <Button variant="ghost" className="glass min-h-11 gap-2 rounded-xl" onClick={() => router.push(`/chat?new=${Date.now()}`)}>
          <Plus aria-hidden="true" />Nova conversa
        </Button>
        <Button variant="ghost" className="glass min-h-11 gap-2 rounded-xl" onClick={onOpenHistory} aria-haspopup="dialog">
          <ClockCounterClockwise aria-hidden="true" />Histórico
        </Button>
      </nav>
    );
  }

  if (!isAssets && !isDocs) return null;

  const categories: Category[] = isAssets
    ? assetCategories.map(category => ({
        label: category.label, icon: category.icon, href: `/assets/${category.slug}`,
        active: pathname === `/assets/${category.slug}` || (pathname === "/assets" && category.slug === "logotipos"),
      }))
    : navConfig.map(item => ({
        label: item.title, icon: item.icon,
        href: item.href ?? (item.items[0] ? `/docs/${item.items[0].slug}` : undefined),
        active: item === section,
      }));

  return (
    <div className="min-w-0 pb-3">
      <nav aria-label={isAssets ? "Categorias de ativos" : "Seções de conteúdo"}>
        <div ref={railRef} className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 py-1 scroll-px-4">
          {categories.map(category => {
            const Icon = getNavigationIcon(category.icon);
            const className = cn(buttonVariants({ variant: "ghost" }), "glass h-11 shrink-0 gap-2 rounded-xl px-4 whitespace-nowrap", category.active && "bg-primary/15 text-link border-primary/30");
            const content = <><Icon aria-hidden="true" className="size-4" /><span>{category.label}</span></>;
            return category.href ? (
              <Link key={category.label} href={category.href} className={className} aria-current={category.active ? (isAssets ? "page" : "true") : undefined}>{content}</Link>
            ) : (
              <Button key={category.label} disabled className={className}>{content}<span className="text-xs">Em breve</span></Button>
            );
          })}
        </div>
      </nav>
      {isDocs && section && section.items.length > 1 && (
        <div className="px-4 pt-2">
          <label htmlFor="mobile-doc-page" className="sr-only">Página de {section.title}</label>
          <Select id="mobile-doc-page" value={slug} onChange={event => router.push(`/docs/${event.target.value}`)} className="glass h-11 rounded-xl">
            {section.items.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </Select>
        </div>
      )}
    </div>
  );
}
