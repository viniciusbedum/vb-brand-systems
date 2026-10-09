import type { AssetFile } from "@/components/assets/AssetCard";

// Assets do modo demo — arquivos estáticos em public/demo-assets/<categoria>/.
// Ao adicionar um arquivo lá, registre-o aqui.
const DEMO_FILES: { category: string; name: string; size: number; type: string }[] = [
  { category: "icones", name: "icone-grid.svg", size: 382, type: "image/svg+xml" },
  { category: "icones", name: "icone-paleta.svg", size: 313, type: "image/svg+xml" },
  { category: "icones", name: "icone-tipografia.svg", size: 204, type: "image/svg+xml" },
  { category: "imagens", name: "padrao-grid.svg", size: 608, type: "image/svg+xml" },
  { category: "imagens", name: "paleta-de-cores.svg", size: 1987, type: "image/svg+xml" },
  { category: "logotipos", name: "vb-logo-horizontal.svg", size: 644, type: "image/svg+xml" },
  { category: "logotipos", name: "vb-logo-negativo.svg", size: 708, type: "image/svg+xml" },
  { category: "logotipos", name: "vb-simbolo.svg", size: 343, type: "image/svg+xml" },
  { category: "tipografia", name: "Montserrat-VariableFont_wght.ttf", size: 688600, type: "font/ttf" },
  { category: "tipografia", name: "OFL.txt", size: 4400, type: "text/plain" },
];

export function listDemoAssets(category: string): AssetFile[] {
  return DEMO_FILES.filter((f) => f.category === category).map((f) => {
    const path = `demo-assets/${f.category}/${f.name}`;
    return {
      ...f,
      id: path,
      url: `/${path}`,
      storage_path: path,
      uploaded_by: null,
      created_at: "2026-01-01T00:00:00.000Z",
    };
  });
}
