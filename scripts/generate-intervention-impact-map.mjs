#!/usr/bin/env node
/**
 * ETAPAS 4, 5, 6, 13, 16 e 17 — MAPA CAUSAL OBSERVÁVEL DA INTERVENÇÃO
 *
 * Registra a cadeia de exposição:
 *   DIRECT_INTERVENTION → links internos novos/alterados → URLs de descoberta
 *   indireta → clusters → estado de indexação conhecido.
 *
 * Não afirma causalidade. Apenas preserva o que é observável hoje para que o
 * D14 possa ser lido sem confundir tempo natural com intervenção.
 *
 *   node scripts/generate-intervention-impact-map.mjs
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";
import { clusterOf, tierOf } from "./lib/indexation-tiers.mjs";

const OUT = path.resolve("reports/intervention-impact-map.json");
const ler = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const ledger = ler("public/intervencoes-d0.json");
const live = ler("reports/live-validation.json");
const marcos = ler("public/operacao-marcos.json");
if (!ledger) { console.error("❌ Ledger ausente — rode npm run intervencao:registrar"); process.exit(1); }
if (!live) { console.error("❌ Sem reports/live-validation.json — rode npm run validar:producao"); process.exit(1); }

const sha = (v) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");
const porPath = new Map(live.paginas.map((p) => [p.path, p]));
const estadoNoMarco = (marco, p) =>
  (marcos?.marcos ?? []).find((m) => m.marco === marco)?.urls?.find((u) => u.path === p)?.estado ?? "SEM_DADO";

const diretas = (ledger.coortes.INTERVENTION_COHORT.urls ?? []).map((u) => u.url);
const indiretas = (ledger.coortes.INDIRECT_DISCOVERY_COHORT.urls ?? []).map((u) => u.url);
const fontes = ledger.eventos.filter((e) => e.urlsIndiretas.length > 0).map((e) => e.urlsDiretas).flat();

/** Grafo interno observado hoje (produção). */
const arestas = new Map(live.paginas.map((p) => [p.path, (p.internalLinks ?? []).filter((t) => CURATED_PATHS.includes(t))]));
const inboundDepois = new Map(CURATED_PATHS.map((p) => [p, 0]));
for (const [, alvos] of arestas) for (const t of alvos) inboundDepois.set(t, (inboundDepois.get(t) ?? 0) + 1);

/** Contrafactual: mesmo grafo sem as arestas criadas pela intervenção. */
const arestasAntes = new Map(
  [...arestas].map(([origem, alvos]) => [
    origem,
    fontes.includes(origem) ? alvos.filter((t) => !indiretas.includes(t)) : alvos,
  ]),
);
const inboundAntes = new Map(CURATED_PATHS.map((p) => [p, 0]));
for (const [, alvos] of arestasAntes) for (const t of alvos) inboundAntes.set(t, (inboundAntes.get(t) ?? 0) + 1);

const profundidade = (grafo) => {
  const dist = new Map([["/", 0]]);
  const fila = ["/"];
  while (fila.length) {
    const atual = fila.shift();
    for (const t of grafo.get(atual) ?? []) if (!dist.has(t)) { dist.set(t, dist.get(atual) + 1); fila.push(t); }
  }
  return dist;
};
const profDepois = profundidade(arestas);
const profAntes = profundidade(arestasAntes);

const ancoraDe = (origem, alvo) => {
  // Âncora não é extraída do HTML aqui; o diretório usa o nome da localidade.
  const slug = alvo.replace(/^\/(bairros\/|tecnico-informatica-)/, "");
  return slug.split("/").pop().replace(/-/g, " ");
};

const DIRETAS = diretas.map((u) => {
  const ev = ledger.eventos.find((e) => e.urlsDiretas.includes(u));
  const pg = porPath.get(u);
  return {
    url: u,
    eventoId: ev?.id ?? null,
    motivoClassificacao: ev?.motivo ?? null,
    timestamp: ev?.timestamp ?? null,
    deployment: ev?.deploymentId ?? live.executadoEm,
    mudanca: ev?.mudanca ?? null,
    arquivos: ev?.arquivos ?? [],
    estadoAtual: {
      http: pg?.status ?? null,
      canonical: pg?.canonical ?? null,
      robots: pg?.robots ?? null,
      titleHash: pg?.titleHash ?? null,
      h1Hash: pg?.h1Hash ?? null,
      mainHash: pg?.mainHash ?? null,
      jsonldHash: pg?.jsonldHash ?? null,
      jsonldTipos: pg?.jsonldTipos ?? [],
      internalLinkSetHash: pg?.internalLinkSetHash ?? null,
      outboundInternos: (pg?.internalLinks ?? []).length,
      lastmod: pg?.sitemap?.lastmod ?? null,
      tier: tierOf(u),
      cluster: clusterOf(u),
    },
    diff: {
      title: ev?.impacto?.metadata ?? "sem alteração declarada",
      h1: "sem alteração declarada",
      canonical: "sem alteração",
      robots: "sem alteração",
      schema: ev?.impacto?.schema ?? "sem alteração",
      conteudo: ev?.impacto?.conteudo ?? null,
      internalLinks: ev?.impacto?.internalLinking ?? null,
      lastmod: ev?.impacto?.lastmod ?? null,
    },
    impactoEsperado: {
      descoberta: ev?.impacto?.internalLinking ?? "nenhum",
      conversao: ev?.impacto?.conversao ?? "nenhum",
    },
    novosAlvos: fontes.includes(u) ? indiretas.length : 0,
  };
});

