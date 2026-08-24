#!/usr/bin/env node
/**
 * LISTA DE INSPEÇÃO — URLs do sitemap que o Google reporta como bloqueadas
 * por meta tag (noindex) ou por robots.
 *
 * Uma URL dentro do sitemap declarando noindex é contradição de sinal: o
 * sitemap pede rastreio e a página nega indexação. Este relatório NÃO decide
 * nada — apenas cruza o sinal do Google com a política de índice do projeto e
 * registra a evidência a favor de indexar ou de manter fora do sitemap.
 *
 * Entrada: reports/gsc/index-coverage.json (URL Inspection) e o sitemap curado.
 * Saídas:  reports/noindex-inspection.json · reports/noindex-inspection.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const cov = existsSync("reports/gsc/index-coverage.json")
  ? JSON.parse(readFileSync("reports/gsc/index-coverage.json", "utf8"))
  : null;
if (!cov) {
  console.error("Faltam dados de inspeção. Rode: node scripts/gsc-fase4-inspect.mjs");
  process.exit(1);
}

const noSitemap = new Map();
for (const [arquivo, entradas] of ACTIVE_SITEMAPS) {
  for (const e of entradas) if (!noSitemap.has(e.path)) noSitemap.set(e.path, arquivo);
}

const BLOQUEADOS = new Set(["BLOCKED_BY_META_TAG", "BLOCKED_BY_HTTP_HEADER", "BLOCKED_BY_ROBOTS_TXT"]);

const familia = (p) => {
  if (p.startsWith("/bairros/")) return "BAIRRO";
  if (p === "/blog") return "BLOG INDEX";
  if (p.startsWith("/blog/")) return "EDITORIAL";
  if (/^\/tecnico-informatica-/.test(p)) return "CIDADE";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(p)) return "SERVICO x BAIRRO";
  if (p.startsWith("/servicos")) return "SERVICO";
  if (p.startsWith("/problemas")) return "PROBLEMA";
  return "OUTRO";
};

/**
 * Evidência por família, com base nas políticas já vigentes no projeto
 * (poda de bairros, cidades-âncora, hub editorial). Nada aqui altera política.
 */
const evidencia = (path, fam) => {
  if (fam === "BAIRRO")
    return {
      aFavorDeIndexar: "A página existe, tem narrativa e recebe links internos do mapa local; bairros irmãos já indexados aparecem em posição 5–9, o que indica que a família converte impressão em posição competitiva.",
      aFavorDeExcluir: "A política de poda limita a quantidade de bairros indexáveis para evitar canibalização entre páginas de mesma estrutura. Sem narrativa exclusiva comprovada e prova visual própria, o bairro permanece noindex.",
      recomendacao: "Manter noindex e remover do sitemap curado, ou promover apenas por onda de liberação com narrativa exclusiva — nunca pelos dois sinais ao mesmo tempo.",
    };
  if (fam === "BLOG INDEX")
    return {
      aFavorDeIndexar: "O índice do blog é o hub de entrada dos artigos e já tem conteúdo próprio suficiente para não ser página-vazia.",
      aFavorDeExcluir: "Índice paginado tende a competir com os próprios artigos e muda de conteúdo a cada publicação, o que enfraquece a relevância estável.",
      recomendacao: "Decidir um único sinal: se o hub deve ser indexável, remover o noindex; se não, retirá-lo do sitemap. Hoje os dois sinais coexistem.",
    };
  if (fam === "CIDADE")
    return {
      aFavorDeIndexar: "Cidades irmãs indexadas aparecem em posição média 8–11 com demanda local medida, o que mostra potencial da família.",
      aFavorDeExcluir: "A política de cidades-âncora restringe a indexação às praças com atendimento e conteúdo próprio; cidade fora desse conjunto reproduz template e vira doorway.",
      recomendacao: "Manter fora do índice e retirar do sitemap enquanto a cidade não estiver no conjunto âncora.",
    };
  return {
    aFavorDeIndexar: "A URL está no sitemap curado, ou seja, foi considerada relevante em alguma rodada anterior.",
    aFavorDeExcluir: "A própria página declara noindex, o que indica decisão editorial de não competir com a página dona da intenção.",
    recomendacao: "Alinhar os dois sinais: retirar do sitemap ou remover o noindex, conforme o dono da intenção.",
  };
};

const itens = (cov.results ?? [])
  .filter((r) => BLOQUEADOS.has(r.indexingState) || r.robotsTxtState === "DISALLOWED")
  .map((r) => {
    const fam = familia(r.path);
    return {
      path: r.path,
      familia: fam,
      indexingState: r.indexingState ?? null,
      robotsTxtState: r.robotsTxtState ?? null,
      coverageState: r.coverageState ?? null,
      verdict: r.verdict ?? null,
      ultimoRastreio: r.lastCrawlTime ?? null,
      googleCanonical: r.googleCanonical ?? null,
      noSitemap: noSitemap.get(r.path) ?? null,
      contradicao: !!noSitemap.get(r.path),
      ...evidencia(r.path, fam),
    };
  })
  .sort((a, b) => a.familia.localeCompare(b.familia) || a.path.localeCompare(b.path));

mkdirSync("reports", { recursive: true });
const payload = {
  geradoEm: new Date().toISOString(),
  site: cov.site,
  totais: {
    bloqueadas: itens.length,
    contradicoesComSitemap: itens.filter((i) => i.contradicao).length,
  },
  itens,
};
writeFileSync("reports/noindex-inspection.json", `${JSON.stringify(payload, null, 2)}\n`);

writeFileSync(
  "reports/noindex-inspection.md",
  [
    `# Inspeção de URLs noindex presentes no sitemap`,
    ``,
    `Propriedade \`${payload.site}\` · gerado em ${payload.geradoEm.slice(0, 10)}.`,
    ``,
    `${payload.totais.bloqueadas} URL(s) reportadas pelo Google como bloqueadas para indexação; ${payload.totais.contradicoesComSitemap} delas ainda constam no sitemap curado.`,
    ``,
    `Este relatório é diagnóstico. Nenhuma política de índice é alterada por ele.`,
    ``,
    `| URL | Família | Estado reportado | Sitemap | Contradição |`,
    `| --- | --- | --- | --- | --- |`,
    ...itens.map(
      (i) =>
        `| ${i.path} | ${i.familia} | ${i.indexingState ?? i.robotsTxtState} | ${i.noSitemap ?? "fora"} | ${i.contradicao ? "sim" : "não"} |`,
    ),
    ``,
    `## Evidência por URL`,
    ``,
    ...itens.flatMap((i) => [
      `### ${i.path}`,
      ``,
      `Família ${i.familia} · estado \`${i.indexingState ?? "—"}\` · robots \`${i.robotsTxtState ?? "—"}\` · cobertura \`${i.coverageState ?? "—"}\` · último rastreio ${i.ultimoRastreio ?? "não reportado"}.`,
      ``,
      `- Evidência a favor de indexar: ${i.aFavorDeIndexar}`,
      `- Evidência a favor de manter excluída: ${i.aFavorDeExcluir}`,
      `- Encaminhamento sugerido: ${i.recomendacao}`,
      ``,
    ]),
  ].join("\n"),
);
console.log(
  `✔ reports/noindex-inspection.md — ${payload.totais.bloqueadas} bloqueada(s), ${payload.totais.contradicoesComSitemap} contradição(ões) com o sitemap`,
);
