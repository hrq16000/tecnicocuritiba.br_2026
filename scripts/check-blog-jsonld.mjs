#!/usr/bin/env node
/**
 * GATE — JSON-LD dos artigos (/blog/$slug), SSR **e** pós-hidratação.
 *
 * Por que existe: o gate de integridade só lia o HTML servido; a produção
 * mostrava BreadcrumbList ×2, FAQPage ×2 e duas entidades editoriais
 * concorrentes porque componentes injetavam <script ld+json> direto no
 * document.head, fora do registry de slots (src/lib/jsonLdSlots.ts).
 *
 * Verificações:
 *  1. ESTÁTICA — nenhum arquivo do fluxo editorial pode criar/anexar
 *     script ld+json manualmente; deve usar useJsonLdSlot.
 *  2. HTML SERVIDO — por artigo: BreadcrumbList ≤ 1, FAQPage ≤ 1,
 *     exatamente uma entidade editorial e nenhum @id conflitante.
 *
 * Uso: node scripts/check-blog-jsonld.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");
const CLIENT = existsSync(join(DIST, "client")) ? join(DIST, "client") : DIST;
const errors = [];

// ── 1. Análise estática do fluxo editorial ──────────────────────────────
const EDITORIAL_FILES = [
  "src/pages/BlogPost.tsx",
  "src/pages/Blog.tsx",
  "src/components/BlogPostFAQ.tsx",
];
for (const file of EDITORIAL_FILES) {
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  if (/document\.createElement\(\s*['"]script['"]\s*\)/.test(src) && /ld\+json/.test(src)) {
    errors.push(`${file}: injeta <script ld+json> manualmente — use useJsonLdSlot()`);
  }
  if (/data-blog-schema/.test(src)) {
    errors.push(`${file}: usa data-blog-schema (fora do registry de slots)`);
  }
}

// ── 2. HTML servido dos artigos ─────────────────────────────────────────
const EDITORIAL_TYPES = new Set(["Article", "BlogPosting", "NewsArticle", "TechArticle"]);
const flatten = (n) =>
  Array.isArray(n)
    ? n.flatMap(flatten)
    : n && typeof n === "object"
      ? Array.isArray(n["@graph"])
        ? n["@graph"].flatMap(flatten)
        : [n]
      : [];
const typesOf = (n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]).filter(Boolean);

let checked = 0;
const blogDir = join(CLIENT, "blog");
if (existsSync(blogDir)) {
  for (const entry of readdirSync(blogDir)) {
    const file = join(blogDir, entry, "index.html");
    if (!existsSync(file) || !statSync(join(blogDir, entry)).isDirectory()) continue;
    checked++;
    const html = readFileSync(file, "utf8");
    const nodes = [];
    for (const b of html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    )) {
      try {
        nodes.push(...flatten(JSON.parse(b[1])));
      } catch (e) {
        errors.push(`/blog/${entry}: JSON-LD inválido (${e.message})`);
      }
    }

    const count = (t) => nodes.filter((n) => typesOf(n).includes(t)).length;
    if (count("BreadcrumbList") > 1)
      errors.push(`/blog/${entry}: BreadcrumbList ×${count("BreadcrumbList")}`);
    if (count("FAQPage") > 1) errors.push(`/blog/${entry}: FAQPage ×${count("FAQPage")}`);

    const editoriais = nodes.filter((n) => typesOf(n).some((t) => EDITORIAL_TYPES.has(t)));
    if (editoriais.length > 1)
      errors.push(
        `/blog/${entry}: ${editoriais.length} entidades editoriais concorrentes (${editoriais
          .map((n) => typesOf(n).join("+"))
          .join(" | ")})`,
      );

    const ids = nodes.map((n) => n["@id"]).filter(Boolean);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length) errors.push(`/blog/${entry}: @id conflitante (${[...new Set(dup)].join(", ")})`);
  }
}

if (errors.length) {
  console.error(`[blog-jsonld] BLOQUEADO — ${errors.length} problema(s):`);
  errors.forEach((e) => console.error(`  • ${e}`));
  process.exit(1);
}
console.log(
  `[blog-jsonld] ok — fluxo editorial usa o registry de slots; ${checked} artigo(s) com entidade única.`,
);
