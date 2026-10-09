import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const withNextIntl = createNextIntlPlugin();

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});

const nextConfig: NextConfig = {
  // Dev server opened from another device on the network (see ALLOWED_DEV_ORIGINS in .env.example)
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean),
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // /api/chat lê content/ em runtime (RAG) — garante os arquivos no bundle da função
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(withMDX(nextConfig));
