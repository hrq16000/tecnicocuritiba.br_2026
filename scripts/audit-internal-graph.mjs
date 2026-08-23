#!/usr/bin/env node
/**
 * ============================================================================
 * GRAFO REAL DA MALHA INTERNA (a partir do HTML SSR de dist/client)
 * ============================================================================
 * Diferente de scripts/check-internal-links.mjs (análise estática do código),
 * este auditor lê o HTML efetivamente servido de cada URL do sitemap curado e
 * monta o grafo verdadeiro de links internos:
 *
 *   • inbound / outbound por URL (contextual = fora de <header>/<footer>/<nav global>)
 *   • profundidade a partir da home (BFS)
 *   • tipo de página, title, H1, contagem de palavras
 *   • órfãs (0 inbound), sub-linkadas (1–2 inbound contextuais)
 *
 * Saídas: reports/internal-graph.json · reports/internal-graph.md
 * Uso:    node scripts/audit-internal-graph.mjs [dist]
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const GATE = process.argv.includes("--gate");
const DIST = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) || "dist");
const CLIENT = existsSync(path.join(DIST, "client")) ? path.join(DIST, "client") : DIST;
const CANONICAL = "https://tecnico.curitiba.br";

// ── URLs do sitemap curado ───────────────────────────────────────────────────
const sitemapDir = existsSync(path.join(CLIENT, "sitemap-index.xml")) ? CLIENT : "public";
const urls = new Set();
for (const f of readdirSync(sitemapDir).filter((f) => /^sitemap.*\.xml$/.test(f))) {
  if (f === "sitemap-index.xml" || f === "sitemap-images.xml") continue;
  const xml = readFileSync(path.join(sitemapDir, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].trim().replace(CANONICAL, "") || "/";
    if (p.endsWith(".xml")) continue; // índice de sitemaps, não é página
    urls.add(p.replace(/\/$/, "") || "/");
  }
}
const all = [...urls].sort();
const known = new Set(all);

// ── Tipo de página ───────────────────────────────────────────────────────────
export function tipoDe(p) {
  if (p === "/") return "HOME";
  if (/^\/problemas\/[^/]+$/.test(p)) return "PROBLEMA";
  if (p === "/problemas") return "HUB_PROBLEMAS";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(p)) return "SERVICO_X_BAIRRO";
  if (/^\/servicos\/[^/]+$/.test(p)) return "SERVICO";
  if (p === "/servicos") return "HUB_SERVICOS";
  if (/^\/bairros?\//.test(p)) return "BAIRRO";
  if (/^\/tecnico-informatica-/.test(p)) return "CIDADE";
  if (p === "/blog") return "HUB_BLOG";
  if (/^\/blog\//.test(p)) return "ARTIGO";
  if (/^\/(marcas|procedimentos)\//.test(p)) return "SUPORTE_EDITORIAL";
  if (/^\/(empresas|suporte-empresas|empresa-de-ti-curitiba|precos|anuncie|parceiros)/.test(p)) return "COMERCIAL";
  return "INSTITUCIONAL";
}

const clean = (s) =>
  (s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

function html(p) {
  const rel = p === "/" ? "index.html" : `${p.replace(/^\//, "")}/index.html`;
  const f = path.join(CLIENT, rel);
  if (existsSync(f)) return readFileSync(f, "utf8");
  const flat = path.join(CLIENT, `${p.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

/** Remove header/footer para isolar links contextuais do corpo. */
function corpo(doc) {
  let body = doc;
  const main = doc.match(/<main[\s\S]*?<\/main>/i);
  if (main) body = main[0];
  return body.replace(/<header[\s\S]*?<\/header>/gi, "").replace(/<footer[\s\S]*?<\/footer>/gi, "");
}

