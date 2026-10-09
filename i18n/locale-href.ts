import { routing } from "./routing";

export type Locale = (typeof routing.locales)[number];

/**
 * Path for `path` in `locale`, e.g. ("/open", "pt") -> "/br/open". Pure
 * (reads only `routing`), so it also runs outside Next, e.g. in tests.
 */
export function localeHref(path: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return path;
  const { localePrefix } = routing;
  const prefixes =
    typeof localePrefix === "object" && "prefixes" in localePrefix
      ? (localePrefix.prefixes as Partial<Record<Locale, string>>)
      : {};
  const prefix = prefixes[locale] ?? `/${locale}`;
  return path === "/" ? prefix : `${prefix}${path}`;
}
