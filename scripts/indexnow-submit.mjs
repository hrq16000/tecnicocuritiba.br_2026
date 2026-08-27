#!/usr/bin/env node
/**
 * INDEXNOW — SUBMISSÃO SELETIVA POR MUDANÇA REAL
 *
 * Envia SOMENTE URLs cujo conteúdo relevante para busca mudou desde a última
 * submissão. O estado fica em `reports/indexnow-manifest.json`:
 *
 *   { "<path>": { hash, lastmod, lastSubmitted, submissions } }
 *
 * Ordem de decisão (toda ela em scripts/lib/indexnow-core.mjs, testada):
 *   1. gate de `lastmod`: URL já submetida com o mesmo lastmod é pulada —
 *      nem fetch de HTML, nem ping;
 *   2. para o restante, diff do hash de sinais de busca do HTML servido
 *      (title, description, canonical, robots, headings, texto do <main>);
 *   3. POST no endpoint com retry e backoff exponencial (nada falha calado).
 *
 * Uso:
 *   node scripts/indexnow-submit.mjs              # diff e envio
 *   node scripts/indexnow-submit.mjs --dry-run    # mostra o que enviaria e por quê
 *   node scripts/indexnow-submit.mjs --all        # primeira submissão (baseline)
 *   node scripts/indexnow-submit.mjs --recheck    # ignora o atalho de lastmod
 *   node scripts/indexnow-submit.mjs --limit 50
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exitIfLocalMode } from "./lib/local-mode.mjs";
import { MOTIVOS, diagnosticar, planejar, postComRetry } from "./lib/indexnow-core.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const forceAll = args.includes("--all");
const recheck = args.includes("--recheck");
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
// path → lastmod declarado no sitemap (pode ser null quando ausente).
const lastmodPorPath = new Map();
for (const file of readdirSync(publicDir).filter(
  (f) => f.startsWith("sitemap-") && f.endsWith(".xml") && f !== "sitemap-index.xml" && f !== "sitemap-images.xml",
)) {
  const xml = readFileSync(resolve(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const bloco = m[1];
    const loc = bloco.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const path = loc.replace(BASE, "") || "/";
    const lastmod = bloco.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? null;
    // Mantém o lastmod mais recente caso a URL apareça em mais de um sitemap.
    const atual = lastmodPorPath.get(path);
    if (atual === undefined || (lastmod && (!atual || lastmod > atual))) lastmodPorPath.set(path, lastmod);
  }
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const paths = [...lastmodPorPath.keys()];

const { fila, puladas, atualizado } = planejar({ paths, lastmodPorPath, manifest, forceAll, recheck });
const { novas, mudadas, iguais, falhas } = await diagnosticar({
  fila,
  manifest,
  base: BASE,
  atualizado,
});

const candidatas = forceAll
  ? Object.keys(atualizado).map((path) => ({ path, lastmod: lastmodPorPath.get(path) ?? null, motivo: MOTIVOS.FORCE_ALL }))
  : [...novas, ...mudadas];
const enviar = candidatas.slice(0, limit);

console.log(
  `[indexnow] ${paths.length} URL(s) no sitemap · ${novas.length} nova(s) · ${mudadas.length} alterada(s) · ${iguais.length} sem mudança de conteúdo · ${puladas.length} puladas por lastmod · ${falhas.length} ignorada(s)`,
);
for (const f of falhas.slice(0, 15)) console.log(`  · ignorada ${f.path} → ${f.motivo}`);

const modo = dryRun ? "dry-run" : forceAll ? "baseline" : recheck ? "recheck" : "incremental";
const iniciadoEm = new Date().toISOString();

/**
 * Relatório por deploy: contagens + motivo por URL.
 * `reports/indexnow-report.json`  → artefato de CI
 * `public/indexnow-status.json`   → consumido por /admin/indexnow-status
 */
