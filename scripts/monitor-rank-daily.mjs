#!/usr/bin/env node
/**
 * MONITORAMENTO DIÁRIO DE RANKING E VISIBILIDADE LOCAL (Curitiba).
 *
 * Lê o Search Console (últimos dias completos) para as consultas-alvo
 * principais e secundárias, compara com o snapshot do dia anterior e emite
 * alertas acionáveis: queda de posição, perda de impressões, consulta-alvo
 * sem dados e CTR baixo em página bem posicionada.
 *
 * Saídas: reports/rank-daily.json · reports/rank-daily.md
 *         reports/rank-daily-snapshot.json (base da comparação do dia seguinte)
 *
 * Uso: node scripts/monitor-rank-daily.mjs [--dias=3]
 * Sem credenciais do Search Console o script sai em modo aviso (exit 0).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolveSite, searchAnalytics, dayOffset } from "./lib/gsc-client.mjs";
import { BASE_URL } from "./lib/curated-urls.mjs";

const arg = (k, d) => {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split("=")[1] : d;
};
const DIAS = Number(arg("dias", 3));
const SNAPSHOT = "reports/rank-daily-snapshot.json";

/** Consultas que sustentam a operação local. */
const PRINCIPAIS = [
  "tecnico de informatica curitiba",
  "assistencia tecnica notebook curitiba",
  "conserto de computador curitiba",
  "formatacao de computador curitiba",
  "manutencao de notebook curitiba",
];
const SECUNDARIAS = [
  "remocao de virus curitiba",
  "upgrade ssd curitiba",
  "recuperacao de dados curitiba",
  "conserto de tv curitiba",
  "suporte tecnico empresarial curitiba",
  "tecnico de informatica perto de mim",
];
const ALVOS = [...PRINCIPAIS, ...SECUNDARIAS];

const LIMITES = { quedaPosicao: 3, perdaImpressoes: 0.4, ctrBaixo: 1.5, posicaoBoa: 10 };

mkdirSync("reports", { recursive: true });

let site;
try {
  site = await resolveSite(BASE_URL);
} catch (err) {
  console.warn(`AVISO: monitoramento diário sem Search Console — ${err.message}`);
  process.exit(0);
}

const janela = { start: dayOffset(DIAS + 2), end: dayOffset(2) };
const round = (n, d = 1) => (n == null ? null : Number(n.toFixed(d)));
const normal = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

const resposta = await searchAnalytics(site, {
  startDate: janela.start,
  endDate: janela.end,
  dimensions: ["query", "page"],
  rowLimit: 2000,
});

const linhas = (resposta.rows ?? [])
  .map((r) => ({
    query: r.keys[0],
    queryNorm: normal(r.keys[0]),
    url: r.keys[1].replace(BASE_URL, "") || "/",
    position: round(r.position),
    impressions: r.impressions ?? 0,
    clicks: r.clicks ?? 0,
    ctr: round((r.ctr ?? 0) * 100, 2),
  }))
  .filter((r) => ALVOS.includes(r.queryNorm) || /curitiba|perto de mim/.test(r.queryNorm))
  .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));

const anterior = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, "utf8")) : null;
const antes = new Map((anterior?.rows ?? []).map((r) => [`${r.queryNorm}||${r.url}`, r]));

const alertas = [];
for (const r of linhas) {
  const b = antes.get(`${r.queryNorm}||${r.url}`);
  if (b?.position != null && r.position != null && r.position - b.position >= LIMITES.quedaPosicao) {
    alertas.push({
      tipo: "queda-posicao",
      severidade: "alta",
      query: r.query,
      url: r.url,
      mensagem: `caiu de ${b.position} para ${r.position} — revisar corpo do texto e provas da página`,
    });
  }
  if (b?.impressions > 50 && r.impressions < b.impressions * (1 - LIMITES.perdaImpressoes)) {
    alertas.push({
      tipo: "perda-impressoes",
      severidade: "media",
      query: r.query,
      url: r.url,
      mensagem: `impressões caíram de ${b.impressions} para ${r.impressions} — checar canonical, indexação e concorrência`,
    });
  }
  if (r.position != null && r.position <= LIMITES.posicaoBoa && r.impressions > 100 && r.ctr < LIMITES.ctrBaixo) {
    alertas.push({
      tipo: "ctr-baixo",
      severidade: "media",
      query: r.query,
      url: r.url,
      mensagem: `posição ${r.position} com CTR ${r.ctr}% — reescrever title/description e reforçar a promessa`,
    });
  }
}
const semDados = ALVOS.filter((q) => !linhas.some((r) => r.queryNorm === q));
for (const q of semDados) {
  alertas.push({
    tipo: "sem-dados",
    severidade: "baixa",
    query: q,
    url: null,
    mensagem: "sem dados na janela — cobertura de conteúdo insuficiente ou volume abaixo do limiar do Search Console",
  });
}

const relatorio = {
  generatedAt: new Date().toISOString(),
  site,
  janela,
  limites: LIMITES,
  totals: {
    pares: linhas.length,
    top3: linhas.filter((r) => (r.position ?? 99) <= 3).length,
    top10: linhas.filter((r) => (r.position ?? 99) <= 10).length,
    alertas: alertas.length,
  },
  alertas,
  rows: linhas,
};
writeFileSync("reports/rank-daily.json", `${JSON.stringify(relatorio, null, 2)}\n`);

writeFileSync(
  "reports/rank-daily.md",
  [
    `# Monitoramento diário — visibilidade local (${janela.start} a ${janela.end})`,
    ``,
    `Propriedade \`${site}\` · ${relatorio.totals.pares} pares consulta×URL · `,
    `${relatorio.totals.top3} no top 3 · ${relatorio.totals.top10} no top 10.`,
    ``,
    alertas.length ? `## Alertas (${alertas.length})` : `Nenhum alerta nesta janela.`,
    ...alertas.map((a) => `- **${a.severidade}** · ${a.tipo} · ${a.query}${a.url ? ` → ${a.url}` : ""}: ${a.mensagem}`),
    ``,
    `## Consultas monitoradas`,
    ``,
    `| Consulta | URL | Posição | Impressões | Cliques | CTR % |`,
    `| --- | --- | --- | --- | --- | --- |`,
    ...linhas.map((r) => `| ${r.query} | ${r.url} | ${r.position ?? "—"} | ${r.impressions} | ${r.clicks} | ${r.ctr} |`),
    ``,
    `> Ausência de dados não prova ausência de indexação: o Search Console omite consultas de baixo volume.`,
  ].join("\n"),
);

writeFileSync(SNAPSHOT, `${JSON.stringify({ generatedAt: relatorio.generatedAt, janela, rows: linhas }, null, 2)}\n`);

console.log(`✔ reports/rank-daily.md gerado — ${alertas.length} alerta(s), ${relatorio.totals.top10} URL(s) no top 10.`);
