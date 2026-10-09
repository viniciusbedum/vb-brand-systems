import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type React from "react";
import { ContentArea } from "@/components/layout/ContentArea";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { getContentBySlug, type Frontmatter } from "@/lib/content";
import { getAllNavSlugs } from "@/lib/navigation";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllNavSlugs().map((slug) => ({ locale, slug: slug.split("/") }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  try {
    const { frontmatter } = getContentBySlug(locale, slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    const t = await getTranslations({ locale, namespace: "docs" });
    return { title: t("notFound") };
  }
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const currentSlug = slug.join("/");

  let frontmatter: Frontmatter | undefined;
  let Content: React.ComponentType<{ components: typeof mdxComponents }> | undefined;

  try {
    frontmatter = getContentBySlug(locale, slug).frontmatter;
    Content = (await import(`@/content/${locale}/${currentSlug}.mdx`)).default;
  } catch {
    notFound();
  }

  const MDX = Content!;

  return (
    <ContentArea frontmatter={frontmatter!}>
      <MDX components={mdxComponents} />
    </ContentArea>
  );
}
