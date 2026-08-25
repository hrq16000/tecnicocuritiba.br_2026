#!/usr/bin/env node
/**
 * INVENTÁRIO MESTRE DE DESCOBERTA / CRAWLING / INDEXAÇÃO
 *
 * Junta, por URL do sitemap curado:
 *   - contrato técnico live (HTTP, TTFB, canonical, meta robots, H1)
 *   - malha interna real do HTML SSR (inbound, inbound contextual, depth)
 *   - performance GSC (clicks/impressões, 90d)
 *   - estado de índice GSC (URL Inspection — somente leitura)
 *   - cluster + tier de prioridade
 *
 * Saídas: reports/indexation-inventory.json
 *         reports/indexation-master.md
 *         reports/google-indexation.md
 *
 * Uso:
 *   node scripts/report-indexation-inventory.mjs            # completo
 *   node scripts/report-indexation-inventory.mjs --no-gsc   # só contrato + malha
 *   node scripts/report-indexation-inventory.mjs --no-inspect
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { clusterOf, tierOf } from "./lib/indexation-tiers.mjs";
import { lastmodFor } from "./lib/lastmod.mjs";

const BASE = "https://tecnico.curitiba.br";
const args = process.argv.slice(2);
const useGsc = !args.includes("--no-gsc");
const useInspect = useGsc && !args.includes("--no-inspect");

// ── 1. URLs do sitemap curado (fonte única servida aos buscadores) ──────────
const publicDir = resolve("public");
const sitemapFiles = readdirSync(publicDir).filter(
  (f) => f.startsWith("sitemap-") && f.endsWith(".xml") && f !== "sitemap-index.xml" && f !== "sitemap-images.xml",
);
const sitemapOf = new Map();
for (const file of sitemapFiles) {
  const xml = readFileSync(resolve(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = m[1].trim().replace(BASE, "") || "/";
    sitemapOf.set(path, file);
  }
}
const paths = [...sitemapOf.keys()].sort();
console.log(`sitemap curado: ${paths.length} URL(s) em ${sitemapFiles.length} sub-sitemap(s)`);

// ── 2. Fetch live + parse do HTML SSR ──────────────────────────────────────
const pages = new Map();

async function fetchPage(path) {
  const url = `${BASE}${path}`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "tecnico-indexation-audit" } });
    const ttfb = Date.now() - t0;
    const html = res.status < 300 ? await res.text() : "";
    return { path, http: res.status, ttfb, xRobots: res.headers.get("x-robots-tag"), html };
  } catch (e) {
    return { path, http: 0, ttfb: Date.now() - t0, error: String(e).slice(0, 160), html: "" };
  }
}

const NAV_RE = /<(?:header|nav|footer)\b[\s\S]*?<\/(?:header|nav|footer)>/gi;

function parsePage(p) {
  const html = p.html ?? "";
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1] ?? null;
  const robots = html.match(/name="robots"\s+content="([^"]+)"/)?.[1] ?? null;
  const h1 = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  const links = new Set();
  const contextual = new Set();
  const stripped = html.replace(NAV_RE, "");
  const collect = (src, sink) => {
    for (const m of src.matchAll(/<a\b[^>]*href="([^"#?]+)/gi)) {
      let href = m[1];
      if (href.startsWith(BASE)) href = href.slice(BASE.length) || "/";
      if (!href.startsWith("/")) continue;
      href = href.length > 1 ? href.replace(/\/+$/, "") : "/";
      sink.add(href);
    }
  };
  collect(html, links);
  collect(stripped, contextual);
  return {
    ...p,
    html: undefined,
    canonical,
    robots,
    h1,
    noindex: /noindex/i.test(robots ?? "") || /noindex/i.test(p.xRobots ?? ""),
    outLinks: [...links],
    contextualLinks: [...contextual],
  };
}

async function crawl() {
  const queue = [...paths];
  const CONC = 6;
  let done = 0;
  async function worker() {
    while (queue.length) {
      const path = queue.shift();
      pages.set(path, parsePage(await fetchPage(path)));
      if (++done % 25 === 0) console.log(`  crawl ${done}/${paths.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
}
await crawl();

// ── 3. Malha interna: inbound, contextual inbound, depth (BFS na home) ─────
const inbound = new Map(paths.map((p) => [p, 0]));
const inboundCtx = new Map(paths.map((p) => [p, 0]));
for (const page of pages.values()) {
  for (const target of page.outLinks) {
    if (target === page.path) continue;
    if (inbound.has(target)) inbound.set(target, inbound.get(target) + 1);
  }
  for (const target of page.contextualLinks) {
    if (target === page.path) continue;
    if (inboundCtx.has(target)) inboundCtx.set(target, inboundCtx.get(target) + 1);
  }
}

const depth = new Map([["/", 0]]);
let frontier = ["/"];
while (frontier.length) {
  const next = [];
  for (const cur of frontier) {
    for (const target of pages.get(cur)?.outLinks ?? []) {
      if (!pages.has(target) || depth.has(target)) continue;
      depth.set(target, depth.get(cur) + 1);
      next.push(target);
    }
  }
  frontier = next;
}

// ── 4. GSC: performance + estado de índice ─────────────────────────────────
const perf = new Map();
const idxState = new Map();
let site = null;
let gscErro = null;

if (useGsc) {
  try {
    const { resolveSite, searchAnalytics, inspectUrl, dayOffset } = await import("./lib/gsc-client.mjs");
    site = process.env.GSC_SITE_URL || (await resolveSite(`${BASE}/`));
    const rows = await searchAnalytics(site, {
      startDate: dayOffset(-92),
      endDate: dayOffset(-2),
      dimensions: ["page"],
      rowLimit: 25000,
      dataState: "all",
    });
    for (const r of rows) {
      const path = (r.keys?.[0] ?? "").replace(BASE, "").replace(/\/$/, "") || "/";
      perf.set(path, { clicks: r.clicks ?? 0, impressions: r.impressions ?? 0, position: r.position ?? null });
    }
    console.log(`GSC performance: ${rows.length} página(s) com dados`);

    if (useInspect) {
      const queue = [...paths];
      let n = 0;
      async function worker() {
        while (queue.length) {
          const path = queue.shift();
          try {
            idxState.set(path, await inspectUrl(site, `${BASE}${path}`));
          } catch (e) {
            idxState.set(path, { verdict: "ERROR", coverageState: String(e.message).slice(0, 120) });
          }
          if (++n % 25 === 0) console.log(`  inspect ${n}/${paths.length}`);
        }
      }
      await Promise.all(Array.from({ length: 4 }, worker));
    }
  } catch (e) {
    gscErro = e.message;
    console.warn(`aviso: GSC indisponível — ${gscErro}`);
  }
}

/** INDEXED | DISCOVERED_NOT_INDEXED | CRAWLED_NOT_INDEXED | UNKNOWN_TO_GOOGLE | OTHER */
function gscClass(state) {
  if (!state) return "N/A";
  const cov = (state.coverageState ?? "").toLowerCase();
  if (state.verdict === "PASS") return "INDEXED";
  if (cov.includes("crawled") && cov.includes("not indexed")) return "CRAWLED_NOT_INDEXED";
  if (cov.includes("discovered")) return "DISCOVERED_NOT_INDEXED";
  if (cov.includes("url is unknown")) return "UNKNOWN_TO_GOOGLE";
  if (state.verdict === "ERROR") return "OTHER";
  return "OTHER";
}

