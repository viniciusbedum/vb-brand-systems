"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { CircleHalf, DotsThree, Translate } from "@/lib/icons";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locale-href";
import { menuLinks } from "@/brand/config";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { cn } from "@/lib/utils";

const rowLabel = "flex min-h-8 items-center gap-2 pr-3 text-sm text-muted-foreground [&_svg]:size-4";
// As chaves das duas linhas compartilham as mesmas 3 colunas (subgrid), então EN fica sobre o escuro e BR sobre o sistema.
const switchCols = "col-span-3 grid grid-cols-subgrid gap-x-1";
const linkRow =
  "flex min-h-9 items-center gap-2 rounded-lg px-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Menu de preferências da barra inferior (mobile): um painel suspenso com o idioma e o tema em chaves
 * na horizontal, e abaixo os links de página configurados em `menuLinks` (brand/config.ts).
 * No desktop, tema e idioma ficam na barra superior.
 */
export function PreferencesMenu({ className }: { className?: string }) {
  const t = useTranslations("preferences");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Clique fora e Esc fecham; Esc devolve o foco ao botão.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // O painel vai para o <body>: dentro da barra inferior (que já tem backdrop-filter) o blur
  // não alcançaria o conteúdo da página, e o texto de trás ficaria nítido atrás do painel.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      // Âncora na barra inferior (não no botão): a borda direita do painel alinha com a da barra,
      // e o vão até ela é o mesmo de qualquer espaçamento do app (8px).
      const trigger = triggerRef.current;
      const anchor = (trigger?.closest(".glass") ?? trigger)?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      panel.style.bottom = `${window.innerHeight - anchor.top + 8}px`;
      panel.style.right = `${Math.max(16, window.innerWidth - anchor.right)}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  // Fecha ao navegar.
  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon-sm"
        aria-label={t("more")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(open && "bg-primary/15 text-link", className)}
      >
        <DotsThree aria-hidden="true" weight="bold" />
        <span>{t("moreLabel")}</span>
      </Button>

      {open && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={t("settings")}
          className="glass fixed z-50 flex w-max min-w-[15rem] max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-xl bg-card/80 p-3"
        >
          {/* Rótulos à esquerda; à direita, 3 colunas fixas onde as chaves de idioma e de tema se alinham. */}
          <div className="grid grid-cols-[1fr_repeat(3,2.5rem)] items-center gap-x-1 gap-y-3">
            <span className={rowLabel}>
              <Translate aria-hidden="true" />
              {t("language")}
            </span>
            <LanguageSwitch onSelect={close} className={cn(switchCols, "[&>*:first-child]:col-start-2")} />
            <span className={rowLabel}>
              <CircleHalf aria-hidden="true" />
              {t("theme")}
            </span>
            <ThemeSwitch className={switchCols} />
          </div>

          {menuLinks.length > 0 && (
            <div className="flex flex-col border-t border-border pt-2">
              {menuLinks.map(({ label, href }) =>
                /^https?:\/\//.test(href) ? (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" onClick={close} className={linkRow}>
                    {label[locale]}
                  </a>
                ) : (
                  <Link key={href} href={href} onClick={close} className={linkRow}>
                    {label[locale]}
                  </Link>
                )
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
