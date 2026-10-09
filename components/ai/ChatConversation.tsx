"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversations } from "@/lib/conversations-context";
import { brand } from "@/brand/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { isDemoMode, DEMO_AI_REPLY } from "@/lib/features";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatConversationProps {
  conversationId?: string;
  initialMessages?: Message[];
  autoPrompt?: string;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "size-1.5 rounded-full bg-link/60 animate-bounce [animation-duration:0.8s]",
              i === 1 && "[animation-delay:0.15s]",
              i === 2 && "[animation-delay:0.3s]"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-sans">pensando…</span>
    </div>
  );
}

export function ChatConversation({ conversationId, initialMessages, autoPrompt }: ChatConversationProps) {
  const router = useRouter();
  const { addConversation } = useConversations();
  const [convId, setConvId] = useState<string | null>(conversationId ?? null);
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef<string | null>(conversationId ?? null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessages = useCallback(async (id: string, msgs: Message[]) => {
    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
    } catch {
      // silently fail — não bloqueia a UX
    }
  }, []);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMessage];
      const withPlaceholder: Message[] = [...updatedMessages, { role: "assistant", content: "" }];
      setMessages(withPlaceholder);
      setInput("");

      if (isDemoMode) {
        setMessages([...updatedMessages, { role: "assistant", content: DEMO_AI_REPLY }]);
        return;
      }

      setIsLoading(true);

      // Criar conversa no banco se ainda não existe
      let currentConvId = convIdRef.current;
      if (!currentConvId) {
        try {
          const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: trimmed.slice(0, 80),
              messages: updatedMessages,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            currentConvId = data.id;
            convIdRef.current = data.id;
            setConvId(data.id);
            window.history.replaceState({}, "", `/chat/${data.id}`);
            addConversation({
              id: data.id,
              title: trimmed.slice(0, 80),
              pinned: false,
              updated_at: new Date().toISOString(),
            });
          }
        } catch {
          // continua sem persistência se falhar
        }
      }

      // Streaming da resposta
      const finalMessages = [...withPlaceholder];
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!res.ok || !res.body) throw new Error("Resposta inválida");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") break;
            try {
              const { delta } = JSON.parse(payload) as { delta: string };
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + delta,
                };
                finalMessages[finalMessages.length - 1] = copy[copy.length - 1];
                return copy;
              });
            } catch {
              // chunk malformado
            }
          }
        }
      } catch {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Erro ao conectar com a IA. Verifique sua conexão e a chave de API.",
          };
          return copy;
        });
      } finally {
        setIsLoading(false);
        // Salvar mensagens finais no banco
        if (currentConvId) {
          setMessages((prev) => {
            saveMessages(currentConvId!, prev);
            return prev;
          });
        }
      }
    },
    [messages, isLoading, saveMessages]
  );

  useEffect(() => {
    if (autoPrompt && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      submit(autoPrompt);
    }
  }, [autoPrompt, submit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const hasMessages = messages.length > 0;
  const isStreaming =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  const inputBox = (
    <Card glass className="w-full p-2 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex items-end gap-2">
        <Textarea
          autoResize
          maxHeight={160}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={brand.ai.placeholder}
          aria-label="Mensagem para o assistente"
          disabled={isLoading}
          rows={1}
          className="min-h-10 flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          size="icon"
          onClick={() => submit(input)}
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensagem"
        >
          <ArrowUp size={16} />
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      {hasMessages ? (
        <>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages([]);
                    setConvId(null);
                    convIdRef.current = null;
                    router.push("/chat");
                  }}
                >
                  <RotateCcw size={14} />
                  Nova conversa
                </Button>
              </div>
              {messages.map((msg, i) => {
                const isLastAssistant =
                  msg.role === "assistant" && i === messages.length - 1;
                return msg.role === "user" ? (
                  <div
                    key={i}
                    className="ml-auto max-w-[85%] w-fit rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm whitespace-pre-wrap break-words"
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="max-w-[85%] w-fit rounded-xl bg-card border border-border px-4 py-3 text-sm text-card-foreground leading-relaxed break-words"
                  >
                    {isLastAssistant && isStreaming && !msg.content ? (
                      <ThinkingDots />
                    ) : (
                      <>
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                        {isLastAssistant && isStreaming && msg.content && (
                          <span className="ml-0.5 inline-block h-4 w-0.5 bg-link animate-pulse align-middle" />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur p-4">
            <div className="mx-auto max-w-3xl">{inputBox}</div>
          </div>
        </>
      ) : (
        <div data-backdrop className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 sm:px-6">
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
                {brand.ai.headline}
              </h1>
              <p className="text-muted-foreground">{brand.ai.intro}</p>
            </div>
            {inputBox}
          </div>
        </div>
      )}
    </div>
  );
}
