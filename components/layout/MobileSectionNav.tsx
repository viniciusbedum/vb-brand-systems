"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locale-href";
import { ClockCounterClockwise, getNavigationIcon } from "@/lib/icons";
import { getAssetCategories } from "@/lib/asset-config";
import { findNavSection, getNavConfig } from "@/lib/navigation";
import { isAIVisible } from "@/lib/features";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type Category = { label: string; icon?: string; href?: string; active: boolean };

export function MobileSectionNav({ onOpenHistory }: { onOpenHistory: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("shell");
  const assetCategories = getAssetCategories(locale);
  const navConfig = getNavConfig(locale);
  const railRef = useRef<HTMLDivElement>(null);
  const isAssets = pathname.startsWith("/assets");
  const isDocs = pathname.startsWith("/docs/");
  const slug = isDocs ? pathname.slice(6) : "";
  const section = findNavSection(locale, slug);

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
      <nav aria-label={t("chatActions")} className="flex gap-2 px-4 pb-3">
        <Button variant="ghost" className="glass min-h-11 gap-2 rounded-xl" onClick={onOpenHistory} aria-haspopup="dialog">
          <ClockCounterClockwise aria-hidden="true" />{t("history")}
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
      <nav aria-label={isAssets ? t("assetCategories") : t("contentSections")}>
        <div ref={railRef} className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 py-1 scroll-px-4">
          {categories.map(category => {
            const Icon = getNavigationIcon(category.icon);
            const className = cn(buttonVariants({ variant: "ghost" }), "glass h-11 shrink-0 gap-2 rounded-xl px-4 whitespace-nowrap", category.active && "bg-primary/15 text-link border-primary/30 hover:bg-primary/15 hover:text-link");
            const content = <><Icon aria-hidden="true" className="size-4" /><span>{category.label}</span></>;
            return category.href ? (
              <Link key={category.label} href={category.href} className={className} aria-current={category.active ? (isAssets ? "page" : "true") : undefined}>{content}</Link>
            ) : (
              <Button key={category.label} disabled className={className}>{content}<span className="text-xs">{t("soon")}</span></Button>
            );
          })}
        </div>
      </nav>
      {isDocs && section && section.items.length > 1 && (
        <div className="px-4 pt-2">
          <label htmlFor="mobile-doc-page" className="sr-only">{t("pageOf", { section: section.title })}</label>
          <Select id="mobile-doc-page" value={slug} onChange={event => router.push(`/docs/${event.target.value}`)} className="glass h-11 rounded-xl">
            {section.items.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </Select>
        </div>
      )}
    </div>
  );
}
