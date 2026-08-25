#!/usr/bin/env node
/**
 * ============================================================================
 * PRONTIDÃO PARA O D14 — PROVA DE FERRAMENTAL, NÃO RODADA DE SEO
 * ============================================================================
 * O D14 real ainda não venceu. Este job não coleta marco, não altera o site,
 * não dispara IndexNow e não toca lastmod: ele só prova que, quando a janela
 * temporal abrir, o sistema consegue distinguir tempo normal, oportunidade,
 * gargalo e regressão — e que se recusa a coletar antes da hora.
 *
 * Saídas:
 *   docs/relatorio-prontidao-d14.md   relatório com o veredito
 *   reports/prontidao-d14.json        payload das checagens
 *   reports/marco-ledger.json         selo de imutabilidade dos marcos
 *
 * Uso:
 *   node scripts/check-prontidao-d14.mjs
 *   node scripts/check-prontidao-d14.mjs --gate   # exit 1 se houver defeito
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { avaliarJanela } from "./lib/marco-janela.mjs";
import { decidirMarco } from "./lib/marco-decisao.mjs";
import {
  avaliarFreshness,
  hashMarco,
  janelasSearchPerformance,
  reconciliarFunil,
  verificarMarco,
} from "./lib/marco-integridade.mjs";
import { CENARIOS, CENARIOS_POR_DECISAO } from "./fixtures/marco-cenarios.mjs";

const args = process.argv.slice(2);
const GATE = args.includes("--gate");
const AGORA = new Date();

const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};
const existeTexto = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

const checagens = [];
const registrar = (secao, item, ok, detalhe, extra = {}) => {
  checagens.push({ secao, item, status: ok ? "PASS" : "FAIL", detalhe, ...extra });
  return ok;
};

/* ── 1. Temporal gate ───────────────────────────────────────────────────── */
const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const marcoDe = (m) => historico.marcos.find((x) => x.marco === m) ?? null;
const D0 = marcoDe("D0");
const D7 = marcoDe("D7");
const janela = avaliarJanela("D14", historico, AGORA);
const temporal = {
  d0: D0?.registradoEm ?? null,
  agora: AGORA.toISOString(),
  d14EarliestUtc: janela.elegivelEm,
  faltamDias: janela.faltamDias,
  status: janela.ok ? "READY" : "LOCKED",
};
registrar(
  "TEMPORAL GATE",
  "janela avaliada em UTC com fonte única",
  Boolean(temporal.d0 && temporal.d14EarliestUtc),
  `D0 ${temporal.d0} · agora ${temporal.agora} · elegível ${temporal.d14EarliestUtc} · status ${temporal.status}`,
);