const INDIRETAS = indiretas.map((alvo) => {
  const origem = fontes.find((f) => (arestas.get(f) ?? []).includes(alvo)) ?? fontes[0] ?? null;
  return {
    SOURCE_OF_INTERVENTION: origem,
    TARGET_URL: alvo,
    NEW_INBOUND: (inboundDepois.get(alvo) ?? 0) - (inboundAntes.get(alvo) ?? 0),
    ANCHOR: ancoraDe(origem, alvo),
    SSR_LINK: (porPath.get(origem)?.internalLinks ?? []).includes(alvo),
    DEPTH_BEFORE: profAntes.get(alvo) ?? null,
    DEPTH_AFTER: profDepois.get(alvo) ?? null,
    CLUSTER: clusterOf(alvo),
    TIER: tierOf(alvo),
    D0_STATE: estadoNoMarco("D0", alvo),
    D7_STATE: estadoNoMarco("D7", alvo),
  };
});

const contarPor = (lista, chave) =>
  lista.reduce((acc, x) => { acc[x[chave]] = (acc[x[chave]] ?? 0) + 1; return acc; }, {});

const tierPorCoorte = (urls) => contarPor(urls.map((u) => ({ TIER: tierOf(u) })), "TIER");
const clean = (ledger.coortes.CLEAN_COHORT.urls ?? []);

const alvosInvalidos = INDIRETAS.filter((i) => !CURATED_PATHS.includes(i.TARGET_URL) || porPath.get(i.TARGET_URL)?.status !== 200);

const mapa = {
  schema: "intervention-impact-map/1.0",
  geradoEm: new Date().toISOString(),
  aviso: "Cadeia de exposição observável. Nenhuma afirmação causal. No D14 use ASSOCIATED_CHANGE / OBSERVED_DIFFERENCE.",
  ledgerSelo: ledger.selo,
  fonteLive: { base: live.base, executadoEm: live.executadoEm, problemas: live.problemas.length },
  coortes: {
    CLEAN_COHORT: clean.length,
    DIRECT_INTERVENTION: diretas.length,
    INDIRECT_DISCOVERY_INTERVENTION: indiretas.length,
    TOTAL: clean.length + diretas.length + indiretas.length,
  },
  DIRECT_INTERVENTION: DIRETAS,
  INDIRECT_DISCOVERY: INDIRETAS,
  grafo: {
    novosInboundTotais: INDIRETAS.reduce((a, i) => a + i.NEW_INBOUND, 0),
    urlsComProfundidadeReduzida: INDIRETAS.filter((i) => i.DEPTH_AFTER !== null && i.DEPTH_BEFORE !== null && i.DEPTH_AFTER < i.DEPTH_BEFORE).length,
    alvosInvalidos: alvosInvalidos.map((i) => i.TARGET_URL),
    alvosConsolidados: 0,
    alvos404: alvosInvalidos.length,
    alvosNoindex: live.paginas.filter((p) => /noindex/i.test(p.robots ?? "")).map((p) => p.path),
  },
  clusters: {
    INDIRECT: contarPor(INDIRETAS, "CLUSTER"),
    PROBLEMA_indiretas: INDIRETAS.filter((i) => i.CLUSTER === "PROBLEMA").length,
    BAIRRO_indiretas: INDIRETAS.filter((i) => i.CLUSTER === "BAIRRO").length,
    CIDADE_indiretas: INDIRETAS.filter((i) => i.CLUSTER === "CIDADE").length,
  },
  tierA: {
    TIER_A_CLEAN: tierPorCoorte(clean.map((u) => (typeof u === "string" ? u : u.url))).A ?? 0,
    TIER_A_DIRECT: tierPorCoorte(diretas).A ?? 0,
    TIER_A_INDIRECT: tierPorCoorte(indiretas).A ?? 0,
  },
  metricaD14: {
    INDIRECT_DISCOVERY_TRANSITION_RATE: "calcular no D14: UNKNOWN→DISCOVERED, UNKNOWN→INDEXED, DISCOVERED→INDEXED, NO_CHANGE",
    comparacao: "descritiva contra CLEAN_COHORT — nunca chamar de efeito ou lift",
  },
};
mapa.selo = sha({ ...mapa, selo: undefined, geradoEm: undefined });

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(mapa, null, 2)}\n`);

console.log("Mapa causal observável gerado → reports/intervention-impact-map.json");
console.log(`  diretas:              ${DIRETAS.length}`);
console.log(`  indiretas:            ${INDIRETAS.length}`);
console.log(`  novos inbound:        ${mapa.grafo.novosInboundTotais}`);
console.log(`  profundidade menor:   ${mapa.grafo.urlsComProfundidadeReduzida}`);
console.log(`  alvos inválidos:      ${mapa.grafo.alvosInvalidos.length}`);
console.log(`  Tier A (C/D/I):       ${mapa.tierA.TIER_A_CLEAN}/${mapa.tierA.TIER_A_DIRECT}/${mapa.tierA.TIER_A_INDIRECT}`);
if (mapa.grafo.alvosInvalidos.length) process.exit(1);
