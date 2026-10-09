// Identidade da marca exibida pelo app.
// Para criar seu próprio brand system, edite este arquivo, brand/theme.css,
// brand/fonts.ts, brand/navigation.ts e o conteúdo em content/<idioma>/.
// Os textos da marca existem em cada idioma (en, pt); o resto da interface
// está em messages/<idioma>.json.

import type { Locale } from "@/i18n/locale-href";
import type { MenuLink } from "@/lib/navigation";

export const brand = {
  /** Nome completo — títulos de página, metadata, prompt da IA */
  name: "VB Brand Systems",
  /** Texto do logotipo na sidebar e no login */
  wordmark: "VB BRAND SYSTEMS",

  /** Links externos exibidos na barra superior. Vazio oculta o link. */
  links: {
    github: "" as string,
  },
} as const;

/**
 * Links extras do menu de preferências (o "⋯" da barra inferior no mobile), abaixo do idioma e do tema.
 * Vazio por padrão. Exemplo:
 *   { label: { en: "Privacy", pt: "Privacidade" }, href: "/docs/privacidade" }   // página interna
 *   { label: { en: "Website", pt: "Site" }, href: "https://example.com" }         // externo (nova aba)
 */
export const menuLinks: MenuLink[] = [];

export type BrandCopy = {
  /** Subtítulo curto exibido junto ao nome */
  tagline: string;
  /** Descrição usada em metadata e na home */
  description: string;
  /** Texto padrão do componente <TypographySample /> */
  specimenText: string;
  ai: {
    assistantName: string;
    headline: string;
    intro: string;
    placeholder: string;
    suggestions: string[];
  };
};

export const brandCopy: Record<Locale, BrandCopy> = {
  en: {
    tagline: "Brand System",
    description: "Guidelines, assets and identity of the VB Brand Systems brand in one place.",
    specimenText: "VB Brand Systems — your brand, organized.",
    ai: {
      assistantName: "VB Brand Assistant",
      headline: "What do you want to build today?",
      intro: "Ask, plan and look up references for the VB Brand Systems brand.",
      placeholder: "Ask the AI about the VB Brand Systems brand...",
      suggestions: [
        "What is the brand's color palette?",
        "How should I use the logo on a dark background?",
        "What is the tone of voice for Instagram posts?",
      ],
    },
  },
  pt: {
    tagline: "Brand System",
    description: "Diretrizes, ativos e identidade da marca VB Brand Systems em um só lugar.",
    specimenText: "VB Brand Systems — sua marca, organizada.",
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
  },
};

export type Brand = typeof brand;
