import type { Locale } from "@/i18n/locale-href";

type Localized = Record<Locale, string>;

type RawAssetCategory = {
  slug: string;
  label: Localized;
  icon: string;
  description: Localized;
  accept: string;
  emptyMessage: Localized;
  extensions: string[];
};

/** Categoria de ativos já traduzida para um idioma. */
export type AssetCategory = {
  slug: string;
  label: string;
  icon: string;
  description: string;
  accept: string;
  emptyMessage: string;
  extensions: string[];
};

// Os slugs (logotipos, imagens…) são chaves estáveis: nomeiam as pastas do storage e as URLs.
const rawAssetCategories: RawAssetCategory[] = [
  {
    slug: "logotipos",
    label: { en: "Logos", pt: "Logotipos" },
    icon: "Stack",
    description: { en: "Logo versions in different formats and variations.", pt: "Versões do logo em diferentes formatos e variações." },
    accept: ".svg,.png,.pdf,.ai,.eps",
    emptyMessage: { en: "No logos added yet.", pt: "Nenhum logotipo adicionado ainda." },
    extensions: ["SVG", "PNG", "PDF", "AI", "EPS"],
  },
  {
    slug: "tipografia",
    label: { en: "Typography", pt: "Tipografia" },
    icon: "TextT",
    description: { en: "Brand fonts and typography files.", pt: "Fontes e arquivos de tipografia da marca." },
    accept: ".ttf,.otf,.woff,.woff2",
    emptyMessage: { en: "No fonts added yet.", pt: "Nenhuma fonte adicionada ainda." },
    extensions: ["TTF", "OTF", "WOFF", "WOFF2"],
  },
  {
    slug: "imagens",
    label: { en: "Images", pt: "Imagens" },
    icon: "Image",
    description: { en: "Photos, illustrations and visual elements of the brand.", pt: "Fotos, ilustrações e elementos visuais da marca." },
    accept: "image/*",
    emptyMessage: { en: "No images added yet.", pt: "Nenhuma imagem adicionada ainda." },
    extensions: ["JPG", "PNG", "WEBP", "GIF", "SVG"],
  },
  {
    slug: "videos",
    label: { en: "Videos", pt: "Vídeos" },
    icon: "VideoCamera",
    description: { en: "Videos, motion graphics and animations of the brand.", pt: "Vídeos, motion graphics e animações da marca." },
    accept: "video/*",
    emptyMessage: { en: "No videos added yet.", pt: "Nenhum vídeo adicionado ainda." },
    extensions: ["MP4", "MOV", "WEBM", "AVI"],
  },
  {
    slug: "audios",
    label: { en: "Audio", pt: "Áudios" },
    icon: "MusicNotes",
    description: { en: "Jingles, soundtracks and sonic identity.", pt: "Jingles, trilhas sonoras e identidade sonora." },
    accept: "audio/*",
    emptyMessage: { en: "No audio added yet.", pt: "Nenhum áudio adicionado ainda." },
    extensions: ["MP3", "WAV", "AAC", "OGG"],
  },
  {
    slug: "documentos",
    label: { en: "Documents", pt: "Documentos" },
    icon: "FileText",
    description: { en: "PDFs, presentations and brand documents.", pt: "PDFs, apresentações e documentos de marca." },
    accept: ".pdf,.pptx,.ppt,.docx,.doc",
    emptyMessage: { en: "No documents added yet.", pt: "Nenhum documento adicionado ainda." },
    extensions: ["PDF", "PPTX", "DOCX"],
  },
  {
    slug: "icones",
    label: { en: "Icons", pt: "Ícones" },
    icon: "Shapes",
    description: { en: "Icon set and iconographic elements of the brand.", pt: "Set de ícones e elementos iconográficos da marca." },
    accept: ".svg,.png,.ico",
    emptyMessage: { en: "No icons added yet.", pt: "Nenhum ícone adicionado ainda." },
    extensions: ["SVG", "PNG", "ICO"],
  },
  {
    slug: "mockups",
    label: { en: "Mockups", pt: "Mockups" },
    icon: "Monitor",
    description: { en: "Product mockups and previews of the applied brand.", pt: "Mockups de produto e visualizações de marca aplicada." },
    accept: "image/*,.psd,.sketch,.fig",
    emptyMessage: { en: "No mockups added yet.", pt: "Nenhum mockup adicionado ainda." },
    extensions: ["PSD", "SKETCH", "FIG", "PNG", "JPG"],
  },
];

export function getAssetCategories(locale: Locale): AssetCategory[] {
  return rawAssetCategories.map((c) => ({
    ...c,
    label: c.label[locale],
    description: c.description[locale],
    emptyMessage: c.emptyMessage[locale],
  }));
}

export function getAssetCategorySlugs(): string[] {
  return rawAssetCategories.map((c) => c.slug);
}

export function getCategoryBySlug(locale: Locale, slug: string): AssetCategory | undefined {
  return getAssetCategories(locale).find((c) => c.slug === slug);
}
