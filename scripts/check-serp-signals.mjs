#!/usr/bin/env node
/**
 * ============================================================================
 * ESTABILIDADE DE SERP SIGNALS — ANTES × DEPOIS DO DEPLOY
 * ============================================================================
 * Congela os sinais que o Google usa para identificar a página (title, H1,
 * canonical, robots e conjunto de @type de JSON-LD) e compara build a build.
 * O objetivo é detectar mudança INDEVIDA — principalmente nas páginas que são
 * destino das 40 URLs consolidadas, onde qualquer oscilação de canonical ou
 * de schema reabre o risco de o Google desfazer a consolidação.
 *
 * Uso:
 *   node scripts/check-serp-signals.mjs dist --snapshot     grava baseline
 *   node scripts/check-serp-signals.mjs dist                compara (relatório)
 *   node scripts/check-serp-signals.mjs dist --gate         compara e bloqueia
 *   node scripts/check-serp-signals.mjs --live https://...  lê produção
 *
 * Baseline: reports/serp-signals-baseline.json
 * Relatório: reports/serp-signals.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CURATED_PATHS, BASE_URL } from "./lib/curated-urls.mjs";
import { CONSOLIDATED_LOCAL_URLS } from "./lib/consolidated-local-urls.mjs";

const args = process.argv.slice(2);
const gate = args.includes("--gate");
const snapshot = args.includes("--snapshot");
const liveIdx = args.indexOf("--live");
const live = liveIdx >= 0 ? (args[liveIdx + 1] || BASE_URL).replace(/\/$/, "") : null;
const DIST = args.find((a) => !a.startsWith("--") && a !== live) || "dist";
const BASELINE = "reports/serp-signals-baseline.json";

/** Páginas que absorveram as URLs consolidadas — tolerância zero a mudança. */
const DESTINOS = new Set(CONSOLIDATED_LOCAL_URLS.map((u) => u.destino ?? u.target ?? u.to).filter(Boolean));

const strip = (s) => (s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function sinais(html) {
  const pick = (re) => (html.match(re)?.[1] ?? "").trim();
  const tipos = new Set();
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (!n || typeof n !== "object") return;
        [].concat(n["@type"] ?? []).forEach((t) => tipos.add(t));
        if (Array.isArray(n["@graph"])) n["@graph"].forEach(walk);
      };
      walk(JSON.parse(m[1].trim()));
    } catch {
      tipos.add("__INVALIDO__");
    }
  }
  return {
    title: strip(pick(/<title>([\s\S]*?)<\/title>/i)),
    description: pick(/name="description"\s+content="([^"]*)"/i),
    canonical: pick(/rel="canonical"\s+href="([^"]*)"/i),
    robots: pick(/name="robots"\s+content="([^"]*)"/i) || "(default)",
    h1: strip(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ""),
    schema: [...tipos].sort(),
  };
}

