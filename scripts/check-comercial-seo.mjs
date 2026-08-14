#!/usr/bin/env node
/**
 * GATE COMERCIAL — ONDA 2 + HUB
 *
 * Para cada URL comercial declarada em scripts/lib/comercial-onda2.mjs valida,
 * no HTML ESTÁTICO (pré-hidratação):
 *   1. <link rel="canonical"> presente, absoluto e self-referente
 *   2. og:url igual ao canonical
 *   3. og:site_name = "Técnico em Curitiba"
 *   4. JSON-LD com os @type obrigatórios (Service / FAQPage / LocalBusiness)
 *   5. URL listada no sitemap curado (indexação esperada)
 * Também confere robots.txt (sem bloqueio global, com diretiva Sitemap).
 *
 * Uso:
 *   node scripts/check-comercial-seo.mjs dist            # pós-build (padrão)
 *   node scripts/check-comercial-seo.mjs --base=https://tecnico.curitiba.br
 *
 * Saída: reports/comercial-onda2-seo.{json,md} · exit 1 em qualquer falha.
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BASE_URL, COMERCIAL_ONDA2, SITE_NAME, keywordsDuplicadas } from "./lib/comercial-onda2.mjs";

const args = process.argv.slice(2);
const BASE = args.find((a) => a.startsWith("--base="))?.slice(7)?.replace(/\/$/, "") ?? null;
const DIST = args.find((a) => !a.startsWith("--")) ?? "dist";

const errors = [];
const warnings = [];

const attr = (html, re) => html.match(re)?.[1]?.trim() ?? null;
const canonicalDe = (html) => attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
const ogDe = (html, prop) =>
  attr(html, new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`, "i")) ??
  attr(html, new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`, "i"));

function tiposJsonLd(html) {
  const tipos = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      warnings.push("bloco JSON-LD inválido encontrado");
      continue;
    }
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== "object") return;
      const t = n["@type"];
      if (typeof t === "string") tipos.add(t);
      if (Array.isArray(t)) t.forEach((x) => tipos.add(x));
      if (Array.isArray(n["@graph"])) n["@graph"].forEach(walk);
    };
    walk(data);
  }
  return tipos;
}

async function carregar(path) {
  if (BASE) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
      return res.ok ? await res.text() : null;
    } catch {
      return null;
    }
  }
  const file = path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html");
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

/* ── URLs presentes nos sitemaps emitidos ─────────────────────────── */
function urlsNoSitemap() {
  const set = new Set();
  const dir = existsSync(join(DIST, "sitemap-main.xml")) ? DIST : "public";
  for (const f of readdirSync(dir).filter((f) => /^sitemap.*\.xml$/.test(f))) {
    const xml = readFileSync(join(dir, f), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) set.add(m[1].replace(BASE_URL, ""));
  }
  return set;
}

const noSitemap = urlsNoSitemap();
const linhas = [];

for (const item of COMERCIAL_ONDA2) {
  const html = await carregar(item.path);
  const r = {
    path: item.path,
    cluster: item.cluster,
    intencao: item.intencao,
    keyword: item.keyword,
    canonical: null,
    ogUrl: null,
    ogSiteName: null,
    schemas: [],
    faltando: [],
    noSitemap: noSitemap.has(item.path),
    ok: true,
  };
  if (!html) {
    r.ok = false;
    r.faltando.push("HTML estático ausente");
    errors.push(`${item.path}: HTML estático não encontrado (${BASE ? "fetch" : DIST})`);
    linhas.push(r);
    continue;
  }
  const esperado = `${BASE_URL}${item.path === "/" ? "/" : item.path}`;
  r.canonical = canonicalDe(html);
  r.ogUrl = ogDe(html, "url");
  r.ogSiteName = ogDe(html, "site_name");
  const tipos = tiposJsonLd(html);
  r.schemas = [...tipos];

  if (r.canonical !== esperado) {
    r.ok = false;
    errors.push(`${item.path}: canonical "${r.canonical ?? "ausente"}" ≠ "${esperado}"`);
  }
  if (r.ogUrl !== esperado) {
    r.ok = false;
    errors.push(`${item.path}: og:url "${r.ogUrl ?? "ausente"}" ≠ "${esperado}"`);
  }
  if (r.ogSiteName !== SITE_NAME) {
    r.ok = false;
    errors.push(`${item.path}: og:site_name "${r.ogSiteName ?? "ausente"}" ≠ "${SITE_NAME}"`);
  }
  for (const t of item.schemas) {
    if (!tipos.has(t)) {
      r.faltando.push(t);
      r.ok = false;
      errors.push(`${item.path}: JSON-LD sem @type ${t}`);
    }
  }
  if (!r.noSitemap) {
    r.ok = false;
    errors.push(`${item.path}: não está listada em nenhum sitemap curado`);
  }
  linhas.push(r);
}

