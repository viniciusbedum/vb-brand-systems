---
name: brand-translate
description: Add a new language to this brand system, or remove one, covering the URL prefix, UI strings, brand copy, menu, asset categories, pages and AI prompts. Use when the user wants a third language or a single-language install; not for editing one page (brand-content).
---

# Brand translate

English is served at the bare URL and Portuguese under `/br`; the browser language picks one on the first visit. Translation costs a meaningful amount of tokens (the UI strings plus every page), so state the size of the job and get the user's go-ahead before translating.

## Add a language (example: Spanish, code `es`, URL prefix `/es`)

TypeScript enforces most of this: the `Locale` type comes from `i18n/routing.ts` and the per-language data uses `Record<Locale, ...>`, so after step 1 `npx tsc --noEmit` lists what is left.

1. `i18n/routing.ts`: add `"es"` to `locales` and `es: "/es"` to `localePrefix.prefixes`.
2. `messages/es.json`: copy `messages/en.json` and translate the values. Keep every key and every `{placeholder}` and plural form.
3. `brand/config.ts`: add `es` to `brandCopy` (tagline, description, specimen text, AI copy).
4. `brand/navigation.ts` and `lib/asset-config.ts`: add `es` to every `{ en, pt }` title, label, description and empty message.
5. `content/es/`: translate every page listed in `brand/navigation.ts`, same slugs (use `brand-content` rules).
6. `lib/system-prompt.ts`: add the `es` prompt and its heading in `RAG_HEADING`, and make the instructions say to answer in that language.
7. Small language tables: `app/[locale]/layout.tsx` (`HTML_LANG`, for example `es`), `components/ui/LanguageSwitch.tsx` and `components/layout/PreferencesMenu.tsx` (`LABELS` and `NAMES`), and the date helpers in `lib/utils.ts` and `components/settings/tabs/MembersTab.tsx` (which map the code to a date locale).
8. Run `npx tsc --noEmit`, `npm run doctor` (reports missing keys and pages) and `npm run audit:ui`. Open `/es` when a browser is available.

## Remove a language (single-language install)

1. Delete its entry in `i18n/routing.ts` `locales` and `prefixes`. If it is the default language (`en`), also set a new `defaultLocale`.
2. Delete `messages/<code>.json` and `content/<code>/`.
3. Fix what `npx tsc --noEmit` reports: remove the language from the `Record<Locale, ...>` tables in `brand/`, `lib/` and the components in step 7 above.
4. With one locale the switch is pointless: hide `LanguageSwitch` and the language row of `PreferencesMenu`.
5. Run `npm run doctor` and the type check.

## Rules

- Translate meaning, keep names, hex values, tokens, URLs and code identical.
- Mark machine-translated text as needing review when the language is not one you translate reliably.
- Do not change the default language or URLs of an install that is already shared without telling the user, since existing links change.
