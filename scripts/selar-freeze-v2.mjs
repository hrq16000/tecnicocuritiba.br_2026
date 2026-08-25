#!/usr/bin/env node
/**
 * ETAPA 7 — SELO DO FREEZE_V2
 *
 * Congela o estado público observado em produção após a intervenção. FREEZE_V1
 * (baseline D0) é preservado: o histórico é append-only, nunca sobrescrito.
 *
 *   node scripts/selar-freeze-v2.mjs
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";
import { impressaoDigitalRepo } from "./lib/superficie-publica.mjs";

const sha = (v) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");
const ler = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const live = ler("reports/live-validation.json");
const ledger = ler("public/intervencoes-d0.json");
if (!live || !ledger) {
  console.error("❌ Requer reports/live-validation.json e public/intervencoes-d0.json.");
  process.exit(1);
}
if (live.problemas.length) {
  console.error(`❌ Produção com ${live.problemas.length} problema(s): não se sela freeze sobre regressão.`);
  process.exit(1);
}

const coorteDe = (p) => {
  if ((ledger.coortes.INTERVENTION_COHORT.urls ?? []).some((u) => u.url === p)) return "DIRECT_INTERVENTION";
  if ((ledger.coortes.INDIRECT_DISCOVERY_COHORT.urls ?? []).some((u) => u.url === p)) return "INDIRECT_DISCOVERY_INTERVENTION";
  return "CLEAN_COHORT";
};

const deploymentId = live.base.includes("localhost") ? "LOCAL" : `live:${sha(live.paginas.map((p) => p.mainHash).join("")).slice(0, 16)}`;

// FREEZE_V1 — declarativo do D0, criado só uma vez e nunca reescrito.
if (!existsSync("public/freeze-v1.json")) {
  const v1 = {
    schema: "freeze/1.0",
    versao: "FREEZE_V1",
    origem: "declarativo — baseline D0 (ZERO_PUBLIC_SEO_DIFF)",
    baseline: ledger.baseline,
    seladoEm: ledger.baseline.registradoEm,
    universoCurado: ledger.universoCurado,
    curadoHash: sha(CURATED_PATHS.slice().sort().join("\n")),
    imutavel: true,
  };
  v1.selo = sha({ ...v1, selo: undefined });
  writeFileSync("public/freeze-v1.json", `${JSON.stringify(v1, null, 2)}\n`);
  console.log("FREEZE_V1 materializado (declarativo, imutável).");
}
const v1 = ler("public/freeze-v1.json");

const superficie = impressaoDigitalRepo();
const urls = live.paginas.map((p) => ({
  path: p.path,
  http: p.status,
  canonical: p.canonical,
  robots: p.robots,
  titleHash: p.titleHash,
  h1Hash: p.h1Hash,
  mainHash: p.mainHash,
  jsonldHash: p.jsonldHash,
  internalLinkSetHash: p.internalLinkSetHash,
  sitemapMembro: Boolean(p.sitemap),
  lastmod: p.sitemap?.lastmod ?? null,
  cohort: coorteDe(p.path),
  deploymentId,
}));

const v2 = {
  schema: "freeze/1.0",
  versao: "FREEZE_V2",
  seladoEm: new Date().toISOString(),
  base: live.base,
  deploymentId,
  origem: { liveValidation: sha(readFileSync("reports/live-validation.json", "utf8")), executadoEm: live.executadoEm },
  ledgerSelo: ledger.selo,
  freezeV1: { selo: v1.selo, preservado: true, seladoEm: v1.seladoEm },
  universoCurado: CURATED_PATHS.length,
  coortes: {
    CLEAN_COHORT: urls.filter((u) => u.cohort === "CLEAN_COHORT").length,
    DIRECT_INTERVENTION: urls.filter((u) => u.cohort === "DIRECT_INTERVENTION").length,
    INDIRECT_DISCOVERY_INTERVENTION: urls.filter((u) => u.cohort === "INDIRECT_DISCOVERY_INTERVENTION").length,
  },
  regra: "Qualquer PUBLIC_CHANGE em superfície curada após este selo exige novo evento de intervenção no ledger.",
  urls,
  superficie,
  superficieHash: sha(superficie),
};
v2.selo = sha({ ...v2, selo: undefined, seladoEm: undefined });

writeFileSync("public/freeze-v2.json", `${JSON.stringify(v2, null, 2)}\n`);

// Histórico append-only dos freezes.
const hist = ler("public/freeze-historico.json") ?? { schema: "freeze-historico/1.0", versoes: [] };
if (!hist.versoes.some((x) => x.versao === "FREEZE_V1")) hist.versoes.push({ versao: "FREEZE_V1", selo: v1.selo, seladoEm: v1.seladoEm });
const jaV2 = hist.versoes.find((x) => x.versao === "FREEZE_V2");
if (jaV2 && jaV2.selo !== v2.selo) hist.versoes.push({ versao: `FREEZE_V2.${hist.versoes.length}`, selo: v2.selo, seladoEm: v2.seladoEm, nota: "reselo após novo estado público" });
else if (!jaV2) hist.versoes.push({ versao: "FREEZE_V2", selo: v2.selo, seladoEm: v2.seladoEm, deploymentId });
hist.atualizadoEm = new Date().toISOString();
writeFileSync("public/freeze-historico.json", `${JSON.stringify(hist, null, 2)}\n`);

console.log("✅ FREEZE_V2 selado");
console.log(`   URLs congeladas:  ${urls.length}`);
console.log(`   deployment:       ${deploymentId}`);
console.log(`   arquivos vigiados:${Object.keys(superficie).length}`);
console.log(`   selo:             ${v2.selo.slice(0, 16)}…`);
console.log(`   FREEZE_V1:        preservado (${v1.selo.slice(0, 12)}…)`);
