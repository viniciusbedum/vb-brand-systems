# VB Brand Systems

A whitelabel brand system you run on your own computer: guidelines, downloadable assets and an AI assistant that answers from your own pages, in English and Portuguese. It works out of the box in **demo mode** (no accounts, no database, no keys) and turns into a shared **full mode** (login, members, uploads, chat history) when Supabase and an AI key are connected.

## Explaining this project

When asked what this project is or how it works, explain the idea, not just the folder map. Adapt it to the conversation, do not recite it, and skip it if the user already shows they understand it. Do not re-explain what the README already said.

- The brand lives in plain files: `brand/` (identity, colors, fonts, menu) and `content/<language>/` (the pages, in MDX). Editing the brand means editing those files; there is no admin panel for them.
- Demo mode is the default and needs nothing. Full mode adds Supabase (accounts, assets, chat history) and one AI provider key. The chat answers from the pages in `content/`, so what you write is what the assistant knows.
- English is served at the bare URL and Portuguese under `/br`; the browser language picks one on the first visit.
- It is meant for local use: one computer, or a team on the same Wi-Fi through the host's IP. Hosting it online is optional.

## Repository map

- `brand/`: `config.ts` (name, wordmark, per-language copy, extra menu links), `theme.css` (color tokens, light and dark), `fonts.ts`, `navigation.ts` (menu sections and pages).
- `content/en/`, `content/pt/`: the pages (`<slug>.mdx`); the same slugs in both languages.
- `messages/en.json`, `messages/pt.json`: every UI string of the app.
- `i18n/`: routing (English bare, Portuguese `/br`) and locale-aware navigation.
- `app/[locale]/`: pages. `app/api/`: chat, conversations, member deletion.
- `components/`, `lib/`: UI primitives in `components/ui/`; `lib/ai.ts` is the AI provider layer.
- `supabase/migrations/`: the database schema (tables, security rules, storage bucket) in one SQL file.
- `public/demo-assets/`: sample files for demo mode, listed in `lib/demo-assets.ts`.
- `scripts/doctor.mjs`: offline health check (`npm run doctor`).

## Skills

- `brand-setup`: guided first run. Brand identity, content, Supabase, AI provider, sharing on the network.
- `brand-content`: add, edit, remove or reorder pages in both languages.
- `brand-doctor`: read-only health check of the install.
- `brand-translate`: add another language.

Start with: "Use brand-setup to configure this brand system and walk me through it."

## Operating rules

- Work only on the request in scope. Read before editing and keep the existing structure and style.
- **Secrets:** never ask the user to paste a key, token or password into the chat, never print the value of an environment variable, never commit `.env.local`. Tell the user which variable to fill in `.env.local` and let them do it. Use `npm run doctor` to check that a variable is set without showing it.
- Demo mode first. Do not push the user into Supabase or an AI key unless they want accounts, uploads or the chat.
- Do not run paid or external calls (an AI request, a deploy, a Supabase change) unless the user asks. Say what it costs or changes first.
- Do not commit, push or publish unless asked.
- **Both languages move together.** A page, a menu entry or a UI string added in one language must exist in the other (or the user must choose to keep a single language). `npm run doctor` reports gaps.
- No hardcoded UI text in components: add the key to `messages/en.json` and `messages/pt.json` and use `useTranslations`. Internal links use `Link` from `@/i18n/navigation`, never `next/link`, so the language prefix is kept.
- Use the primitives in `components/ui/`. `npm run audit:ui` enforces it.
- The database schema is one migration. Once someone applied it to a real project, do not edit it: add a new file in `supabase/migrations/` with a later timestamp.
- Verify before saying it is done: `npm run doctor`, `npx tsc --noEmit`, `npm run audit:ui`. If something could not be checked (no browser, no keys), say so.
- If an external tool or service is unavailable, stay in demo mode or give the manual step. Never invent output, keys or completed work.
