import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ChatConversation } from "@/components/ai/ChatConversation";
import { isAIVisible } from "@/lib/features";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "chat" });
  return { title: t("newConversationTitle") };
}

export default async function ChatPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  if (!isAIVisible) redirect({ href: "/", locale });
  const { q } = await searchParams;
  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      <ChatConversation autoPrompt={q} />
    </main>
  );
}
