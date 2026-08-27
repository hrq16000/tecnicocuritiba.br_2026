#!/usr/bin/env node
/**
 * GATE — SCHEMA ESTRUTURADO POR TIPO DE PÁGINA (Rodada 3)
 *
 * Varre o dist e exige, no HTML servido (SSR, sem depender de hidratação):
 *   • páginas de bairro  → LocalBusiness com areaServed.name (bairro),
 *     areaServed.address.addressLocality (cidade exata) e, quando a página é
 *     indexável, additionalProperty com as dicas locais;
 *   • páginas de serviço → Service (ou Offer.itemOffered Service) com nome e
 *     areaServed declarados;
 *   • toda página indexável → ao menos um bloco JSON-LD válido.
 *
 * Uso: node scripts/check-schema-por-tipo.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] || "dist");
if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) walk(full);
    else if (e === "index.html") files.push(full);
  }
})(DIST);

const flatten = (node, out = []) => {
  if (Array.isArray(node)) node.forEach((n) => flatten(n, out));
  else if (node && typeof node === "object") {
    out.push(node);
    if (Array.isArray(node["@graph"])) flatten(node["@graph"], out);
  }
  return out;
};

const typesOf = (node) => [].concat(node["@type"] ?? []);
const errors = [];
let bairros = 0;
let servicos = 0;

for (const file of files.sort()) {
  const route =
    ("/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/$/, "") || "/";
  const html = readFileSync(file, "utf8");
  const indexavel = !/<meta name="robots" content="[^"]*noindex/i.test(html);
  if (!indexavel) continue;

  const nodes = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      flatten(JSON.parse(m[1].trim()), nodes);
    } catch {
      errors.push(`${route}: bloco JSON-LD inválido (não é JSON)`);
    }
  }
  if (!nodes.length) {
    errors.push(`${route}: página indexável sem JSON-LD no HTML inicial`);
    continue;
  }

  if (/^\/bairros\//.test(route)) {
    bairros++;
    const lb = nodes.find((n) => typesOf(n).includes("LocalBusiness"));
    if (!lb) {
      errors.push(`${route}: falta schema LocalBusiness de bairro`);
      continue;
    }
    const area = lb.areaServed ?? {};
    if (!area.name) errors.push(`${route}: LocalBusiness sem areaServed.name (bairro exato)`);
    if (!area.address?.addressLocality)
      errors.push(`${route}: LocalBusiness sem areaServed.address.addressLocality (cidade exata)`);
    const dicas = [].concat(lb.additionalProperty ?? []);
    if (!dicas.length)
      errors.push(`${route}: LocalBusiness sem additionalProperty (dicasLocais não injetadas no build)`);
    else if (dicas.some((d) => !d.value))
      errors.push(`${route}: additionalProperty com dica vazia`);
  }

  if (/^\/servicos\//.test(route)) {
    servicos++;
    const svc = nodes.find(
      (n) => typesOf(n).includes("Service") || typesOf(n.itemOffered ?? {}).includes("Service"),
    );
    if (!svc) {
      errors.push(`${route}: falta schema Service`);
      continue;
    }
    const node = typesOf(svc).includes("Service") ? svc : svc.itemOffered;
    if (!node.name) errors.push(`${route}: Service sem name`);
    if (!node.areaServed) errors.push(`${route}: Service sem areaServed`);
  }
}

if (errors.length) {
  console.error(`BLOQUEADO — ${errors.length} problema(s) de schema por tipo:`);
  errors.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 40) console.error(`  … +${errors.length - 40}`);
  process.exit(1);
}
console.log(`OK — schema por tipo válido (${bairros} bairro(s), ${servicos} serviço(s) indexáveis).`);
