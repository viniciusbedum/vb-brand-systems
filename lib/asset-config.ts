export type AssetCategory = {
  slug: string;
  label: string;
  icon: string;
  description: string;
  accept: string;
  emptyMessage: string;
  extensions: string[];
};

export const assetCategories: AssetCategory[] = [
  {
    slug: "logotipos",
    label: "Logotipos",
    icon: "Layers",
    description: "Versões do logo em diferentes formatos e variações.",
    accept: ".svg,.png,.pdf,.ai,.eps",
    emptyMessage: "Nenhum logotipo adicionado ainda.",
    extensions: ["SVG", "PNG", "PDF", "AI", "EPS"],
  },
  {
    slug: "tipografia",
    label: "Tipografia",
    icon: "Type",
    description: "Fontes e arquivos de tipografia da marca.",
    accept: ".ttf,.otf,.woff,.woff2",
    emptyMessage: "Nenhuma fonte adicionada ainda.",
    extensions: ["TTF", "OTF", "WOFF", "WOFF2"],
  },
  {
    slug: "imagens",
    label: "Imagens",
    icon: "Image",
    description: "Fotos, ilustrações e elementos visuais da marca.",
    accept: "image/*",
    emptyMessage: "Nenhuma imagem adicionada ainda.",
    extensions: ["JPG", "PNG", "WEBP", "GIF", "SVG"],
  },
  {
    slug: "videos",
    label: "Vídeos",
    icon: "Video",
    description: "Vídeos, motion graphics e animações da marca.",
    accept: "video/*",
    emptyMessage: "Nenhum vídeo adicionado ainda.",
    extensions: ["MP4", "MOV", "WEBM", "AVI"],
  },
  {
    slug: "audios",
    label: "Áudios",
    icon: "Music",
    description: "Jingles, trilhas sonoras e identidade sonora.",
    accept: "audio/*",
    emptyMessage: "Nenhum áudio adicionado ainda.",
    extensions: ["MP3", "WAV", "AAC", "OGG"],
  },
  {
    slug: "documentos",
    label: "Documentos",
    icon: "FileText",
    description: "PDFs, apresentações e documentos de marca.",
    accept: ".pdf,.pptx,.ppt,.docx,.doc",
    emptyMessage: "Nenhum documento adicionado ainda.",
    extensions: ["PDF", "PPTX", "DOCX"],
  },
  {
    slug: "icones",
    label: "Ícones",
    icon: "Shapes",
    description: "Set de ícones e elementos iconográficos da marca.",
    accept: ".svg,.png,.ico",
    emptyMessage: "Nenhum ícone adicionado ainda.",
    extensions: ["SVG", "PNG", "ICO"],
  },
  {
    slug: "mockups",
    label: "Mockups",
    icon: "Monitor",
    description: "Mockups de produto e visualizações de marca aplicada.",
    accept: "image/*,.psd,.sketch,.fig",
    emptyMessage: "Nenhum mockup adicionado ainda.",
    extensions: ["PSD", "SKETCH", "FIG", "PNG", "JPG"],
  },
];

export function getCategoryBySlug(slug: string): AssetCategory | undefined {
  return assetCategories.find((c) => c.slug === slug);
}
