"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locale-href";
import { brandCopy } from "@/brand/config";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "./ChatComposer";

export function HomeChat() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [input, setInput] = useState("");

  const goToChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push({ pathname: "/chat", query: { q: trimmed } });
  };

  return (
    <div className="space-y-3">
      <ChatComposer value={input} onChange={setInput} onSubmit={goToChat} />
      <div className="flex flex-wrap gap-2">
        {brandCopy[locale].ai.suggestions.map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            className="rounded-full h-auto min-h-9 py-1.5 text-left whitespace-normal"
            onClick={() => goToChat(s)}
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
