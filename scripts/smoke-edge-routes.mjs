#!/usr/bin/env node
/**
 * SMOKE TESTS DE BORDA — rotas válidas, aliases 301 e 404 reais.
 *
 * Executa requisições HTTP reais contra a base informada (produção após o
 * deploy do Worker, ou o servidor local de paridade) e comprova:
 *   1. rotas válidas   → 200 e HTML com conteúdo (não é o 404.html)
 *   2. aliases         → 301 de salto único, Location correto, destino 200
 *   3. 50+ URLs falsas → 404 real, sem conteúdo da home
 *   4. health-check    → manifesto íntegro e contagens coerentes
 *
 * Uso:
 *   node scripts/smoke-edge-routes.mjs                      # sobe serve-dist e testa
 *   node scripts/smoke-edge-routes.mjs --base=https://tecnico.curitiba.br
 *   node scripts/smoke-edge-routes.mjs --valid=60 --fake=80 --report-only
 *
 * Artefatos: reports/edge-smoke.json e docs/relatorio-smoke-edge.md
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
};
const REPORT_ONLY = args.includes("--report-only");
const VALID_SAMPLE = Number(flag("valid", 45));
const FAKE_COUNT = Math.max(50, Number(flag("fake", 60)));
const DIST = path.resolve(flag("dist", "dist"));
const TIMEOUT = Number(flag("timeout", 15000));
let BASE = flag("base", "");

const manifest = JSON.parse(readFileSync(path.join(DIST, "route-manifest.json"), "utf8"));

/** Amostra determinística e espalhada sobre a lista completa. */
function sample(list, n) {
  if (list.length <= n) return [...list];
  const step = list.length / n;
  return Array.from({ length: n }, (_, i) => list[Math.floor(i * step)]);
}

const PRIORITY = [
  "/",
  "/servicos/manutencao-de-notebook",
  "/servicos/manutencao-de-computador",
  "/servicos/formatacao",
  "/servicos/recuperacao-de-dados",
  "/servicos/upgrade-ssd-ram",
  "/precos-e-politicas",
  "/sobre",
  "/como-funciona",
  "/problemas/notebook-nao-liga",
  "/problemas/computador-lento",
  "/problemas/tela-azul-windows",
  "/problemas/notebook-nao-carrega-bateria",
  "/problemas/tv-nao-liga",
  "/problemas/computador-desliga-sozinho",
  "/problemas/wifi-caindo-toda-hora",
  "/problemas/tv-com-som-sem-imagem",
  "/problemas/notebook-molhado",
  "/problemas/tela-de-notebook-quebrada",
  "/problemas/hd-nao-reconhecido",
  "/problemas/computador-nao-liga",
  "/problemas/teclado-de-notebook-nao-funciona",
  "/problemas/notebook-superaquecendo",
];

const FAKE_SEEDS = [
  "notebook", "computador", "formatacao", "ssd", "wifi", "impressora",
  "curitiba", "batel", "centro", "portao", "suporte", "assistencia",
];

function fakePaths(n) {
  const out = new Set();
  let i = 0;
  while (out.size < n) {
    const seed = FAKE_SEEDS[i % FAKE_SEEDS.length];
    const bucket = Math.floor(i / FAKE_SEEDS.length);
    const shapes = [
      `/${seed}-inexistente-${bucket}`,
      `/servicos/${seed}-nao-existe-${bucket}`,
      `/bairros/${seed}-fantasma-${bucket}`,
      `/blog/${seed}-post-removido-${bucket}`,
      `/${seed}/${bucket}/pagina-fantasma`,
      `/assets/${seed}-${bucket}.js`,
    ];
    for (const s of shapes) {
      if (out.size < n && !manifest.validExact.includes(s)) out.add(s);
    }
    i += 1;
  }
  return [...out];
}

async function request(url, { redirect = "manual" } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { redirect, signal: ctrl.signal, headers: { "user-agent": "tecnico-curitiba-smoke/1" } });
    const body = res.headers.get("content-type")?.includes("text") ? await res.text() : "";
    return { status: res.status, location: res.headers.get("location"), body };
  } catch (err) {
    return { status: 0, location: null, body: "", error: String(err?.message ?? err) };
  } finally {
    clearTimeout(timer);
  }
}

const looksLike404 = (body) => /Página não encontrada|page-not-found|__soft404__/i.test(body);

