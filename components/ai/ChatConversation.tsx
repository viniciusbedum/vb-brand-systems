"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { localeHref, type Locale } from "@/i18n/locale-href";
import { ArrowCounterClockwise as RotateCcw } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useConversations } from "@/lib/conversations-context";
import { brandCopy } from "@/brand/config";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "./ChatComposer";
import { isDemoMode } from "@/lib/features";

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
  const t = useTranslations("chat");
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
      <span className="text-xs font-sans">{t("thinking")}</span>
    </div>
  );
}

export function ChatConversation({ conversationId, initialMessages, autoPrompt }: ChatConversationProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("chat");
  const tDemo = useTranslations("demo");
  const copy = brandCopy[locale];
  const { addConversation } = useConversations();
  const [convId, setConvId] = useState<string | null>(conversationId ?? null);
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef<string | null>(conversationId ?? null);
  const autoSubmittedRef = useRef(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    const measure = () => layoutRef.current?.style.setProperty("--mobile-composer-height", `${composer.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(composer);
    return () => observer.disconnect();
  }, [messages.length > 0]);

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
        setMessages([...updatedMessages, { role: "assistant", content: tDemo("aiReply") }]);
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
            window.history.replaceState({}, "", localeHref(`/chat/${data.id}`, locale));
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
          body: JSON.stringify({ messages: updatedMessages, locale }),
        });

        if (!res.ok || !res.body) throw new Error("Invalid response");

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
            content: t("error"),
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
    [messages, isLoading, saveMessages, locale, t, tDemo, addConversation]
  );

  useEffect(() => {
    if (autoPrompt && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      submit(autoPrompt);
    }
  }, [autoPrompt, submit]);

  const hasMessages = messages.length > 0;
  const isStreaming =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  const inputBox = (
    <ChatComposer
      value={input}
      onChange={setInput}
      onSubmit={submit}
      disabled={isLoading}
      variant={hasMessages ? "dock" : "hero"}
    />
  );

  return (
    <div ref={layoutRef} className="mobile-chat-layout flex h-full w-full min-w-0 flex-col">
      {hasMessages ? (
        <>
          <div className="mobile-chat-messages flex-1 overflow-y-auto overflow-x-hidden">
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
                  {t("newConversation")}
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
          <div ref={composerRef} className="mobile-chat-composer shrink-0 border-t border-border bg-background/80 backdrop-blur p-4">
            <div className="mx-auto max-w-3xl">{inputBox}</div>
          </div>
        </>
      ) : (
        <div data-backdrop className="mobile-chat-empty flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 sm:px-6">
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-[26px] md:text-[32px] leading-[1.15] font-semibold tracking-tight">
                {copy.ai.headline}
              </h1>
              <p className="text-muted-foreground">{copy.ai.intro}</p>
            </div>
            {inputBox}
          </div>
        </div>
      )}
    </div>
  );
}
