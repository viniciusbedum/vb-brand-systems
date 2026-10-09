import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// Provedor do chat de IA, escolhido por variável de ambiente (só no servidor):
//
//   AI_PROVIDER=anthropic   (padrão)  ANTHROPIC_API_KEY  — Claude
//   AI_PROVIDER=openai                OPENAI_API_KEY     — modelos da OpenAI
//   AI_PROVIDER=gemini                GEMINI_API_KEY     — Gemini e Gemma (tem plano grátis no Google AI Studio)
//   AI_MODEL=...                      (opcional) troca o modelo do provedor escolhido
//
// Anthropic usa o SDK oficial da Anthropic. OpenAI e Gemini usam o SDK da OpenAI,
// já que o Gemini expõe um endpoint compatível.

export type AIProvider = 'anthropic' | 'openai' | 'gemini'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const PROVIDERS: Record<AIProvider, { keyVar: string; defaultModel: string; baseURL?: string }> = {
  anthropic: { keyVar: 'ANTHROPIC_API_KEY', defaultModel: 'claude-opus-5-5' },
  openai: { keyVar: 'OPENAI_API_KEY', defaultModel: 'gpt-5' },
  gemini: {
    keyVar: 'GEMINI_API_KEY',
    defaultModel: 'gemma-3-27b-it',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
}

// Modelos Claude que aceitam o fallback do servidor quando o classificador de segurança recusa.
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-fable-5-1', 'claude-sonnet-5-5'])

function resolveProvider(): AIProvider {
  const value = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()
  return value in PROVIDERS ? (value as AIProvider) : 'anthropic'
}

export function getAIConfig() {
  const provider = resolveProvider()
  const { keyVar, defaultModel, baseURL } = PROVIDERS[provider]
  return {
    provider,
    keyVar,
    apiKey: process.env[keyVar],
    model: process.env.AI_MODEL || defaultModel,
    baseURL,
  }
}

/** Texto da resposta em pedaços, conforme o modelo escreve. */
export async function* streamChat(system: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const { provider, apiKey, model, baseURL } = getAIConfig()

  if (provider === 'anthropic') {
    const client = new Anthropic({ apiKey })
    const stream = FALLBACK_MODELS.has(model)
      ? client.beta.messages.stream({
          model,
          max_tokens: 64000,
          system,
          messages,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
        })
      : client.messages.stream({ model, max_tokens: 64000, system, messages })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
    }
    return
  }

  const client = new OpenAI({ apiKey, baseURL })
  const stream = await client.chat.completions.create({
    model,
    messages: [{ role: 'system', content: system }, ...messages],
    stream: true,
  })
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? ''
    if (delta) yield delta
  }
}
