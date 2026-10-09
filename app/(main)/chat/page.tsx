import { redirect } from "next/navigation";
import { ChatConversation } from "@/components/ai/ChatConversation";
import { isAIVisible } from "@/lib/features";

export const metadata = { title: "Nova Conversa" };

type Props = { searchParams: Promise<{ q?: string; new?: string }> };

export default async function ChatPage({ searchParams }: Props) {
  if (!isAIVisible) redirect("/");
  const { q, new: newConversation } = await searchParams;
  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      <ChatConversation key={newConversation ?? "default"} autoPrompt={q} />
    </main>
  );
}
