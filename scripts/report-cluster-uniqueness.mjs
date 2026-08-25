#!/usr/bin/env node
/**
 * ============================================================================
 * RELATÓRIO DE UNICIDADE POR CLUSTER (Fase Final)
 * ============================================================================
 * Mede, por cluster do sitemap curado:
 *   similaridade média · máxima · mediana · exclusividade média
 * e — o que realmente orienta a correção — lista os TRECHOS REPETIDOS entre
 * páginas do mesmo cluster (parágrafos/itens compartilhados por 3+ URLs),
 * indicando exatamente o que precisa ser reescrito para gerar valor incremental.
 *
 * Este relatório é alarme editorial, não algoritmo de ranking: a saída correta
 * é reescrever com informação real ou consolidar — nunca parafrasear para
 * "passar no teste".
 *
 * Fonte: HTML servido (produção) ou `dist/` quando um diretório é passado.
 * Uso: node scripts/report-cluster-uniqueness.mjs [dist] [--limit N]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { clusterOf } from "./lib/indexation-tiers.mjs";
import { extractSignals, jaccard, shingles } from "./lib/page-quality.mjs";

const BASE = "https://tecnico.curitiba.br";
const args = process.argv.slice(2);
const distDir = args.find((a) => !a.startsWith("--"));
const limit = Number(args[args.indexOf("--limit") + 1]) || Infinity;

// ── URLs curadas (sitemaps emitidos) ───────────────────────────────────────
const publicDir = resolve("public");
const paths = new Set();
for (const f of readdirSync(publicDir).filter(
  (x) =>
    x.startsWith("sitemap-") &&
    x.endsWith(".xml") &&
    !["sitemap-index.xml", "sitemap-images.xml"].includes(x),
)) {
  const xml = readFileSync(resolve(publicDir, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g))
    paths.add(m[1].trim().replace(BASE, "") || "/");
}
const lista = [...paths].sort().slice(0, limit);

function distHtml(path) {
  const base = distDir?.endsWith("client") ? distDir : join(distDir ?? "", "client");
  const candidatos = [
    join(base, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
    join(base, path === "/" ? "index.html" : `${path.slice(1)}.html`),
    join(distDir ?? "", path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
  ];
  const f = candidatos.find((c) => existsSync(c));
  return f ? readFileSync(f, "utf8") : "";
}

const pages = new Map();
if (distDir) {
  for (const p of lista) {
    const html = distHtml(p);
    if (html) pages.set(p, extractSignals(html));
  }
} else {
  const queue = [...lista];
  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      try {
        const res = await fetch(`${BASE}${p}`, { headers: { "user-agent": "tecnico-uniqueness" } });
        if (res.status === 200) pages.set(p, extractSignals(await res.text()));
      } catch {
        /* URL inacessível: fica fora do cálculo, nunca estimada */
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
}

// ── Agrupamento por cluster ────────────────────────────────────────────────
const clusters = new Map();
for (const [p, s] of pages) {
  const c = clusterOf(p);
  if (!clusters.has(c)) clusters.set(c, []);
  clusters.get(c).push({ path: p, signals: s, sh: shingles(s.text) });
}