// ── 5. Inventário ─────────────────────────────────────────────────────────
const inventory = paths.map((path) => {
  const p = pages.get(path) ?? {};
  const g = perf.get(path) ?? { clicks: 0, impressions: 0, position: null };
  const state = idxState.get(path) ?? null;
  const canonicalSelf = p.canonical === `${BASE}${path}` || (path === "/" && p.canonical === `${BASE}/`);
  return {
    url: `${BASE}${path}`,
    path,
    cluster: clusterOf(path),
    tier: tierOf(path, g),
    sitemap: sitemapOf.get(path),
    http: p.http ?? null,
    ttfbMs: p.ttfb ?? null,
    indexavel: p.http === 200 && !p.noindex,
    noindex: !!p.noindex,
    canonical: p.canonical ?? null,
    canonicalSelf,
    h1: p.h1 ?? null,
    inbound: inbound.get(path) ?? 0,
    inboundContextual: inboundCtx.get(path) ?? 0,
    orfa: (inbound.get(path) ?? 0) === 0,
    depth: depth.has(path) ? depth.get(path) : null,
    lastmod: lastmodFor(path),
    gscStatus: gscClass(state),
    gscCoverage: state?.coverageState ?? null,
    lastCrawl: state?.lastCrawlTime ?? null,
    googleCanonical: state?.googleCanonical ?? null,
    clicks: g.clicks,
    impressions: g.impressions,
    position: g.position,
  };
});

