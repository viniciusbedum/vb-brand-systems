"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Desktop, Moon, Sun } from "@/lib/icons";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun, key: "light" },
  { value: "dark", icon: Moon, key: "dark" },
  { value: "system", icon: Desktop, key: "system" },
] as const;

/** Escolha de tema em três botões na horizontal: claro, escuro e do sistema. */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("preferences");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div role="group" aria-label={t("theme")} className={cn("flex items-center gap-1", className)}>
      {OPTIONS.map(({ value, icon: Icon, key }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={t(key)}
            title={t(key)}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-8 min-w-9 items-center justify-center rounded-lg border px-2.5 transition-colors [&_svg]:size-4",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
