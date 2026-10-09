#!/usr/bin/env node
// Auditoria de UI: garante que componentes usem primitivos e tokens.
// Uso: node scripts/ui-audit.mjs [caminhos...]  (padrão: app/ e components/)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const targets = process.argv.slice(2);
if (targets.length === 0) targets.push("app", "components");

function walk(p, out) {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) {
    for (const e of readdirSync(p)) {
      if (e === "node_modules" || e === ".next") continue;
      walk(join(p, e), out);
    }
  } else if (p.endsWith(".tsx")) out.push(p);
}

const files = [];
for (const t of targets) walk(join(root, t), files);

const RAW = /<(button|input|textarea|select)\b/;
const STYLE = /style=\{\{/;
const COLOR =
  /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|hsl\(\d|rgba?\(\d|\b(?:bg|text|border|ring|from|via|to)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|white|black)(?:-\d{2,3})?\b/;
const ROUND = /\brounded-none\b/;
const STYLE_ALLOWED = [
  "components/mdx/ColorSwatch.tsx",
  "components/mdx/TypographySample.tsx",
];

const violations = [];
const add = (file, line, rule, msg) =>
  violations.push(`${file}:${line} ${rule} ${msg}`);

for (const abs of files) {
  const file = relative(root, abs).split(sep).join("/");
  const isStory = file.endsWith(".stories.tsx");
  const inUi = file.startsWith("components/ui/");
  const text = readFileSync(abs, "utf8");
  const lines = text.split("\n");

  if (!isStory) {
    lines.forEach((l, i) => {
      const n = i + 1;
      if (!inUi && RAW.test(l) && !l.includes('type="file"'))
        add(file, n, "raw-element", "use um primitivo de components/ui/ em vez de elemento nativo");
      if (STYLE.test(l) && !STYLE_ALLOWED.includes(file))
        add(file, n, "inline-style", "evite style={{}}; use classes/tokens");
      if (COLOR.test(l))
        add(file, n, "hardcoded-color", "use tokens (bg-primary, text-muted-foreground...), sem cor fixa");
      if (ROUND.test(l))
        add(file, n, "radius", "rounded-none não é permitido");
    });
  }

  if (inUi && !isStory) {
    if (/<button|<input|<textarea|<select|<a /.test(text) && !text.includes("focus-visible:"))
      add(file, 1, "focus", "elemento interativo sem estilo focus-visible:");
  }
}

if (violations.length) {
  console.log(violations.join("\n"));
  console.log(`\nui-audit: ${violations.length} violação(ões)`);
  process.exit(1);
}
console.log(`ui-audit: OK (${files.length} files)`);