function gravarRelatorio({ enviadas = [], aceitas = 0, falhouEnvio = 0, chunks = [], erros = [] }) {
  const registro = {
    executadoEm: new Date().toISOString(),
    iniciadoEm,
    host: HOST,
    modo,
    dryRun,
    totais: {
      sitemap: paths.length,
      novas: novas.length,
      alteradas: mudadas.length,
      puladasPorLastmod: puladas.length,
      puladasPorConteudo: iguais.length,
      ignoradas: falhas.length,
      candidatas: candidatas.length,
      enviadas: enviadas.length,
      aceitas,
      falhas: falhouEnvio,
    },
    urls: {
      novas: novas.map(({ path, lastmod, motivo }) => ({ path, lastmod, motivo })),
      alteradas: mudadas.map(({ path, lastmod, motivo }) => ({ path, lastmod, motivo })),
      puladas: puladas.map(({ path, lastmod, motivo }) => ({ path, lastmod, motivo })),
      inalteradas: iguais.map(({ path, lastmod, motivo }) => ({ path, lastmod, motivo })),
      ignoradas: falhas,
      enviadas: enviadas.map((p) => (typeof p === "string" ? p : p.path)),
    },
    chunks,
    erros,
  };

  mkdirSync("reports", { recursive: true });
  mkdirSync("public", { recursive: true });
  writeFileSync("reports/indexnow-last-run.json", JSON.stringify(registro, null, 2));
  writeFileSync("reports/indexnow-report.json", JSON.stringify(registro, null, 2));

  const histPath = "reports/indexnow-history.json";
  const hist = existsSync(histPath) ? JSON.parse(readFileSync(histPath, "utf8")) : [];
  hist.push({
    executadoEm: registro.executadoEm,
    modo,
    dryRun,
    ...registro.totais,
    erros: erros.length,
  });
  const historico = hist.slice(-180);
  writeFileSync(histPath, JSON.stringify(historico, null, 2));

  writeFileSync(
    "public/indexnow-status.json",
    JSON.stringify({ atualizadoEm: registro.executadoEm, ultimaExecucao: registro, historico: historico.slice(-60) }, null, 2),
  );
  return registro;
}

if (dryRun) {
  gravarRelatorio({});
  console.log(`[indexnow] --dry-run: submeteria ${enviar.length} URL(s) (nenhum ping enviado).`);
  for (const item of enviar.slice(0, 60)) console.log(`  → ${item.path}  [${item.motivo}]  lastmod=${item.lastmod ?? "—"}`);
  console.log(`[indexnow] --dry-run: ${puladas.length} pulada(s) por lastmod inalterado, ${iguais.length} sem mudança de conteúdo.`);
  for (const item of puladas.slice(0, 20)) console.log(`  · pulada ${item.path}  [${item.motivo}]  lastmod=${item.lastmod ?? "—"}`);
  process.exit(0);
}

if (enviar.length === 0) {
  console.log("[indexnow] nada mudou — nenhuma submissão (evita ruído de ping repetido).");
  writeFileSync(MANIFEST, JSON.stringify(atualizado, null, 2));
  gravarRelatorio({});
  process.exit(0);
}

const agora = new Date().toISOString();
let aceitas = 0;
let falhouEnvio = 0;
const chunksLog = [];
const erros = [];

for (let i = 0; i < enviar.length; i += 1000) {
  const chunk = enviar.slice(i, i + 1000);
  const resultado = await postComRetry({
    endpoint: ENDPOINT,
    payload: {
      host: HOST,
      key: KEY,
      keyLocation: `${BASE}/${KEY}.txt`,
      urlList: chunk.map((c) => `${BASE}${c.path}`),
    },
    onRetry: ({ tentativa, espera, erro }) =>
      console.warn(`[indexnow] tentativa ${tentativa} falhou (${erro}) — novo envio em ${espera}ms`),
  });

  chunksLog.push({ urls: chunk.length, status: resultado.status, tentativas: resultado.tentativas, ok: resultado.ok });
  console.log(`[indexnow] chunk de ${chunk.length} URL(s) → HTTP ${resultado.status} em ${resultado.tentativas} tentativa(s)`);

  if (!resultado.ok) {
    falhouEnvio += chunk.length;
    erros.push({ chunk: chunksLog.length, status: resultado.status, tentativas: resultado.tentativas, erro: resultado.erro });
    console.error(`[indexnow] FALHA definitiva no chunk ${chunksLog.length}: ${resultado.erro}`);
    continue;
  }

  aceitas += chunk.length;
  for (const { path } of chunk) {
    atualizado[path].lastSubmitted = agora;
    atualizado[path].submissions += 1;
  }
}

mkdirSync("reports", { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(atualizado, null, 2));
gravarRelatorio({ enviadas: enviar, aceitas, falhouEnvio, chunks: chunksLog, erros });

if (erros.length) {
  console.error(`[indexnow] ${erros.length} chunk(s) falharam após retry — saindo com erro (nunca falhar em silêncio).`);
  process.exit(1);
}
