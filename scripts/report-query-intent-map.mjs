#!/usr/bin/env node
/**
 * MAPA CONSULTA → PÁGINA (intenção × desempenho real).
 *
 * Responde três perguntas com dados do Search Console:
 *   1. quais consultas estão abaixo do potencial (impressões com posição fraca);
 *   2. qual página o Google está entregando hoje para cada consulta;
 *   3. onde há mais de uma página disputando a mesma consulta (canibalização).
 *
 * Entrada: reports/gsc/queries-90d.json · reports/gsc/page-query-90d.json
 * Saídas:  reports/query-intent-map.json · reports/query-intent-map.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const norm = (u) => {
  try {
    return new URL(u).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return u;
  }
};

const queries = read("reports/gsc/queries-90d.json");
const pq = read("reports/gsc/page-query-90d.json");
if (!queries || !pq) {
  console.error("Faltam dados do GSC. Rode: node scripts/gsc-fase4-pull.mjs");
  process.exit(1);
}

const LOCAL = /(curitiba|colombo|pinhais|araucária|araucaria|campo largo|são josé|sao jose|piraquara|quatro barras|tamandaré|tamandare|fazenda rio grande|perto de mim|próximo|proximo)/i;
const COMERCIAL = /(preço|preco|quanto custa|orçamento|orcamento|assistência|assistencia|técnico|tecnico|conserto|manutenção|manutencao|formatação|formatacao|empresa|suporte)/i;
const PROBLEMA = /(não |nao |lento|travando|travar|erro|tela azul|barulho|esquentando|superaquec|desliga|reiniciando|piscando|sem som|sem sinal|molhad|quebrad)/i;

const intencao = (q) => {
  if (PROBLEMA.test(q)) return LOCAL.test(q) ? "problema + local" : "problema";
  if (LOCAL.test(q)) return COMERCIAL.test(q) ? "comercial local" : "local";
  if (COMERCIAL.test(q)) return "comercial";
  return "informacional";
};

const donoEsperado = (intent) => {
  switch (intent) {
    case "problema":
      return "página /problemas/* do sintoma";
    case "problema + local":
      return "página /problemas/* (o reforço local é do serviço, não do sintoma)";
    case "comercial local":
      return "página de serviço, cidade ou bairro correspondente";
    case "local":
      return "página de cidade ou bairro";
    case "comercial":
      return "página /servicos/* correspondente";
    default:
      return "conteúdo editorial (/blog/*) ou guia técnico";
  }
};

/** consulta → páginas que a receberam */
const porConsulta = new Map();
for (const r of pq.rows ?? []) {
  const page = norm(r.keys[0]);
  const q = r.keys[1];
  const acc = porConsulta.get(q) ?? [];
  acc.push({
    page,
    impressions: r.impressions ?? 0,
    clicks: r.clicks ?? 0,
    position: r.position != null ? Number(r.position.toFixed(1)) : null,
    ctr: Number(((r.ctr ?? 0) * 100).toFixed(2)),
  });
  porConsulta.set(q, acc);
}

