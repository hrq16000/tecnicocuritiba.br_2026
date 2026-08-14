#!/usr/bin/env node
/**
 * RELATÓRIO — INCLUSÃO PROGRESSIVA NO SITEMAP
 *
 * Explica, URL a URL, o que entrou no sitemap curado e POR QUÊ, e o que ficou
 * de fora e por qual gate (originalidade, prova visual, onda não aprovada).
 *
 * Fontes:
 *   scripts/lib/curated-urls.mjs         manifesto declarado
 *   reports/content-approval.json        gate de originalidade
 *   public/publish-status.json           gates consolidados (prova visual)
 *   scripts/lib/wave-approvals.json      aprovações em lote por onda
 *   public/sitemap-*.xml                 o que de fato foi emitido
 *
 * Uso: node scripts/report-sitemap-inclusions.mjs
 * Saída: reports/sitemap-inclusions.{json,md}
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ACTIVE_SITEMAPS, BASE_URL } from "./lib/curated-urls.mjs";
import { WAVES } from "./lib/content-waves.mjs";
import { approvedWeeks } from "./lib/wave-approvals.mjs";

const readJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

const aprovacao = readJson("reports/content-approval.json");
const status = readJson("public/publish-status.json");
const liberadas = approvedWeeks();

const bloqueadoPorOriginalidade = new Map((aprovacao?.blocked ?? []).map((b) => [b.path, b]));
const porStatus = new Map((status?.urls ?? []).map((u) => [u.path, u]));
const ondaDe = new Map();
for (const w of WAVES) for (const p of w.paths) ondaDe.set(p, w.week);

const emitidas = new Set();
for (const [name] of ACTIVE_SITEMAPS) {
  const file = join("public", name);
  if (!existsSync(file)) continue;
  for (const m of readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    emitidas.add(m[1].replace(BASE_URL, ""));
  }
}

const linhas = [];
for (const [sitemap, entries] of ACTIVE_SITEMAPS) {
  for (const e of entries) {
    const incluida = emitidas.has(e.path);
    const s = porStatus.get(e.path);
    const onda = ondaDe.get(e.path) ?? null;
    const motivos = [];
    if (bloqueadoPorOriginalidade.has(e.path)) {
      const b = bloqueadoPorOriginalidade.get(e.path);
      motivos.push(`originalidade reprovada${b?.similarity ? ` (Jaccard ${b.similarity})` : ""}`);
    }
    if (s?.provaVisual && s.provaVisual.ok !== true) motivos.push(`prova visual pendente (${s.provaVisual.fotos ?? 0} foto(s))`);
    if (onda && !liberadas.has(onda)) motivos.push(`onda ${onda} não aprovada em lote`);
    if (!incluida && motivos.length === 0) motivos.push("fora do XML emitido — rode npm run build");
    linhas.push({
      path: e.path,
      sitemap,
      incluida,
      onda,
      motivo: incluida
        ? `aprovada${onda ? ` (onda ${onda} liberada)` : " (manifesto curado, sem bloqueio)"}`
        : motivos.join(" · "),
    });
  }
}

const dentro = linhas.filter((l) => l.incluida);
const fora = linhas.filter((l) => !l.incluida);

mkdirSync("reports", { recursive: true });
const relatorio = {
  generatedAt: new Date().toISOString(),
  declaradas: linhas.length,
  indexaveis: dentro.length,
  bloqueadas: fora.length,
  ondasLiberadas: [...liberadas],
  urls: linhas,
};
writeFileSync("reports/sitemap-inclusions.json", JSON.stringify(relatorio, null, 2));
writeFileSync(
  "reports/sitemap-inclusions.md",
  [
    "# Inclusão progressiva no sitemap — o que foi indexado e por quê",
    "",
    `- Gerado em: ${relatorio.generatedAt}`,
    `- Declaradas: ${relatorio.declaradas} · no sitemap: **${relatorio.indexaveis}** · bloqueadas: ${relatorio.bloqueadas}`,
    `- Ondas liberadas: ${relatorio.ondasLiberadas.join(", ") || "nenhuma"}`,
    "",
    "## Bloqueadas",
    "",
    fora.length ? "| URL | Sitemap | Onda | Motivo |\n| --- | --- | --- | --- |" : "Nenhuma URL bloqueada.",
    ...fora.map((l) => `| ${l.path} | ${l.sitemap} | ${l.onda ?? "—"} | ${l.motivo} |`),
    "",
    "## Indexáveis",
    "",
    "| URL | Sitemap | Motivo |",
    "| --- | --- | --- |",
    ...dentro.map((l) => `| ${l.path} | ${l.sitemap} | ${l.motivo} |`),
  ].join("\n"),
);

console.log(
  `sitemap: ${relatorio.indexaveis}/${relatorio.declaradas} URLs indexáveis (${relatorio.bloqueadas} bloqueadas) — reports/sitemap-inclusions.md`,
);
for (const l of fora) console.log(`  · fora: ${l.path} → ${l.motivo}`);
