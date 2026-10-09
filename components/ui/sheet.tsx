"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useNativeDialog } from "./use-native-dialog";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  floating?: boolean;
  contentClassName?: string;
}

/**
 * Painel lateral de altura total sobre `<dialog>` nativo (mesmo comportamento de
 * foco/Esc/backdrop do `Dialog`). O título fica `sr-only`, mas rotula o painel.
 *
 * O Sheet reserva o espaço do botão "Fechar" (canto superior direito): a área de
 * conteúdo já tem `pt-14`, então quem consome não precisa adicionar padding no topo.
 */
export function Sheet({
  open,
  onOpenChange,
  side = "left",
  title,
  children,
  className,
  floating = false,
  contentClassName,
}: SheetProps) {
  const { ref, onKeyDown } = useNativeDialog(open, onOpenChange);
  const t = useTranslations("common");
  const titleId = React.useId();

  return (
    <dialog
      ref={ref}
      onKeyDown={onKeyDown}
      tabIndex={-1}
      aria-labelledby={titleId}
      data-side={side}
      className={cn(
        "max-w-none p-0 focus:outline-none text-popover-foreground backdrop:bg-overlay/50 backdrop:backdrop-blur-sm",
        floating
          ? "glass mobile-sheet rounded-2xl overflow-hidden"
          : cn(
              "m-0 h-dvh max-h-dvh w-[min(320px,85vw)] bg-popover shadow-2xl",
              side === "left"
                ? "mr-auto rounded-r-xl border-r border-border"
                : "ml-auto rounded-l-xl border-l border-border"
            ),
        className
      )}
    >
      <div className="relative flex h-full flex-col">
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        <div className={cn("min-h-0 flex-1 overflow-y-auto pt-14", contentClassName)}>{children}</div>
        <Button
          // Evita que showModal() foque a busca e abra o teclado no mobile.
          autoFocus
          variant="ghost"
          size="icon-sm"
          aria-label={t("close")}
          data-dialog-close=""
          className={cn("absolute right-3 top-3 text-muted-foreground", floating && "right-2 top-2 size-11")}
          onClick={() => onOpenChange(false)}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </dialog>
  );
}
