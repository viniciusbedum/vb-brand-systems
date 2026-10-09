import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { assetCategories, getCategoryBySlug } from "@/lib/asset-config";
import { AssetPageClient } from "@/components/assets/AssetPageClient";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return assetCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };
  return {
    title: `${category.label} — Ativos da Marca`,
    description: category.description,
  };
}

export default async function AssetCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  return <AssetPageClient category={category} />;
}
