"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { CaretRight as ChevronRight, CaretDown as ChevronDown, getNavigationIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NavSection } from "@/lib/navigation";
import { SidebarItem } from "./SidebarItem";

type SidebarSectionProps = {
  section: NavSection;
  currentSlug: string;
};

const rowClass = "h-10 w-full justify-between rounded-lg px-3 font-normal [&_svg]:size-4";
const iconClass = "shrink-0";

export function SidebarSection({ section, currentSlug }: SidebarSectionProps) {
  const hasActiveItem = section.items.some((item) => item.slug === currentSlug);
  const Icon = getNavigationIcon(section.icon);
  const [isOpen, setIsOpen] = useState(
    section.defaultOpen === true || hasActiveItem
  );

  // Caso 1 — Toggle vazio: sem items e sem href (categoria futura)
  if (section.items.length === 0 && !section.href) {
    return (
      <Button variant="ghost" disabled className={cn(rowClass, "text-muted-foreground")}>
        <span className="flex min-w-0 items-center gap-3">
          <Icon aria-hidden="true" className={iconClass} />
          <span className="truncate">{section.title}</span>
        </span>
        <ChevronRight aria-hidden="true" className="!size-4" />
      </Button>
    );
  }

  // Caso 2 — Link direto: 1 item ou menos (sem accordion, sem chevron)
  if (section.items.length <= 1) {
    const href = section.href ?? `/docs/${section.items[0]?.slug ?? ""}`;
    const isActive = section.items[0]?.slug === currentSlug;
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isActive
            ? "bg-primary/10 text-link font-medium"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon aria-hidden="true" className={cn(iconClass, "size-4")} />
        <span className="truncate">{section.title}</span>
      </Link>
    );
  }

  // Caso 3 — Accordion colapsável: mais de 1 item
  return (
    <div>
      <Button
        variant="ghost"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(rowClass, "text-foreground/80")}
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon aria-hidden="true" className={iconClass} />
          <span className="truncate">{section.title}</span>
        </span>
        {isOpen ? <ChevronDown aria-hidden="true" className="!size-4" /> : <ChevronRight aria-hidden="true" className="!size-4" />}
      </Button>

      {isOpen && (
        <div className="mt-0.5 space-y-0.5 pl-7">
          {section.items.map((item) => (
            <SidebarItem key={item.slug} item={item} isActive={item.slug === currentSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
