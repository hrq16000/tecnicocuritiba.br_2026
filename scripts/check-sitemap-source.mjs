#!/usr/bin/env node
/**
 * ============================================================================
 * GATE DE GOVERNANÇA DO SITEMAP — FONTE CURADA vs XML EMITIDO
 * ============================================================================
 * O sitemap deve derivar EXCLUSIVAMENTE do manifesto curado
 * (`scripts/lib/curated-urls.mjs`). Nenhum número mágico é fonte da verdade.
 *
 * Falha quando:
 *  1. URL declarada como indexável não está no sitemap.
 *  2. URL emitida no sitemap não está declarada no manifesto.
 *  3. URL do sitemap não corresponde a rota real (404) ou é rota dinâmica.
 *  4. URL do sitemap é origem de redirect / alias (redirectMatrix).
 *  5. URL do sitemap está marcada como noindex no código da página.
 *  6. Landing serviço × bairro não aprovada pela hierarquia local
 *     (bairro fora dos bairros-âncora ou serviço fora da fábrica).
 *  7. Sitemaps herdados deixam de estar vazios.
 *  8. Domínio não canônico em qualquer <loc>.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  ACTIVE_SITEMAPS,
  BASE_URL,
  CURATED_PATHS,
  EMPTY_SITEMAPS,
  SERVICO_BAIRRO,
} from "./lib/curated-urls.mjs";
import { tanstackRouteIndex } from "./lib/tanstack-routes.mjs";

const ROOT = process.cwd();
const failures = [];
const fail = (m) => failures.push(m);
const note = (m) => console.log(`  ✓ ${m}`);

console.log("── check:sitemap-source ──");

// ── 1. Rotas declaradas no roteador ─────────────────────────────────────────
const { staticRoutes, dynamicRoutes } = tanstackRouteIndex(ROOT);
const hasRoute = (p) => staticRoutes.has(p) || dynamicRoutes.some((re) => re.test(p));

// ── 2. Redirects / aliases ──────────────────────────────────────────────────
const redirectSrc = readFileSync(join(ROOT, "src/lib/redirectMatrix.ts"), "utf8");
const redirectFrom = new Set(
  [...redirectSrc.matchAll(/from:\s*"([^"]+)"/g)].map((m) => m[1].replace(/\/$/, "")),
);

// ── 3. URLs emitidas ────────────────────────────────────────────────────────
const pub = join(ROOT, "public");
const emitted = [];
for (const [name] of ACTIVE_SITEMAPS) {
  const xml = readFileSync(join(pub, name), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = m[1].trim();
    if (!url.startsWith(BASE_URL)) {
      fail(`[${name}] domínio não canônico: ${url}`);
      continue;
    }
    emitted.push({ file: name, path: url.slice(BASE_URL.length) || "/" });
  }
}

// ── 4. Paridade manifesto × XML ─────────────────────────────────────────────
const declared = new Set(CURATED_PATHS);
const emittedSet = new Set(emitted.map((e) => e.path));
for (const p of declared) {
  if (!emittedSet.has(p)) fail(`URL curada ausente do sitemap: ${p} (rode npm run sitemap)`);
}
for (const { file, path: p } of emitted) {
  if (!declared.has(p)) fail(`[${file}] URL não curada no sitemap: ${p}`);
}
if (emitted.length !== new Set(emitted.map((e) => e.path)).size) {
  fail("sitemap contém URLs duplicadas");
}

// ── 5. Rota real, sem redirect/alias ────────────────────────────────────────
for (const { file, path: p } of emitted) {
  if (!hasRoute(p)) fail(`[${file}] URL sem rota correspondente (404): ${p}`);
  if (redirectFrom.has(p)) fail(`[${file}] URL é origem de redirect/alias: ${p}`);
}

// ── 6. noindex fora do sitemap ──────────────────────────────────────────────
const pageFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry)) pageFiles.push(full);
  }
};
walk(join(ROOT, "src/pages"));
for (const f of pageFiles) {
  const code = readFileSync(f, "utf8");
  if (!/\bnoindex\b/.test(code)) continue;
  for (const m of code.matchAll(/noindex[^>]*?\bpath="([^"]+)"/g)) {
    const p = m[1].replace(/\/$/, "") || "/";
    if (emittedSet.has(p)) fail(`URL noindex presente no sitemap: ${p} (${f.replace(`${ROOT}/`, "")})`);
  }
}

// ── 7. Hierarquia local das landings serviço × bairro ───────────────────────
const factory = readFileSync(join(ROOT, "src/lib/servicoBairroFactory.ts"), "utf8");
const ancora = [
  ...(factory.match(/BAIRROS_ANCORA\s*=\s*\[([^\]]+)\]/)?.[1].matchAll(/"([^"]+)"/g) ?? []),
].map((m) => m[1]);
const servicosGerados = [...factory.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
const rotasEstaticas = [
  ...(factory.match(/ROTAS_ESTATICAS_EXISTENTES[^[]*\[([\s\S]*?)\]/)?.[1].matchAll(/"([^"]+)"/g) ?? []),
].map((m) => m[1]);
for (const { path: p } of SERVICO_BAIRRO) {
  const [, , servico, bairro] = p.split("/");
  if (!ancora.includes(bairro)) fail(`serviço × bairro fora dos bairros-âncora: ${p}`);
  if (!servicosGerados.includes(servico)) fail(`serviço × bairro sem definição na fábrica: ${p}`);
  if (rotasEstaticas.includes(`${servico}/${bairro}`))
    fail(`serviço × bairro colide com página estática dedicada: ${p}`);
}

// ── 8. Sitemaps herdados vazios ─────────────────────────────────────────────
for (const name of EMPTY_SITEMAPS) {
  const xml = readFileSync(join(pub, name), "utf8");
  if (/<loc>/.test(xml)) fail(`sitemap herdado deveria estar vazio: ${name}`);
}

// ── Saída ───────────────────────────────────────────────────────────────────
note(`manifesto curado: ${declared.size} URLs indexáveis declaradas`);
note(`sitemap emitido: ${emitted.length} URLs em ${ACTIVE_SITEMAPS.length} sub-sitemaps`);
note(`serviço × bairro auditadas: ${SERVICO_BAIRRO.length}`);

if (failures.length) {
  console.log(`\n✖ ${failures.length} falha(s):`);
  failures.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
}
console.log("\n✔ sitemap derivado da fonte curada, sem noindex, alias ou redirect.");
