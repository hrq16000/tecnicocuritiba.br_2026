#!/usr/bin/env node
/**
 * CORREÇÃO PONTUAL DE SELO — FREEZE_V2
 *
 * Existe um caso legítimo de drift: o selo capturou um arquivo em estado
 * transitório (ex.: injeção de head durante o build) e o repositório nunca
 * mudou. Isso produz PUBLIC_CHANGE eterno sem mudança pública real.
 *
 * Este script corrige a impressão digital de arquivos assim — e SOMENTE deles:
 * a correção só é aceita quando o arquivo em disco é idêntico ao commit HEAD,
 * provando que nada foi publicado depois do selo. Qualquer arquivo com
 * alteração real é recusado e deve seguir o rito de intervenção + reselo.
 *
 *   node scripts/corrigir-selo-freeze-v2.mjs src/routes/problemas.tv-sem-som.tsx
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { impressaoDigitalRepo } from "./lib/superficie-publica.mjs";

const FREEZE = "public/freeze-v2.json";
const sha = (v) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");

const alvos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const motivo =
  process.argv.find((a) => a.startsWith("--motivo="))?.slice(9) ??
  "selo capturado em estado transitório de build; arquivo idêntico ao HEAD, sem mudança pública";

if (!alvos.length) {
  console.error("Uso: node scripts/corrigir-selo-freeze-v2.mjs <arquivo> [--motivo=...]");
  process.exit(1);
}

const freeze = JSON.parse(readFileSync(FREEZE, "utf8"));
const atual = impressaoDigitalRepo();
const corrigidos = [];

for (const rel of alvos) {
  const info = atual[rel];
  if (!info) {
    console.error(`❌ ${rel} não está na superfície vigiada.`);
    process.exit(1);
  }
  const anterior = freeze.superficie?.[rel];
  if (!anterior) {
    console.error(`❌ ${rel} não consta no selo — é adição, não correção.`);
    process.exit(1);
  }
  if (anterior.hash === info.hash) {
    console.log(`• ${rel} já coerente com o selo — nada a fazer.`);
    continue;
  }

  // Prova de que nada foi publicado depois do selo: disco === HEAD.
  const head = execFileSync("git", ["show", `HEAD:${rel}`], { encoding: "buffer" });
  if (sha(readFileSync(rel).toString()) !== sha(head.toString())) {
    console.error(`❌ ${rel} difere do HEAD: é mudança real. Registre intervenção e reselo o freeze.`);
    process.exit(1);
  }

  corrigidos.push({
    arquivo: rel,
    classe: info.classe,
    hashSelado: anterior.hash,
    hashCorreto: info.hash,
    motivo,
    corrigidoEm: new Date().toISOString(),
    prova: "conteúdo em disco idêntico a git HEAD",
  });
  freeze.superficie[rel] = info;
}

if (!corrigidos.length) {
  console.log("Nenhuma correção necessária.");
  process.exit(0);
}

freeze.correcoesSelo = [...(freeze.correcoesSelo ?? []), ...corrigidos];
freeze.superficieHash = sha(freeze.superficie);
freeze.selo = sha({ ...freeze, selo: undefined, seladoEm: undefined });
writeFileSync(FREEZE, `${JSON.stringify(freeze, null, 2)}\n`);

const HIST = "public/freeze-historico.json";
const hist = JSON.parse(readFileSync(HIST, "utf8"));
hist.versoes.push({
  versao: `FREEZE_V2.correcao-${hist.versoes.length}`,
  selo: freeze.selo,
  seladoEm: new Date().toISOString(),
  nota: `correção de impressão digital sem mudança pública: ${corrigidos.map((c) => c.arquivo).join(", ")}`,
});
hist.atualizadoEm = new Date().toISOString();
writeFileSync(HIST, `${JSON.stringify(hist, null, 2)}\n`);

console.log("✅ Selo corrigido (sem alterar URLs congeladas nem coortes)");
for (const c of corrigidos) console.log(`   ${c.arquivo}: ${c.hashSelado.slice(0, 12)}… → ${c.hashCorreto.slice(0, 12)}…`);
console.log(`   novo selo: ${freeze.selo.slice(0, 16)}…`);
