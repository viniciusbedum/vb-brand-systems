import type { NavConfig } from "@/lib/navigation";

// Seções da sidebar e cards da home. Cada `slug` aponta para content/<slug>.mdx.
// `icon` usa os nomes Phosphor registrados em lib/icons.ts (https://phosphoricons.com).
// Seção com `items: []` aparece como "em breve".
export const navConfig: NavConfig = [
  {
    title: "Introdução",
    icon: "BookOpen",
    href: "/docs/introducao",
    items: [{ title: "Bem-vindo", slug: "introducao" }],
    defaultOpen: true,
  },
  {
    title: "Núcleo da Marca",
    icon: "Fingerprint",
    dividerAfter: true,
    items: [
      { title: "Propósito e valores", slug: "nucleo/proposito" },
      { title: "Posicionamento", slug: "nucleo/posicionamento" },
    ],
  },
  {
    title: "Universo Verbal",
    icon: "ChatText",
    items: [
      { title: "Personalidade", slug: "voz-e-tom/personalidade" },
      { title: "Princípios de voz", slug: "voz-e-tom/principios" },
      { title: "Exemplos", slug: "voz-e-tom/exemplos" },
    ],
  },
  {
    title: "Universo Visual",
    icon: "Eye",
    items: [
      { title: "Logotipo", slug: "identidade-visual/logo" },
      { title: "Uso incorreto", slug: "identidade-visual/uso-incorreto" },
      { title: "Paleta de cores", slug: "cores/paleta" },
      { title: "Uso de cores", slug: "cores/uso-de-cores" },
      { title: "Famílias tipográficas", slug: "tipografia/familias" },
      { title: "Escala tipográfica", slug: "tipografia/escala" },
    ],
  },
  {
    title: "Aplicações",
    icon: "SquaresFour",
    items: [{ title: "Redes sociais", slug: "aplicacoes/redes-sociais" }],
  },
  {
    title: "Universo Sonoro",
    icon: "WaveSine",
    items: [],
  },
];
