#!/usr/bin/env node
/**
 * SOLICITAÇÃO AUTOMÁTICA DE RECRAWL para toda rota APTA nos gates.
 *
 * Lê `public/route-gate-status.json` e dispara, para cada URL apta:
 *   • IndexNow (Bing/Yandex/Seznam) — requer INDEXNOW_KEY;
 *   • Google Indexing API          — requer GOOGLE_INDEXING_SA_JSON
 *                                    (service account com acesso ao GSC).
 *
 * Cada tentativa é registrada em reports/indexing-requests.json com o
 * resultado por rota (histórico append-only, sem dado sensível).
 *
 * Uso:
 *   node scripts/request-indexing.mjs              # só rotas aptas ainda não pedidas hoje
 *   node scripts/request-indexing.mjs --force      # reenvia todas as aptas
 *   node scripts/request-indexing.mjs --dry-run
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createSign } from "node:crypto";
import { BASE_URL } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY = args.includes("--dry-run");

const STATUS = "public/route-gate-status.json";
const HISTORY = "reports/indexing-requests.json";

if (!existsSync(STATUS)) {
  console.error(`✗ ${STATUS} ausente. Rode antes: npm run report:route-gates`);
  process.exit(1);
}

const status = JSON.parse(readFileSync(STATUS, "utf8"));
const history = existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : { runs: [], porRota: {} };

const hoje = new Date().toISOString().slice(0, 10);
const aptas = status.rotas.filter((r) => r.apta).map((r) => `${BASE_URL}${r.path}`);
const alvo = FORCE ? aptas : aptas.filter((url) => history.porRota[url]?.ultimoPedido?.slice(0, 10) !== hoje);

console.log(`── request:indexing ── ${aptas.length} apta(s) · ${alvo.length} a solicitar${DRY ? " (dry-run)" : ""}`);
if (alvo.length === 0) process.exit(0);

const resultados = [];

/** IndexNow: um único POST em lote. */
async function indexNow(urls) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return { engine: "indexnow", skipped: "INDEXNOW_KEY ausente" };
  if (DRY) return { engine: "indexnow", dryRun: true, urls: urls.length };
  const host = new URL(BASE_URL).host;
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${BASE_URL}/${key}.txt`, urlList: urls }),
  });
  return { engine: "indexnow", status: res.status, ok: res.ok, urls: urls.length };
}

/** Google Indexing API: token JWT assinado com a service account. */
async function googleToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const claim = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })}`;
  const sig = createSign("RSA-SHA256").update(claim).end().sign(sa.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${claim}.${sig}` }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  return (await res.json()).access_token;
}

async function googleIndexing(urls) {
  const raw = process.env.GOOGLE_INDEXING_SA_JSON;
  if (!raw) return [{ engine: "google", skipped: "GOOGLE_INDEXING_SA_JSON ausente" }];
  if (DRY) return [{ engine: "google", dryRun: true, urls: urls.length }];
  const sa = JSON.parse(raw);
  const token = await googleToken(sa);
  const out = [];
  for (const url of urls) {
    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });
    out.push({ engine: "google", url, status: res.status, ok: res.ok });
    await new Promise((r) => setTimeout(r, 200));
  }
  return out;
}

resultados.push(await indexNow(alvo));
resultados.push(...(await googleIndexing(alvo)));

const run = { at: new Date().toISOString(), urls: alvo.length, dryRun: DRY, resultados };
history.runs = [run, ...(history.runs ?? [])].slice(0, 200);
for (const url of alvo) {
  const porRota = history.porRota[url] ?? { pedidos: 0 };
  const google = resultados.find((r) => r.url === url);
  history.porRota[url] = {
    pedidos: porRota.pedidos + 1,
    ultimoPedido: run.at,
    indexnow: resultados.find((r) => r.engine === "indexnow") ?? null,
    google: google ?? resultados.find((r) => r.engine === "google" && r.skipped) ?? null,
  };
}

mkdirSync("reports", { recursive: true });
writeFileSync(HISTORY, `${JSON.stringify(history, null, 2)}\n`);

for (const r of resultados.slice(0, 5)) console.log("  ", JSON.stringify(r));
console.log(`✓ histórico atualizado em ${HISTORY}`);
