#!/usr/bin/env node
/**
 * CHANGELOG DE SEO POR BUILD
 *
 * Extrai do dist, para cada rota curada, um "snapshot" de:
 *   - title, meta description, canonical, og:url, robots
 *   - hierarquia de headings (H1/H2/H3)
 *   - tipos de structured data (@type dos blocos JSON-LD)
 *
 * Compara com o snapshot do build anterior (reports/seo-snapshot.json) e emite
 * um changelog legível por commit: o que entrou, o que saiu e o que mudou.
 *
 * Uso:
 *   node scripts/report-seo-changelog.mjs dist            # gera changelog
 *   node scripts/report-seo-changelog.mjs dist --save     # atualiza o snapshot
 *
 * Saídas: reports/seo-changelog.md · reports/seo-changelog.json · reports/seo-snapshot.json
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const SAVE = args.includes("--save");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");
const SNAPSHOT = "reports/seo-snapshot.json";
const commit = (process.env.GITHUB_SHA ?? "").slice(0, 8) || "local";
const branch = process.env.GITHUB_REF_NAME ?? "local";

if (!existsSync(DIST)) {
  console.error(`dist ausente em ${DIST} — rode "npm run build" antes do changelog de SEO.`);
  process.exit(1);
}

const lerHtml = (routePath) => {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
};

const texto = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const attr = (html, re) => html.match(re)?.[1]?.trim() ?? "";

function tiposJsonLd(html) {
  const tipos = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== "object") return;
        if (node["@type"]) [].concat(node["@type"]).forEach((t) => tipos.add(t));
        Object.values(node).forEach(walk);
      };
      walk(JSON.parse(m[1]));
    } catch {
      tipos.add("JSON-LD inválido");
    }
  }
  return [...tipos].sort();
}

function snapshotDe(html) {
  const headings = [];
  for (const m of html.matchAll(/<h([123])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    headings.push(`H${m[1]}: ${texto(m[2]).slice(0, 120)}`);
  }
  return {
    title: attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: attr(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    canonical: attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i),
    ogUrl: attr(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i),
    robots: attr(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i),
    headings,
    schemas: tiposJsonLd(html),
  };
}

const atual = {};
for (const routePath of [...new Set(CURATED_PATHS)]) {
  const html = lerHtml(routePath);
  if (html) atual[routePath] = snapshotDe(html);
}

const anterior = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, "utf8")) : null;
const antes = anterior?.pages ?? {};

const adicionadas = Object.keys(atual).filter((p) => !antes[p]);
const removidas = Object.keys(antes).filter((p) => !atual[p]);
const alteradas = [];

const listaDiff = (a = [], b = []) => ({
  entrou: b.filter((x) => !a.includes(x)),
  saiu: a.filter((x) => !b.includes(x)),
});

for (const p of Object.keys(atual)) {
  const a = antes[p];
  if (!a) continue;
  const b = atual[p];
  const mudancas = [];
  for (const campo of ["title", "description", "canonical", "ogUrl", "robots"]) {
    if ((a[campo] ?? "") !== (b[campo] ?? "")) {
      mudancas.push({ campo, de: a[campo] ?? "", para: b[campo] ?? "" });
    }
  }
  const h = listaDiff(a.headings, b.headings);
  const s = listaDiff(a.schemas, b.schemas);
  if (h.entrou.length || h.saiu.length) mudancas.push({ campo: "headings", ...h });
  if (s.entrou.length || s.saiu.length) mudancas.push({ campo: "structured data", ...s });
  if (mudancas.length) alteradas.push({ path: p, mudancas });
}

const changelog = {
  generatedAt: new Date().toISOString(),
  commit,
  branch,
  baseCommit: anterior?.commit ?? null,
  totals: { paginas: Object.keys(atual).length, adicionadas: adicionadas.length, removidas: removidas.length, alteradas: alteradas.length },
  adicionadas,
  removidas,
  alteradas,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/seo-changelog.json", `${JSON.stringify(changelog, null, 2)}\n`);

const bloco = (m) =>
  m.campo === "headings" || m.campo === "structured data"
    ? `  - **${m.campo}**: ${[
        m.entrou.length ? `+ ${m.entrou.join(" | ")}` : null,
        m.saiu.length ? `− ${m.saiu.join(" | ")}` : null,
      ]
        .filter(Boolean)
        .join(" · ")}`
    : `  - **${m.campo}**: \`${m.de || "—"}\` → \`${m.para || "—"}\``;

writeFileSync(
  "reports/seo-changelog.md",
  [
    `# Changelog de SEO — build ${commit} (${branch})`,
    "",
    `- Gerado em: ${changelog.generatedAt}`,
    `- Comparado com: ${changelog.baseCommit ?? "_sem snapshot anterior (primeira execução)_"}`,
    `- Páginas: ${changelog.totals.paginas} · novas: ${adicionadas.length} · removidas: ${removidas.length} · alteradas: ${alteradas.length}`,
    "",
    "## Páginas novas",
    "",
    adicionadas.length ? adicionadas.map((p) => `- ${p}`).join("\n") : "_nenhuma_",
    "",
    "## Páginas removidas do build",
    "",
    removidas.length ? removidas.map((p) => `- ${p}`).join("\n") : "_nenhuma_",
    "",
    "## Alterações de headings, metadados e structured data",
    "",
    alteradas.length
      ? alteradas.map((a) => `- \`${a.path}\`\n${a.mudancas.map(bloco).join("\n")}`).join("\n")
      : "_nenhuma alteração detectada_",
    "",
  ].join("\n"),
);

if (SAVE) writeFileSync(SNAPSHOT, `${JSON.stringify({ commit, branch, generatedAt: changelog.generatedAt, pages: atual }, null, 2)}\n`);

console.log(
  `seo changelog: ${changelog.totals.paginas} páginas · +${adicionadas.length} / −${removidas.length} / ~${alteradas.length}` +
    (SAVE ? " (snapshot atualizado)" : ""),
);