async function lerHtml(path) {
  if (live) {
    const res = await fetch(`${live}${path}`, { redirect: "manual" });
    if (res.status !== 200) return null;
    return res.text();
  }
  const base = DIST.endsWith("client") || existsSync(join(DIST, "index.html")) ? DIST : join(DIST, "client");
  const file = join(base, path === "/" ? "" : path.replace(/^\//, ""), "index.html");
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

const atual = {};
const ausentes = [];
const fila = [...new Set(CURATED_PATHS)].sort();
const queue = [...fila];
async function worker() {
  while (queue.length) {
    const path = queue.shift();
    const html = await lerHtml(path);
    if (!html) {
      ausentes.push(path);
      continue;
    }
    atual[path] = sinais(html);
  }
}
await Promise.all(Array.from({ length: live ? 6 : 12 }, worker));

mkdirSync("reports", { recursive: true });

if (snapshot) {
  writeFileSync(
    BASELINE,
    JSON.stringify({ geradoEm: new Date().toISOString(), origem: live ?? DIST, sinais: atual }, null, 2),
  );
  console.log(`✔ baseline de SERP signals gravado: ${Object.keys(atual).length} URL(s) → ${BASELINE}`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.warn(`[serp-signals] baseline ausente — gravando o primeiro em ${BASELINE}.`);
  writeFileSync(
    BASELINE,
    JSON.stringify({ geradoEm: new Date().toISOString(), origem: live ?? DIST, sinais: atual }, null, 2),
  );
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8")).sinais ?? {};
const CAMPOS = ["title", "h1", "canonical", "robots", "schema"];
const regressoes = [];
const mudancas = [];

for (const [path, s] of Object.entries(atual)) {
  const b = base[path];
  if (!b) {
    mudancas.push({ path, campo: "—", de: "(nova no baseline)", para: "", critica: false });
    continue;
  }
  for (const campo of CAMPOS) {
    const de = Array.isArray(b[campo]) ? b[campo].join(",") : (b[campo] ?? "");
    const para = Array.isArray(s[campo]) ? s[campo].join(",") : (s[campo] ?? "");
    if (de === para) continue;
    // Canonical, robots e schema são sinais de identidade: mudança é sempre
    // regressão até prova em contrário. Title/H1 só bloqueiam nos destinos
    // das consolidações e quando o schema/canonical também oscila.
    const critica =
      ["canonical", "robots", "schema"].includes(campo) ||
      (DESTINOS.has(path) && ["title", "h1"].includes(campo));
    (critica ? regressoes : mudancas).push({ path, campo, de, para, critica });
  }
}

for (const path of Object.keys(base)) {
  if (!(path in atual) && !ausentes.includes(path)) continue;
  if (!(path in atual)) {
    regressoes.push({ path, campo: "presença", de: "200", para: "ausente", critica: true });
  }
}

const linha = (r) => `| ${r.path} | ${r.campo} | ${r.de.slice(0, 70)} | ${r.para.slice(0, 70)} |`;
writeFileSync(
  "reports/serp-signals.md",
  [
    "# Estabilidade de SERP signals",
    "",
    `Gerado em ${new Date().toISOString()} sobre \`${live ?? DIST}\`.`,
    `Baseline de ${JSON.parse(readFileSync(BASELINE, "utf8")).geradoEm}.`,
    "",
    `URLs comparadas: **${Object.keys(atual).length}** · regressões: **${regressoes.length}** · mudanças aceitáveis: **${mudancas.length}**`,
    "",
    "## Regressões (bloqueiam publicação)",
    "",
    regressoes.length
      ? ["| URL | Sinal | Antes | Depois |", "| --- | --- | --- | --- |", ...regressoes.map(linha)].join("\n")
      : "Nenhuma.",
    "",
    "## Mudanças observadas (não bloqueiam)",
    "",
    mudancas.length
      ? ["| URL | Sinal | Antes | Depois |", "| --- | --- | --- | --- |", ...mudancas.slice(0, 80).map(linha)].join("\n")
      : "Nenhuma.",
    "",
    ausentes.length ? `## Sem HTML\n\n${ausentes.map((p) => `- ${p}`).join("\n")}` : "",
  ].join("\n"),
);

console.log(
  `── SERP signals: ${Object.keys(atual).length} URL(s) · ${regressoes.length} regressão(ões) · ${mudancas.length} mudança(s)`,
);
for (const r of regressoes.slice(0, 20)) console.log(`  ✖ ${r.path} [${r.campo}] "${r.de}" → "${r.para}"`);
for (const m of mudancas.slice(0, 10)) console.log(`  · ${m.path} [${m.campo}]`);

if (gate && regressoes.length) {
  console.error(`\n✖ check:serp-signals — ${regressoes.length} regressão(ões) de identidade. Publicação bloqueada.`);
  process.exit(1);
}
console.log("\n✔ sinais de SERP estáveis (ou apenas mudanças não críticas).");
