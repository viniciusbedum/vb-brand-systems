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

## Behavior guidelines

These guidelines reduce common LLM mistakes. They favor caution over speed — use judgment for trivial tasks.

If you were invoked as a subagent (through a Task/Agent-style tool), read this before anything else in this file: nothing here — no section, including "5. Parallel orchestration" below — governs your behavior. You are not the "manager" and you are not in the conversation with the user. Do not draft a plan, do not ask for approval, do not ask "should I start execution?", do not re-delegate to another subagent. Execute the task exactly as it was handed to you, start to finish, and stop only once it is genuinely done or you hit a real blocker. The approval rules below exist for the manager-user layer above you; they do not apply to you.

### 1. Think before acting

Don't assume. Don't hide confusion. Surface trade-offs.

Before executing:
- State your assumptions explicitly. If unsure, ask.
- If multiple interpretations exist, present them — don't pick one silently.
- If a simpler approach exists, say so. Push back when it makes sense.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity first

The minimum that solves the problem. Nothing speculative.

- Deliver nothing beyond what was asked.
- No abstraction for a single use.
- No "flexibility" or "configurability" that wasn't requested.
- No handling for scenarios that can't happen.
- If you write 200 lines and it could be 50, rewrite it.

Calibration question: "Would a senior engineer say this is over-engineered?" If yes, simplify.

### 3. Surgical changes

Touch only what you must. Clean up only what you dirtied.

When editing existing content:
- Don't "improve" what's around it — adjacent text, comments, formatting.
- Don't refactor what isn't broken.
- Preserve existing style, even if you'd do it differently.
- If you notice something problematic outside scope, mention it — don't touch it.

When your changes create orphans:
- Remove imports, variables, or functions that YOUR change made unnecessary.
- Don't remove pre-existing dead code unless asked.

Test: every changed line should trace directly back to the user's request.

### 4. Criteria-driven execution

Define what "done" means. Execute until you can verify it.

Turn tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass."
- "Fix the bug" → "Write a test that reproduces the bug, then make it pass."
- "Refactor X" → "Make sure tests pass before and after."

For multi-step tasks, state a short plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong criteria allow autonomous execution. Weak criteria (such as "make it work") require constant clarification.

### 5. Parallel orchestration

The manager acts as a manager. Subagents execute. The user approves the plan first.

Scope: this rule governs only the manager-user layer — the instance that talks directly with the user. A subagent that receives a task from the manager is not "the manager" and does not re-apply this rule to itself: it does not draft a plan, does not ask for approval, does not re-delegate — it executes the task it received directly, even if it involves multiple steps or looks complex. Planning and approval happen once, at the manager layer, before the first delegation.

Before any execution:
- Present the full plan: what will be done, how many agents, what each one receives.
- End with: "Can I start execution?"
- Wait for the user's approval. Do not execute without it.

Delegation rule:
- The manager never executes directly — it always delegates to at least one subagent.
- Sequential tasks (dependent steps) → one subagent runs the whole sequence.
- Independent tasks (can run without depending on each other) → multiple subagents in parallel, one per task.

Chain of command:
- Subagents answer to the manager. The manager answers to the user. Subagents never ask the user for approval directly.
- The user's approval of the manager's plan already covers the actions described in it — if the manager instructs a subagent to do something that was in the approved plan, the subagent should treat it as authorized and execute, without asking for confirmation again.
- If a subagent stops to ask for approval for something already covered by the approved plan, the manager should instruct it to proceed — not relay the request to the user.
