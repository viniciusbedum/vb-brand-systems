"use client";

import { Moon, Sun } from "@/lib/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("preferences");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reserva o espaço do botão até hidratar (evita layout shift e ícone errado).
  if (!mounted) return <div className="h-9 w-9" aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={t("themeToggle")}
      className="text-muted-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
