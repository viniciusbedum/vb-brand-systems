"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "@/lib/icons";
import { brand } from "@/brand/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function HomeChat() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const goToChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      goToChat(input);
    }
  };

  return (
    <div className="space-y-3">
      <Card glass className="p-2 focus-within:ring-2 focus-within:ring-ring">
        <div className="flex items-end gap-2">
          <Textarea
            autoResize
            maxHeight={160}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={brand.ai.placeholder}
            aria-label="Mensagem para o assistente"
            className="min-h-10 flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            onClick={() => goToChat(input)}
            disabled={!input.trim()}
            aria-label="Enviar mensagem"
          >
            <ArrowUp size={16} />
          </Button>
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">
        {brand.ai.suggestions.map((s) => (
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
