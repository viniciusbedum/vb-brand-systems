---
name: brand-content
description: Add, edit, remove, reorder or translate the pages of this brand system, keeping both languages, the menu and the AI knowledge in sync. Use when the user wants to write or change brand guidelines pages; not for first-run setup (brand-setup) or adding a new language (brand-translate).
---

# Brand content

The pages are MDX files in `content/<language>/<slug>.mdx`, listed in `brand/navigation.ts`. The AI chat reads the same files, so editing a page also updates what the assistant knows. Nothing else needs to be registered.

## Page anatomy

```mdx
---
title: Color usage
description: Proportion, approved combinations and contrast.
section: Visual Universe
order: 4
lastUpdated: "2026-10-09"
---

## A heading

Text, **bold**, lists and tables (GitHub Markdown).

<Callout type="tip" title="A tip">Short note.</Callout>
```

Components available in any page:

- `<Callout type="info" | "warning" | "tip" | "danger" title="...">`
- `<ColorPalette columns={3} colors={[{ name, hex, rgb, token, usage }]} />` and `<ColorSwatch name hex rgb token usage />`
- `<TokenTable tokens={[{ name, value, description }]} />`
- `<TypographySample fontFamily="var(--font-heading)" label weights={[400, 700]} specimenText usage />`
- Images: put the file in `public/` and use `<img src="/path.svg" alt="..." className="..." />`.

## Workflow

1. Read `brand/navigation.ts` and one or two existing pages to match tone, depth and format.
2. Ask what the page is for and who reads it. Write only what the user said or confirmed; do not invent brand facts, numbers or rules.
3. **Add a page:** create `content/en/<slug>.mdx` and `content/pt/<slug>.mdx` with the same slug (folders allowed, for example `cores/paleta`), then add the entry to `brand/navigation.ts` inside the right section with its title in both languages: `{ title: { en: "...", pt: "..." }, slug: "..." }`.
4. **Edit:** change the file in each language. If the user edits one language only, ask whether to mirror the change.
5. **Remove:** delete both files and the navigation entry. Search `content/` for links to the removed slug (`/docs/<slug>`).
6. **Reorder or regroup:** the order of entries in `brand/navigation.ts` is the menu order. A section needs `items: []` to appear as "coming soon". Menu icons are names from `lib/icons.ts` (`getNavigationIcon`); a new icon must be added there first.
7. If the user keeps a single language, remove the other one properly with `brand-translate` instead of leaving half-empty folders.
8. Run `npm run doctor` (reports a page missing in a language, or a file that is not in the menu) and `npx tsc --noEmit`. Open the page in both languages when a browser is available.

## Rules

- Same slug in both languages. Slugs are URLs: lowercase, no spaces.
- Translate meaning, not word by word, and keep names, hex values, tokens and code identical.
- Do not change `brand/theme.css` or `brand/config.ts` from here; that is `brand-setup`.
- Translating many pages uses a lot of tokens: tell the user the size of the job before starting.
