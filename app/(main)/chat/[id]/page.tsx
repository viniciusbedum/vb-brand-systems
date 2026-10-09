import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import { isAIVisible, isDemoMode } from "@/lib/features";
import { ChatConversation } from "@/components/ai/ChatConversation";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Conversa" };

export default async function ChatIdPage({ params }: Props) {
  if (!isAIVisible || isDemoMode) redirect("/");
  const { id } = await params;
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
