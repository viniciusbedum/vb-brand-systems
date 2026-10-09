"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

type SidebarItemProps = {
  item: NavItem;
  isActive: boolean;
};

export function SidebarItem({ item, isActive }: SidebarItemProps) {
  return (
    <Link
      href={`/docs/${item.slug}`}
      className={cn(
        "flex h-9 items-center rounded-lg px-3 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? "bg-primary/10 text-link font-medium"
          : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="truncate">{item.title}</span>
    </Link>
  );
}