/* ── robots.txt ───────────────────────────────────────────────────── */
const robotsPath = existsSync(join(DIST, "robots.txt")) ? join(DIST, "robots.txt") : "public/robots.txt";
if (!existsSync(robotsPath)) errors.push("robots.txt ausente");
else {
  const robots = readFileSync(robotsPath, "utf8");
  if (/^\s*User-agent:\s*\*\s*[\r\n]+\s*Disallow:\s*\/\s*$/mi.test(robots)) {
    errors.push("robots.txt: bloqueio global `Disallow: /`");
  }
  if (!/^\s*Sitemap:\s*https?:\/\//mi.test(robots)) warnings.push("robots.txt sem diretiva Sitemap:");
}

/* ── canibalização de keyword principal ───────────────────────────── */
for (const d of keywordsDuplicadas()) {
  errors.push(`keyword duplicada "${d.keyword}" em ${d.paths.join(" e ")}`);
}

/* ── relatório ────────────────────────────────────────────────────── */
mkdirSync("reports", { recursive: true });
const relatorio = {
  generatedAt: new Date().toISOString(),
  fonte: BASE ?? DIST,
  total: linhas.length,
  aprovadas: linhas.filter((l) => l.ok).length,
  erros: errors,
  avisos: warnings,
  urls: linhas,
};
writeFileSync("reports/comercial-onda2-seo.json", JSON.stringify(relatorio, null, 2));
writeFileSync(
  "reports/comercial-onda2-seo.md",
  [
    "# Onda 2 — status de indexação esperado (rotas comerciais + hub)",
    "",
    `- Fonte: \`${relatorio.fonte}\``,
    `- Gerado em: ${relatorio.generatedAt}`,
    `- Aprovadas: **${relatorio.aprovadas}/${relatorio.total}**`,
    "",
    "| URL | Cluster | Intenção | Keyword principal | Canonical | og:url | og:site_name | Schemas | Sitemap |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...linhas.map(
      (l) =>
        `| ${l.path} | ${l.cluster} | ${l.intencao} | ${l.keyword} | ${l.canonical ? "✔" : "✖"} | ${l.ogUrl ? "✔" : "✖"} | ${l.ogSiteName ? "✔" : "✖"} | ${l.schemas.join(", ") || "—"}${l.faltando.length ? ` (falta: ${l.faltando.join(", ")})` : ""} | ${l.noSitemap ? "✔" : "✖"} |`,
    ),
    "",
    errors.length ? `## Falhas\n\n${errors.map((e) => `- ${e}`).join("\n")}` : "Sem falhas.",
    warnings.length ? `\n## Avisos\n\n${warnings.map((w) => `- ${w}`).join("\n")}` : "",
  ].join("\n"),
);

console.log(`Onda 2 comercial: ${relatorio.aprovadas}/${relatorio.total} URLs aprovadas — reports/comercial-onda2-seo.md`);
for (const w of warnings) console.warn(`  aviso: ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} falha(s):`);
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}
console.log("✔ canonical, og:url, og:site_name, schema e sitemap conformes.");
