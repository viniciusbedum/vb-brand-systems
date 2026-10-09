"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type ColorSwatchProps = {
  name: string;
  hex: string;
  rgb?: string;
  token?: string;
  usage?: string;
};

export function ColorSwatch({ name, hex, rgb, token, usage }: ColorSwatchProps) {
  const t = useTranslations("mdx");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = () => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(hex).then(
      () => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      },
      () => {
        /* clipboard indisponível */
      },
    );
  };

  return (
    <Card className="not-prose min-w-0 overflow-hidden">
      <Button
        variant="ghost"
        onClick={handleCopy}
        className="group relative h-24 w-full rounded-t-xl rounded-b-none p-0 hover:bg-transparent focus-visible:ring-inset"
        style={{ backgroundColor: hex }}
        aria-label={t("copyHex", { hex })}
      >
        <span
          className={cn(
            "absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-xs font-medium text-foreground transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
            copied ? "opacity-100" : "opacity-0",
          )}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t("copied") : t("copy")}
        </span>
      </Button>
      <div className="space-y-1 p-4">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="break-all font-mono text-xs text-muted-foreground">{hex}</p>
        {rgb && <p className="break-all font-mono text-xs text-muted-foreground">rgb({rgb})</p>}
        {token && <p className="break-all font-mono text-xs text-muted-foreground">{token}</p>}
        {usage && <p className="text-xs text-foreground/80">{usage}</p>}
        <span className="sr-only" aria-live="polite">
          {copied ? t("hexCopied", { hex }) : ""}
        </span>
      </div>
    </Card>
  );
}
