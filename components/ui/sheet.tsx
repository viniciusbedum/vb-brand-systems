"use client";

import * as React from "react";
import { X } from "lucide-react";
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
}: SheetProps) {
  const { ref, onKeyDown } = useNativeDialog(open, onOpenChange);
  const titleId = React.useId();

  return (
    <dialog
      ref={ref}
      onKeyDown={onKeyDown}
      aria-labelledby={titleId}
      className={cn(
        "m-0 h-dvh max-h-dvh w-[min(320px,85vw)] max-w-none bg-popover p-0 text-popover-foreground shadow-2xl backdrop:bg-overlay/50 backdrop:backdrop-blur-sm",
        side === "left"
          ? "mr-auto rounded-r-xl border-r border-border"
          : "ml-auto rounded-l-xl border-l border-border",
        className
      )}
    >
      <div className="relative flex h-full flex-col">
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto pt-14">{children}</div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Fechar"
          className="absolute right-3 top-3 text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </dialog>
  );
}
