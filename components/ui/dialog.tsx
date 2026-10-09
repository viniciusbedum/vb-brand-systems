"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useNativeDialog } from "./use-native-dialog";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
} as const;

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
}

/**
 * Modal acessível sobre `<dialog>` nativo (`showModal()`): top layer, fundo inerte,
 * Esc / clique no backdrop / botão "Fechar" chamam `onOpenChange(false)` e o foco
 * volta ao elemento que abriu.
 *
 * Atenção: o corpo rola (`overflow-y-auto`), então popovers posicionados com
 * `absolute` (ex.: `DropdownMenu`) dentro dele podem ser cortados nas bordas.
 * Posicione esses menus perto do topo do conteúdo ou use `side="top"` quando necessário.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
}: DialogProps) {
  const { ref, onKeyDown } = useNativeDialog(open, onOpenChange);
  const t = useTranslations("common");
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <dialog
      ref={ref}
      onKeyDown={onKeyDown}
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "w-[calc(100%-2rem)] focus:outline-none rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl backdrop:bg-overlay/50 backdrop:backdrop-blur-sm",
        sizes[size],
        className
      )}
    >
      {/* O wrapper carrega o layout: classes de display no <dialog> o mostrariam fechado. */}
      <div className="relative flex max-h-[85dvh] flex-col">
        <div className="space-y-1.5 px-6 pb-4 pr-14 pt-6">
          <h2 id={titleId} className="text-lg font-semibold leading-tight">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
        {/* Depois do conteúdo no DOM: o foco inicial nativo cai no primeiro controle do corpo. */}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("close")}
          data-dialog-close=""
          className="absolute right-3 top-3 text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </dialog>
  );
}
