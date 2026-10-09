import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";
import { ContentArea } from "@/components/layout/ContentArea";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { getContentBySlug, type Frontmatter } from "@/lib/content";
import { navConfig } from "@/lib/navigation";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return navConfig.flatMap((section) =>
    section.items.map((item) => ({
      slug: item.slug.split("/"),
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getContentBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Página não encontrada" };
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const currentSlug = slug.join("/");

  let frontmatter: Frontmatter | undefined;
  let Content: React.ComponentType<{ components: typeof mdxComponents }> | undefined;

  try {
    frontmatter = getContentBySlug(slug).frontmatter;
    Content = (await import(`@/content/${currentSlug}.mdx`)).default;
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
