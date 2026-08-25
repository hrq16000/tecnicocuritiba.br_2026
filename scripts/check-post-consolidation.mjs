#!/usr/bin/env node
/**
 * ============================================================================
 * VERIFICAÇÃO PÓS-DEPLOY DA CONSOLIDAÇÃO (Fase de Operação)
 * ============================================================================
 * Roda depois do deploy (ou sobre o `dist/`) e responde três perguntas:
 *
 *   1. Sobrou link interno para alguma das 40 URLs consolidadas?
 *      (inclui href em HTML, breadcrumb JSON-LD, ItemList e sitemap)
 *   2. Sitemap e breadcrumbs estão coerentes com a consolidação?
 *      (nenhuma URL removida no sitemap; breadcrumb aponta só para canônicos)
 *   3. As rotas antigas respondem 301 para o destino certo — e não 404?
 *      (em modo live; em modo dist verifica o contrato de redirect emitido)
 *
 * Uso:
 *   node scripts/check-post-consolidation.mjs dist            # pré-deploy
 *   node scripts/check-post-consolidation.mjs --live [origem] # pós-deploy
 * Exit 1 em qualquer falha — este é um gate, não um relatório informativo.
 */
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CONSOLIDATED_LOCAL_URLS, CONSOLIDATED_LOCAL_PATHS } from "./lib/consolidated-local-urls.mjs";
import { CURATED_PATHS, BASE_URL } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const ORIGIN = args.find((a) => a.startsWith("http")) ?? BASE_URL;
const DIST = args.find((a) => !a.startsWith("--") && !a.startsWith("http")) ?? "dist";

const falhas = [];
const avisos = [];
const linhas = [];

// ── 1 · Sitemap não pode conter URL consolidada ────────────────────────────
const publicDir = resolve("public");
const sitemapPaths = new Set();
for (const f of readdirSync(publicDir).filter((x) => /^sitemap-.*\.xml$/.test(x) && x !== "sitemap-index.xml")) {
  const xml = readFileSync(join(publicDir, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].trim().replace(BASE_URL, "") || "/";
    sitemapPaths.add(p);
    if (CONSOLIDATED_LOCAL_PATHS.has(p)) falhas.push(`sitemap ${f} contém URL consolidada: ${p}`);
  }
}
linhas.push(`Sitemap curado: ${sitemapPaths.size} URLs`);

// ── 2 · HTML servido: links, breadcrumbs e ItemList ────────────────────────
function htmlDe(path) {
  const base = DIST.endsWith("client") ? DIST : join(DIST, "client");
  const cands = [
    join(base, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
    join(DIST, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
  ];
  const f = cands.find((c) => existsSync(c));
  return f ? readFileSync(f, "utf8") : null;
}

async function carregar(path) {
  if (!LIVE) return htmlDe(path);
  const res = await fetch(`${ORIGIN}${path}`, { redirect: "manual" });
  if (res.status !== 200) {
    falhas.push(`${path} → HTTP ${res.status} (esperado 200 para URL canônica)`);
    return null;
  }
  return res.text();
}

const rotasConhecidas = new Set(CURATED_PATHS);
let comLinkParaConsolidada = 0;
let paginasVerificadas = 0;

for (const path of CURATED_PATHS) {
  const html = await carregar(path);
  if (!html) {
    if (!LIVE) falhas.push(`${path}: HTML ausente em ${DIST}`);
    continue;
  }
  paginasVerificadas++;

  // links internos
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (CONSOLIDATED_LOCAL_PATHS.has(href)) {
      falhas.push(`${path}: link interno para URL consolidada ${href}`);
      comLinkParaConsolidada++;
    }
  }

  // JSON-LD: breadcrumb + ItemList
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      falhas.push(`${path}: JSON-LD inválido`);
      continue;
    }
    const bruto = JSON.stringify(data);
    for (const c of CONSOLIDATED_LOCAL_PATHS)
      if (bruto.includes(`${BASE_URL}${c}`) || bruto.includes(`"${c}"`))
        falhas.push(`${path}: structured data referencia URL consolidada ${c}`);
    // breadcrumb precisa terminar na própria URL canônica
    const nodes = [];
    (function flat(n) {
      if (Array.isArray(n)) n.forEach(flat);
      else if (n && typeof n === "object") {
        nodes.push(n);
        if (Array.isArray(n["@graph"])) n["@graph"].forEach(flat);
      }
    })(data);
    for (const n of nodes) {
      if (![].concat(n["@type"] ?? []).includes("BreadcrumbList")) continue;
      const itens = [].concat(n.itemListElement ?? []);
      const ultimo = itens[itens.length - 1];
      const item = ultimo?.item?.["@id"] ?? ultimo?.item ?? "";
      const alvo = typeof item === "string" ? item.replace(BASE_URL, "").replace(/\/$/, "") || "/" : "";
      if (alvo && alvo !== path.replace(/\/$/, "") && `${alvo}/` !== path)
        avisos.push(`${path}: breadcrumb termina em "${alvo}"`);
    }
  }
}
linhas.push(`Páginas verificadas: ${paginasVerificadas}`);
linhas.push(`Links internos para consolidadas: ${comLinkParaConsolidada}`);

