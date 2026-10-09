import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isAIVisible, isDemoMode } from "@/lib/features";
import { ChatConversation } from "@/components/ai/ChatConversation";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "chat" });
  return { title: t("conversationTitle") };
}

export default async function ChatIdPage({ params }: Props) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  if (!isAIVisible || isDemoMode) redirect({ href: "/", locale });
  const supabase = await createClient();

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("id, messages")
    .eq("id", id)
    .single();

  if (error || !conversation) notFound();

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      <ChatConversation
        conversationId={conversation.id}
        initialMessages={conversation.messages}
      />
    </main>
  );
}
