"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Português aparece como "BR", igual ao prefixo da URL (/br). */
const LABELS = { en: "EN", pt: "BR" } as const;
const NAMES = { en: "English", pt: "Português" } as const;

/**
 * Chave de idioma (EN | BR). Cada opção é um link para a mesma página no outro idioma
 * (inglês na raiz, português em /br); o Link do next-intl também atualiza o cookie NEXT_LOCALE.
 */
export function LanguageSwitch({ className, onSelect }: { className?: string; onSelect?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("preferences");

  return (
    <div role="group" aria-label={t("languageSwitch")} className={cn("flex items-center gap-1", className)}>
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code === "pt" ? "pt-BR" : "en"}
            lang={code === "pt" ? "pt-BR" : "en"}
            aria-label={NAMES[code]}
            title={NAMES[code]}
            aria-current={active ? "true" : undefined}
            onClick={onSelect}
            className={cn(
              "inline-flex h-8 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold tracking-wide transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {LABELS[code]}
          </Link>
        );
      })}
    </div>
  );
}
