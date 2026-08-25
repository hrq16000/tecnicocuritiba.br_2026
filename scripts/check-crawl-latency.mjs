#!/usr/bin/env node
/**
 * CHECAGEM DE LATÊNCIA DE CRAWL (TTFB / resposta SSR)
 *
 * Foco: URLs que o Google ainda não indexou (DISCOVERED_NOT_INDEXED e
 * UNKNOWN_TO_GOOGLE). Latência alta nessas URLs é uma das poucas causas
 * técnicas capazes de limitar o ritmo de descoberta, então elas recebem
 * medição dedicada em vez do TTFB médio do site.
 *
 * Mede, por URL, 3 amostras sequenciais (descarta a 1ª como aquecimento de
 * cache de borda) e registra:
 *   - TTFB (primeiro byte) e tempo total até o HTML completo
 *   - HTTP e tamanho do HTML
 *   - falha de limiar: TTFB acima de 800 ms (configurável)
 *
 * Saídas: reports/crawl-latency.json · reports/crawl-latency.md
 * Uso: node scripts/check-crawl-latency.mjs [--threshold 800] [--all] [--strict]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const THRESHOLD = Number(args[args.indexOf("--threshold") + 1]) || 800;
const strict = args.includes("--strict");
const todas = args.includes("--all");
const INV = "reports/indexation-inventory.json";

if (!existsSync(INV)) {
  console.error(`check:crawl-latency: ${INV} ausente — rode 'npm run report:indexation' antes.`);
  process.exit(1);
}
const inv = JSON.parse(readFileSync(INV, "utf8"));
const alvo = todas
  ? inv.urls
  : inv.urls.filter((u) => u.gscStatus === "DISCOVERED_NOT_INDEXED" || u.gscStatus === "UNKNOWN_TO_GOOGLE");

console.log(`medindo ${alvo.length} URL(s) · limiar TTFB ${THRESHOLD} ms · 3 amostras por URL`);

async function medir(url) {
  const amostras = [];
  for (let i = 0; i < 3; i++) {
    const t0 = performance.now();
    try {
      const res = await fetch(url, { headers: { "user-agent": "tecnico-crawl-latency" } });
      const reader = res.body?.getReader();
      let ttfb = null;
      let bytes = 0;
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (ttfb === null) ttfb = performance.now() - t0;
          if (done) break;
          bytes += value?.byteLength ?? 0;
        }
      } else {
        const body = await res.text();
        ttfb = performance.now() - t0;
        bytes = body.length;
      }
      amostras.push({ http: res.status, ttfb: Math.round(ttfb), total: Math.round(performance.now() - t0), bytes });
    } catch (e) {
      amostras.push({ http: 0, ttfb: null, total: null, bytes: 0, erro: String(e).slice(0, 120) });
    }
  }
  return amostras;
}

const resultados = [];
const queue = [...alvo];
let done = 0;
async function worker() {
  while (queue.length) {
    const u = queue.shift();
    const amostras = await medir(u.url);
    const uteis = amostras.slice(1).filter((a) => a.ttfb !== null);
    const ttfbs = uteis.map((a) => a.ttfb);
    const ttfb = ttfbs.length ? Math.round(ttfbs.reduce((s, n) => s + n, 0) / ttfbs.length) : null;
    const totalMs = uteis.length ? Math.round(uteis.reduce((s, a) => s + a.total, 0) / uteis.length) : null;
    resultados.push({
      path: u.path,
      url: u.url,
      gscStatus: u.gscStatus,
      tier: u.tier,
      http: amostras.at(-1)?.http ?? 0,
      ttfbMs: ttfb,
      ttfbMaxMs: ttfbs.length ? Math.max(...ttfbs) : null,
      totalMs,
      htmlBytes: amostras.at(-1)?.bytes ?? 0,
      amostras,
      falha:
        amostras.at(-1)?.http !== 200
          ? `HTTP ${amostras.at(-1)?.http}`
          : ttfb !== null && ttfb > THRESHOLD
            ? `TTFB ${ttfb} ms acima do limiar de ${THRESHOLD} ms`
            : null,
    });
    if (++done % 25 === 0) console.log(`  ${done}/${alvo.length}`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

resultados.sort((a, b) => (b.ttfbMs ?? 0) - (a.ttfbMs ?? 0));
const validos = resultados.filter((r) => r.ttfbMs !== null).map((r) => r.ttfbMs).sort((a, b) => a - b);
const pct = (q) => (validos.length ? validos[Math.floor((validos.length - 1) * q)] : null);
const falhas = resultados.filter((r) => r.falha);
const geradoEm = new Date().toISOString();

const payload = {
  geradoEm,
  limiarMs: THRESHOLD,
  escopo: todas ? "todas as URLs do sitemap" : "URLs DISCOVERED_NOT_INDEXED + UNKNOWN_TO_GOOGLE",
  total: resultados.length,
  p50: pct(0.5),
  p75: pct(0.75),
  p95: pct(0.95),
  max: validos.at(-1) ?? null,
  falhas: falhas.map((r) => ({ path: r.path, motivo: r.falha, ttfbMs: r.ttfbMs, gscStatus: r.gscStatus })),
  resultados,
};
writeFileSync("reports/crawl-latency.json", JSON.stringify(payload, null, 2));
writeFileSync(
  "reports/crawl-latency.md",
  `# Latência de crawl — URLs ainda não indexadas

Gerado em ${geradoEm} · escopo: ${payload.escopo} · limiar TTFB **${THRESHOLD} ms**
(3 amostras por URL, a primeira descartada como aquecimento de borda)

| Métrica | Valor |
| --- | --- |
| URLs medidas | ${payload.total} |
| TTFB p50 | ${payload.p50} ms |
| TTFB p75 | ${payload.p75} ms |
| TTFB p95 | ${payload.p95} ms |
| TTFB máximo | ${payload.max} ms |
| Falhas de limiar/HTTP | ${falhas.length} |

${falhas.length ? `## Falhas\n\n${falhas.map((r) => `- ${r.path} — ${r.falha} (${r.gscStatus})`).join("\n")}` : "Nenhuma URL acima do limiar e nenhum HTTP inesperado."}

## 15 URLs mais lentas

| URL | TTFB médio | TTFB máx | Total HTML | Bytes | GSC |
| --- | --- | --- | --- | --- | --- |
${resultados.slice(0, 15).map((r) => `| ${r.path} | ${r.ttfbMs} ms | ${r.ttfbMaxMs} ms | ${r.totalMs} ms | ${r.htmlBytes} | ${r.gscStatus} |`).join("\n")}
`,
);

console.log(
  `check:crawl-latency — ${payload.total} URLs · p75 ${payload.p75} ms · p95 ${payload.p95} ms · falhas ${falhas.length}`,
);
for (const f of falhas.slice(0, 15)) console.log(`  ! ${f.path} — ${f.motivo}`);
if (strict && falhas.length) process.exit(1);
