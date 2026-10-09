"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUp } from "@/lib/icons";
import { brandCopy } from "@/brand/config";
import type { Locale } from "@/i18n/locale-href";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  /** `hero`: destaque no centro da tela. `dock`: fixo na base durante a conversa. */
  variant?: "hero" | "dock";
};

export function ChatComposer({ value, onChange, onSubmit, disabled = false, variant = "hero" }: ChatComposerProps) {
  const hero = variant === "hero";
  const locale = useLocale() as Locale;
  const t = useTranslations("chat");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <Card
      glass
      className={cn(
        "w-full rounded-2xl border-primary/20 shadow-xl focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring",
        hero ? "p-4" : "p-3"
      )}
    >
      <Textarea
        autoResize
        maxHeight={200}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={brandCopy[locale].ai.placeholder}
        aria-label={t("messageLabel")}
        disabled={disabled}
        className={cn(
          "border-0 bg-transparent px-1 py-1 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base",
          hero ? "min-h-[88px]" : "min-h-[52px]"
        )}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {t("hint")}
        </span>
        <Button
          onClick={() => onSubmit(value)}
          disabled={disabled || !value.trim()}
          aria-label={t("send")}
          className="ml-auto h-11 w-11 rounded-full p-0"
        >
          <ArrowUp size={20} />
        </Button>
      </div>
    </Card>
  );
}
