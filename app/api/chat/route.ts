import { NextRequest } from 'next/server';
import { retrieveRelevantChunks } from '@/lib/rag';
import { getAIConfig, streamChat } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/system-prompt';
import { getUser } from '@/lib/auth';
import { isDemoMode } from '@/lib/features';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/locale-href';
import { RAG_HEADING } from '@/lib/system-prompt';

export const dynamic = 'force-dynamic';

// POST /api/chat
// Body: { messages: Array<{ role: 'user' | 'assistant', content: string }>, locale?: 'en' | 'pt' }
// Response: text/event-stream
//   data: {"delta": "chunk"}\n\n  — text to append to the current AI message
//   data: {"error": true}\n\n     — the provider failed mid-request
//   data: [DONE]\n\n             — stream complete
export async function POST(req: NextRequest) {
  if (isDemoMode) return new Response('Not found', { status: 404 })

  const { keyVar, apiKey } = getAIConfig()
  if (!apiKey) {
    return new Response(`AI not configured: set ${keyVar} in .env.local`, { status: 503 })
  }

  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, locale: requestedLocale } = await req.json();
  const locale: Locale = (routing.locales as readonly string[]).includes(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const lastUserMessage = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === 'user');

  const relevantContext = lastUserMessage
    ? retrieveRelevantChunks(lastUserMessage.content, locale)
    : '';

  const systemPrompt = buildSystemPrompt(locale);
  const systemWithContext = relevantContext
    ? `${systemPrompt}\n\n## ${RAG_HEADING[locale]}\n\n${relevantContext}`
    : systemPrompt;

  const stream = streamChat(systemWithContext, messages);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of stream) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        // Chave inválida, limite do plano, modelo inexistente… O cliente mostra o erro padrão.
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: true })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
