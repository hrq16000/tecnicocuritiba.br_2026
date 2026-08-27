#!/usr/bin/env node
/**
 * INDEXNOW — SUBMISSÃO SELETIVA POR MUDANÇA REAL
 *
 * Diferente de `indexnow-ping.mjs` (envia o sitemap inteiro), este script
 * envia SOMENTE URLs cujo conteúdo relevante para busca mudou desde a última
 * submissão. O estado fica em `reports/indexnow-manifest.json`:
 *
 *   { "<path>": { hash, lastSubmitted, submissions } }
 *
 * O hash cobre apenas sinais de busca extraídos do HTML servido
 * (title, description, canonical, robots, headings, texto do <main>), então
 * mudanças de build, hash de asset ou markup de layout não geram ruído.
 *
 * Uso:
 *   node scripts/indexnow-submit.mjs              # diff e envio
 *   node scripts/indexnow-submit.mjs --dry-run    # só mostra o que enviaria
 *   node scripts/indexnow-submit.mjs --all        # primeira submissão (baseline)
 *   node scripts/indexnow-submit.mjs --limit 50
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const forceAll = args.includes("--all");
const limit = Number(args[args.indexOf("--limit") + 1]) || 10000;

if (!dryRun) exitIfLocalMode("IndexNow", "submissão seletiva");

const HOST = process.env.INDEXNOW_HOST || "tecnico.curitiba.br";
const BASE = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || "85fad1bb57c44507a97ed5bc051f6da8";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const MANIFEST = resolve("reports/indexnow-manifest.json");

// Key file precisa existir em public/ para o endpoint validar a autoria.
if (!existsSync(resolve("public", `${KEY}.txt`))) {
  console.error(`[indexnow] key file public/${KEY}.txt ausente — abortando (endpoint rejeitaria a chave).`);
  process.exit(1);
}

const publicDir = resolve("public");
const paths = new Set();
for (const file of readdirSync(publicDir).filter(
  (f) => f.startsWith("sitemap-") && f.endsWith(".xml") && f !== "sitemap-index.xml" && f !== "sitemap-images.xml",
)) {
  const xml = readFileSync(resolve(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) paths.add(m[1].trim().replace(BASE, "") || "/");
}

/** Extrai só os sinais que interessam a um buscador e devolve o hash. */
function seoHash(html) {
  const pick = (re) => (html.match(re)?.[1] ?? "").trim();
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? html;
  const texto = main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const headings = [...main.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .join("|");
  const partes = [
    pick(/<title>([\s\S]*?)<\/title>/i),
    pick(/name="description"\s+content="([^"]*)"/i),
    pick(/rel="canonical"\s+href="([^"]*)"/i),
    pick(/name="robots"\s+content="([^"]*)"/i),
    headings,
    texto,
  ];
  return createHash("sha1").update(partes.join("\u0000")).digest("hex");
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const lista = [...paths].sort();
const atualizado = {};
const mudadas = [];
const novas = [];
const falhas = [];

const queue = [...lista];
async function worker() {
  while (queue.length) {
    const path = queue.shift();
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
      if (res.status !== 200) {
        falhas.push(`${path} → HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
        falhas.push(`${path} → noindex (não submetida)`);
        continue;
      }
      const hash = seoHash(html);
      const anterior = manifest[path];
      atualizado[path] = {
        hash,
        lastSubmitted: anterior?.lastSubmitted ?? null,
        submissions: anterior?.submissions ?? 0,
      };
      if (!anterior) novas.push(path);
      else if (anterior.hash !== hash) mudadas.push(path);
    } catch (e) {
      falhas.push(`${path} → ${String(e).slice(0, 80)}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const enviar = (forceAll ? Object.keys(atualizado) : [...novas, ...mudadas]).slice(0, limit);
console.log(
  `[indexnow] ${lista.length} URL(s) no sitemap · ${novas.length} nova(s) · ${mudadas.length} alterada(s) · ${falhas.length} ignorada(s)`,
);
for (const f of falhas.slice(0, 15)) console.log(`  · ignorada ${f}`);

/** Evidência para o painel operacional: sempre registrada, inclusive no no-op. */
function registrarExecucao(extra) {
  mkdirSync("reports", { recursive: true });
  const registro = {
    executadoEm: new Date().toISOString(),
    host: HOST,
    modo: dryRun ? "dry-run" : forceAll ? "baseline" : "incremental",
    eligible: lista.length,
    novas,
    mudadas,
    submitted: 0,
    accepted: 0,
    failed: 0,
    ignoradas: falhas,
    ...extra,
  };
  writeFileSync("reports/indexnow-last-run.json", JSON.stringify(registro, null, 2));
  const histPath = "reports/indexnow-history.json";
  const hist = existsSync(histPath) ? JSON.parse(readFileSync(histPath, "utf8")) : [];
  hist.push({
    executadoEm: registro.executadoEm,
    modo: registro.modo,
    eligible: registro.eligible,
    submitted: registro.submitted,
    accepted: registro.accepted,
    failed: registro.failed,
  });
  writeFileSync(histPath, JSON.stringify(hist.slice(-180), null, 2));
  return registro;
}

if (enviar.length === 0) {
  console.log("[indexnow] nada mudou — nenhuma submissão (evita ruído de ping repetido).");
  if (!dryRun) writeFileSync(MANIFEST, JSON.stringify(atualizado, null, 2));
  registrarExecucao({});
  process.exit(0);
}

if (dryRun) {
  registrarExecucao({ submitted: 0, elegiveisParaEnvio: enviar.length });
  console.log(`[indexnow] --dry-run: submeteria ${enviar.length} URL(s):`);
  for (const p of enviar.slice(0, 40)) console.log(`  → ${p}`);
  process.exit(0);
}

const agora = new Date().toISOString();
let ok = true;
let aceitas = 0;
let falhou = 0;
for (let i = 0; i < enviar.length; i += 1000) {
  const chunk = enviar.slice(i, i + 1000);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${BASE}/${KEY}.txt`,
      urlList: chunk.map((p) => `${BASE}${p}`),
    }),
  });
  console.log(`[indexnow] ${res.status} ${res.statusText} — ${chunk.length} URL(s)`);
  if (!res.ok) {
    ok = false;
    falhou += chunk.length;
    console.error(await res.text());
    continue;
  }
  aceitas += chunk.length;
  for (const p of chunk) {
    atualizado[p].lastSubmitted = agora;
    atualizado[p].submissions += 1;
  }
}

mkdirSync("reports", { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(atualizado, null, 2));
registrarExecucao({
  executadoEm: agora,
  enviadas: enviar.length,
  submitted: enviar.length,
  accepted: aceitas,
  failed: falhou,
});
if (!ok) process.exit(1);
