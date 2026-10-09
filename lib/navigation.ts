import { navConfig as rawNavConfig } from "@/brand/navigation";
import type { Locale } from "@/i18n/locale-href";

/** Texto da marca em cada idioma. */
export type Localized = Record<Locale, string>;

/** Link extra do menu de preferências (mobile). `href` interno recebe o prefixo do idioma; `http(s)://` abre em nova aba. */
export type MenuLink = { label: Localized; href: string };

export type RawNavItem = { title: Localized; slug: string; description?: Localized };
export type RawNavSection = {
  title: Localized;
  icon?: string;
  href?: string;
  items: RawNavItem[];
  defaultOpen?: boolean;
  dividerAfter?: boolean;
};
export type NavConfig = RawNavSection[];

/** Navegação já traduzida para um idioma (é o que os componentes usam). */
export type NavItem = { title: string; slug: string; description?: string };
export type NavSection = {
  title: string;
  icon?: string;
  href?: string;
  items: NavItem[];
  defaultOpen?: boolean;
  dividerAfter?: boolean;
};

export function getNavConfig(locale: Locale): NavSection[] {
  return rawNavConfig.map((section) => ({
    ...section,
    title: section.title[locale],
    items: section.items.map((item) => ({
      slug: item.slug,
      title: item.title[locale],
      description: item.description?.[locale],
    })),
  }));
}

/** Todos os slugs de documentos (iguais nos dois idiomas). */
export function getAllNavSlugs(): string[] {
  return rawNavConfig.flatMap((section) => section.items.map((item) => item.slug));
}

export function findNavItem(locale: Locale, slug: string): NavItem | undefined {
  for (const section of getNavConfig(locale)) {
    const found = section.items.find((item) => item.slug === slug);
    if (found) return found;
  }
  return undefined;
}

export function findNavSection(locale: Locale, slug: string): NavSection | undefined {
  return getNavConfig(locale).find((section) =>
    section.items.some((item) => item.slug === slug)
  );
}

export function getAdjacentItems(locale: Locale, slug: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const allItems = getNavConfig(locale).flatMap((section) => section.items);
  const currentIndex = allItems.findIndex((item) => item.slug === slug);

  return {
    prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
    next: currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
  };
}
