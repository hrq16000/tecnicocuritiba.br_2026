#!/usr/bin/env node
/**
 * ============================================================================
 * FASE FINAL — AUDITORIA INDIVIDUAL DAS URLs SERVICO_BAIRRO
 * ============================================================================
 * Classifica cada URL do cluster SERVICO_BAIRRO em uma decisão explícita:
 *   KEEP · IMPROVE · CONSOLIDATE · NOINDEX_TEMPORARY · REVIEW
 *
 * A decisão NÃO é baseada em contagem de palavras. Combina:
 *   intenção própria · exclusividade real · similaridade intra-cluster ·
 *   demanda observada (GSC) · indexação atual · malha interna · quality score.
 *
 * Fontes de evidência (somente dados medidos, nada inventado):
 *   reports/quality-audit.json        → score, faixa, similaridade, exclusivo
 *   reports/local-page-quality.json   → nível de risco doorway + sinais
 *   reports/indexation-inventory.json → GSC, inbound, depth, tier
 *
 * Saídas: reports/servico-bairro-decisions.json e .md
 * Uso: node scripts/audit-servico-bairro.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

const quality = read("reports/quality-audit.json");
const doorway = read("reports/local-page-quality.json");
const inventory = read("reports/indexation-inventory.json");

const doorwayByPath = new Map(doorway.paginas.map((p) => [p.path, p]));
const invByPath = new Map(inventory.urls.map((u) => [u.path, u]));

/** Destino canônico por slug de serviço gerado (páginas-pilar de serviço). */
const SERVICO_PILAR = {
  "formatacao-computador": "/servicos/formatacao",
  "remocao-virus": "/servicos/remocao-de-virus",
  "conserto-pc-notebook": "/servicos/manutencao-de-computador",
  "upgrade-ssd-memoria": "/servicos/upgrade-ssd-ram",
  "redes-wifi": "/servicos/redes-e-wifi",
  "manutencao-tv": "/servicos/conserto-tv",
};

/** Bairros com hub local curado (destino alternativo de intenção geográfica). */
const BAIRRO_HUBS = new Set(
  [
    "cic", "batel", "agua-verde", "centro", "portao", "bigorrilho",
    "santa-felicidade", "cabral", "cristo-rei", "boa-vista", "cajuru",
    "boqueirao", "xaxim", "novo-mundo", "uberaba", "reboucas", "hauer",
    "pinheirinho", "bacacheri", "capao-raso", "sitio-cercado", "fazendinha",
    "campo-comprido", "merces", "juveve", "seminario",
  ],
);

function parsePath(p) {
  const [, , servico, bairro] = p.split("/");
  return { servico, bairro };
}

/**
 * Melhor destino alternativo: o pilar de serviço atende a intenção comercial
 * principal; nunca a home, nunca outra página local igualmente fraca.
 */
function melhorDestino(servico) {
  return SERVICO_PILAR[servico] ?? "/servicos";
}

