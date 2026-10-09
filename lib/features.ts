// Variáveis NEXT_PUBLIC_* são embutidas no build: estes flags valem no server e no client.

/**
 * Modo demo: sem banco e sem login. Visitante navega por docs e assets de exemplo.
 * Ativa sozinho quando o Supabase não está configurado.
 */
export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Interface do chat de IA (padrão: visível). NEXT_PUBLIC_AI_ENABLED=false esconde tudo.
 * Para responder de verdade exige o modo completo + OPENROUTER_API_KEY no servidor;
 * no modo demo o chat aparece, mas responde com um aviso.
 */
export const isAIVisible = process.env.NEXT_PUBLIC_AI_ENABLED !== "false";

export const DEMO_AI_REPLY =
  "Este é o modo demonstração: o chat de IA não está conectado a nenhum modelo. " +
  "Para ativá-lo, configure o Supabase e uma OPENROUTER_API_KEY — o passo a passo está no README.";

export const DEMO_UPLOAD_NOTICE =
  "Upload indisponível no modo demonstração — não há armazenamento conectado. " +
  "Configure o Supabase para enviar arquivos.";

export const DEMO_USER = {
  name: "Visitante",
  email: null,
  role: "staff",
} as const;
