import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Build every internal link with these (never
 * `/${locale}/...` by hand): English has no prefix and pt uses /br, see
 * `routing.ts`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export { localeHref, type Locale } from "./locale-href";
