#!/usr/bin/env node
/**
 * ============================================================================
 * NOTIFICAÇÃO DE DECISÃO DE MARCO — INVESTIGATE / REGRESSION
 * ============================================================================
 * Lê a decisão produzida por `report:monitoramento` (public/monitoramento-analise.json)
 * e notifica APENAS quando o marco terminar em INVESTIGATE ou REGRESSION.
 * WAIT é silêncio por design: alerta que dispara todo dia deixa de ser alerta.
 *
 * Canais (opcionais, todos por variável de ambiente):
 *   SEO_ALERTS_WEBHOOK   webhook Slack-compatível
 *   SEO_ALERTS_EMAIL     destinatário; exige RESEND_API_KEY
 *
 * Antirruído: a assinatura (marco + decisão + URLs afetadas) é persistida em
 * reports/marco-decision-notify.json; assinatura repetida não reenvia.
 *
 * Uso:
 *   node scripts/notify-marco-decision.mjs            # avalia e imprime
 *   node scripts/notify-marco-decision.mjs --notify   # envia se mudou
 *   node scripts/notify-marco-decision.mjs --notify --force
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { registrarJob } from "./lib/job-log.mjs";

const inicio = Date.now();
const args = process.argv.slice(2);
const NOTIFY = args.includes("--notify");
const FORCE = args.includes("--force");
const ESTADO = "reports/marco-decision-notify.json";
const PAINEL = "https://tecnico.curitiba.br/admin/monitoramento";
const ACIONAVEIS = new Set(["INVESTIGATE", "REGRESSION"]);

const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

const analise = lerJson("public/monitoramento-analise.json") ?? lerJson("reports/monitoramento-analise.json");
if (!analise) {
  console.log("[notify-marco] N/A — sem análise de marco; rode `npm run report:monitoramento` antes.");
  process.exit(0);
}

const marco = analise.marcoAtual ?? "N/A";
const bloco = analise.decisaoD14 ?? analise.decisaoD7 ?? analise.decisao ?? null;
const decisao = (bloco?.decisao ?? bloco?.valor ?? "N/A").toString().toUpperCase();
const justificativa = bloco?.justificativa ?? bloco?.motivo ?? null;

/** URLs afetadas: Tier A sem indexação + crawled-not-indexed + clusters em queda. */
const afetadas = [
  ...(analise.tierANaoIndexadas ?? []).map((u) => ({
    path: u.path ?? u.url ?? String(u),
    motivo: u.causa ?? u.diagnostico ?? "Tier A não indexada",
    cluster: u.cluster ?? null,
  })),
  ...(analise.crawledNotIndexed ?? []).map((u) => ({
    path: u.path ?? u.url ?? String(u),
    motivo: "rastreada e não indexada",
    cluster: u.cluster ?? null,
  })),
].slice(0, 25);

const linkPainel = (u) =>
  `${PAINEL}?url=${encodeURIComponent(u.path)}${u.cluster ? `&cluster=${encodeURIComponent(u.cluster)}` : ""}`;

const acionavel = ACIONAVEIS.has(decisao);
const assinatura = createHash("sha1")
  .update(JSON.stringify({ marco, decisao, afetadas: afetadas.map((a) => a.path) }))
  .digest("hex");
const anterior = lerJson(ESTADO);
const repetida = anterior?.assinatura === assinatura;

const titulo = `[${marco}] decisão ${decisao} — tecnico.curitiba.br`;
const corpoTexto = [
  titulo,
  justificativa ? `Justificativa: ${justificativa}` : null,
  `Tier A indexadas: ${analise.tierA?.indexadas ?? "sem dado"}/${analise.tierA?.total ?? "sem dado"}`,
  `Funil: indexadas ${analise.funil?.indexed ?? "sem dado"} · unknown ${analise.funil?.unknown ?? "sem dado"} · discovered ${analise.funil?.discovered ?? "sem dado"} · crawled-not-indexed ${analise.funil?.crawled_not_indexed ?? "sem dado"}`,
  "",
  afetadas.length ? "URLs afetadas:" : "Nenhuma URL individual associada à decisão.",
  ...afetadas.map((u) => `• ${u.path} — ${u.motivo} → ${linkPainel(u)}`),
  "",
  `Painel completo: ${PAINEL}`,
].filter(Boolean).join("\n");

