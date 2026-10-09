// Health check for a brand-system install: `npm run doctor`.
// Read-only and offline. Checks the environment, the languages and the content.
// It never prints the value of a secret, only whether it is set.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const results = [];
const ok = (msg) => results.push(["ok", msg]);
const warn = (msg) => results.push(["warn", msg]);
const fail = (msg) => results.push(["fail", msg]);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

// ── Node and dependencies ────────────────────────────────────────────────
const [major, minor] = process.versions.node.split(".").map(Number);
if (major > 18 || (major === 18 && minor >= 18)) ok(`Node ${process.versions.node}`);
else fail(`Node ${process.versions.node} is too old. Use Node 18.18 or newer (20+ recommended).`);

if (exists("node_modules")) ok("Dependencies installed");
else fail("Dependencies missing. Run: npm install");

// ── Environment ──────────────────────────────────────────────────────────
const env = { ...process.env };
for (const file of [".env", ".env.local"]) {
  if (!exists(file)) continue;
  for (const line of read(file).split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
const has = (name) => Boolean(env[name]);

const demo = env.NEXT_PUBLIC_DEMO_MODE === "true" || !has("NEXT_PUBLIC_SUPABASE_URL");
if (!exists(".env.local")) ok("No .env.local: running in demo mode (nothing to configure)");

if (demo) {
  ok("Mode: DEMO (no database, no login). To turn on full mode, set the Supabase variables in .env.local");
} else {
  ok("Mode: FULL (Supabase)");
  if (has("NEXT_PUBLIC_SUPABASE_ANON_KEY")) ok("NEXT_PUBLIC_SUPABASE_ANON_KEY is set");
  else fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing (Supabase > Project Settings > API)");
  if (/service_role/i.test(env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")) {
    fail("The anon key looks like a service_role key. Use the anon/public key here.");
  }
  if (has("SUPABASE_SERVICE_ROLE_KEY")) ok("SUPABASE_SERVICE_ROLE_KEY is set (members can be deleted)");
  else warn("SUPABASE_SERVICE_ROLE_KEY is not set: deleting a member will fail. Everything else works.");
  if (env.NEXT_PUBLIC_SIGNUP_ENABLED === "true") {
    warn("Public sign-up is ON. Also turn it off in Supabase if you do not want strangers creating accounts.");
  } else {
    ok("Public sign-up page is off (also disable \"Allow new users to sign up\" in Supabase > Authentication)");
  }

  if (env.NEXT_PUBLIC_AI_ENABLED === "false") {
    ok("AI chat hidden (NEXT_PUBLIC_AI_ENABLED=false)");
  } else {
    const provider = (env.AI_PROVIDER || "anthropic").toLowerCase();
    const keys = { anthropic: "ANTHROPIC_API_KEY", openai: "OPENAI_API_KEY", gemini: "GEMINI_API_KEY" };
    if (!keys[provider]) fail(`AI_PROVIDER="${provider}" is not valid. Use anthropic, openai or gemini.`);
    else if (has(keys[provider])) ok(`AI chat: provider "${provider}", ${keys[provider]} is set`);
    else warn(`AI chat is visible but ${keys[provider]} is not set: the chat will show a notice instead of answering.`);
  }
}

// ── Database files ───────────────────────────────────────────────────────
const migrations = exists("supabase/migrations")
  ? fs.readdirSync(path.join(root, "supabase/migrations")).filter((f) => f.endsWith(".sql"))
  : [];
if (migrations.length) ok(`Database schema ready to apply: supabase/migrations/${migrations[0]}`);
else fail("supabase/migrations/*.sql is missing");

// ── Languages, navigation and content ────────────────────────────────────
const routing = read("i18n/routing.ts");
const localesMatch = routing.match(/locales:\s*\[([^\]]*)\]/);
const locales = localesMatch ? [...localesMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
if (locales.length) ok(`Languages: ${locales.join(", ")}`);
else fail("Could not read the languages from i18n/routing.ts");

const slugs = [...read("brand/navigation.ts").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
ok(`Navigation: ${slugs.length} pages`);

for (const locale of locales) {
  const missing = slugs.filter((slug) => !exists(`content/${locale}/${slug}.mdx`));
  if (missing.length) fail(`content/${locale}/ is missing ${missing.length} page(s): ${missing.join(", ")}`);
  else ok(`content/${locale}/ has every page in the navigation`);
}

const mdxFiles = (dir, prefix = "") =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? mdxFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`)
          : entry.name.endsWith(".mdx") ? [`${prefix}${entry.name.replace(/\.mdx$/, "")}`] : []
      )
    : [];
for (const locale of locales) {
  const orphans = mdxFiles(path.join(root, "content", locale)).filter((slug) => !slugs.includes(slug));
  if (orphans.length) warn(`content/${locale}/ has page(s) not in brand/navigation.ts (they will not show in the menu): ${orphans.join(", ")}`);
}

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object" ? flat(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );
const messageKeys = {};
for (const locale of locales) {
  if (!exists(`messages/${locale}.json`)) { fail(`messages/${locale}.json is missing`); continue; }
  messageKeys[locale] = new Set(flat(JSON.parse(read(`messages/${locale}.json`))));
}
const base = locales.find((l) => messageKeys[l]);
for (const locale of locales) {
  if (!messageKeys[locale] || locale === base) continue;
  const missing = [...messageKeys[base]].filter((k) => !messageKeys[locale].has(k));
  const extra = [...messageKeys[locale]].filter((k) => !messageKeys[base].has(k));
  if (missing.length || extra.length) {
    fail(`messages/${locale}.json differs from messages/${base}.json (missing: ${missing.length}, extra: ${extra.length})`);
  } else ok(`messages/${locale}.json has the same ${messageKeys[locale].size} keys as messages/${base}.json`);
}

// ── Report ───────────────────────────────────────────────────────────────
const icon = { ok: "✔", warn: "⚠", fail: "✖" };
for (const [level, msg] of results) console.log(`${icon[level]} ${msg}`);
const failures = results.filter(([l]) => l === "fail").length;
const warnings = results.filter(([l]) => l === "warn").length;
console.log(`\n${failures ? "✖" : "✔"} ${failures} problem(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
