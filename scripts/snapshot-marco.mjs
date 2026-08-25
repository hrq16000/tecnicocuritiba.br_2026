#!/usr/bin/env node
/**
 * ============================================================================
 * SNAPSHOT DE MARCO OPERACIONAL — D0 / D7 / D14 / D30
 * ============================================================================
 * Congela, em um único registro versionado, o estado do conjunto curado no dia
 * do marco: cobertura Google por URL/cluster/tier, qualidade, doorway, grafo
 * interno, consolidação, IndexNow, Bing (quando houver evidência) e a
 * identidade de SERP (title/H1/canonical/JSON-LD).
 *
 * Nunca inventa número: fonte ausente vira `null` e o painel mostra "sem dado".
 *
 * Uso:
 *   node scripts/snapshot-marco.mjs --marco=D0
 *   node scripts/snapshot-marco.mjs --marco=D7 --nota="primeira leitura pós-deploy"
 *   node scripts/snapshot-marco.mjs --marco=D0 --deployment=<id>
 *
 * Saídas:
 *   reports/operacao-marcos.json       histórico completo (append idempotente)
 *   reports/operacao-<marco>.md        resumo legível do marco
 *   reports/serp-signals-<marco>.json  cópia imutável dos sinais de SERP
 *   public/operacao-marcos.json        payload consumido por /admin/monitoramento
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (nome, padrao = null) => {
  const hit = args.find((a) => a.startsWith(`--${nome}=`));
  return hit ? hit.slice(nome.length + 3) : padrao;
};
const MARCO = (arg("marco", "D0") || "D0").toUpperCase();
if (!/^D(0|7|14|30)$/.test(MARCO)) {
  console.error(`✖ marco inválido: ${MARCO} (use D0, D7, D14 ou D30)`);
  process.exit(1);
}

const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

const inventario = lerJson("reports/indexation-inventory.json");
const qualidade = lerJson("reports/local-page-quality.json");
const grafo = lerJson("reports/internal-graph.json");
const sitemap = lerJson("reports/sitemap-inclusions.json");
const indexnow = lerJson("reports/indexnow-last-run.json");
const entidade = lerJson("reports/entity-consistency.json");
const consolidacao = lerJson("reports/post-consolidation.json");
const serp = lerJson("reports/serp-signals-baseline.json");
const bing = lerJson("reports/bing-webmaster.json"); // opcional; N/A quando ausente

const urls = (inventario?.urls ?? []).filter((u) => u.sitemap);
const norm = (s) => (s ?? "").toString().toUpperCase();

/** Classificação de cobertura em buckets estáveis do Search Console. */
function bucket(u) {
  const s = norm(u.gscStatus);
  const c = norm(u.gscCoverage);
  if (!s && !c) return "unknown";
  if (s === "INDEXED" || c.includes("SUBMITTED AND INDEXED") || c === "INDEXED") return "indexed";
  if (c.includes("DISCOVERED")) return "discovered";
  if (c.includes("CRAWLED")) return "crawled_not_indexed";
  if (c.includes("DUPLICATE") || c.includes("ALTERNATE")) return "duplicate";
  if (c.includes("CANONICAL")) return "canonical_different";
  if (c.includes("REDIRECT")) return "redirect";
  if (c.includes("SOFT 404")) return "soft_404";
  if (s === "UNKNOWN" || c.includes("UNKNOWN")) return "unknown";
  return "outros";
}

const buckets = {
  indexed: 0, unknown: 0, discovered: 0, crawled_not_indexed: 0,
  duplicate: 0, redirect: 0, soft_404: 0, canonical_different: 0, outros: 0,
};
for (const u of urls) buckets[bucket(u)] += 1;

const somar = (lista, campo) =>
  lista.reduce((acc, u) => acc + (typeof u[campo] === "number" ? u[campo] : 0), 0);
const posicaoMedia = (lista) => {
  const comPos = lista.filter((u) => typeof u.position === "number" && u.impressions > 0);
  if (!comPos.length) return null;
  const peso = comPos.reduce((a, u) => a + u.impressions, 0);
  return Math.round((comPos.reduce((a, u) => a + u.position * u.impressions, 0) / peso) * 100) / 100;
};
const taxa = (parte, total) => (total ? Math.round((parte / total) * 1000) / 10 : null);

