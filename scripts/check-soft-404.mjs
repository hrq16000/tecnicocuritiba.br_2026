// Gate de soft-404: valida o contrato HTTP das quatro categorias de URL
// contra o build servido com paridade de produção (scripts/serve-dist.mjs).
//
// Uso: node scripts/check-soft-404.mjs            (sobe servidor local no dist)
//      node scripts/check-soft-404.mjs --base=URL (valida um ambiente remoto)

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createServer } from "./serve-dist.mjs";
import { buildRouteManifest } from "./lib/route-manifest.mjs";

const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith("--base="))?.split("=")[1];
const DIST = path.resolve("dist");
const PORT = 4187;

const INVALID_URLS = [
  "/rota-inexistente-001",
  "/rota-inexistente-002",
  "/servicos/servico-que-nao-existe",
  "/servicos/formatacao/bairro-que-nao-existe-xyz",
  "/bairros/bairro-inexistente",
  "/bairros/xxxxx-yyyyy",
  "/empresa/teste-inexistente",
  "/tecnico-informatica-cidade-inexistente",
  "/tecnico-informatica-",
  "/wp-admin",
  "/wp-login.php",
  "/teste.php",
  "/produto/inexistente",
  "/faq/inexistente",
  "/marcas/marca-inexistente-xyz",
  "/problemas/problema-inexistente-xyz",
  "/procedimentos/procedimento-inexistente-xyz",
  "/blog/post-que-nao-existe-2026",
  "/abc/def/ghi",
  "/precos-e-politicas/extra",
  "/admin-falso",
  "/index.php",
  "/.env",
  // Variações de slug dinâmico (marcas, problemas, procedimentos, bairros).
  "/marcas/dell-inexistente",
  "/problemas/tela-azul-inexistente-xyz",
  "/procedimentos/reballing-inexistente-xyz",
  "/servicos/formatacao/centro-inexistente-xyz",
  "/bairros/centro-xyz",
  "/tecnico-informatica-curitiba-xyz",
  "/blog/categoria/inexistente",
  "/blog/2026/01/post",
];

/** Combinações de query string aplicadas às checagens 200/404. */
const QUERY_COMBOS = [
  "?utm_source=google&utm_medium=cpc&utm_campaign=curitiba",
  "?page=2&sort=asc",
  "?gclid=abc123",
  "?fbclid=xyz&utm_source=facebook",
  "?q=t%C3%A9cnico%20curitiba",
  "?",
];

const failures = [];
const notes = [];
let checks = 0;

function assert(cond, msg) {
  checks += 1;
  if (!cond) failures.push(msg);
}

function normalize(html) {
  return crypto
    .createHash("md5")
    .update(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .digest("hex");
}

async function get(base, url, { redirect = "manual" } = {}) {
  const res = await fetch(base + url, { redirect });
  const body = res.status === 204 ? "" : await res.text();
  return { status: res.status, location: res.headers.get("location"), body };
}

async function main() {
  let server;
  let base = baseArg;
  if (!base) {
    server = await createServer({ distDir: DIST });
    await new Promise((r) => server.listen(PORT, r));
    base = `http://localhost:${PORT}`;
    notes.push(`servidor local de paridade em ${base}`);
  }

  const manifestPath = path.join(DIST, "route-manifest.json");
  const manifest = await fs.readFile(manifestPath, "utf8")
    .then(JSON.parse)
    .catch(async () => {
      notes.push("manifesto ausente: derivado localmente para a verificação");
      return buildRouteManifest({ distDir: DIST });
    });

  // Teste 1 — URLs indexáveis do manifesto curado.
  for (const p of manifest.curated) {
    const r = await get(base, p);
    assert(r.status === 200, `[válidas] ${p} → ${r.status} (esperado 200)`);
  }

  // Teste 2 — Aliases: 301 de salto único até destino 200.
  for (const rule of manifest.redirects) {
    const r = await get(base, rule.from);
    assert(
      r.status === 301 || r.status === 308,
      `[alias] ${rule.from} → ${r.status} (esperado 301/308)`,
    );
    assert(r.location === rule.to, `[alias] ${rule.from} → Location ${r.location} (esperado ${rule.to})`);
    if (r.location) {
      const hop = await get(base, r.location);
      assert(hop.status === 200, `[alias] destino ${r.location} → ${hop.status} (esperado 200, salto único)`);
    }
  }

  // Teste 3 — URLs inexistentes.
  for (const p of INVALID_URLS) {
    const r = await get(base, p);
    assert(r.status === 404, `[404] ${p} → ${r.status} (esperado 404)`);
  }

  // Teste 4 — Conteúdo da resposta 404.
  const home = await get(base, "/");
  const nf = await get(base, "/rota-inexistente-001");
  assert(/Página não encontrada/i.test(nf.body), "[404-body] falta o texto 'Página não encontrada'");
  assert(/noindex,\s*nofollow/i.test(nf.body), "[404-body] falta meta robots noindex, nofollow");
  assert(!/rel=["']canonical["']/i.test(nf.body), "[404-body] resposta 404 não pode emitir canonical");
  assert(!/application\/ld\+json/i.test(nf.body), "[404-body] resposta 404 não pode emitir JSON-LD");
  assert(
    !/Técnico de Informática em Curitiba<\/h1>/i.test(nf.body),
    "[404-body] resposta 404 não pode reusar o H1 da home",
  );
  assert(normalize(nf.body) !== normalize(home.body), "[404-body] hash normalizado igual ao da home");

  // Teste 5 — Query strings.
  const utmInvalid = await get(base, "/rota-inexistente-001?utm_source=teste");
  assert(utmInvalid.status === 404, `[utm] rota inválida com UTM → ${utmInvalid.status} (esperado 404)`);
  const utmValid = await get(base, "/servicos?utm_source=teste");
  assert(utmValid.status === 200, `[utm] /servicos?utm_source=teste → ${utmValid.status} (esperado 200)`);
  const aliasUtm = await get(base, `${manifest.redirects[0].from}?utm_source=teste`);
  assert(
    (aliasUtm.location || "").includes("utm_source=teste"),
    "[utm] alias deve preservar a query string de campanha",
  );

  // Teste 5b — Combinações de query string em rota válida e inválida.
  for (const qs of QUERY_COMBOS) {
    const ok = await get(base, `/servicos${qs}`);
    assert(ok.status === 200, `[qs] /servicos${qs} → ${ok.status} (esperado 200)`);
    const bad = await get(base, `/rota-inexistente-001${qs}`);
    assert(bad.status === 404, `[qs] /rota-inexistente-001${qs} → ${bad.status} (esperado 404)`);
  }

  // Teste 6 — Assets.
  for (const asset of ["/robots.txt", "/sitemap-index.xml", "/logo.webp", "/manifest.json"]) {
    const r = await get(base, asset);
    assert(r.status === 200, `[asset] ${asset} → ${r.status} (esperado 200)`);
  }
  for (const asset of ["/assets/nao-existe.js", "/imagem-inexistente.png"]) {
    const r = await get(base, asset);
    assert(r.status === 404, `[asset] ${asset} → ${r.status} (esperado 404)`);
  }

  if (server) await new Promise((r) => server.close(r));

  console.log(`── Gate soft-404 ──`);
  notes.forEach((n) => console.log(`  • ${n}`));
  console.log(`  verificações: ${checks}`);
  if (failures.length) {
    console.error(`\n✖ ${failures.length} falha(s):`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log("✔ URLs válidas 200, aliases 301 de salto único, URLs inválidas 404 sem conteúdo da home.");
}

main().catch((err) => {
  console.error("[check-soft-404] erro:", err);
  process.exit(1);
});
