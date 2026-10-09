import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/locale-href";

export type Frontmatter = {
  title: string;
  description: string;
  section?: string;
  order?: number;
  lastUpdated?: string;
};

// O conteúdo vive em content/<idioma>/<slug>.mdx — o mesmo slug nos dois idiomas.
const CONTENT_ROOT = path.join(process.cwd(), "content");

function contentDir(locale: Locale) {
  return path.join(CONTENT_ROOT, locale);
}

export function getContentBySlug(locale: Locale, slugParts: string[]): {
  frontmatter: Frontmatter;
  filePath: string;
} {
  const slugPath = slugParts.join("/");
  const filePath = path.join(contentDir(locale), `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  return {
    frontmatter: data as Frontmatter,
    filePath,
  };
}

export function getAllContentSlugs(locale: Locale): string[][] {
  const slugs: string[][] = [];

  function walk(dir: string, parts: string[] = []) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, [...parts, entry]);
      } else if (entry.endsWith(".mdx") && !entry.startsWith("_")) {
        slugs.push([...parts, entry.replace(".mdx", "")]);
      }
    }
  }

  walk(contentDir(locale));
  return slugs;
}
