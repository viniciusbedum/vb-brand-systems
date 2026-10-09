import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAssetCategorySlugs, getCategoryBySlug } from "@/lib/asset-config";
import { AssetPageClient } from "@/components/assets/AssetPageClient";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAssetCategorySlugs().map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "assets" });
  const category = getCategoryBySlug(locale, slug);
  if (!category) return { title: t("categoryNotFound") };
  return {
    title: `${category.label} — ${t("brandAssets")}`,
    description: category.description,
  };
}

export default async function AssetCategoryPage({ params }: PageProps) {
  const { locale, category: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const category = getCategoryBySlug(locale, slug);

  if (!category) notFound();

  return <AssetPageClient category={category} />;
}
