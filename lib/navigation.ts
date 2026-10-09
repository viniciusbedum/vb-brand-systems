import { navConfig } from "@/brand/navigation";

export type NavItem = {
  title: string;
  slug: string;
  description?: string;
};

export type NavSection = {
  title: string;
  slug?: string;
  icon?: string;
  href?: string;
  items: NavItem[];
  defaultOpen?: boolean;
  dividerAfter?: boolean;
};

export type NavConfig = NavSection[];

export { navConfig };

export function findNavItem(slug: string): NavItem | undefined {
  for (const section of navConfig) {
    const found = section.items.find((item) => item.slug === slug);
    if (found) return found;
  }
  return undefined;
}

export function findNavSection(slug: string): NavSection | undefined {
  return navConfig.find((section) =>
    section.items.some((item) => item.slug === slug)
  );
}

export function getAdjacentItems(slug: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const allItems = navConfig.flatMap((section) => section.items);
  const currentIndex = allItems.findIndex((item) => item.slug === slug);

  return {
    prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
    next: currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
  };
}
