// Identidade da marca exibida pelo app.
// Para criar seu próprio brand system, edite este arquivo, brand/theme.css,
// brand/fonts.ts, brand/navigation.ts e o conteúdo em content/.

export const brand = {
  /** Nome completo — títulos de página, metadata, prompt da IA */
  name: "VB Brand Systems",
  /** Texto do logotipo na sidebar e no login */
  wordmark: "VB BRAND SYSTEMS",
  /** Subtítulo curto exibido junto ao nome */
  tagline: "Brand System",
  /** Descrição usada em metadata e na home */
  description: "Diretrizes, ativos e identidade da marca VB Brand Systems em um só lugar.",
  locale: "pt-BR",

  /** Texto padrão do componente <TypographySample /> */
  specimenText: "VB Brand Systems — sua marca, organizada.",

  /** Links externos exibidos na barra superior. Vazio oculta o link. */
  links: {
    github: "" as string,
  },

  ai: {
    assistantName: "VB Brand Assistant",
    headline: "O que você quer construir hoje?",
    intro: "Pergunte, planeje e busque referências da marca VB Brand Systems.",
    placeholder: "Pergunte à IA sobre a marca VB Brand Systems...",
    suggestions: [
      "Qual é a paleta de cores da marca?",
      "Como devo usar o logo em fundo escuro?",
      "Qual é o tom de voz para posts de Instagram?",
    ],
  },
} as const;

export type Brand = typeof brand;
