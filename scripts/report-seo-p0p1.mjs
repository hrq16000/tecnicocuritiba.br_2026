#!/usr/bin/env node
/**
 * CHECKLIST P0/P1 POR URL — impressões × posição × indexação (Search Console).
 *
 * Entrada (gerada por scripts/gsc-fase4-pull.mjs e scripts/gsc-fase4-inspect.mjs):
 *   reports/gsc/pages-90d.json
 *   reports/gsc/page-query-90d.json
 *   reports/gsc/index-coverage.json
 *
 * Classificação:
 *   P0 — já tem demanda medida (impressões) e está fora do topo, ou está
 *        indexada e recebendo impressões com CTR baixo. Mexer aqui muda número.
 *   P1 — sinal fraco mas real (poucas impressões) ou indexada sem demanda ainda.
 *   P2 — sem impressões e sem indexação confirmada: é assunto de descoberta,
 *        não de otimização on-page.
 *
 * Saídas: reports/seo-p0p1-checklist.json · reports/seo-p0p1-checklist.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const BASE = "https://tecnico.curitiba.br";
const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const norm = (u) => {
  try {
    return new URL(u).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return u;
  }
};

const pages = read("reports/gsc/pages-90d.json");
const pq = read("reports/gsc/page-query-90d.json");
const cov = read("reports/gsc/index-coverage.json");
if (!pages || !cov) {
  console.error("Faltam dados do GSC. Rode: node scripts/gsc-fase4-pull.mjs && node scripts/gsc-fase4-inspect.mjs");
  process.exit(1);
}

const familia = (p) => {
  if (p === "/") return "HOME";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(p)) return "SERVICO x BAIRRO";
  if (p.startsWith("/servicos")) return "SERVICO";
  if (p.startsWith("/problemas")) return "PROBLEMA";
  if (p.startsWith("/bairros")) return "BAIRRO";
  if (/^\/tecnico-informatica-/.test(p) || p.startsWith("/arrumar-pc")) return "CIDADE";
  if (p.startsWith("/blog")) return "EDITORIAL";
  if (p.startsWith("/empresa") || p.includes("empresarial")) return "EMPRESAS";
  return "INSTITUCIONAL";
};

const perf = new Map();
for (const r of pages.rows ?? []) {
  perf.set(norm(r.keys[0]), {
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: Number(((r.ctr ?? 0) * 100).toFixed(2)),
    position: r.position != null ? Number(r.position.toFixed(1)) : null,
  });
}

/** Consultas por página (para justificar a ação sem adivinhar). */
const queriesPorPagina = new Map();
for (const r of pq?.rows ?? []) {
  const p = norm(r.keys[0]);
  const arr = queriesPorPagina.get(p) ?? [];
  arr.push({
    query: r.keys[1],
    impressions: r.impressions ?? 0,
    clicks: r.clicks ?? 0,
    position: r.position != null ? Number(r.position.toFixed(1)) : null,
  });
  queriesPorPagina.set(p, arr);
}

const acoes = (u) => {
  const out = [];
  if (!u.indexada && u.impressions > 0) {
    out.push("URL com impressões mas sem indexação confirmada: revalidar canonical, links internos de entrada e sitemap antes de qualquer edição de texto.");
  }
  if (u.position != null && u.position > 20) {
    out.push("Posição média fora do alcance de clique: a lacuna é de cobertura de conteúdo (causas, diagnóstico, decisão), não de metadata.");
  } else if (u.position != null && u.position > 10) {
    out.push("Posição entre 11 e 20: quick win. Fortalecer a resposta direta no início e a seção que corresponde à consulta principal.");
  } else if (u.position != null && u.position > 3) {
    out.push("Posição 4–10: ganho vem de CTR e de responder melhor a intenção, não de mais palavras.");
  }
  if (u.position != null && u.position <= 10 && u.impressions >= 10 && u.ctr < 2) {
    out.push("CTR abaixo de 2% já na primeira página: revisar title e description para refletir exatamente a dúvida da consulta.");
  }
  if (u.impressions === 0 && u.indexada) {
    out.push("Indexada sem impressões: assunto de demanda/consulta-alvo, não de enriquecimento.");
  }
  if (u.impressions === 0 && !u.indexada) {
    out.push("Sem indexação e sem impressões: tratar por descoberta (links internos e sitemap), fora do escopo de otimização on-page.");
  }
  if (u.topQueries.length > 1) {
    const intents = new Set(u.topQueries.map((q) => (/(curitiba|pinhais|colombo|araucária|araucaria|perto de mim)/i.test(q.query) ? "local" : "informacional")));
    if (intents.size > 1) out.push("A mesma URL recebe consulta local e informacional: confirmar que o dono da intenção continua correto antes de expandir texto.");
  }
  return out;
};