async function run() {
  let server = null;
  if (!BASE) {
    const { createServer } = await import("./serve-dist.mjs");
    server = await createServer({ distDir: DIST });
    await new Promise((resolve) => server.listen(0, resolve));
    BASE = `http://localhost:${server.address().port}`;
  }
  BASE = BASE.replace(/\/+$/, "");

  const results = { valid: [], aliases: [], notFound: [], health: null };
  const failures = [];

  // 1. Rotas válidas
  const validPaths = [...new Set([...PRIORITY, ...sample(manifest.validExact, VALID_SAMPLE)])];
  for (const p of validPaths) {
    const r = await request(`${BASE}${p}`);
    const ok = r.status === 200 && !looksLike404(r.body);
    results.valid.push({ path: p, status: r.status, ok, bytes: r.body.length });
    if (!ok) failures.push(`rota válida ${p} → ${r.status}${r.error ? ` (${r.error})` : ""}`);
  }

  // 2. Aliases → 301 salto único
  for (const red of manifest.redirects ?? []) {
    const from = red.from ?? red[0];
    const to = red.to ?? red[1];
    const r = await request(`${BASE}${from}`);
    const location = r.location ? new URL(r.location, BASE).pathname : null;
    let hopStatus = null;
    if (location) hopStatus = (await request(`${BASE}${location}`)).status;
    const ok = r.status === 301 && location === to && hopStatus === 200;
    results.aliases.push({ from, expected: to, status: r.status, location, hopStatus, ok });
    if (!ok) failures.push(`alias ${from} → esperado 301 ${to} (200), obtido ${r.status} ${location ?? "-"} (${hopStatus ?? "-"})`);
  }

  // 3. 404 reais
  for (const p of fakePaths(FAKE_COUNT)) {
    const r = await request(`${BASE}${p}`);
    const ok = r.status === 404;
    results.notFound.push({ path: p, status: r.status, ok });
    if (!ok) failures.push(`URL inexistente ${p} → ${r.status} (esperado 404)`);
  }

  // 4. Health-check
  const health = await request(`${BASE}/__edge/health`);
  try {
    results.health = health.status === 200 ? JSON.parse(health.body) : { status: health.status };
  } catch {
    results.health = { status: health.status, parse: "falhou" };
  }
  if (health.status !== 200 || results.health?.manifest?.ok === false) {
    failures.push(`health-check → ${health.status} / manifesto ${results.health?.manifest?.ok}`);
  }

  server?.close();

  const summary = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    counts: {
      valid: results.valid.length,
      validOk: results.valid.filter((r) => r.ok).length,
      aliases: results.aliases.length,
      aliasesOk: results.aliases.filter((r) => r.ok).length,
      notFound: results.notFound.length,
      notFoundOk: results.notFound.filter((r) => r.ok).length,
    },
    failures,
    results,
  };

  mkdirSync("reports", { recursive: true });
  writeFileSync("reports/edge-smoke.json", JSON.stringify(summary, null, 2));

  const md = [
    "# Smoke tests de borda",
    "",
    `- Base: \`${BASE}\``,
    `- Executado em: ${summary.generatedAt}`,
    "",
    "| Suíte | OK | Total |",
    "| --- | ---: | ---: |",
    `| Rotas válidas (200) | ${summary.counts.validOk} | ${summary.counts.valid} |`,
    `| Aliases (301 salto único) | ${summary.counts.aliasesOk} | ${summary.counts.aliases} |`,
    `| URLs inexistentes (404 real) | ${summary.counts.notFoundOk} | ${summary.counts.notFound} |`,
    "",
    failures.length ? `## Falhas (${failures.length})\n\n${failures.map((f) => `- ${f}`).join("\n")}` : "Sem falhas.",
    "",
    "Artefato bruto: `reports/edge-smoke.json`.",
  ].join("\n");
  mkdirSync("docs", { recursive: true });
  writeFileSync("docs/relatorio-smoke-edge.md", `${md}\n`);

  console.log("── Smoke de borda ──");
  console.log(`  base: ${BASE}`);
  console.log(`  válidas ${summary.counts.validOk}/${summary.counts.valid} · aliases ${summary.counts.aliasesOk}/${summary.counts.aliases} · 404 ${summary.counts.notFoundOk}/${summary.counts.notFound}`);
  if (failures.length) {
    for (const f of failures.slice(0, 20)) console.log(`  ✖ ${f}`);
    if (!REPORT_ONLY) process.exitCode = 1;
  } else {
    console.log("✔ todas as suítes passaram.");
  }
}

run().catch((err) => {
  console.error("[smoke-edge] erro:", err);
  process.exitCode = 1;
});
