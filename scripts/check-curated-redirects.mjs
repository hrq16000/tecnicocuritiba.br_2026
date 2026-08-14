#!/usr/bin/env node
/**
 * GATE DE ROTAS CURADAS — 301/308, cadeias, 404 e loops (roda no CI antes de publicar).
 *
 * Para CADA URL curada (scripts/lib/curated-urls.mjs) valida contra a rede:
 *   1. a URL canônica responde 200 (nunca 404, nunca 5xx);
 *   2. quando responde 3xx, aceita apenas 301/308 e exige salto único até 200;
 *   3. nenhuma cadeia com mais de MAX_SALTOS saltos;
 *   4. nenhum loop de redirect;
 *   5. destino final sempre em HTTPS e no domínio canônico.
 *
 * Uso:
 *   node scripts/check-curated-redirects.mjs                      # gate (falha o CI)
 *   node scripts/check-curated-redirects.mjs --report             # relatório (exit 0)
 *   node scripts/check-curated-redirects.mjs --base=https://...   # outro ambiente
 *   node scripts/check-curated-redirects.mjs --limit=50           # amostra
 *
 * Saídas: reports/curated-redirects.json · reports/curated-redirects.md
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { BASE_URL, CURATED_PATHS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const arg = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=") ?? null;
const BASE = (arg("base") ?? BASE_URL).replace(/\/$/, "");
const LIMIT = Number(arg("limit") || 0);
const CONCURRENCY = Number(arg("concurrency") || 8);
const MAX_SALTOS = 1;

const paths = [...new Set(CURATED_PATHS)];
const alvo = LIMIT > 0 ? paths.slice(0, LIMIT) : paths;

const hop = async (url) => {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "curated-redirect-gate" } });
  return { status: res.status, location: res.headers.get("location") ?? "" };
};

async function verificar(path) {
  const origin = `${BASE}${path}`;
  const row = { path, origin, chain: [], hops: 0, finalUrl: origin, finalStatus: null, error: "" };
  try {
    let current = origin;
    const vistos = new Set([current]);
    for (let i = 0; i <= MAX_SALTOS + 1; i++) {
      const step = await hop(current);
      row.finalStatus = step.status;
      if (![301, 302, 307, 308].includes(step.status)) break;

      const destino = new URL(step.location || "/", current).href;
      row.chain.push(`${step.status} ${current} → ${destino}`);
      row.hops++;
      if (![301, 308].includes(step.status)) row.error ||= `redirect ${step.status} (use 301/308)`;
      if (vistos.has(destino)) {
        row.error = "loop de redirect";
        break;
      }
      if (!destino.startsWith("https://")) row.error ||= "destino não HTTPS";
      if (!destino.startsWith(BASE)) row.error ||= `destino fora do domínio canônico: ${destino}`;
      vistos.add(destino);
      current = destino;
      row.finalUrl = destino;
      if (row.hops > MAX_SALTOS) {
        row.error ||= `cadeia de ${row.hops} saltos (máximo ${MAX_SALTOS})`;
        break;
      }
    }
    if (row.finalStatus === 404) row.error ||= "404 em rota curada";
    else if (row.finalStatus !== 200 && ![301, 308].includes(row.finalStatus)) {
      row.error ||= `status final ${row.finalStatus}`;
    } else if (row.finalStatus !== 200 && row.hops > MAX_SALTOS) {
      row.error ||= "não chegou a 200";
    }
  } catch (e) {
    row.error = `erro de rede: ${e.message}`;
  }
  return row;
}

const results = [];
for (let i = 0; i < alvo.length; i += CONCURRENCY) {
  results.push(...(await Promise.all(alvo.slice(i, i + CONCURRENCY).map(verificar))));
}

const falhas = results.filter((r) => r.error);
const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  totalCurated: paths.length,
  verificadas: results.length,
  ok: results.length - falhas.length,
  falhas: falhas.length,
  results,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/curated-redirects.json", `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  "reports/curated-redirects.md",
  [
    "# Rotas curadas — redirects, 404 e loops",
    "",
    `- Base: ${BASE}`,
    `- Gerado em: ${report.generatedAt}`,
    `- Verificadas: ${report.verificadas}/${report.totalCurated} · OK: ${report.ok} · Falhas: ${falhas.length}`,
    "",
    "| Rota | Status final | Saltos | Cadeia | Problema |",
    "| --- | --- | --- | --- | --- |",
    ...results.map((r) => `| ${r.path} | ${r.finalStatus ?? "-"} | ${r.hops} | ${r.chain.join(" · ") || "-"} | ${r.error || "-"} |`),
    "",
  ].join("\n"),
);

console.log(`rotas curadas: ${report.ok}/${report.verificadas} ok · ${falhas.length} falhas (base ${BASE})`);
for (const f of falhas) console.log(`  FAIL ${f.path} [${f.finalStatus}] ${f.error}`);
if (falhas.length && !REPORT_ONLY) process.exit(1);