const urls = (cov.results ?? []).map((r) => {
  const p = perf.get(r.path) ?? { clicks: 0, impressions: 0, ctr: 0, position: null };
  const topQueries = (queriesPorPagina.get(r.path) ?? []).sort((a, b) => b.impressions - a.impressions).slice(0, 5);
  const base = {
    path: r.path,
    url: `${BASE}${r.path}`,
    familia: familia(r.path),
    indexada: !!r.indexed,
    estado: r.coverageState ?? null,
    indexingState: r.indexingState ?? null,
    ultimoRastreio: r.lastCrawlTime ?? null,
    ...p,
    topQueries,
  };
  let prioridade = "P2";
  if (base.impressions >= 10 && (base.position == null || base.position > 3)) prioridade = "P0";
  else if (base.impressions > 0) prioridade = "P1";
  else if (base.indexada) prioridade = "P1";
  return { ...base, prioridade, checklist: acoes(base) };
});

const ord = { P0: 0, P1: 1, P2: 2 };
urls.sort((a, b) => ord[a.prioridade] - ord[b.prioridade] || b.impressions - a.impressions || a.path.localeCompare(b.path));

mkdirSync("reports", { recursive: true });
const payload = {
  geradoEm: new Date().toISOString(),
  site: cov.site,
  janela: pages.janela ?? null,
  totais: {
    urls: urls.length,
    p0: urls.filter((u) => u.prioridade === "P0").length,
    p1: urls.filter((u) => u.prioridade === "P1").length,
    p2: urls.filter((u) => u.prioridade === "P2").length,
    indexadas: urls.filter((u) => u.indexada).length,
  },
  urls,
};
writeFileSync("reports/seo-p0p1-checklist.json", `${JSON.stringify(payload, null, 2)}\n`);

const linha = (u) =>
  `| ${u.prioridade} | ${u.path} | ${u.familia} | ${u.impressions} | ${u.clicks} | ${u.ctr}% | ${u.position ?? "—"} | ${u.indexada ? "sim" : "não"} |`;

const md = [
  `# Checklist P0/P1 por URL — Search Console`,
  ``,
  `Propriedade \`${payload.site}\` · janela ${payload.janela?.startDate ?? "?"} a ${payload.janela?.endDate ?? "?"} · gerado em ${payload.geradoEm.slice(0, 10)}.`,
  ``,
  `${payload.totais.urls} URLs curadas · ${payload.totais.indexadas} indexadas · P0 ${payload.totais.p0} · P1 ${payload.totais.p1} · P2 ${payload.totais.p2}.`,
  ``,
  `Ausência de dados no Search Console não prova ausência de indexação nem de tráfego: consultas de baixo volume são omitidas.`,
  ``,
  `## Resumo por prioridade`,
  ``,
  `| Prioridade | URL | Família | Impressões | Cliques | CTR | Posição | Indexada |`,
  `| --- | --- | --- | --- | --- | --- | --- | --- |`,
  ...urls.filter((u) => u.prioridade !== "P2").map(linha),
  ``,
  `## Checklist detalhado (P0 e P1 com demanda medida)`,
  ``,
  ...urls
    .filter((u) => u.prioridade !== "P2" && u.impressions > 0)
    .flatMap((u) => [
      `### ${u.prioridade} · ${u.path}`,
      ``,
      `Família ${u.familia} · ${u.impressions} impressões · ${u.clicks} cliques · CTR ${u.ctr}% · posição ${u.position ?? "—"} · indexada: ${u.indexada ? "sim" : "não"}${u.estado ? ` (${u.estado})` : ""}.`,
      ``,
      u.topQueries.length
        ? `Consultas reportadas: ${u.topQueries.map((q) => `\`${q.query}\` (${q.impressions} impr., pos. ${q.position ?? "—"})`).join(", ")}.`
        : `Nenhuma consulta reportada nesta janela.`,
      ``,
      ...u.checklist.map((c) => `- ${c}`),
      ``,
    ]),
  `## P2 — fora do escopo de otimização on-page`,
  ``,
  `${payload.totais.p2} URL(s) sem impressões e sem indexação confirmada. São caso de descoberta (links internos, sitemap, idade do domínio) e não devem ser reescritas por suposição.`,
  ``,
].join("\n");
writeFileSync("reports/seo-p0p1-checklist.md", md);
console.log(`✔ reports/seo-p0p1-checklist.md — P0 ${payload.totais.p0} · P1 ${payload.totais.p1} · P2 ${payload.totais.p2}`);
