---
name: brand-doctor
description: Read-only health check of this brand system install: environment, mode, Supabase and AI configuration, languages, content, types and UI rules. Use when something does not work, before sharing the app, or after changes; never edits files.
---

# Brand doctor

Report what works and what does not, separating the working local install from optional integrations. Do not edit anything; if the user wants a fix, say what to change and offer to do it with `brand-setup` or `brand-content`.

## Workflow

1. Run `npm run doctor` and keep its output (it never prints secret values).
2. Run `npx tsc --noEmit` and `npm run audit:ui`.
3. Check the server: is something answering on http://localhost:3000, and do `/`, `/br`, `/docs/introducao` and `/assets/logotipos` return 200? If no server is running, say so instead of starting a long-running one unasked.
4. **Full mode only.** `npm run doctor` cannot see the database. Give the user these checks to run in the Supabase SQL Editor and read their answers:
   - `select tablename from pg_tables where schemaname = 'public';` should list `profiles`, `conversations`, `brand_assets`.
   - `select id, public, file_size_limit from storage.buckets;` should show `brand-assets` with `public = false`.
   - `select email from auth.users;` should list the first admin.
   If the tables are missing, the migration in `supabase/migrations/` was not applied (see `brand-setup`, step 7).
5. **AI chat.** `npm run doctor` shows whether the provider key is set. A real test spends tokens: ask first, then have the user send one chat message. Typical failures: a wrong or expired key, a model name the provider does not know (`AI_MODEL`), the free-tier limit reached, or no credit on the account.
6. Group the report:
   - **Working now:** the local install (demo or full).
   - **Needs attention:** failures from the checks above, each with the exact file or variable and the one step that fixes it.
   - **Optional / not configured:** AI key, service role key, network sharing.
   - **Could not verify:** anything that needed a browser, a key or a service you do not have.

## Rules

- Read-only. Never print, ask for or store a key or token. Never run anything that changes the database, the host or `.env.local`.
- Do not claim something works unless a command or the user's answer showed it.
