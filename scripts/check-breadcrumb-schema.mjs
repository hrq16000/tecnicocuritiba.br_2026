#!/usr/bin/env node
/**
 * GATE — BreadcrumbList das páginas serviço × cidade/bairro.
 *
 * Valida HTML pré-renderizado (dist/client/) que cada /conserto-<categoria>/<local>/ tem:
 *   • exatamente 1 BreadcrumbList;
 *   • 3 níveis na ordem Home > Serviço > Cidade;
 *   • `item` de cada nível apontando para URLs reais (nível 3 == canonical);
 *   • os mesmos rótulos presentes na trilha visível do HTML.
 *
 * Uso: node scripts/check-breadcrumb-schema.mjs [dist/client]
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CATEGORIES, LOCAIS, cityLabel } from "./lib/category-local.mjs";

const DIST = path.resolve(process.argv[2] || "dist/client");
const SITE = "https://tecnico.curitiba.br";

if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const flatten = (n) =>
  Array.isArray(n)
    ? n.flatMap(flatten)
    : n && typeof n === "object"
      ? Array.isArray(n["@graph"]) ? n["@graph"].flatMap(flatten) : [n]
      : [];

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const errors = [];
let checked = 0;

for (const cat of CATEGORIES) {
  for (const local of LOCAIS) {
    const route = `/${cat.slug}/${local.slug}`;
    const file = path.join(DIST, cat.slug, local.slug, "index.html");
    if (!existsSync(file)) {
      errors.push(`${route}: HTML estático ausente (${path.relative(DIST, file)})`);
      continue;
    }
    checked++;
    const html = readFileSync(file, "utf8");
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
      .filter(Boolean);
    const crumbs = blocks.flatMap(flatten).filter((n) => n["@type"] === "BreadcrumbList");
    if (crumbs.length !== 1) {
      errors.push(`${route}: esperado exatamente 1 BreadcrumbList, encontrado ${crumbs.length}`);
      continue;
    }
    const items = crumbs[0].itemListElement ?? [];
    const expected = [
      { name: "Início", item: `${SITE}/` },
      { name: cat.titlePrefix, item: `${SITE}/${cat.slug}-curitiba` },
      { name: cityLabel(local), item: `${SITE}${route}` },
    ];
    if (items.length !== 3) {
      errors.push(`${route}: BreadcrumbList com ${items.length} níveis (esperado 3)`);
      continue;
    }
    items.forEach((it, i) => {
      const exp = expected[i];
      if (it.position !== i + 1) errors.push(`${route}: nível ${i + 1} com position=${it.position}`);
      if (norm(it.name) !== norm(exp.name))
        errors.push(`${route}: nível ${i + 1} name="${it.name}" (esperado "${exp.name}")`);
      if (it.item !== exp.item)
        errors.push(`${route}: nível ${i + 1} item="${it.item}" (esperado "${exp.item}")`);
    });

    // Canonical precisa bater com o último nível.
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if (canonical !== `${SITE}${route}`)
      errors.push(`${route}: canonical="${canonical}" difere do último nível do breadcrumb`);

    // Trilha visível.
    const text = norm(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "));
    for (const exp of expected) {
      if (!text.includes(norm(exp.name)))
        errors.push(`${route}: rótulo "${exp.name}" ausente do conteúdo visível`);
    }
  }
}

if (errors.length) {
  console.error(`BLOQUEADO — BreadcrumbList inválido em ${errors.length} verificação(ões):`);
  errors.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 40) console.error(`  … +${errors.length - 40}`);
  process.exit(1);
}

console.log(`OK — BreadcrumbList Home > Serviço > Cidade válido em ${checked} páginas serviço × local.`);
