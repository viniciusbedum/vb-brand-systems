---
name: brand-setup
description: Guide a first-time user through making this brand system their own, from the demo to a shared install: identity, content, Supabase, AI provider and sharing on the network. Use for first-run setup or when the user asks how to get started or connect Supabase or an AI key; not for editing a single page (brand-content) or a read-only check (brand-doctor).
---

# Brand setup

Walk the user from "it runs" to "it is my brand, shared with my team", one stage at a time. The demo works with nothing configured, so every stage after step 3 is optional: stop whenever the user has what they need.

## Workflow

1. **Inspect first.** Read `AGENTS.md`, run `npm run doctor`, and look at `brand/config.ts`. If the brand is still "VB Brand Systems" and `content/` holds the sample pages, this is a fresh copy.
2. **Explain briefly** using `## Explaining this project` in `AGENTS.md`. Skip it if the user already understands.
3. **Ask only what changes the setup**, all at once, with a recommendation for each:
   - Brand name and the short text for the logo (wordmark).
   - Languages: keep English and Portuguese, or only one.
   - Mode: **demo** (just you, no accounts, nothing saved) or **full** (accounts, uploads, chat history, AI).
   - If full: which AI provider (see step 8).
   - Who opens it: only me, my team on the same Wi-Fi, or hosted online.
4. **Run it.** `npm install`, then `npm run dev`, and open http://localhost:3000 (English) and http://localhost:3000/br (Portuguese). Offer to tour the sample pages before replacing them.
5. **Identity.** Edit, one file at a time, showing the user what changed:
   - `brand/config.ts`: `brand.name`, `brand.wordmark`, and `brandCopy` (tagline, description, AI headline, intro, placeholder and suggestions) for each language.
   - `brand/theme.css`: color tokens as HSL for light and dark. `--primary` and `--link` set the accent; `--backdrop`, `--backdrop-docs` and `--backdrop-assets` set the glow of each area. Check text contrast (4.5:1 minimum).
   - `brand/fonts.ts`: heading font (local file in `brand/fonts/`) and body font. Only use fonts whose license allows distribution.
   - Logos and sample files: replace `public/demo-assets/<category>/` and the list in `lib/demo-assets.ts` (demo mode). In full mode, files are uploaded from the Assets page by an admin.
   - Menu and asset categories: `brand/navigation.ts` and `lib/asset-config.ts` (every title has `{ en, pt }`).
6. **Content.** Hand off to `brand-content` to rewrite or remove the sample pages. Remove sample pages that do not apply instead of leaving them.
7. **Full mode: Supabase** (only if chosen). The database structure already exists in `supabase/migrations/`; the user never builds tables by hand.
   1. Create a project at https://supabase.com.
   2. Open SQL Editor, paste the whole content of `supabase/migrations/20261008000000_initial_schema.sql`, Run. It creates the `profiles`, `conversations` and `brand_assets` tables, the security rules, and the private `brand-assets` storage bucket (50 MB per file, allowed file types).
   3. In Project Settings > API, copy the Project URL and the anon key into `.env.local` (copy `.env.example` first). The user does this, not you.
   4. Authentication > Users > Add user: create the first user (tick auto-confirm). The first user of a project becomes admin automatically.
   5. Authentication > Sign In / Providers > Email: turn off "Allow new users to sign up". This is the real lock; `NEXT_PUBLIC_SIGNUP_ENABLED` only hides the sign-up page. More members are added from the same Users screen.
   6. Authentication > URL Configuration: set the Site URL to the address people use (`http://localhost:3000`) and add Redirect URLs for it, including `/reset-password` and `/br/reset-password`, and the same for the host's network address if the team will use it.
   7. Optional, for deleting a member from Settings > Members: copy the `service_role` key into `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. It is server-only and powerful; never put it anywhere else.
   8. Restart `npm run dev`. The login page appears; sign in with the first user.
8. **Full mode: AI chat** (only if chosen). The chat answers from the pages in `content/` and needs one provider key in `.env.local`:
   - `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY` (Claude, console.anthropic.com). Default model `claude-opus-5-5`; `AI_MODEL=claude-haiku-5-5` is the cheaper choice.
   - `AI_PROVIDER=openai` with `OPENAI_API_KEY`.
   - `AI_PROVIDER=gemini` with `GEMINI_API_KEY` (Google AI Studio, has a free tier; default model `gemma-3-27b-it`). Free-tier limits and data-use terms are set by Google and change; tell the user to read them.
   Every chat message spends tokens on the user's account. Restart the server, then ask the user to send one message to test. Do not send test messages yourself without asking.
   To hide the chat entirely: `NEXT_PUBLIC_AI_ENABLED=false`.
9. **Sharing.** Two options, no hosting needed:
   - Only me: `npm run dev` or `npm run build && npm run start`, at http://localhost:3000.
   - My team on the same network: `npm run build && npm run start:lan`, then share `http://<this computer's IP>:3000` (the user finds the IP in the network settings). Add that address to the Supabase Redirect URLs. Keep the computer on and awake while people use it, and allow it through the firewall if asked. If the dev server is used instead, set `ALLOWED_DEV_ORIGINS=<ip>` in `.env.local`.
   - Hosting it online (for example on Vercel) is optional and not covered here; the same environment variables go in the host's settings.
10. **Verify.** Run `npm run doctor`, `npx tsc --noEmit` and `npm run audit:ui`, and open the home, a docs page and the Assets page in both languages. Report what was verified and what could not be (for example, no browser available). Offer `brand-doctor` for later health checks.

## Rules

- Never ask for, read aloud or print a key, token or password. Point to the variable name and the page where the user finds the value.
- Keep demo mode working at every point. If the user stops after step 6, the app must still run.
- One stage at a time; confirm before moving to the next. Do not touch Supabase, an AI provider or a host for the user.
- Do not commit or push unless asked.
