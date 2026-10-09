import type { NavConfig } from "@/lib/navigation";

// Seções da sidebar e cards da home. Cada `slug` aponta para content/<idioma>/<slug>.mdx.
// Os títulos existem em cada idioma ({ en, pt }). Os slugs são os mesmos nos dois.
// `icon` usa os nomes Phosphor registrados em lib/icons.ts (https://phosphoricons.com).
// Seção com `items: []` aparece como "em breve".
export const navConfig: NavConfig = [
  {
    title: { en: "Introduction", pt: "Introdução" },
    icon: "BookOpen",
    href: "/docs/introducao",
    items: [{ title: { en: "Welcome", pt: "Bem-vindo" }, slug: "introducao" }],
    defaultOpen: true,
  },
  {
    title: { en: "Brand Core", pt: "Núcleo da Marca" },
    icon: "Fingerprint",
    dividerAfter: true,
    items: [
      { title: { en: "Purpose and values", pt: "Propósito e valores" }, slug: "nucleo/proposito" },
      { title: { en: "Positioning", pt: "Posicionamento" }, slug: "nucleo/posicionamento" },
    ],
  },
  {
    title: { en: "Verbal Universe", pt: "Universo Verbal" },
    icon: "ChatText",
    items: [
      { title: { en: "Personality", pt: "Personalidade" }, slug: "voz-e-tom/personalidade" },
      { title: { en: "Voice principles", pt: "Princípios de voz" }, slug: "voz-e-tom/principios" },
      { title: { en: "Examples", pt: "Exemplos" }, slug: "voz-e-tom/exemplos" },
    ],
  },
  {
    title: { en: "Visual Universe", pt: "Universo Visual" },
    icon: "Eye",
    items: [
      { title: { en: "Logo", pt: "Logotipo" }, slug: "identidade-visual/logo" },
      { title: { en: "Incorrect use", pt: "Uso incorreto" }, slug: "identidade-visual/uso-incorreto" },
      { title: { en: "Color palette", pt: "Paleta de cores" }, slug: "cores/paleta" },
      { title: { en: "Color usage", pt: "Uso de cores" }, slug: "cores/uso-de-cores" },
      { title: { en: "Type families", pt: "Famílias tipográficas" }, slug: "tipografia/familias" },
      { title: { en: "Type scale", pt: "Escala tipográfica" }, slug: "tipografia/escala" },
    ],
  },
  {
    title: { en: "Applications", pt: "Aplicações" },
    icon: "SquaresFour",
    items: [{ title: { en: "Social media", pt: "Redes sociais" }, slug: "aplicacoes/redes-sociais" }],
  },
  {
    title: { en: "Sonic Universe", pt: "Universo Sonoro" },
    icon: "WaveSine",
    items: [],
  },
];
