# Changelog

All notable changes to VB Brand Systems are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/). While the version is `0.x`, the database schema, the environment variables and the layout of `brand/` and `content/` may change between minor versions; breaking changes are listed here.

## [Unreleased]

## [0.1.0] - 2026-10-09

First public release.

### Added
- Brand system app (Next.js 15, React 19, Tailwind, MDX): guidelines as pages, an asset library with eight categories, and an AI chat that answers from the pages in `content/`.
- Demo mode (default): no accounts, no database, no keys. A live demo runs on Vercel with `NEXT_PUBLIC_DEMO_MODE=true`.
- Full mode with Supabase: login, members with `admin` and `staff` roles, asset uploads, chat history. The whole schema (tables, row level security, private storage bucket) is in one migration in `supabase/migrations/`.
- English at the bare URL and Portuguese under `/br`, chosen by the browser language on the first visit; language switch next to the theme toggle, and a mobile "more" menu with language, theme and optional page links.
- AI providers chosen with `AI_PROVIDER`: Anthropic (default), OpenAI or Gemini, each with its own API key and an optional `AI_MODEL`.
- Whitelabel files: `brand/` (identity, colors, fonts, menu), `content/<language>/` (pages) and `messages/<language>.json` (interface texts).
- Agent instructions (`AGENTS.md`, `CLAUDE.md`) and four skills: `brand-setup`, `brand-content`, `brand-doctor`, `brand-translate`.
- `npm run doctor`, an offline health check of the environment, languages and content, and `dev:lan` / `start:lan` scripts to share the app on a local network.
- Montserrat and Inter, bundled with their SIL OFL licenses.

### Security
- Asset upload is limited to admins, with a 50 MB limit and an allowed file type list enforced by the storage bucket.
- Public sign-up is off by default (`NEXT_PUBLIC_SIGNUP_ENABLED`).
- Deleting a member removes the login account through an admin-only server route.

### License
- PolyForm Shield 1.0.0.

### Known limits
- Full mode (login, uploads, chat with a live provider key, member deletion) has not been through a testing phase yet.
- The search box in the sidebar is not connected.
- Asset category URLs keep Portuguese slugs (`/assets/logotipos`) in both languages.

[Unreleased]: https://github.com/viniciusbedum/vb-brand-systems/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/viniciusbedum/vb-brand-systems/releases/tag/v0.1.0
