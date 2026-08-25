#!/usr/bin/env node
/**
 * GATE — LASTMOD REAL NO SITEMAP
 *
 * lastmod só tem valor se representar modificação real de conteúdo. Falha se:
 *   - formato inválido (fora de YYYY-MM-DD)
 *   - data no futuro
 *   - carimbo idêntico em massa (> 60% das URLs com lastmod na mesma data),
 *     padrão típico de `new Date()` aplicado no build
 *   - `new Date()` usado como origem de lastmod no gerador de sitemaps
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve("public");
const hoje = new Date().toISOString().slice(0, 10);
const problemas = [];
const datas = [];
let total = 0;

for (const file of readdirSync(publicDir).filter((f) => f.startsWith("sitemap-") && f.endsWith(".xml"))) {
  const xml = readFileSync(resolve(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    total++;
    const bloco = m[1];
    const loc = bloco.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "?";
    const lastmod = bloco.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (!lastmod) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) problemas.push(`formato inválido: ${loc} → ${lastmod}`);
    else if (lastmod > hoje) problemas.push(`lastmod futuro: ${loc} → ${lastmod}`);
    else datas.push(lastmod);
  }
}

if (datas.length) {
  const contagem = new Map();
  for (const d of datas) contagem.set(d, (contagem.get(d) ?? 0) + 1);
  const [dataTop, n] = [...contagem.entries()].sort((a, b) => b[1] - a[1])[0];
  const fracao = n / datas.length;
  if (fracao > 0.6 && n > 20)
    problemas.push(
      `carimbo em massa: ${n}/${datas.length} URLs (${(fracao * 100).toFixed(0)}%) com lastmod ${dataTop} — sinal provavelmente artificial`,
    );
}

const gerador = readFileSync(resolve("scripts/generate-sitemaps.mjs"), "utf8");
if (/lastmod[^\n]*new Date\(\)/.test(gerador) || /new Date\(\)[^\n]*lastmod/.test(gerador))
  problemas.push("scripts/generate-sitemaps.mjs deriva lastmod de new Date() — proibido (lastmod falso global)");

if (problemas.length) {
  console.error(`check:sitemap-lastmod FALHOU — ${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`check:sitemap-lastmod OK — ${datas.length}/${total} URL(s) com lastmod real e válido.`);
