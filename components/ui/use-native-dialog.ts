"use client";

import * as React from "react";

/**
 * Liga um `<dialog>` nativo a um estado controlado (`open` / `onOpenChange`).
 *
 * - `showModal()` / `close()` acompanham `open` (top layer, `inert` no fundo e
 *   foco inicial são nativos do navegador).
 * - Esc é tratado pelo `onKeyDown` (React) devolvido pelo hook e ligado ao
 *   `<dialog>`: assim handlers internos (Input, DropdownMenuContent) que chamam
 *   `preventDefault()`/`stopPropagation()` impedem o fechamento. Um listener
 *   nativo de `keydown` no `<dialog>` rodaria ANTES da delegação do React (na
 *   raiz) e não poderia ser interrompido por eles.
 * - `cancel` nativo (close request sem keydown, ex.: botão voltar do Android),
 *   `close` nativo e clique no backdrop chamam `onOpenChange(false)`.
 * - O pedido de fechamento é idempotente por abertura: Esc fecha exatamente uma vez.
 * - Guarda `document.activeElement` ao abrir e devolve o foco ao fechar.
 * - Não altera estilos do `body`.
 */
export function useNativeDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void
): {
  ref: React.RefObject<HTMLDialogElement | null>;
  onKeyDown: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
} {
  const ref = React.useRef<HTMLDialogElement>(null);
  const onOpenChangeRef = React.useRef(onOpenChange);
  const openRef = React.useRef(open);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  // true logo após um pedido de fechamento (evita chamar onOpenChange(false) 2x no mesmo Esc).
  const closeRequestedRef = React.useRef(false);

  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
    openRef.current = open;
  });

  const restoreFocus = React.useCallback(() => {
    const el = returnFocusRef.current;
    returnFocusRef.current = null;
    if (el && el.isConnected && typeof el.focus === "function") {
      el.focus({ preventScroll: true });
    }
  }, []);

  // Sincroniza o estado controlado com o elemento nativo.
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
      dialog.showModal();
      // Se o foco inicial caiu no botão de fechar, o anel de foco apareceria sem o usuário ter
      // navegado por teclado. Leva o foco ao próprio dialog (sem anel); o Tab segue normal.
      if (document.activeElement instanceof HTMLElement && document.activeElement.hasAttribute("data-dialog-close")) {
        dialog.focus({ preventScroll: true });
      }
    } else if (!open && dialog.open) {
      dialog.close();
      restoreFocus();
    }
  }, [open, restoreFocus]);

  const requestClose = React.useCallback(() => {
    if (!openRef.current || closeRequestedRef.current) return;
    closeRequestedRef.current = true;
    // Libera no próximo task: cobre keydown + cancel do mesmo Esc, mas não trava
    // o Esc seguinte caso quem controla o estado ignore o pedido.
    window.setTimeout(() => {
      closeRequestedRef.current = false;
    }, 0);
    onOpenChangeRef.current(false);
  }, []);

  // Esc via React: roda depois dos onKeyDown internos (bubbling), que podem impedi-lo.
  // preventDefault() no keydown também impede o `cancel` nativo do navegador.
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key !== "Escape" || event.defaultPrevented || event.nativeEvent.isComposing) return;
      event.preventDefault();
      requestClose();
    },
    [requestClose]
  );

  // Eventos nativos: cancel, close e clique no backdrop.
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      // Nunca deixa o navegador fechar sozinho; o estado controlado decide.
      event.preventDefault();
      requestClose();
    };
    const onClose = () => {
      // Evento `close` atrasado (StrictMode ou fechar→abrir rápido) chega depois de
      // showModal() ter reaberto o dialog: ignora para não fechar de novo.
      if (dialog.open) return;
      // Fechado pelo navegador (ex.: segundo Esc sem ativação do usuário, form method="dialog").
      restoreFocus();
      requestClose();
    };

    let pointerDownOnBackdrop = false;
    const onMouseDown = (event: MouseEvent) => {
      pointerDownOnBackdrop = event.target === dialog;
    };
    const onClick = (event: MouseEvent) => {
      // Só fecha se o clique começou e terminou no backdrop (evita fechar ao arrastar seleção).
      if (event.target === dialog && pointerDownOnBackdrop) requestClose();
      pointerDownOnBackdrop = false;
    };

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("mousedown", onMouseDown);
    dialog.addEventListener("click", onClick);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("mousedown", onMouseDown);
      dialog.removeEventListener("click", onClick);
    };
  }, [restoreFocus, requestClose]);

  // Desmontado enquanto aberto: fecha e devolve o foco.
  React.useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) {
        dialog.close();
        restoreFocus();
      }
    };
  }, [restoreFocus]);

  return { ref, onKeyDown };
}
