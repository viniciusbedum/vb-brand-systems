# VB Brand Systems

A brand system is the single place where everything about a brand lives: what it believes, how it speaks, how it looks, and the files you need to use it. VB Brand Systems is that place, as an app you run on your own computer, in English and Portuguese, and make yours by editing a few files.

It is also built for something a PDF manual or a shared folder cannot do: **give an AI the full context of your brand**, so it answers and helps you decide with your rules in mind instead of guessing.

## What is inside

**Content: your guidelines, as pages.** A navigable manual written in plain MDX files. The sample brand organizes it from the most abstract to the most concrete:

- *Brand Core*: purpose, mission, values and positioning.
- *Verbal Universe*: personality, voice principles and writing examples.
- *Visual Universe*: logo and its misuse, color palette with copy-to-clipboard swatches and tokens, color usage and contrast, type families and type scale.
- *Applications*: how it all comes together in real pieces, such as social media.
- A *Sonic Universe* section, marked "coming soon", for you to fill.

You can rename, remove or add sections and pages; the pages can use callouts, color palettes, token tables and type specimens.

**Assets: the files people need.** A library with eight categories: logos, typography, images, videos, audio, documents, icons and mockups. Anyone with access can search, preview and download; admins upload and remove. Files are stored privately and served through expiring links.

**Chat: an assistant that knows your brand.** Ask in plain language ("How do I use the logo on a dark background?", "What tone for an Instagram post?") and it answers from your own pages, citing the section it used. It keeps a history of your conversations, which you can pin, rename and delete.

**People and settings.** Login, a role for each member (admin or staff), your profile and password, light and dark themes, and English or Portuguese.

## Why it exists: context for your AI

Most AI answers about a brand are generic because the AI does not know the brand. Here, everything above is a plain-text base: your purpose, voice, colors, rules and examples live in files the AI can read.

Connect an AI provider and the chat always has your brand context: it looks up the pages that matter for each question and answers from them, so it helps you make decisions that fit the brand, with less guessing. The pages you write are exactly what it knows, so improving the content improves every answer.

The same files also give any coding agent that opens this folder (Claude Code, OpenAI Codex) the same context, which is why the repository ships with skills that guide you through setting it up.

The AI part is optional. Without it you still have the manual and the asset library.

## At a glance