function decidir(row) {
  const dw = doorwayByPath.get(row.path);
  const inv = invByPath.get(row.path) ?? {};
  const indexada = row.gscStatus === "INDEXED";
  const impressoes = row.impressions ?? 0;
  const cliques = row.clicks ?? 0;
  const exclusivo = row.textoExclusivoRatio ?? 0;
  const sim = row.similaridadeMax ?? 0;
  const inbound = row.inbound ?? 0;
  const risco = dw?.nivel ?? "N/A";
  const demanda = impressoes > 0 || cliques > 0;

  const justificativas = [];
  if (indexada) justificativas.push("já indexada pelo Google");
  if (demanda) justificativas.push(`demanda observada (${impressoes} impressões, ${cliques} cliques)`);
  if (exclusivo >= 0.25) justificativas.push(`texto exclusivo ${(exclusivo * 100).toFixed(0)}%`);
  if (row.score >= 70) justificativas.push(`quality score ${row.score}`);
  if (inbound >= 3) justificativas.push(`${inbound} links internos`);

  let decisao;
  let motivo;

  if (indexada || demanda) {
    decisao = "KEEP";
    motivo = "sinal real de índice/demanda — preservar e reforçar sem inflar texto";
  } else if (row.score >= 70 && exclusivo >= 0.2) {
    decisao = "KEEP";
    motivo = "valor incremental próprio já suficiente";
  } else if (exclusivo >= 0.16 && sim < 0.5 && risco !== "ALTO") {
    decisao = "IMPROVE";
    motivo = "intenção legítima com conteúdo templated — cabe informação local real";
  } else if (risco === "ALTO" && exclusivo < 0.12) {
    decisao = "CONSOLIDATE";
    motivo = "quase idêntica às irmãs, sem demanda própria — funciona como doorway";
  } else if (risco === "ALTO") {
    decisao = "CONSOLIDATE";
    motivo = "valor incremental insuficiente para resultado independente";
  } else {
    decisao = "REVIEW";
    motivo = "sinais mistos — decidir com o próximo ciclo de dados do Search Console";
  }

  const { servico, bairro } = parsePath(row.path);
  return {
    url: row.url,
    path: row.path,
    servico,
    bairro,
    indexada,
    impressoes,
    cliques,
    inbound,
    profundidade: inv.depth ?? null,
    tier: row.tier ?? inv.tier ?? null,
    score: row.score,
    faixa: row.faixa,
    exclusivoPct: Math.round(exclusivo * 100),
    similaridadeMax: sim,
    parMaisParecido: row.parMaisParecido ?? null,
    riscoDoorway: risco,
    sinaisDoorway: dw?.sinais ?? [],
    causas: row.causas ?? [],
    intencaoPropria: exclusivo >= 0.16 || demanda,
    informacaoLocalVerdadeira: exclusivo >= 0.12,
    demandaObservada: demanda,
    valorComercial: Boolean(SERVICO_PILAR[servico]),
    paginaPai: melhorDestino(servico),
    melhorDestinoAlternativo: BAIRRO_HUBS.has(bairro) && !SERVICO_PILAR[servico]
      ? `/bairros/${bairro}`
      : melhorDestino(servico),
    decisao,
    motivo,
    justificativas,
  };
}

const rows = quality.results.filter((r) => r.cluster === "SERVICO_BAIRRO");
const decisoes = rows.map(decidir).sort((a, b) => a.path.localeCompare(b.path));

const resumo = decisoes.reduce((acc, d) => {
  acc[d.decisao] = (acc[d.decisao] ?? 0) + 1;
  return acc;
}, {});

const out = {
  geradoEm: new Date().toISOString(),
  base: inventory.base,
  total: decisoes.length,
  resumo,
  decisoes,
};

fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "reports/servico-bairro-decisions.json"),
  `${JSON.stringify(out, null, 2)}\n`,
);

const md = [
  "# Auditoria individual — cluster SERVICO_BAIRRO (Fase Final)",
  "",
  `Gerado em ${out.geradoEm} · ${out.total} URLs auditadas.`,
  "",
  "| Decisão | URLs |",
  "| --- | --- |",
  ...["KEEP", "IMPROVE", "CONSOLIDATE", "NOINDEX_TEMPORARY", "REVIEW"].map(
    (k) => `| ${k} | ${resumo[k] ?? 0} |`,
  ),
  "",
  "| URL | Serviço | Bairro | Idx | Impr | Inb | Score | %excl | SimMax | Risco | Decisão | Destino |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...decisoes.map(
    (d) =>
      `| ${d.path} | ${d.servico} | ${d.bairro} | ${d.indexada ? "sim" : "não"} | ${d.impressoes} | ${d.inbound} | ${d.score} | ${d.exclusivoPct}% | ${d.similaridadeMax} | ${d.riscoDoorway} | **${d.decisao}** | ${d.decisao === "CONSOLIDATE" ? d.melhorDestinoAlternativo : "—"} |`,
  ),
  "",
  "## Motivos por decisão",
  "",
  ...decisoes.map((d) => `- \`${d.path}\` → **${d.decisao}**: ${d.motivo}${d.justificativas.length ? ` (${d.justificativas.join("; ")})` : ""}`),
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, "reports/servico-bairro-decisions.md"), md);

console.log(`[servico-bairro] ${out.total} URLs auditadas`);
for (const k of ["KEEP", "IMPROVE", "CONSOLIDATE", "NOINDEX_TEMPORARY", "REVIEW"]) {
  console.log(`  ${k.padEnd(18)} ${resumo[k] ?? 0}`);
}
console.log("  → reports/servico-bairro-decisions.json | .md");
