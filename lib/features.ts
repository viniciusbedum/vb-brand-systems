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

// Os textos do modo demo (resposta da IA, aviso de upload, nome do visitante)
// estão em messages/<idioma>.json, namespace "demo".
export const DEMO_USER = {
  email: null,
  role: "staff",
} as const;