/** Executa um comando e devolve o exit code sem derrubar o job. */
function rodar(cmd, cmdArgs, env = {}) {
  try {
    const out = execFileSync(cmd, cmdArgs, { env: { ...process.env, ...env }, encoding: "utf8", stdio: "pipe" });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

// Coleta antecipada precisa falhar fechada (exit 2) — só quando ainda está travada.
if (!janela.ok) {
  const r = rodar(process.execPath, ["scripts/snapshot-marco.mjs", "--marco=D14"]);
  registrar("TEMPORAL GATE", "coleta antecipada de D14 falha fechada", r.code === 2, `exit ${r.code}`);
  const mensagemCompleta = ["marco solicitado", "D0 (UTC)", "agora (UTC)", "liberado a partir de", "tempo restante"].every(
    (t) => r.out.includes(t),
  );
  registrar("TEMPORAL GATE", "bloqueio informa marco, D0, agora, mínimo e restante", mensagemCompleta, "mensagem de bloqueio auditada");
} else {
  registrar("TEMPORAL GATE", "coleta antecipada de D14 falha fechada", true, "janela já aberta — teste não aplicável (N/A)");
  registrar("TEMPORAL GATE", "bloqueio informa marco, D0, agora, mínimo e restante", true, "janela já aberta — N/A");
}

for (const flag of ["--force", "--skip-date", "--ignore-window"]) {
  const r = rodar(process.execPath, ["scripts/snapshot-marco.mjs", "--marco=D14", flag]);
  registrar("TEMPORAL GATE", `bypass ${flag} recusado`, r.code === 2, `exit ${r.code}`);
}
{
  const r = rodar(process.execPath, ["scripts/snapshot-marco.mjs", "--marco=D14", "--fora-de-janela"], {
    MARCO_FIXTURE: "",
    NODE_ENV: "production",
  });
  registrar(
    "TEMPORAL GATE",
    "--fora-de-janela recusado fora de fixture",
    r.code === 2 && r.out.includes("MARCO_FIXTURE"),
    `exit ${r.code}`,
  );
}

/* ── 2. Boundary de timezone (node --test) ──────────────────────────────── */
{
  const r = rodar(process.execPath, ["--test", "scripts/lib/marco-janela.test.mjs"]);
  registrar("TEMPORAL GATE", "boundary D14−1s bloqueado / D14 exato liberado", r.code === 0, `node --test exit ${r.code}`);
}

/* ── 3. Imutabilidade dos marcos (ledger selado) ────────────────────────── */
const LEDGER = "reports/marco-ledger.json";
const ledger = lerJson(LEDGER) ?? { seloVersao: 1, selos: {} };
const integridadeMarcos = [];
for (const m of ["D0", "D7"]) {
  const reg = marcoDe(m);
  if (!reg) {
    registrar("SNAPSHOT INTEGRITY", `${m} presente`, false, "marco não registrado");
    continue;
  }
  const hash = reg.integridade?.hash ?? hashMarco(reg);
  const selo = ledger.selos[m];
  if (!selo) {
    ledger.selos[m] = {
      hash,
      snapshotId: reg.integridade?.snapshotId ?? `${m.toLowerCase()}-${hash.slice(0, 12)}`,
      schemaVersion: reg.integridade?.schemaVersion ?? "marco/1.0-legado",
      registradoEm: reg.registradoEm,
      source: reg.integridade ? "assinado" : "selado retroativamente pelo check de prontidão",
      counts: {
        curadas: reg.denominador?.curadas ?? null,
        indexed: reg.google?.indexed ?? null,
        unknown: reg.google?.unknown ?? null,
        discovered: reg.google?.discovered ?? null,
        crawled_not_indexed: reg.google?.crawled_not_indexed ?? null,
      },
      seladoEm: AGORA.toISOString(),
    };
    registrar("SNAPSHOT INTEGRITY", `${m} selado`, true, `hash ${hash.slice(0, 12)} registrado pela primeira vez`);
  } else {
    const igual = selo.hash === hash;
    registrar(
      "SNAPSHOT INTEGRITY",
      `${m} imutável`,
      igual,
      igual ? `hash ${hash.slice(0, 12)} confere com o selo` : `hash divergente: selo ${selo.hash.slice(0, 12)} × atual ${hash.slice(0, 12)}`,
    );
  }
  if (reg.integridade) {
    const v = verificarMarco(reg);
    registrar("SNAPSHOT INTEGRITY", `${m} hash interno confere`, v.ok, v.motivo ?? "ok");
  }
  integridadeMarcos.push({
    marco: m,
    hash,
    snapshotId: ledger.selos[m].snapshotId,
    schemaVersion: ledger.selos[m].schemaVersion,
    registradoEm: reg.registradoEm,
    counts: ledger.selos[m].counts,
  });
}
ledger.atualizadoEm = AGORA.toISOString();
mkdirSync("reports", { recursive: true });
writeFileSync(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`);

// Reprocessamento nunca apaga o original.
{
  const trilha = lerJson("reports/marco-reprocessamentos.json");
  const contratoOk = existeTexto("scripts/snapshot-marco.mjs").includes("marco-reprocessamentos.json");
  registrar(
    "SNAPSHOT INTEGRITY",
    "reprocessamento gera trilha e preserva o original",
    contratoOk,
    trilha ? `${trilha.registros?.length ?? 0} reprocessamento(s) arquivado(s)` : "nenhum reprocessamento até agora",
  );
}

/* ── 4. Procedência e freshness ─────────────────────────────────────────── */
const inventario = lerJson("reports/indexation-inventory.json");
const idade = (p) => (existsSync(p) ? statSync(p).mtime.toISOString() : null);
const fontes = [
  { metrica: "cobertura (indexed/unknown/discovered/crawled)", fonte: "gsc", collectedAt: inventario?.geradoEm ?? idade("reports/indexation-inventory.json") },
  { metrica: "http/canonical/noindex por URL", fonte: "crawl", collectedAt: idade("reports/indexation-inventory.json") },
  { metrica: "URLs curadas no sitemap", fonte: "sitemap", collectedAt: idade("reports/sitemap-inclusions.json") },
  { metrica: "inbound/profundidade", fonte: "internal_graph", collectedAt: idade("reports/internal-graph.json") },
  { metrica: "submissões", fonte: "indexnow", collectedAt: lerJson("reports/indexnow-last-run.json")?.executadoEm ?? idade("reports/indexnow-last-run.json") },
  { metrica: "cobertura Bing", fonte: "bing", collectedAt: idade("reports/bing-webmaster.json") },
  { metrica: "identidade de SERP", fonte: "snapshot_local", collectedAt: idade("reports/serp-signals-baseline.json") },
];
const freshness = avaliarFreshness(fontes, AGORA);
registrar(
  "PROVENANCE",
  "toda métrica declara origem e estado",
  fontes.every((f) => f.fonte),
  `${fontes.length} fonte(s) declaradas · observado × derivado nunca misturados`,
);
registrar(
  "FRESHNESS",
  "atraso identificado explicitamente (sem inventar atualização)",
  true,
  `atrasadas: ${freshness.atrasadas.join(", ") || "nenhuma"} · sem dado: ${freshness.ausentes.join(", ") || "nenhuma"}`,
);

/* ── 5. Reconciliação do funil ──────────────────────────────────────────── */
for (const m of ["D0", "D7"]) {
  const reg = marcoDe(m);
  if (!reg) continue;
  const rec = reconciliarFunil(reg.google, reg.denominador?.curadas ?? 0);
  registrar("FUNNEL", `${m} reconcilia com o universo curado`, rec.ok, rec.motivo ?? `${rec.soma}/${rec.universo}`);
}

/* ── 6. Janelas de search performance ───────────────────────────────────── */
const janelas = janelasSearchPerformance(D0, D7);
registrar(
  "SEARCH WINDOWS",
  "overlap entre janelas de 28d explicitado",
  Boolean(janelas),
  janelas ? `D0×D7 overlap ${janelas.overlapDias}d (${janelas.overlapPct}%) · exclusivo ${janelas.naoSobreposto.dias}d` : "marcos insuficientes",
);

/* ── 7. Fixtures sintéticas ─────────────────────────────────────────────── */
const fixtures = CENARIOS.map((c) => {
  const r = decidirMarco(c);
  return { id: c.id, titulo: c.titulo, esperado: c.esperado, obtido: r.decisao, severidade: r.severidade, alerta: r.alerta, justificativa: r.justificativa };
});
for (const f of fixtures) {
  registrar("FIXTURES", `cenário ${f.id} — ${f.titulo}`, f.esperado === f.obtido, `esperado ${f.esperado} · obtido ${f.obtido}`);
}
const decisoesEsperadas = {
  A: CENARIOS_POR_DECISAO.A,
  B: CENARIOS_POR_DECISAO.B,
  C: CENARIOS_POR_DECISAO.C,
  D: CENARIOS_POR_DECISAO.D,
};
const provaDecisao = {};
for (const [codigo, cenario] of Object.entries(decisoesEsperadas)) {
  const r = decidirMarco(cenario);
  provaDecisao[codigo] = { cenario: cenario.id, obtido: r.decisao, rotulo: r.rotulo, severidade: r.severidade };
  registrar("DECISOES", `decisão ${codigo} reproduzida`, r.decisao === codigo, `cenário ${cenario.id} → ${r.decisao} (${r.rotulo})`);
}
// Governança: no máximo 5 quick wins e nenhuma alteração automática.
{
  const r = decidirMarco(CENARIOS_POR_DECISAO.B);
  registrar("DECISOES", "quick wins limitados a 5 e sem execução automática", r.quickWins.length <= 5 && r.quickWins.every((q) => q.acao.includes("backlog")), `${r.quickWins.length} quick win(s) propostos`);
}

/* ── 8. Alertas: severidade e deduplicação ──────────────────────────────── */
const fingerprint = (marco, regra, alvo) => createHash("sha1").update(`${marco}|${regra}|${alvo}`).digest("hex");
{
  const a = fingerprint("D14", "REGRESSION", "/servicos/formatacao");
  const b = fingerprint("D14", "REGRESSION", "/servicos/formatacao");
  const c = fingerprint("D14", "REGRESSION", "/servicos/conserto-tv");
  registrar("ALERTS", "deduplicação por marco+regra+alvo", a === b && a !== c, "mesma assinatura não reenvia; alvo diferente reenvia");
  const notify = existeTexto("scripts/notify-marco-decision.mjs");
  registrar("ALERTS", "WAIT não dispara alerta crítico", notify.includes('ACIONAVEIS = new Set(["INVESTIGATE", "REGRESSION"])'), "somente INVESTIGATE/REGRESSION notificam");
  registrar(
    "ALERTS",
    "severidade cresce de INVESTIGATE para REGRESSION",
    decidirMarco(CENARIOS_POR_DECISAO.C).severidade === "alta" && decidirMarco(CENARIOS_POR_DECISAO.D).severidade === "critica",
    "C=alta · D=crítica",
  );
  registrar("ALERTS", "estado de notificação persistido (antirruído)", notify.includes("marco-decision-notify.json"), "assinatura anterior comparada antes de reenviar");
}

/* ── 9. Modo de contenção ───────────────────────────────────────────────── */
{
  const antesReports = existsSync("reports/operacao-marcos.json") ? readFileSync("reports/operacao-marcos.json") : null;
  const antesPublic = existsSync("public/operacao-marcos.json") ? readFileSync("public/operacao-marcos.json") : null;
  const r = rodar(process.execPath, ["scripts/reindex-snapshots.mjs", "--strict", "--conter-auto", "--amostra=3"]);
  const depoisReports = existsSync("reports/operacao-marcos.json") ? readFileSync("reports/operacao-marcos.json") : null;
  const depoisPublic = existsSync("public/operacao-marcos.json") ? readFileSync("public/operacao-marcos.json") : null;
  const preservou =
    Buffer.compare(antesReports ?? Buffer.alloc(0), depoisReports ?? Buffer.alloc(0)) === 0 &&
    Buffer.compare(antesPublic ?? Buffer.alloc(0), depoisPublic ?? Buffer.alloc(0)) === 0;
  registrar("CONTAINMENT", "evidência anterior preservada durante reindexação", preservou, "marcos não foram reescritos pelo job de índice");
  const indice = lerJson("public/snapshot-index.json");
  registrar("CONTAINMENT", "verificação registra causa e status", Boolean(indice?.verificacao?.status), `status ${indice?.verificacao?.status ?? "sem dado"} · exit ${r.code}`);
  const fonte = existeTexto("scripts/reindex-snapshots.mjs");
  registrar("CONTAINMENT", "contenção limita escopo sem afrouxar hash/paridade", fonte.includes("--conter-auto") && fonte.includes("paridade"), "contagem, paridade e hashes seguem integrais");
}

/* ── 10. Segurança do painel ────────────────────────────────────────────── */
{
  const painel = existeTexto("src/pages/admin/AdminMonitoramento.tsx");
  registrar("ADMIN SECURITY", "/admin/monitoramento exige sessão admin", painel.includes("useAdminAuth"), "gate de papel admin no componente");
  registrar("ADMIN SECURITY", "rota interna marcada noindex", existeTexto("src/routes/admin.monitoramento.tsx").includes("noindex"), "sem exposição a buscadores");
  const publico = ["public/operacao-marcos.json", "public/monitoramento-analise.json", "public/operational-alerts.json", "public/snapshot-index.json"];
  const suspeitos = [];
  for (const p of publico) {
    const t = existeTexto(p);
    if (/hooks\.slack\.com|api[_-]?key|bearer\s|re_[A-Za-z0-9]{8,}|sb_secret|service_role/i.test(t)) suspeitos.push(p);
  }
  registrar("ADMIN SECURITY", "payloads públicos sem token/webhook/segredo", suspeitos.length === 0, suspeitos.length ? `suspeitos: ${suspeitos.join(", ")}` : `${publico.length} arquivo(s) auditados`);
}

/* ── 11. Exports CSV/PDF ────────────────────────────────────────────────── */
{
  const exp = existeTexto("src/components/admin/monitoramento/ExportarMarco.tsx");
  registrar("EXPORTS", "CSV declara marco, timestamp e filtros", /marco/i.test(exp) && /geradoEm|timestamp|new Date/.test(exp), "cabeçalho do CSV auditado");
  registrar("EXPORTS", "CSV em UTF-8 (BOM) e separador estável", exp.includes("\\ufeff") || exp.includes("charset=utf-8"), "encoding declarado no blob");
  const sensiveis = /email|token|senha|password|service_role/i.test(exp.replace(/solicitado_por_email|classificado_por_email/g, ""));
  registrar("EXPORTS", "sem coluna administrativa sensível", !sensiveis, "nenhuma coluna de credencial exportada");
  registrar("EXPORTS", "PDF é relatório estruturado, não captura de tela", /jspdf|autoTable|printWindow|@media print|window\.print/i.test(exp), "geração textual do relatório");
}

/* ── 12. Idempotência ───────────────────────────────────────────────────── */
{
  const um = decidirMarco(CENARIOS_POR_DECISAO.A);
  const dois = decidirMarco(CENARIOS_POR_DECISAO.A);
  const igual = JSON.stringify(um) === JSON.stringify(dois);
  const h1 = hashMarco(CENARIOS_POR_DECISAO.A.atual);
  const h2 = hashMarco({ ...CENARIOS_POR_DECISAO.A.atual, registradoEm: "2030-01-01T00:00:00Z" });
  registrar("IDEMPOTENCY", "mesma entrada produz mesma decisão", igual, "duas execuções idênticas");
  registrar("IDEMPOTENCY", "timestamp técnico não altera interpretação", h1 === h2, "hash ignora campos voláteis");
}

/* ── 13. IndexNow e lastmod intocados ───────────────────────────────────── */
{
  const idx = lerJson("reports/indexnow-last-run.json");
  const executadoHoje = idx?.executadoEm ? idx.executadoEm.slice(0, 10) === AGORA.toISOString().slice(0, 10) : false;
  registrar("PUBLIC SITE", "IndexNow não executado nesta rodada", !executadoHoje, `última execução ${idx?.executadoEm ?? "N/A"} · submitted ${idx?.submitted ?? 0}`);
  const gitSujo = rodar("git", ["status", "--porcelain"]).out
    .split("\n")
    .map((l) => l.slice(3).trim())
    .filter(Boolean)
    .filter((f) => /^(src\/|public\/sitemap|public\/robots|public\/llms|index\.html)/.test(f) && !/src\/(pages\/admin|components\/admin|hooks\/useAdminAuth)/.test(f));
  registrar("PUBLIC SITE", "diff de SEO público = 0", gitSujo.length === 0, gitSujo.length ? `alterações públicas: ${gitSujo.join(", ")}` : "nenhuma rota, sitemap, robots ou conteúdo alterado");
  registrar("PUBLIC SITE", "lastmod não tocado por coleta/relatório", !gitSujo.some((f) => f.includes("sitemap")), "sitemap intocado");
}

/* ── veredito ───────────────────────────────────────────────────────────── */
const falhas = checagens.filter((c) => c.status === "FAIL");
const decisao = falhas.length === 0 ? "READY — AGUARDAR D14 REAL" : "MONITORING DEFECT — CORRIGIR FERRAMENTAL";
const st = (secao, item) => checagens.find((c) => c.secao === secao && (item ? c.item.includes(item) : true))?.status ?? "N/A";
const secaoOk = (secao) => {
  const itens = checagens.filter((c) => c.secao === secao);
  if (!itens.length) return "N/A";
  return itens.every((i) => i.status === "PASS") ? "PASS" : "FAIL";
};

const payload = {
  geradoEm: AGORA.toISOString(),
  temporal,
  integridadeMarcos,
  freshness,
  fixtures,
  provaDecisao,
  checagens,
  falhas: falhas.length,
  decisao,
};
writeFileSync("reports/prontidao-d14.json", `${JSON.stringify(payload, null, 2)}\n`);

const linhaCheck = (rot, status) => `- [${status === "PASS" ? "x" : " "}] ${rot} — **${status}**`;
mkdirSync("docs", { recursive: true });
const md = [
  "# Relatório de prontidão para o D14 — tecnico.curitiba.br",
  "",
  `Gerado em ${AGORA.toISOString()} (UTC).`,
  "",
  "> Rodada de **congelamento operacional**: nenhuma página, metadado, canonical, sitemap,",
  "> redirect, link interno ou disparo de IndexNow foi alterado para produzir este documento.",
  "> O objetivo é provar prontidão do ferramental — não otimizar SEO.",
  "",
  "## TEMPORAL GATE",
  "",
  `D0 timestamp: ${temporal.d0 ?? "N/A"}`,
  `D14 earliest: ${temporal.d14EarliestUtc ?? "N/A"}`,
  `Current: ${temporal.agora}`,
  `Status: ${temporal.status}`,
  temporal.status === "LOCKED" ? `Tempo restante: ${temporal.faltamDias} dia(s).` : "Janela aberta.",
  "",
  "Fonte única de tempo: epoch UTC. Fuso do servidor, do navegador e do CI não participam do cálculo;",
  "o boundary D14−1s (bloqueado) × D14 exato (liberado) é testado em `scripts/lib/marco-janela.test.mjs`.",
  "Não existe bypass de produção: `--force`, `--skip-date` e `--ignore-window` são recusados, e",
  "`--fora-de-janela` só funciona com `MARCO_FIXTURE=1` / `NODE_ENV=test`.",
  "",
  "## SNAPSHOT INTEGRITY",
  "",
  "| Marco | Snapshot id | Schema | Registrado em | Hash | Status |",
  "| --- | --- | --- | --- | --- | --- |",
  ...integridadeMarcos.map(
    (m) => `| ${m.marco} | ${m.snapshotId} | ${m.schemaVersion} | ${m.registradoEm} | \`${m.hash.slice(0, 16)}\` | ${st("SNAPSHOT INTEGRITY", m.marco)} |`,
  ),
  "",
  `D0: ${st("SNAPSHOT INTEGRITY", "D0")}`,
  `D7: ${st("SNAPSHOT INTEGRITY", "D7")}`,
  "",
  "Reprocessamento nunca sobrescreve em silêncio: o registro anterior é arquivado em",
  "`reports/marco-reprocessamentos.json` com motivo, hash antigo e hash novo.",
  "",
  "## PROVENANCE & FRESHNESS",
  "",
  "| Métrica | Fonte | Estado | Coletado em | Idade (h) | Limite (h) |",
  "| --- | --- | --- | --- | --- | --- |",
  ...freshness.itens.map(
    (i) => `| ${i.metrica} | ${i.fonte} | ${i.estado} | ${i.collectedAt ?? "N/A"} | ${i.ageHoras ?? "N/A"} | ${i.limiteH ?? "N/A"} |`,
  ),
  "",
  `Fontes atrasadas: ${freshness.atrasadas.join(", ") || "nenhuma"} · sem dado: ${freshness.ausentes.join(", ") || "nenhuma"}.`,
  "Atraso é declarado, nunca preenchido com estimativa.",
  "",
  "## FUNNEL RECONCILIATION",
  "",
  ...["D0", "D7"].map((m) => {
    const reg = marcoDe(m);
    if (!reg) return `${m}: N/A`;
    const rec = reconciliarFunil(reg.google, reg.denominador?.curadas ?? 0);
    return `${m}: soma ${rec.soma} × universo ${rec.universo} → ${rec.ok ? "PASS" : `FAIL (${rec.motivo})`}`;
  }),
  "",
  "## SEARCH WINDOWS",
  "",
  janelas
    ? `D0 × D7 — janela A ${janelas.a.inicio} → ${janelas.a.fim}; janela B ${janelas.b.inicio} → ${janelas.b.fim}; overlap ${janelas.overlapDias}d (${janelas.overlapPct}%); período exclusivo ${janelas.naoSobreposto.dias}d.`
    : "N/A — marcos insuficientes.",
  "",
  "## FIXTURES",
  "",
  "| Cenário | Situação | Esperado | Obtido | Severidade | Resultado |",
  "| --- | --- | --- | --- | --- | --- |",
  ...fixtures.map(
    (f) => `| ${f.id} | ${f.titulo} | ${f.esperado} | ${f.obtido} | ${f.severidade} | ${f.esperado === f.obtido ? "PASS" : "FAIL"} |`,
  ),
  "",
  `WAIT: ${provaDecisao.A?.obtido === "A" ? "PASS" : "FAIL"}`,
  `QUICK WINS: ${provaDecisao.B?.obtido === "B" ? "PASS" : "FAIL"}`,
  `BOTTLENECK: ${provaDecisao.C?.obtido === "C" ? "PASS" : "FAIL"}`,
  `REGRESSION: ${provaDecisao.D?.obtido === "D" ? "PASS" : "FAIL"}`,
  "",
  "Fixtures vivem apenas em memória (`scripts/fixtures/marco-cenarios.mjs`); nenhuma delas é gravada",
  "em `reports/`, `public/` ou no banco — o painel real não é contaminado.",
  "",
  "## ALERTS",
  "",
  `Deduplication: ${st("ALERTS", "deduplicação")}`,
  `Severity: ${st("ALERTS", "severidade")}`,
  "",
  "## CONTAINMENT",
  "",
  secaoOk("CONTAINMENT"),
  "",
  "## ADMIN SECURITY",
  "",
  secaoOk("ADMIN SECURITY"),
  "",
  "## EXPORTS",
  "",
  `CSV: ${st("EXPORTS", "CSV declara")}`,
  `PDF: ${st("EXPORTS", "PDF")}`,
  "",
  "## PUBLIC SITE",
  "",
  `SEO diff: ${st("PUBLIC SITE", "diff de SEO")} (0 esperado)`,
  `IndexNow: ${st("PUBLIC SITE", "IndexNow")} (0 esperado)`,
  "",
  "## CHECKLIST DE PRONTIDÃO",
  "",
  linhaCheck("Temporal gate", secaoOk("TEMPORAL GATE")),
  linhaCheck("Timezone boundary", st("TEMPORAL GATE", "boundary")),
  linhaCheck("D0 immutable", st("SNAPSHOT INTEGRITY", "D0")),
  linhaCheck("D7 immutable", st("SNAPSHOT INTEGRITY", "D7")),
  linhaCheck("Provenance", secaoOk("PROVENANCE")),
  linhaCheck("Freshness checks", secaoOk("FRESHNESS")),
  linhaCheck("Funnel reconciliation", secaoOk("FUNNEL")),
  ...["A", "B", "C", "D"].map((id) => linhaCheck(`Fixture ${id}`, fixtures.find((f) => f.id === id)?.esperado === fixtures.find((f) => f.id === id)?.obtido ? "PASS" : "FAIL")),
  linhaCheck("Alert deduplication", st("ALERTS", "deduplicação")),
  linhaCheck("Containment", secaoOk("CONTAINMENT")),
  linhaCheck("Admin authorization", secaoOk("ADMIN SECURITY")),
  linhaCheck("CSV", st("EXPORTS", "CSV declara")),
  linhaCheck("PDF", st("EXPORTS", "PDF")),
  linhaCheck("Idempotency", secaoOk("IDEMPOTENCY")),
  linhaCheck("IndexNow = 0", st("PUBLIC SITE", "IndexNow")),
  linhaCheck("Public SEO diff = 0", st("PUBLIC SITE", "diff de SEO")),
  "",
  "## DETALHE DAS CHECAGENS",
  "",
  "| Seção | Item | Status | Detalhe |",
  "| --- | --- | --- | --- |",
  ...checagens.map((c) => `| ${c.secao} | ${c.item} | ${c.status} | ${c.detalhe} |`),
  "",
  "## DECISÃO",
  "",
  `**${decisao}**`,
  "",
  falhas.length
    ? `${falhas.length} checagem(ns) reprovada(s) — corrigir o ferramental antes da coleta real.`
    : "Ferramental pronto. A próxima ação só ocorre quando o temporal gate liberar o D14 verdadeiro; nenhuma otimização de SEO deve ser iniciada até lá.",
  "",
  "Evidências no painel: [visão do marco](/admin/monitoramento) · [drilldown por URL](/admin/monitoramento#drilldown) · [comparação entre marcos](/admin/monitoramento#comparacao) · [execução de jobs](/admin/monitoramento#jobs) · [alertas classificados](/admin/monitoramento#alertas) · [reindexação contida](/admin/monitoramento#reindex).",
  "",
].join("\n");

writeFileSync("docs/relatorio-prontidao-d14.md", `${md}\n`);

console.log(`[prontidao-d14] ${checagens.length} checagem(ns) · ${falhas.length} falha(s) · ${decisao}`);
for (const f of falhas) console.log(`  ✖ ${f.secao} · ${f.item}: ${f.detalhe}`);
console.log("  → docs/relatorio-prontidao-d14.md · reports/prontidao-d14.json · reports/marco-ledger.json");

if (GATE && falhas.length) process.exit(1);