const norm = (t) =>
  t.toLowerCase().replace(/\s+/g, " ").replace(/[“”"']/g, "").trim();

const mediana = (xs) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const clustersOut = [];
for (const [cluster, itens] of [...clusters].sort()) {
  if (itens.length < 2) {
    clustersOut.push({ cluster, urls: itens.length, observacao: "cluster com 1 URL — sem par comparável" });
    continue;
  }

  const sims = [];
  const porPagina = [];
  for (const a of itens) {
    let max = 0;
    let par = null;
    const uniao = new Set();
    for (const b of itens) {
      if (a === b) continue;
      const j = jaccard(a.sh, b.sh);
      sims.push(j);
      if (j > max) {
        max = j;
        par = b.path;
      }
      for (const g of b.sh) uniao.add(g);
    }
    const exclusivos = [...a.sh].filter((g) => !uniao.has(g)).length;
    const exclusividade = a.sh.size ? exclusivos / a.sh.size : 0;
    max = Number(max.toFixed(3));
    porPagina.push({
      path: a.path,
      similaridadeMax: max,
      parMaisParecido: par,
      exclusividade: Number(exclusividade.toFixed(3)),
    });
  }

  // Trechos compartilhados: parágrafos/itens presentes em 3+ URLs do cluster.
  const ocorrencias = new Map();
  for (const a of itens) {
    const blocos = [...(a.signals.paragraphs ?? []), ...(a.signals.listItems ?? [])]
      .filter((t) => t.split(/\s+/).length >= 12);
    for (const b of new Set(blocos.map(norm))) {
      if (!ocorrencias.has(b)) ocorrencias.set(b, new Set());
      ocorrencias.get(b).add(a.path);
    }
  }
  const repetidos = [...ocorrencias]
    .filter(([, urls]) => urls.size >= 3)
    .map(([trecho, urls]) => ({
      urls: urls.size,
      palavras: trecho.split(/\s+/).length,
      trecho: trecho.slice(0, 240),
      exemplos: [...urls].slice(0, 4),
      sugestao: sugerirReescrita(trecho, cluster),
    }))
    .sort((a, b) => b.urls * b.palavras - a.urls * a.palavras)
    .slice(0, 25);

  const palavrasRepetidas = repetidos.reduce((acc, r) => acc + r.palavras, 0);

  clustersOut.push({
    cluster,
    urls: itens.length,
    similaridadeMedia: Number((sims.reduce((a, b) => a + b, 0) / sims.length).toFixed(3)),
    similaridadeMaxima: Number(Math.max(...porPagina.map((p) => p.similaridadeMax)).toFixed(3)),
    similaridadeMediana: Number(mediana(sims).toFixed(3)),
    exclusividadeMedia: Number(
      (porPagina.reduce((a, b) => a + b.exclusividade, 0) / porPagina.length).toFixed(3),
    ),
    blocosCompartilhados: repetidos.length,
    palavrasCompartilhadas: palavrasRepetidas,
    paginas: porPagina.sort((a, b) => b.similaridadeMax - a.similaridadeMax),
    trechosRepetidos: repetidos,
  });
}

/** Sugestão concreta de reescrita conforme o tipo de bloco repetido. */
function sugerirReescrita(trecho, cluster) {
  const t = trecho.toLowerCase();
  if (/whatsapp|triagem|orçamento|autoriza/.test(t))
    return "Bloco de processo comercial: manter em UM lugar canônico (política/serviço) e substituir por link contextual, não por cópia em cada página.";
  if (/garantia|r\$|valor|preço/.test(t))
    return "Bloco de preço/garantia: centralizar em /precos-e-politicas e referenciar; nesta página deixar apenas o recorte específico do serviço.";
  if (/bairro|curitiba|atendemos|região/.test(t) && cluster.includes("BAIRRO"))
    return "Bloco geográfico genérico: trocar por informação local verdadeira e verificável (tipo de imóvel, logística de coleta, padrão de rede/energia observado) ou consolidar a URL.";
  if (/sintoma|diagnóstico|teste|verifica/.test(t))
    return "Bloco de diagnóstico repetido: transformar em conteúdo específico do serviço/sintoma desta URL, com o que muda de fato neste caso.";
  return "Trecho compartilhado por 3+ URLs: reescrever com informação própria desta página ou remover e linkar a página que já é dona do assunto.";
}

const out = {
  geradoEm: new Date().toISOString(),
  fonte: distDir ? `dist (${distDir})` : "produção",
  urlsAnalisadas: pages.size,
  clusters: clustersOut,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/cluster-uniqueness.json", `${JSON.stringify(out, null, 2)}\n`);

const md = [
  "# Unicidade por cluster — Fase Final",
  "",
  `Gerado em ${out.geradoEm} · fonte: ${out.fonte} · ${out.urlsAnalisadas} URLs curadas.`,
  "",
  "| Cluster | URLs | Sim. média | Sim. mediana | Sim. máxima | Exclusividade média | Blocos repetidos |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...clustersOut
    .filter((c) => c.similaridadeMedia !== undefined)
    .map(
      (c) =>
        `| ${c.cluster} | ${c.urls} | ${c.similaridadeMedia} | ${c.similaridadeMediana} | ${c.similaridadeMaxima} | ${(c.exclusividadeMedia * 100).toFixed(0)}% | ${c.blocosCompartilhados} |`,
    ),
  "",
  "## O que reescrever, por cluster",
  "",
  ...clustersOut
    .filter((c) => (c.trechosRepetidos ?? []).length)
    .flatMap((c) => [
      `### ${c.cluster}`,
      "",
      ...c.trechosRepetidos.map(
        (r) =>
          `- **${r.urls} URLs · ${r.palavras} palavras** — “${r.trecho}${r.trecho.length >= 240 ? "…" : ""}”\n  - Onde: ${r.exemplos.join(", ")}\n  - Ação: ${r.sugestao}`,
      ),
      "",
    ]),
].join("\n");

writeFileSync("reports/cluster-uniqueness.md", md);
console.log(
  `[unicidade] ${out.urlsAnalisadas} URLs · ${clustersOut.length} clusters → reports/cluster-uniqueness.json | .md`,
);