- **Demo mode (default):** no accounts, no database, no keys. Browse the guidelines and the sample assets.
- **Full mode:** login, members, asset uploads, chat history and the AI assistant, once you connect [Supabase](https://supabase.com) and one AI provider key.
- **Made for local use:** one computer, or a team on the same Wi-Fi. No hosting required.
- **Guided by your AI agent:** a built-in skill walks you through every step (see [Make it yours with AI](#make-it-yours-with-ai)).

## Quick start

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 for English, or http://localhost:3000/br for Portuguese. The first visit follows your browser language.

That is the whole demo. Nothing else is needed to look around.

## Make it yours with AI

This repository ships instructions for AI coding agents ([Claude Code](https://claude.com/claude-code), OpenAI Codex or similar) in `AGENTS.md`, plus four skills in `.agents/skills/`:

| Skill | What it does |
|---|---|
| `brand-setup` | Guided first run: your brand identity, content, Supabase, AI provider, sharing with your team |
| `brand-content` | Add, edit, remove or reorder pages in both languages |
| `brand-doctor` | Read-only health check of the install |
| `brand-translate` | Add another language, or keep only one |

Open the folder in your agent and say:

> Use brand-setup to configure this brand system and walk me through it.

It asks a few questions, explains what each step does, and never asks you to paste a key into the chat. You can skip the agent and follow the rest of this README by hand.

## Full mode

Full mode adds accounts, uploads and the AI chat. You need:

| What | For | Cost |
|---|---|---|
| A [Supabase](https://supabase.com) project | Login, members, uploaded files, chat history | Free plan is enough to start |
| One AI provider key (optional) | The AI chat | Pay per use, or a free tier (see below) |

Copy `.env.example` to `.env.local` and fill in what you use. Restart `npm run dev` after any change.

### 1. Database (Supabase)

You do not build any tables: the whole structure is in `supabase/migrations/20261008000000_initial_schema.sql`.

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the entire content of that file and click **Run**. It creates:
   - `profiles`: members and their role (`admin` or `staff`). The first user becomes admin.
   - `conversations`: the AI chat history of each user.
   - `brand_assets`: the list of uploaded files.
   - a private storage bucket `brand-assets` for the files (50 MB per file, restricted file types).
   - the security rules (row level security) for all of the above. Only admins upload and delete assets.
3. In **Project Settings > API**, copy the **Project URL** and the **anon key** into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. In **Authentication > Users**, click **Add user** and create your account (tick auto-confirm). Being the first user, you become the admin.
5. In **Authentication > Sign In / Providers > Email**, turn off **Allow new users to sign up**. Add the other members from the same Users screen.
6. In **Authentication > URL Configuration**, set the Site URL to the address you use (`http://localhost:3000`) and add Redirect URLs for it, including `/reset-password` and `/br/reset-password`. Add the same for your network address if your team uses it.

Optional: to delete a member's login from **Settings > Members**, put the project's `service_role` key in `SUPABASE_SERVICE_ROLE_KEY`. It is used only by the server. Never share it or prefix it with `NEXT_PUBLIC_`.

### 2. AI chat

The chat answers questions using the pages in `content/`, so what you write is what it knows. It needs full mode and one provider key in `.env.local`:

| Provider | Variables | Default model |
|---|---|---|
| Anthropic (Claude) | `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY` | `claude-opus-5-5` (cheaper: set `AI_MODEL=claude-haiku-5-5`) |
| OpenAI | `AI_PROVIDER=openai`, `OPENAI_API_KEY` | `gpt-5` |
| Google Gemini / Gemma | `AI_PROVIDER=gemini`, `GEMINI_API_KEY` | `gemma-3-27b-it` |

- Get a key at [console.anthropic.com](https://console.anthropic.com), [platform.openai.com](https://platform.openai.com) or [aistudio.google.com](https://aistudio.google.com).
- Google AI Studio has a free tier, so Gemini or Gemma is the way to try the chat at no cost. Its limits and data-use terms are set by Google and change, so read them first.
- Each chat message uses tokens from your provider account.
- `AI_MODEL` switches to any other model of the chosen provider.
- Without a key, the chat shows a notice. To hide the chat completely: `NEXT_PUBLIC_AI_ENABLED=false`.

Any of the three providers can be connected this way. After configuring one, restart the server and send a message in the chat to confirm it answers.

## Environment variables

| Variable | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Full mode | Empty = demo mode |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Full mode | Public key, safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Deleting members | Server only. Optional |
| `NEXT_PUBLIC_SIGNUP_ENABLED` | Public `/signup` page | `true` to show it. Default off |
| `NEXT_PUBLIC_DEMO_MODE` | Forcing demo mode | `true` ignores Supabase |
| `AI_PROVIDER` | AI chat | `anthropic` (default), `openai` or `gemini` |
| `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY` | AI chat | The one for your provider |
| `AI_MODEL` | AI chat | Optional model override |
| `NEXT_PUBLIC_AI_ENABLED` | Hiding the chat | `false` hides it |
| `ALLOWED_DEV_ORIGINS` | Dev server on the network | Comma-separated IPs, see below |

`NEXT_PUBLIC_*` values are baked in at build time: rebuild after changing them.

## Share it with your team

No hosting needed. Run it on one computer and let everyone on the same network open its address:

```bash
npm run build
npm run start:lan
```

Then share `http://<that computer's IP address>:3000`. The computer must stay on while people use it, and it may ask you to allow the connection in its firewall. With full mode, add that address to the Supabase Redirect URLs. If you use `npm run dev:lan` instead, also set `ALLOWED_DEV_ORIGINS` to the IP in `.env.local`.

Hosting it online (for example on Vercel) is optional: the same environment variables go in the host's settings.

## Customize the brand

| To change | Edit |
|---|---|
| Name, logo text, tagline, AI texts | `brand/config.ts` |
| Colors (light and dark), area glows | `brand/theme.css` |
| Fonts | `brand/fonts.ts` and `brand/fonts/` |
| Menu sections and pages | `brand/navigation.ts` |
| Asset categories | `lib/asset-config.ts` |
| Pages | `content/en/` and `content/pt/` (MDX) |
| Interface texts | `messages/en.json` and `messages/pt.json` |
| Sample files for demo mode | `public/demo-assets/` and `lib/demo-assets.ts` |
| Extra links in the mobile "more" menu | `menuLinks` in `brand/config.ts` |

Every page, menu title and interface string exists in both languages; `npm run doctor` tells you when one is missing. To add or remove a language, use the `brand-translate` skill.

## Commands

| Command | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` then `npm start` | Production build, served locally |
| `npm run dev:lan`, `npm run start:lan` | Same, reachable from your network |
| `npm run doctor` | Offline health check: environment, languages, content |
| `npm run audit:ui` | Checks the interface code against the design rules |
| `npm run storybook` | Component catalog |

## Security notes

- Row level security protects the database, and the browser only ever holds the anon key.
- Turn off sign-ups in Supabase (step 5 above). `NEXT_PUBLIC_SIGNUP_ENABLED` only hides the page; the Supabase setting is the real lock.
- Uploads are limited to admins, 50 MB per file and a list of file types, enforced by Supabase.
- Files are served through signed links that expire after one hour.
- Keep `.env.local` out of version control (it is already in `.gitignore`).

## Known limits

- The search box in the sidebar is not connected yet.
- The demo asset categories keep Portuguese URLs (`/assets/logotipos`) in both languages: they name the storage folders.

## License

MIT with the [Commons Clause](LICENSE): free to use, modify and share, but you may not sell the software or a product or service whose value comes substantially from it.
