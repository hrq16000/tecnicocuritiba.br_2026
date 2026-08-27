#!/usr/bin/env node
/**
 * RODADA 4 — RELATÓRIO DE AUDITORIA: SITEMAP × INDEXAÇÃO × GATES
 *
 * Compara o conjunto de URLs enviadas no sitemap curado com:
 *   • o estado real do HTML publicado no dist (noindex, canonical divergente,
 *     página ausente do build) → anomalias que impedem indexação;
 *   • o histórico de submissões do IndexNow (reports/indexnow-manifest.json);
 *   • o histórico de submissões do sitemap no GSC
 *     (reports/sitemap-submissions.json);
 *   • o estado de índice do GSC quando houver snapshot
 *     (reports/gsc-indexing.json), sem chamar a API aqui.
 *
 * Saída: public/indexacao-auditoria.json (consumido por /admin/seo-status)
 *        reports/indexacao-auditoria.md
 *
 * Uso: node scripts/report-indexacao-auditoria.mjs [dist]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] || "dist");
const BASE = "https://tecnico.curitiba.br";
const readJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

// 1. URLs enviadas no sitemap curado
const publicDir = path.resolve("public");
const sitemapOf = new Map();
const lastmodOf = new Map();
for (const file of readdirSync(publicDir).filter(
  (f) => f.startsWith("sitemap-") && f.endsWith(".xml") && !["sitemap-index.xml", "sitemap-images.xml"].includes(f),
)) {
  const xml = readFileSync(path.join(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const bloco = m[1];
    const loc = bloco.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const p = loc.replace(BASE, "") || "/";
    sitemapOf.set(p, file);
    lastmodOf.set(p, bloco.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null);
  }
}

// 2. Estado no build
const distDisponivel = existsSync(DIST);
const urls = [];
for (const p of [...sitemapOf.keys()].sort()) {
  const file = path.join(DIST, p === "/" ? "" : p, "index.html");
  const anomalias = [];
  let avaliada = true;
  let noindex = null;
  let canonical = null;
  let title = null;

  if (!distDisponivel) {
    // Sem build local não há HTML para auditar: a URL fica "não avaliada",
    // nunca contabilizada como anomalia (evitaria alarme falso).
    avaliada = false;
  } else if (!existsSync(file)) {
    anomalias.push("URL no sitemap sem HTML no build (404 provável)");
  } else {
    const html = readFileSync(file, "utf8");
    noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
    canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? null;
    title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim() || null;
    if (noindex) anomalias.push("página no sitemap servindo meta robots noindex");
    if (!canonical) anomalias.push("sem link canonical");
    else if (canonical.replace(/\/$/, "") !== `${BASE}${p}`.replace(/\/$/, ""))
      anomalias.push(`canonical aponta para outra URL (${canonical})`);
    if (!title) anomalias.push("sem <title>");
  }

  urls.push({
    path: p,
    sitemap: sitemapOf.get(p),
    lastmod: lastmodOf.get(p) ?? null,
    noindex,
    canonical,
    title,
    avaliada,
    anomalias,
  });
}

// 3. Históricos de submissão
const indexnowManifest = readJson(path.resolve("reports/indexnow-manifest.json")) ?? {};
const indexnowEntries = Object.entries(indexnowManifest).map(([p, v]) => ({
  path: p,
  lastSubmitted: v?.lastSubmitted ?? null,
  submissions: v?.submissions ?? 0,
}));
const sitemapSubmissions = readJson(path.resolve("reports/sitemap-submissions.json")) ?? [];
const gsc = readJson(path.resolve("reports/gsc-indexing.json"));

const naoSubmetidas = urls.filter((u) => !indexnowManifest[u.path]).map((u) => u.path);
const comAnomalia = urls.filter((u) => u.anomalias.length);

const payload = {
  generatedAt: new Date().toISOString(),
  fontes: {
    sitemap: "public/sitemap-*.xml",
    dist: distDisponivel ? DIST : null,
    indexnow: "reports/indexnow-manifest.json",
    gscSitemap: "reports/sitemap-submissions.json",
    gscIndex: gsc ? "reports/gsc-indexing.json" : null,
  },
  totals: {
    sitemapUrls: urls.length,
    comLastmod: urls.filter((u) => u.lastmod).length,
    anomalias: comAnomalia.length,
    naoAvaliadas: urls.filter((u) => !u.avaliada).length,
    noindexNoSitemap: urls.filter((u) => u.noindex).length,
    indexnowConhecidas: indexnowEntries.length,
    indexnowPendentes: naoSubmetidas.length,
    gscCoverage: gsc?.coverage ?? null,
    gscIndexadas: gsc?.results?.filter((r) => r.indexed).length ?? null,
  },
  urls,
  anomalias: comAnomalia.map((u) => ({ path: u.path, anomalias: u.anomalias })),
  indexnow: {
    ultimasSubmissoes: indexnowEntries
      .filter((e) => e.lastSubmitted)
      .sort((a, b) => String(b.lastSubmitted).localeCompare(String(a.lastSubmitted)))
      .slice(0, 50),
    pendentes: naoSubmetidas.slice(0, 50),
  },
  sitemapSubmissions: sitemapSubmissions.slice(-20).reverse(),
};

mkdirSync("reports", { recursive: true });
writeFileSync(path.resolve("public/indexacao-auditoria.json"), `${JSON.stringify(payload, null, 2)}\n`);

const md = [
  `# Auditoria sitemap × indexação`,
  ``,
  `Gerado em ${payload.generatedAt}`,
  ``,
  `- URLs no sitemap: **${payload.totals.sitemapUrls}** (${payload.totals.comLastmod} com lastmod real)`,
  `- Anomalias: **${payload.totals.anomalias}** (noindex no sitemap: ${payload.totals.noindexNoSitemap})`,
  `- IndexNow: ${payload.totals.indexnowConhecidas} conhecidas · ${payload.totals.indexnowPendentes} nunca submetidas`,
  `- Cobertura GSC (snapshot): ${payload.totals.gscCoverage ?? "sem dado"}`,
  ``,
  ...(comAnomalia.length
    ? [`## Anomalias`, ``, ...comAnomalia.map((u) => `- \`${u.path}\` — ${u.anomalias.join("; ")}`)]
    : [`Nenhuma anomalia detectada.`]),
  ``,
].join("\n");
writeFileSync(path.resolve("reports/indexacao-auditoria.md"), md);

console.log(
  `auditoria: ${payload.totals.sitemapUrls} URL(s) no sitemap · ${payload.totals.anomalias} anomalia(s) · ${payload.totals.indexnowPendentes} pendente(s) no IndexNow`,
);
if (process.argv.includes("--gate") && comAnomalia.length) process.exit(1);