const rows = (queries.rows ?? [])
  .map((r) => {
    const q = r.keys[0];
    const paginas = (porConsulta.get(q) ?? []).sort((a, b) => b.impressions - a.impressions);
    const intent = intencao(q);
    const position = r.position != null ? Number(r.position.toFixed(1)) : null;
    const impressions = r.impressions ?? 0;
    const clicks = r.clicks ?? 0;
    const ctr = Number(((r.ctr ?? 0) * 100).toFixed(2));

    const problemas = [];
    if (!paginas.length) problemas.push("nenhuma página reportada: o Google mostrou a consulta sem atribuir landing page nesta amostra");
    if (paginas.length > 1) problemas.push(`${paginas.length} páginas disputando a mesma consulta`);
    if (position != null && position > 20) problemas.push("posição média acima de 20 (fora de alcance de clique)");
    else if (position != null && position > 10) problemas.push("posição 11–20 (quick win)");
    if (position != null && position <= 10 && impressions >= 10 && ctr < 2) problemas.push("CTR baixo na primeira página");

    // Score de subaproveitamento: demanda medida × distância do topo.
    let score = 0;
    if (impressions) score += Math.min(50, Math.log10(impressions + 1) * 22);
    if (position != null && position > 3) score += Math.min(30, (position - 3) * 1.6);
    if (position != null && position <= 10 && ctr < 2 && impressions >= 10) score += 12;
    if (paginas.length > 1) score += 8;

    return {
      query: q,
      intent,
      donoEsperado: donoEsperado(intent),
      impressions,
      clicks,
      ctr,
      position,
      paginaAtual: paginas[0]?.page ?? null,
      paginasConcorrentes: paginas.slice(1).map((p) => p.page),
      problemas,
      score: Math.round(score),
    };
  })
  .sort((a, b) => b.score - a.score);

const canibalizacao = rows.filter((r) => r.paginasConcorrentes.length > 0);
const subaproveitadas = rows.filter((r) => r.impressions > 0 && (r.position == null || r.position > 10));
const quickWins = rows.filter((r) => r.position != null && r.position > 5 && r.position <= 20 && r.impressions >= 5);

mkdirSync("reports", { recursive: true });
const payload = {
  geradoEm: new Date().toISOString(),
  janela: queries.janela ?? null,
  totais: {
    consultas: rows.length,
    subaproveitadas: subaproveitadas.length,
    quickWins: quickWins.length,
    canibalizacao: canibalizacao.length,
  },
  rows,
};
writeFileSync("reports/query-intent-map.json", `${JSON.stringify(payload, null, 2)}\n`);

const tabela = (list) => [
  `| Consulta | Intenção | Página atual | Dono esperado | Impr. | Pos. | CTR | Observação |`,
  `| --- | --- | --- | --- | --- | --- | --- | --- |`,
  ...list.map(
    (r) =>
      `| ${r.query} | ${r.intent} | ${r.paginaAtual ?? "—"} | ${r.donoEsperado} | ${r.impressions} | ${r.position ?? "—"} | ${r.ctr}% | ${r.problemas[0] ?? "ok"} |`,
  ),
];

writeFileSync(
  "reports/query-intent-map.md",
  [
    `# Mapa consulta → página (intenção e desempenho)`,
    ``,
    `Janela ${payload.janela?.startDate ?? "?"} a ${payload.janela?.endDate ?? "?"} · ${payload.totais.consultas} consultas reportadas.`,
    ``,
    `Consultas de baixo volume são omitidas pelo Search Console: esta lista é um recorte da demanda, não a demanda inteira.`,
    ``,
    `## Consultas subaproveitadas (impressões com posição acima de 10)`,
    ``,
    ...tabela(subaproveitadas),
    ``,
    `## Quick wins (posição 6–20 com demanda medida)`,
    ``,
    ...tabela(quickWins),
    ``,
    `## Canibalização: mais de uma página na mesma consulta`,
    ``,
    canibalizacao.length
      ? [
          `| Consulta | Página principal | Outras páginas | Impr. | Pos. |`,
          `| --- | --- | --- | --- | --- |`,
          ...canibalizacao.map(
            (r) => `| ${r.query} | ${r.paginaAtual} | ${r.paginasConcorrentes.join(", ")} | ${r.impressions} | ${r.position ?? "—"} |`,
          ),
        ].join("\n")
      : `Nenhuma consulta com duas páginas concorrentes nesta janela.`,
    ``,
    `## Todas as consultas por score de subaproveitamento`,
    ``,
    ...tabela(rows),
    ``,
  ].join("\n"),
);
console.log(
  `✔ reports/query-intent-map.md — ${rows.length} consultas · ${subaproveitadas.length} subaproveitadas · ${canibalizacao.length} com canibalização`,
);
