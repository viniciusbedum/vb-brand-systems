"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type InitialFocus = "first" | "last";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  triggerId: string;
  contentId: string;
  initialFocus: InitialFocus;
  openMenu: (focus?: InitialFocus) => void;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu(component: string) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error(`${component} precisa estar dentro de <DropdownMenu>.`);
  return ctx;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function DropdownMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [initialFocus, setInitialFocus] = React.useState<InitialFocus>("first");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const triggerId = React.useId();
  const contentId = React.useId();

  const openMenu = React.useCallback((focus: InitialFocus = "first") => {
    setInitialFocus(focus);
    setOpen(true);
  }, []);

  const closeMenu = React.useCallback((options?: { focusTrigger?: boolean }) => {
    setOpen(false);
    if (options?.focusTrigger) triggerRef.current?.focus();
  }, []);

  // Clique (mousedown) fora fecha o menu sem roubar o foco.
  React.useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && wrapperRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const value = React.useMemo<DropdownMenuContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      triggerId,
      contentId,
      initialFocus,
      openMenu,
      closeMenu,
    }),
    [open, triggerId, contentId, initialFocus, openMenu, closeMenu]
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div ref={wrapperRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const { open, triggerRef, triggerId, contentId, openMenu, closeMenu } =
    useDropdownMenu("DropdownMenuTrigger");

  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      aria-label={ariaLabel}
      className={cn(focusRing, className)}
      onClick={() => (open ? closeMenu({ focusTrigger: true }) : openMenu("first"))}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          openMenu("first");
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          openMenu("last");
        }
      }}
    >
      {children}
    </button>
  );
}

function getItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
  );
}

export function DropdownMenuContent({
  children,
  align = "start",
  side = "bottom",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  side?: "top" | "bottom";
  className?: string;
}) {
  const { open, triggerId, contentId, initialFocus, closeMenu } =
    useDropdownMenu("DropdownMenuContent");
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Foca o primeiro (ou último, via ↑ no gatilho) item ao abrir.
  React.useEffect(() => {
    if (!open) return;
    const items = getItems(menuRef.current);
    const target = initialFocus === "last" ? items[items.length - 1] : items[0];
    (target ?? menuRef.current)?.focus();
  }, [open, initialFocus]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getItems(menuRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        move(index + 1);
        break;
      case "ArrowUp":
        move(index < 0 ? items.length - 1 : index - 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation(); // não fecha um Dialog/Sheet que contenha o menu
        closeMenu({ focusTrigger: true });
        break;
      case "Tab":
        // Foca o gatilho sem preventDefault: o Tab/Shift+Tab continua a partir dele
        // (Safari/Firefox perderiam a posição quando o item focado é desmontado).
        closeMenu({ focusTrigger: true });
        break;
    }
  };

  return (
    <div
      ref={menuRef}
      id={contentId}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute z-50 min-w-48 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl outline-none",
        align === "end" ? "right-0" : "left-0",
        side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  onSelect,
  variant = "default",
  disabled = false,
  children,
  className,
}: {
  onSelect: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const { closeMenu } = useDropdownMenu("DropdownMenuItem");

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex h-9 w-full cursor-default select-none items-center gap-2 rounded-lg px-3 text-left text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
        focusRing,
        variant === "destructive"
          ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          : "text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onMouseEnter={(event) => {
        if (!disabled) event.currentTarget.focus({ preventScroll: true });
      }}
      onClick={() => {
        if (disabled) return;
        // Devolve o foco ao gatilho antes de onSelect, que pode movê-lo (ex.: abrir um Dialog).
        closeMenu({ focusTrigger: true });
        onSelect();
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="none"
      className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", className)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}
