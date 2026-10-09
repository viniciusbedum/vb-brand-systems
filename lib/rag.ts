import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllContentSlugs } from '@/lib/content';
import type { Locale } from '@/i18n/locale-href';

export interface ContentChunk {
  filePath: string;
  label: string;
  description: string;
  content: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'content');

// Todo .mdx em content/ vira conhecimento da IA — nenhuma lista manual para manter
export function loadChunks(locale: Locale): ContentChunk[] {
  return getAllContentSlugs(locale).map((parts) => {
    const filePath = `content/${locale}/${parts.join('/')}.mdx`;
    const raw = fs.readFileSync(path.join(CONTENT_ROOT, locale, ...parts) + '.mdx', 'utf-8');
    const { data, content } = matter(raw);
    return {
      filePath,
      label: (data.title as string | undefined) ?? parts.join('/'),
      description: (data.description as string | undefined) ?? '',
      content,
    };
  });
}

function scoreChunk(query: string, chunk: ContentChunk): number {
  const q = query.toLowerCase();
  const text = (chunk.label + ' ' + chunk.content).toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  return words.reduce((acc, word) => {
    const matches = text.match(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    return acc + (matches?.length ?? 0);
  }, 0);
}

export function retrieveRelevantChunks(query: string, locale: Locale, topK = 5): string {
  const chunks = loadChunks(locale);

  const scored = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((item) => item.score > 0);

  const selected = scored.length > 0
    ? scored.map((s) => s.chunk)
    : chunks.slice(0, 1);

  return selected
    .map((c) => `### ${c.label}\n${c.content}`)
    .join('\n\n---\n\n');
}