// ── 3 · Rotas antigas: 301 de um hop para destino 200 ──────────────────────
const redirectRows = [];
if (LIVE) {
  const fila = [...CONSOLIDATED_LOCAL_URLS];
  async function worker() {
    while (fila.length) {
      const { from, to } = fila.shift();
      try {
        const res = await fetch(`${ORIGIN}${from}`, { redirect: "manual" });
        const loc = (res.headers.get("location") ?? "").replace(ORIGIN, "") || "";
        const permanente = res.status === 301 || res.status === 308;
        if (!permanente) falhas.push(`${from} → HTTP ${res.status} (esperado 301/308)`);
        if (loc.replace(/\/$/, "") !== to.replace(/\/$/, ""))
          falhas.push(`${from} → destino "${loc}" ≠ "${to}"`);
        // segundo hop
        let hops = 1;
        let final = res;
        if (permanente && loc) {
          final = await fetch(`${ORIGIN}${loc}`, { redirect: "manual" });
          if (final.status >= 300 && final.status < 400) {
            hops = 2;
            falhas.push(`${from}: cadeia de redirect (${hops} hops)`);
          }
          if (final.status === 404) falhas.push(`${from}: destino ${loc} responde 404`);
        }
        redirectRows.push({ from, to, status: res.status, destino: loc, hops, destinoStatus: final.status });
      } catch (e) {
        falhas.push(`${from}: falha ao consultar (${e.message})`);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
} else {
  // Modo dist: o contrato de redirect precisa existir e o destino ser canônico.
  for (const { from, to } of CONSOLIDATED_LOCAL_URLS) {
    if (htmlDe(from)) falhas.push(`${from}: HTML estático emitido para URL consolidada (deveria só redirecionar)`);
    if (!rotasConhecidas.has(to) && !sitemapPaths.has(to))
      falhas.push(`${from}: destino ${to} não está no conjunto canônico`);
    redirectRows.push({ from, to, status: "301 (contrato)", destino: to, hops: 1, destinoStatus: "canônico" });
  }
}

// ── Relatório ──────────────────────────────────────────────────────────────
mkdirSync("reports", { recursive: true });
const md = [
  "# Verificação pós-deploy da consolidação",
  "",
  `Gerado em ${new Date().toISOString()} · modo: ${LIVE ? `live (${ORIGIN})` : `dist (${DIST})`}`,
  "",
  ...linhas.map((l) => `- ${l}`),
  `- Redirects auditados: ${redirectRows.length}`,
  `- Falhas: **${falhas.length}** · Avisos: ${avisos.length}`,
  "",
  "| Origem (consolidada) | Status | Destino | Hops | Destino final |",
  "| --- | --- | --- | --- | --- |",
  ...redirectRows.map((r) => `| ${r.from} | ${r.status} | ${r.destino} | ${r.hops} | ${r.destinoStatus} |`),
  "",
  falhas.length ? `## Falhas\n\n${falhas.map((f) => `- ${f}`).join("\n")}` : "Sem falhas.",
  "",
  avisos.length ? `## Avisos\n\n${avisos.map((a) => `- ${a}`).join("\n")}` : "",
].join("\n");
writeFileSync("reports/post-consolidation.md", md);
writeFileSync(
  "reports/post-consolidation.json",
  `${JSON.stringify({ geradoEm: new Date().toISOString(), modo: LIVE ? "live" : "dist", falhas, avisos, redirects: redirectRows }, null, 2)}\n`,
);

console.log(`[pós-consolidação] ${redirectRows.length} redirects · ${falhas.length} falha(s) → reports/post-consolidation.md`);
for (const f of falhas.slice(0, 30)) console.error(`  ✖ ${f}`);
for (const a of avisos.slice(0, 10)) console.log(`  ⚠ ${a}`);
if (falhas.length) process.exit(1);