const pages = new Map();
for (const p of all) {
  const doc = html(p);
  if (!doc) {
    pages.set(p, { path: p, tipo: tipoDe(p), missing: true, inbound: [], inboundCtx: [], out: [], words: 0 });
    continue;
  }
  const title = clean(doc.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const h1 = clean(doc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const desc = doc.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
  const body = corpo(doc);
  const outAll = new Set();
  const outCtx = new Set();
  const grab = (src, sink) => {
    for (const m of src.matchAll(/<a[^>]+href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = (m[1].replace(/\/$/, "") || "/");
      if (!known.has(href) || href === p) continue;
      sink.add(`${href}\u0000${clean(m[2]).slice(0, 80)}`);
    }
  };
  grab(doc, outAll);
  grab(body, outCtx);
  pages.set(p, {
    path: p,
    tipo: tipoDe(p),
    title,
    h1,
    descLen: desc.length,
    words: clean(body).split(/\s+/).filter(Boolean).length,
    out: [...outAll].map((s) => s.split("\u0000")),
    outCtx: [...outCtx].map((s) => s.split("\u0000")),
    inbound: [],
    inboundCtx: [],
  });
}

for (const [from, pg] of pages) {
  for (const [href, anchor] of pg.out ?? []) pages.get(href)?.inbound.push({ from, anchor });
  for (const [href, anchor] of pg.outCtx ?? []) pages.get(href)?.inboundCtx.push({ from, anchor });
}

// ── Profundidade (BFS pela home, usando todos os links) ──────────────────────
const depth = new Map([["/", 0]]);
let fringe = ["/"];
while (fringe.length) {
  const next = [];
  for (const p of fringe) {
    for (const [href] of pages.get(p)?.out ?? []) {
      if (!depth.has(href)) {
        depth.set(href, depth.get(p) + 1);
        next.push(href);
      }
    }
  }
  fringe = next;
}
for (const [p, pg] of pages) pg.depth = depth.get(p) ?? null;

const orfas = all.filter((p) => p !== "/" && pages.get(p).inbound.length === 0);
const orfasCtx = all.filter((p) => p !== "/" && pages.get(p).inboundCtx.length === 0);
const sub = all.filter((p) => {
  const n = pages.get(p).inboundCtx.length;
  return p !== "/" && n >= 1 && n <= 2;
});
const semAlcance = all.filter((p) => pages.get(p).depth === null);

const porTipo = {};
for (const p of all) {
  const t = pages.get(p).tipo;
  porTipo[t] ??= { total: 0, orfas: 0, orfasCtx: 0, sub: 0 };
  porTipo[t].total++;
  if (pages.get(p).inbound.length === 0 && p !== "/") porTipo[t].orfas++;
  if (pages.get(p).inboundCtx.length === 0 && p !== "/") porTipo[t].orfasCtx++;
  if (sub.includes(p)) porTipo[t].sub++;
}

mkdirSync("reports", { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  total: all.length,
  orfas,
  orfasContextuais: orfasCtx,
  subLinkadas: sub,
  semAlcanceDaHome: semAlcance,
  porTipo,
  pages: all.map((p) => {
    const g = pages.get(p);
    return {
      path: p,
      tipo: g.tipo,
      title: g.title,
      h1: g.h1,
      descLen: g.descLen,
      words: g.words,
      depth: g.depth,
      inbound: g.inbound.length,
      inboundCtx: g.inboundCtx.length,
      outbound: g.out?.length ?? 0,
      inboundFrom: g.inboundCtx.map((i) => `${i.from} :: ${i.anchor}`).slice(0, 8),
    };
  }),
};
writeFileSync("reports/internal-graph.json", `${JSON.stringify(report, null, 2)}\n`);

const md = [
  "# Grafo da malha interna (HTML SSR)",
  "",
  `Gerado em ${report.generatedAt} · ${all.length} URLs indexáveis`,
  "",
  `- Órfãs (0 inbound, incluindo header/footer): **${orfas.length}**`,
  `- Órfãs contextuais (0 inbound fora de header/footer): **${orfasCtx.length}**`,
  `- Sub-linkadas (1–2 inbound contextuais): **${sub.length}**`,
  `- Inalcançáveis pela home: **${semAlcance.length}**`,
  "",
  "## Por tipo",
  "",
  "| Tipo | Total | Órfãs | Órfãs contextuais | Sub-linkadas |",
  "| --- | ---: | ---: | ---: | ---: |",
  ...Object.entries(porTipo).map(([t, v]) => `| ${t} | ${v.total} | ${v.orfas} | ${v.orfasCtx} | ${v.sub} |`),
  "",
  "## Detalhe por URL",
  "",
  "| URL | Tipo | Prof. | In | In ctx | Out | Palavras | Desc |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...report.pages.map(
    (p) =>
      `| ${p.path} | ${p.tipo} | ${p.depth ?? "—"} | ${p.inbound} | ${p.inboundCtx} | ${p.outbound} | ${p.words} | ${p.descLen} |`,
  ),
].join("\n");
writeFileSync("reports/internal-graph.md", `${md}\n`);

if (GATE) {
  const bloqueios = [];
  if (orfas.length) bloqueios.push(`${orfas.length} URL(s) sem nenhum link interno: ${orfas.join(", ")}`);
  if (semAlcance.length)
    bloqueios.push(`${semAlcance.length} URL(s) inalcançável(is) a partir da home: ${semAlcance.join(", ")}`);
  if (bloqueios.length) {
    console.error(`[internal-graph] BLOQUEADO:\n  · ${bloqueios.join("\n  · ")}`);
    process.exit(1);
  }
}

console.log(
  `[internal-graph] ${all.length} URLs · órfãs=${orfas.length} · órfãs contextuais=${orfasCtx.length} · sub-linkadas=${sub.length} · inalcançáveis=${semAlcance.length}`,
);