mkdirSync("reports", { recursive: true });
const geradoEm = new Date().toISOString();
writeFileSync(
  "reports/indexation-inventory.json",
  JSON.stringify({ geradoEm, site, gscErro, base: BASE, total: inventory.length, urls: inventory }, null, 2),
);

// ── 6. Relatórios markdown ────────────────────────────────────────────────
const count = (fn) => inventory.filter(fn).length;
const byKey = (key) => {
  const m = new Map();
  for (const u of inventory) m.set(u[key], (m.get(u[key]) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};
const table = (rows) => rows.map(([k, v]) => `| ${k} | ${v} |`).join("\n");

const statusPorCluster = () => {
  const m = new Map();
  for (const u of inventory) {
    const row = m.get(u.cluster) ?? { INDEXED: 0, DISCOVERED_NOT_INDEXED: 0, UNKNOWN_TO_GOOGLE: 0, OTHER: 0, total: 0 };
    row[u.gscStatus] = (row[u.gscStatus] ?? 0) + 1;
    row.total++;
    m.set(u.cluster, row);
  }
  return [...m.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(
      ([c, r]) =>
        `| ${c} | ${r.total} | ${r.INDEXED} | ${r.DISCOVERED_NOT_INDEXED} | ${r.UNKNOWN_TO_GOOGLE} | ${r.OTHER} |`,
    )
    .join("\n");
};

const ttfbs = inventory.map((u) => u.ttfbMs).filter((n) => typeof n === "number").sort((a, b) => a - b);
const p = (q) => (ttfbs.length ? ttfbs[Math.floor((ttfbs.length - 1) * q)] : "N/A");
const lentas = inventory.filter((u) => (u.ttfbMs ?? 0) > 800);
const orfas = inventory.filter((u) => u.orfa);
const unknownOrfas = inventory.filter((u) => u.gscStatus === "UNKNOWN_TO_GOOGLE" && u.orfa);

const master = `# Inventário de indexação — tecnico.curitiba.br

Gerado em ${geradoEm} · propriedade GSC: ${site ?? "N/A"}${gscErro ? ` · GSC indisponível: ${gscErro}` : ""}

## Contrato do sitemap

| Métrica | Valor |
| --- | --- |
| URLs no sitemap curado | ${inventory.length} |
| HTTP 200 | ${count((u) => u.http === 200)} |
| Redirect (3xx) | ${count((u) => u.http >= 300 && u.http < 400)} |
| 404/erro | ${count((u) => u.http === 404 || u.http === 0 || u.http >= 500)} |
| noindex | ${count((u) => u.noindex)} |
| Canonical self | ${count((u) => u.canonicalSelf)} |
| Canonical divergente | ${count((u) => !u.canonicalSelf)} |
| H1 único | ${count((u) => u.h1 === 1)} |
| lastmod declarado | ${count((u) => !!u.lastmod)} |

## Estado no Google (URL Inspection)

| Status | URLs |
| --- | --- |
${table(byKey("gscStatus"))}

### Por cluster

| Cluster | Total | Indexadas | Discovered | Unknown | Outros |
| --- | --- | --- | --- | --- | --- |
${statusPorCluster()}

## Prioridade

| Tier | URLs |
| --- | --- |
${table(byKey("tier"))}

## Malha interna (HTML SSR)

| Métrica | Valor |
| --- | --- |
| URLs órfãs (0 inbound) | ${orfas.length} |
| URLs UNKNOWN e órfãs | ${unknownOrfas.length} |
| Profundidade média | ${(inventory.filter((u) => u.depth != null).reduce((s, u) => s + u.depth, 0) / Math.max(1, count((u) => u.depth != null))).toFixed(2)} |
| Inalcançáveis a partir da home | ${count((u) => u.depth == null)} |

${orfas.length ? `Órfãs:\n${orfas.map((u) => `- ${u.path} (tier ${u.tier}, ${u.gscStatus})`).join("\n")}` : "Nenhuma órfã."}

## Performance de servidor (TTFB do HTML SSR)

| Métrica | Valor |
| --- | --- |
| p50 | ${p(0.5)} ms |
| p75 | ${p(0.75)} ms |
| p95 | ${p(0.95)} ms |
| URLs acima de 800 ms | ${lentas.length} |

${lentas.length ? lentas.map((u) => `- ${u.path} — ${u.ttfbMs} ms (${u.gscStatus})`).join("\n") : "Nenhuma URL acima do limite de 800 ms."}

## Inversões de prioridade (Tier A com menos sinais que Tier C)

${(() => {
  const medC = (() => {
    const v = inventory.filter((u) => u.tier === "C").map((u) => u.inbound).sort((a, b) => a - b);
    return v.length ? v[Math.floor(v.length / 2)] : 0;
  })();
  const inv = inventory.filter((u) => u.tier === "A" && u.inbound < medC);
  return inv.length
    ? `Mediana de inbound do Tier C: ${medC}\n\n${inv.map((u) => `- ${u.path} — inbound ${u.inbound} (contextual ${u.inboundContextual})`).join("\n")}`
    : `Nenhuma inversão: todas as URLs Tier A recebem pelo menos a mediana do Tier C (${medC}).`;
})()}
`;

writeFileSync("reports/indexation-master.md", master);

const tierA = inventory.filter((u) => u.tier === "A");
const fila = [...tierA]
  .filter((u) => u.gscStatus !== "INDEXED")
  .sort((a, b) => b.impressions - a.impressions || a.depth - b.depth)
  .slice(0, 15);

writeFileSync(
  "reports/google-indexation.md",
  `# Google — estado de indexação

Gerado em ${geradoEm} · propriedade ${site ?? "N/A"}

| Estado | URLs |
| --- | --- |
${table(byKey("gscStatus"))}

## Fila de inspeção prioritária (máx. 15)

Somente Tier A ainda não indexada, ordenada por impressões reais e proximidade da home.

| # | URL | Status | Impressões | Depth | Inbound |
| --- | --- | --- | --- | --- | --- |
${fila.map((u, i) => `| ${i + 1} | ${u.path} | ${u.gscStatus} | ${u.impressions} | ${u.depth ?? "N/A"} | ${u.inbound} |`).join("\n")}

## URLs com impressões nos últimos 90 dias

| URL | Cliques | Impressões | Posição | Status |
| --- | --- | --- | --- | --- |
${inventory
  .filter((u) => u.impressions > 0)
  .sort((a, b) => b.impressions - a.impressions)
  .map((u) => `| ${u.path} | ${u.clicks} | ${u.impressions} | ${u.position?.toFixed(1) ?? "N/A"} | ${u.gscStatus} |`)
  .join("\n")}
`,
);

writeFileSync(
  "reports/indexation-queue.json",
  JSON.stringify({ geradoEm, googleInspectionPriority: fila.map((u) => u.url) }, null, 2),
);

console.log(
  `inventário: ${inventory.length} URLs · indexadas ${count((u) => u.gscStatus === "INDEXED")} · órfãs ${orfas.length} · TTFB p75 ${p(0.75)}ms`,
);
if (!existsSync("reports/indexation-inventory.json")) process.exitCode = 1;
