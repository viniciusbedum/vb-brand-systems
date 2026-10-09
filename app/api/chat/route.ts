import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { retrieveRelevantChunks } from '@/lib/rag';
import { buildSystemPrompt } from '@/lib/system-prompt';
import { getUser } from '@/lib/auth';
import { brand } from '@/brand/config';
import { isDemoMode } from '@/lib/features';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/locale-href';
import { RAG_HEADING } from '@/lib/system-prompt';

export const dynamic = 'force-dynamic';

// POST /api/chat
// Body: { messages: Array<{ role: 'user' | 'assistant', content: string }>, locale?: 'en' | 'pt' }
// Response: text/event-stream
//   data: {"delta": "chunk"}\n\n  — text to append to the current AI message
//   data: [DONE]\n\n             — stream complete
export async function POST(req: NextRequest) {
  if (isDemoMode) return new Response('Not found', { status: 404 })
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response('AI not configured: set OPENROUTER_API_KEY', { status: 503 })
  }

  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': brand.name,
    },
  });

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

  const stream = await openai.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it',
    messages: [
      { role: 'system', content: systemWithContext },
      ...messages,
    ],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
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