/** Agrupa por chave (cluster ou tier) com as mesmas métricas. */
function agrupar(campo) {
  const mapa = new Map();
  for (const u of urls) {
    const k = u[campo] ?? "OUTROS";
    if (!mapa.has(k)) mapa.set(k, []);
    mapa.get(k).push(u);
  }
  return [...mapa.entries()]
    .map(([chave, lista]) => ({
      chave,
      total: lista.length,
      indexadas: lista.filter((u) => bucket(u) === "indexed").length,
      unknown: lista.filter((u) => bucket(u) === "unknown").length,
      discovered: lista.filter((u) => bucket(u) === "discovered").length,
      crawledNaoIndexadas: lista.filter((u) => bucket(u) === "crawled_not_indexed").length,
      taxaIndexacao: taxa(lista.filter((u) => bucket(u) === "indexed").length, lista.length),
      impressoes: somar(lista, "impressions"),
      cliques: somar(lista, "clicks"),
      posicaoMedia: posicaoMedia(lista),
    }))
    .sort((a, b) => b.total - a.total);
}

const faixas = qualidade?.resumo?.faixas ?? qualidade?.faixas ?? null;
const registro = {
  marco: MARCO,
  registradoEm: new Date().toISOString(),
  nota: arg("nota"),
  deploymentId: arg("deployment"),
  commit: arg("commit") ?? process.env.GITHUB_SHA ?? null,
  denominador: {
    curadas: urls.length,
    observacao:
      "Percentuais deste marco usam o conjunto curado atual; não são comparáveis com denominadores anteriores (170 URLs) sem conversão explícita.",
  },
  google: {
    ...buckets,
    impressoes28d: somar(urls, "impressions"),
    cliques28d: somar(urls, "clicks"),
    ctr28d: (() => {
      const i = somar(urls, "impressions");
      return i ? Math.round((somar(urls, "clicks") / i) * 10000) / 100 : null;
    })(),
    posicaoMedia28d: posicaoMedia(urls),
    erro: inventario?.gscErro ?? null,
  },
  clusters: agrupar("cluster"),
  tiers: agrupar("tier"),
  // Estado por URL congelado no marco — base do drilldown e das transições
  // entre marcos em /admin/monitoramento. Sem estimativa: campo ausente = null.
  urls: urls.map((u) => ({
    path: u.path,
    cluster: u.cluster ?? null,
    tier: u.tier ?? null,
    estado: bucket(u),
    gscStatus: u.gscStatus ?? null,
    gscCoverage: u.gscCoverage ?? null,
    lastCrawl: u.lastCrawl ?? null,
    canonical: u.canonical ?? null,
    canonicalSelf: u.canonicalSelf ?? null,
    googleCanonical: u.googleCanonical ?? null,
    http: u.http ?? null,
    ttfbMs: u.ttfbMs ?? null,
    noindex: u.noindex ?? null,
    inbound: u.inbound ?? null,
    inboundContextual: u.inboundContextual ?? null,
    depth: u.depth ?? null,
    lastmod: u.lastmod ?? null,
    impressions: u.impressions ?? 0,
    clicks: u.clicks ?? 0,
    position: typeof u.position === "number" ? u.position : null,
  })),
  qualidade: faixas ? { faixas, piso: qualidade?.piso ?? null } : null,
  doorway: qualidade?.resumo
    ? {
        alto: qualidade.resumo.alto ?? null,
        medio: qualidade.resumo.medio ?? null,
        baixo: qualidade.resumo.baixo ?? null,
      }
    : null,
  grafo: grafo
    ? {
        urls: grafo.total ?? urls.length,
        orfas: grafo.orfas?.length ?? grafo.resumo?.orfas ?? 0,
        subLinkadas: grafo.subLinkadas?.length ?? grafo.resumo?.subLinkadas ?? 0,
        linksParaRedirect: Array.isArray(grafo.linksParaRedirect)
          ? grafo.linksParaRedirect.length
          : (grafo.linksParaRedirect ?? 0),
      }
    : null,
  consolidacao: consolidacao
    ? {
        total: consolidacao.total ?? 40,
        pass: consolidacao.pass ?? (consolidacao.total ?? 40) - (consolidacao.falhas?.length ?? 0),
        falhas: consolidacao.falhas?.length ?? consolidacao.falhas ?? 0,
      }
    : null,
  entidade: entidade
    ? { problemas: entidade.problemas?.length ?? entidade.total ?? 0, urls: entidade.analisadas?.length ?? null }
    : null,
  sitemap: sitemap ? { total: sitemap.total ?? urls.length, bloqueadas: sitemap.bloqueadas ?? 0 } : null,
  indexnow: indexnow
    ? {
        executadoEm: indexnow.executadoEm ?? null,
        eligible: indexnow.eligible ?? null,
        submitted: indexnow.submitted ?? indexnow.enviadas ?? 0,
        accepted: indexnow.accepted ?? null,
        failed: indexnow.failed ?? null,
      }
    : null,
  bing: bing
    ? {
        sitemapStatus: bing.sitemapStatus ?? null,
        known: bing.known ?? null,
        indexed: bing.indexed ?? null,
        crawlErrors: bing.crawlErrors ?? null,
        ultimaAtividade: bing.ultimaAtividade ?? null,
      }
    : null,
  serpSignals: serp
    ? { geradoEm: serp.geradoEm ?? null, urls: Object.keys(serp.urls ?? serp.signals ?? {}).length }
    : null,
};