const resultado = {
  avaliadoEm: new Date().toISOString(),
  marco,
  decisao,
  acionavel,
  assinatura,
  repetida,
  notificado: false,
  canais: [],
  erros: [],
  urlsAfetadas: afetadas.map((u) => ({ ...u, painel: linkPainel(u) })),
};

async function enviarWebhook() {
  const url = process.env.SEO_ALERTS_WEBHOOK;
  if (!url) return resultado.canais.push({ canal: "webhook", status: "N/A — SEO_ALERTS_WEBHOOK ausente" });
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: corpoTexto }),
    });
    resultado.canais.push({ canal: "webhook", status: r.ok ? "enviado" : `falhou ${r.status}` });
    if (!r.ok) resultado.erros.push(`webhook ${r.status}`);
  } catch (e) {
    resultado.canais.push({ canal: "webhook", status: "falhou" });
    resultado.erros.push(`webhook: ${e.message}`);
  }
}

async function enviarEmail() {
  const para = process.env.SEO_ALERTS_EMAIL;
  const key = process.env.RESEND_API_KEY;
  if (!para || !key)
    return resultado.canais.push({ canal: "email", status: "N/A — SEO_ALERTS_EMAIL/RESEND_API_KEY ausentes" });
  const html = [
    `<h2>${titulo}</h2>`,
    justificativa ? `<p>${justificativa}</p>` : "",
    `<p>Tier A: ${analise.tierA?.indexadas ?? "sem dado"}/${analise.tierA?.total ?? "sem dado"}</p>`,
    afetadas.length
      ? `<ul>${afetadas.map((u) => `<li><a href="${linkPainel(u)}">${u.path}</a> — ${u.motivo}</li>`).join("")}</ul>`
      : "<p>Nenhuma URL individual associada à decisão.</p>",
    `<p><a href="${PAINEL}">Abrir painel de monitoramento</a></p>`,
  ].join("");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: "Monitoramento <alertas@tecnico.curitiba.br>",
        to: [para],
        subject: titulo,
        html,
      }),
    });
    resultado.canais.push({ canal: "email", status: r.ok ? "enviado" : `falhou ${r.status}` });
    if (!r.ok) resultado.erros.push(`email ${r.status}`);
  } catch (e) {
    resultado.canais.push({ canal: "email", status: "falhou" });
    resultado.erros.push(`email: ${e.message}`);
  }
}

const deveEnviar = NOTIFY && acionavel && (!repetida || FORCE);

if (deveEnviar) {
  await enviarWebhook();
  await enviarEmail();
  resultado.notificado = resultado.canais.some((c) => c.status === "enviado");
} else {
  console.log(
    acionavel
      ? repetida
        ? `[notify-marco] ${marco}=${decisao} já notificado (assinatura idêntica); use --force para reenviar.`
        : `[notify-marco] ${marco}=${decisao} acionável — rode com --notify para enviar.`
      : `[notify-marco] ${marco}=${decisao} — silêncio por design (só INVESTIGATE/REGRESSION notificam).`,
  );
}

mkdirSync("reports", { recursive: true });
mkdirSync("public", { recursive: true });
const payload = `${JSON.stringify(resultado, null, 2)}\n`;
writeFileSync(ESTADO, payload);
writeFileSync("public/marco-decision-notify.json", payload);

if (deveEnviar) console.log(`[notify-marco] ${marco}=${decisao} · ${resultado.canais.map((c) => `${c.canal}:${c.status}`).join(" · ")}`);

registrarJob({
  job: "notify:marco",
  marco: marco === "N/A" ? null : marco,
  duracaoMs: Date.now() - inicio,
  status: resultado.erros.length ? "falhou" : acionavel ? "aviso" : "ok",
  failClosed: resultado.erros.length === 0,
  contagens: { urlsAfetadas: afetadas.length, canais: resultado.canais.length },
  logs: [`decisão ${decisao}`, ...resultado.canais.map((c) => `${c.canal}: ${c.status}`), ...resultado.erros],
});

if (args.includes("--gate") && resultado.erros.length) process.exit(1);
