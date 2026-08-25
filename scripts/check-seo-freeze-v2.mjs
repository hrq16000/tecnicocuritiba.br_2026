#!/usr/bin/env node
/**
 * ETAPAS 8, 9 e 27 — GATE DO FREEZE_V2 (PROIBIÇÃO DE DRIFT SILENCIOSO)
 *
 * Compara a superfície atual do repositório com o selo FREEZE_V2 e classifica
 * cada diferença:
 *   ADMIN_CHANGE · CI_CHANGE · OBSERVABILITY_CHANGE ·
 *   NON_CURATED_PUBLIC_CHANGE · PUBLIC_CHANGE
 *
 * Somente PUBLIC_CHANGE afeta o experimento. Quando aparece e não está
 * declarada em `scripts/lib/intervencoes.mjs`, o gate falha e emite o alerta
 * PRE_D14_PUBLIC_INTERVENTION_DETECTED. O baseline nunca "anda junto" com o
 * código: só um novo evento de intervenção + reselo versionado liberam.
 *
 *   node scripts/check-seo-freeze-v2.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { impressaoDigitalRepo } from "./lib/superficie-publica.mjs";
import { INTERVENCOES } from "./lib/intervencoes.mjs";

const FREEZE = "public/freeze-v2.json";
const OUT = path.resolve("reports/freeze-v2-drift.json");

if (!existsSync(FREEZE)) {
  console.error("❌ FREEZE_V2 não selado. Rode: npm run freeze:v2");
  process.exit(1);
}

const freeze = JSON.parse(readFileSync(FREEZE, "utf8"));
const atual = impressaoDigitalRepo();
const antes = freeze.superficie ?? {};

const declarados = new Set(
  INTERVENCOES.flatMap((e) => e.arquivos ?? []).map((f) => f.replace(/\/\*+$/, "")),
);
const declarado = (rel) => [...declarados].some((d) => rel === d || rel.startsWith(d));

const diffs = [];
for (const [rel, info] of Object.entries(atual)) {
  const anterior = antes[rel];
  if (!anterior) diffs.push({ arquivo: rel, tipo: "ADICIONADO", classe: info.classe });
  else if (anterior.hash !== info.hash) diffs.push({ arquivo: rel, tipo: "ALTERADO", classe: info.classe });
}
for (const rel of Object.keys(antes)) if (!atual[rel]) diffs.push({ arquivo: rel, tipo: "REMOVIDO", classe: antes[rel].classe });

const porClasse = diffs.reduce((acc, d) => { acc[d.classe] = (acc[d.classe] ?? 0) + 1; return acc; }, {});
const publicos = diffs.filter((d) => d.classe === "PUBLIC_CHANGE");
const naoRegistrados = publicos.filter((d) => !declarado(d.arquivo));

const relatorio = {
  schema: "freeze-v2-drift/1.0",
  verificadoEm: new Date().toISOString(),
  freezeSelo: freeze.selo,
  freezeSeladoEm: freeze.seladoEm,
  totalDiffs: diffs.length,
  porClasse,
  publicChangeTotal: publicos.length,
  publicChangeNaoRegistrado: naoRegistrados.length,
  alerta: naoRegistrados.length ? "PRE_D14_PUBLIC_INTERVENTION_DETECTED" : null,
  exigido: naoRegistrados.length
    ? ["intervention event", "timestamp", "URL", "diff", "motivo", "coorte afetada", "novo freeze versionado"]
    : [],
  diffs,
};

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(relatorio, null, 2)}\n`);

console.log(`FREEZE_V2 ${freeze.selo.slice(0, 12)}… selado em ${freeze.seladoEm}`);
for (const [classe, n] of Object.entries(porClasse)) console.log(`  ${classe.padEnd(28)} ${n}`);
console.log(`  PUBLIC_CHANGE não registrado ${naoRegistrados.length}`);

if (naoRegistrados.length) {
  console.error("\n🚨 PRE_D14_PUBLIC_INTERVENTION_DETECTED");
  for (const d of naoRegistrados.slice(0, 20)) console.error(`  • ${d.tipo} ${d.arquivo}`);
  console.error("\nNão atualize o baseline em silêncio. Registre o evento em scripts/lib/intervencoes.mjs,");
  console.error("rode npm run intervencao:registrar e reselo com npm run freeze:v2.");
  process.exit(1);
}
console.log("✅ Sem drift público não registrado desde o FREEZE_V2.");
