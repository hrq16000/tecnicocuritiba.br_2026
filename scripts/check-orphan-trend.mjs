#!/usr/bin/env node
/**
 * GATE ANTI-ORPHAN PAGES (tendência)
 * ==================================
 * Conta quantas URLs indexáveis (curadas, `index, follow`) NÃO recebem nenhum
 * link interno vindo do código-fonte. Falha o build (block deploy) quando esse
 * número CRESCE em relação ao baseline registrado no commit anterior.
 *
 *   node scripts/check-orphan-trend.mjs            # verifica (gate)
 *   node scripts/check-orphan-trend.mjs --update   # regrava o baseline
 *
 * Baseline: reports/orphan-baseline.json (versionado).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const BASELINE = join(ROOT, "reports/orphan-baseline.json");
const UPDATE = process.argv.includes("--update");

/** Todos os arquivos de código que podem conter links internos. */
function sources(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (/node_modules|routeTree\.gen/.test(full)) continue;
      sources(full, acc);
    } else if (/\.(tsx?|mjs|json)$/.test(entry.name) && statSync(full).isFile()) {
      acc.push(full);
    }
  }
  return acc;
}

const files = [...sources(join(ROOT, "src")), ...sources(join(ROOT, "scripts/lib"))];
const haystack = files
  .filter((f) => !f.includes("curated-urls.mjs") && !f.endsWith("routeTree.gen.ts"))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

/** Um link interno é qualquer `to=`/`href=`/string de rota apontando ao path. */
function hasInboundLink(path) {
  if (path === "/") return true; // raiz é alcançada pelo logo/nav por contrato
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`["'\`]${escaped}(["'\`/?#])`).test(haystack);
}

const orphans = CURATED_PATHS.filter((p) => !hasInboundLink(p)).sort();
const current = { total: CURATED_PATHS.length, orphans: orphans.length, paths: orphans };

if (UPDATE) {
  mkdirSync(join(ROOT, "reports"), { recursive: true });
  writeFileSync(BASELINE, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`[orphan-trend] baseline atualizado: ${orphans.length} órfãs de ${CURATED_PATHS.length} URLs.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error("❌ check:orphan-trend — baseline ausente. Rode: node scripts/check-orphan-trend.mjs --update");
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));

if (current.orphans > baseline.orphans) {
  const novas = orphans.filter((p) => !baseline.paths.includes(p));
  console.error(
    `❌ check:orphan-trend — páginas órfãs subiram de ${baseline.orphans} para ${current.orphans}.\n` +
      `Sem link interno de entrada:\n${novas.map((p) => `  - ${p}`).join("\n")}\n` +
      "Adicione links internos reais (hub, cluster ou grade local) ou remova a URL da lista curada.",
  );
  process.exit(1);
}

console.log(
  `✅ check:orphan-trend — ${current.orphans} órfãs de ${current.total} URLs indexáveis ` +
    `(baseline ${baseline.orphans}, sem regressão).`,
);