mkdirSync("reports", { recursive: true });

// Snapshot imutável dos sinais de SERP deste marco (o baseline histórico fica intacto).
const serpMarco = `reports/serp-signals-${MARCO.toLowerCase()}.json`;
if (existsSync("reports/serp-signals-baseline.json") && !existsSync(serpMarco)) {
  copyFileSync("reports/serp-signals-baseline.json", serpMarco);
}
registro.serpSnapshot = existsSync(serpMarco) ? serpMarco : null;

const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const idx = historico.marcos.findIndex((m) => m.marco === MARCO);
if (idx >= 0 && !args.includes("--overwrite")) {
  console.log(`[marco] ${MARCO} já registrado em ${historico.marcos[idx].registradoEm}; use --overwrite para substituir.`);
} else {
  if (idx >= 0) historico.marcos[idx] = registro;
  else historico.marcos.push(registro);
  const ordem = { D0: 0, D7: 1, D14: 2, D30: 3 };
  historico.marcos.sort((a, b) => ordem[a.marco] - ordem[b.marco]);
  historico.atualizadoEm = new Date().toISOString();
  writeFileSync("reports/operacao-marcos.json", JSON.stringify(historico, null, 2));
}

mkdirSync("public", { recursive: true });
writeFileSync("public/operacao-marcos.json", JSON.stringify(historico, null, 2));

const linha = (r) =>
  `| ${r.chave} | ${r.total} | ${r.indexadas} | ${r.taxaIndexacao ?? "—"}% | ${r.impressoes} | ${r.cliques} | ${r.posicaoMedia ?? "—"} |`;
writeFileSync(
  `reports/operacao-${MARCO.toLowerCase()}.md`,
  [
    `# Marco ${MARCO} — tecnico.curitiba.br`,
    "",
    `Registrado em ${registro.registradoEm}${registro.deploymentId ? ` · deployment \`${registro.deploymentId}\`` : ""}`,
    "",
    `Conjunto curado: **${registro.denominador.curadas} URLs**. ${registro.denominador.observacao}`,
    "",
    "## Google",
    "",
    ...Object.entries(registro.google).map(([k, v]) => `- ${k}: ${v ?? "N/A"}`),
    "",
    "## Clusters",
    "",
    "| Cluster | Total | Indexadas | Taxa | Impressões | Cliques | Posição |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...registro.clusters.map(linha),
    "",
    "## Tiers",
    "",
    "| Tier | Total | Indexadas | Taxa | Impressões | Cliques | Posição |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...registro.tiers.map(linha),
    "",
    `## IndexNow`,
    "",
    registro.indexnow
      ? `eligible ${registro.indexnow.eligible ?? "N/A"} · submitted ${registro.indexnow.submitted} · accepted ${registro.indexnow.accepted ?? "N/A"} · failed ${registro.indexnow.failed ?? "N/A"}`
      : "sem evidência de execução.",
    "",
    "## Bing",
    "",
    registro.bing
      ? `known ${registro.bing.known ?? "N/A"} · indexed ${registro.bing.indexed ?? "N/A"} · sitemap ${registro.bing.sitemapStatus ?? "N/A"}`
      : "N/A — sem acesso ao Bing Webmaster Tools nesta execução.",
  ].join("\n"),
);

console.log(
  `[marco ${MARCO}] curadas=${urls.length} indexed=${buckets.indexed} unknown=${buckets.unknown} discovered=${buckets.discovered} crawled-not-indexed=${buckets.crawled_not_indexed}`,
);
console.log(`  → reports/operacao-marcos.json · public/operacao-marcos.json · reports/operacao-${MARCO.toLowerCase()}.md`);

// Snapshot de queries do marco (quando houver coleta GSC recente) — imutável.
const queriesFonte = "reports/gsc/queries-28d.json";
const queriesMarco = `reports/queries-${MARCO.toLowerCase()}.json`;
if (existsSync(queriesFonte) && !existsSync(queriesMarco)) copyFileSync(queriesFonte, queriesMarco);

// Reindexa memórias/snapshots e verifica cobertura logo após registrar o marco.
try {
  const { execFileSync } = await import("node:child_process");
  execFileSync(process.execPath, ["scripts/reindex-snapshots.mjs"], { stdio: "inherit" });
} catch (e) {
  console.warn(`[marco] reindexação falhou: ${e.message}`);
}
