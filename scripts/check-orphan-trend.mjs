#!/usr/bin/env node
/**
 * GATE ANTI-ORPHAN PAGES (tendência)
 * ==================================
 * Conta quantas URLs indexáveis (curadas, `index, follow`) NÃO recebem nenhum
 * link interno vindo do código-fonte. Falha o build (block deploy) quando esse
 * número CRESCE em relação ao baseline versionado.
 *
 *   node scripts/check-orphan-trend.mjs                  # verifica (gate)
 *   node scripts/check-orphan-trend.mjs --update         # regrava o baseline
 *   node scripts/check-orphan-trend.mjs --assert-baseline # só exige o arquivo
 *
 * Baseline canônico (versionado em git): scripts/data/orphan-baseline.json
 * Cópia publicada no build para paridade staging/produção: public/orphan-baseline.json
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const BASELINE = join(ROOT, "scripts/data/orphan-baseline.json");
const PUBLIC_COPY = join(ROOT, "public/orphan-baseline.json");
const UPDATE = process.argv.includes("--update");
const ASSERT_ONLY = process.argv.includes("--assert-baseline");

const MSG_AUSENTE =
  "❌ check:orphan-trend — baseline ausente em scripts/data/orphan-baseline.json.\n" +
  "   Rode `npm run orphan:update` (ou `node scripts/check-orphan-trend.mjs --update`)\n" +
  "   e COMMITE o arquivo gerado antes do build de produção.\n" +
  "   Ele precisa estar versionado: sem baseline não há como provar que a\n" +
  "   quantidade de páginas órfãs indexáveis não cresceu.";

if (ASSERT_ONLY) {
  if (!existsSync(BASELINE)) {
    console.error(MSG_AUSENTE);
    process.exit(1);
  }
  const b = JSON.parse(readFileSync(BASELINE, "utf8"));
  console.log(`✅ baseline de orphan-trend presente (${b.orphans} órfãs de ${b.total} URLs).`);
  process.exit(0);
}

/**
 * SINTONIA FINA (redução de falsos positivos, sem relaxar o SEO estrutural):
 * rotas que, por contrato, não dependem de link interno estático — segmentos
 * dinâmicos, telas transacionais efêmeras (modal/protocolo/consulta) e área
 * administrativa. Nada aqui é URL de conteúdo indexável do funil orgânico.
 */
const ISENTOS = [
  /\$/, // segmento dinâmico do router (ex.: /ordem-de-servico/$protocolo)
  /^\/admin(\/|$)/, // painéis autenticados
  /^\/ordem-de-servico\//, // consulta transacional por protocolo
  /#/, // âncoras/modais isolados
];

const isIsento = (path) => ISENTOS.some((re) => re.test(path));

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

const avaliadas = CURATED_PATHS.filter((p) => !isIsento(p));
const isentas = CURATED_PATHS.filter(isIsento);
const orphans = avaliadas.filter((p) => !hasInboundLink(p)).sort();
const current = {
  total: avaliadas.length,
  orphans: orphans.length,
  paths: orphans,
  isentos: isentas.sort(),
};

if (UPDATE) {
  for (const dest of [BASELINE, PUBLIC_COPY]) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, `${JSON.stringify(current, null, 2)}\n`);
  }
  console.log(
    `[orphan-trend] baseline atualizado: ${orphans.length} órfãs de ${avaliadas.length} URLs avaliadas ` +
      `(${isentas.length} isentas). Commite scripts/data/orphan-baseline.json.`,
  );
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error(MSG_AUSENTE);
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

// Paridade de ambiente: o build sempre publica a cópia lida pelo baseline.
mkdirSync(dirname(PUBLIC_COPY), { recursive: true });
writeFileSync(PUBLIC_COPY, `${JSON.stringify(baseline, null, 2)}\n`);

console.log(
  `✅ check:orphan-trend — ${current.orphans} órfãs de ${current.total} URLs indexáveis ` +
    `(baseline ${baseline.orphans}, sem regressão; ${isentas.length} rotas isentas).`,
);
