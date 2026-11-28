#!/usr/bin/env node
/**
 * GATE — BreadcrumbList das páginas serviço × cidade/bairro.
 *
 * Valida no HTML servido pelo build (prerender ou SSR dinâmico) que cada /conserto-<categoria>/<local>/ tem:
 *   • exatamente 1 BreadcrumbList;
 *   • 3 níveis na ordem Home > Serviço > Cidade;
 *   • `item` de cada nível apontando para URLs reais (nível 3 == canonical);
 *   • os mesmos rótulos presentes na trilha visível do HTML.
 *
 * Uso: node scripts/check-breadcrumb-schema.mjs [dist]
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { CURATED_ROUTES } from "./curated-routes-meta.mjs";
import { CATEGORIES, LOCAIS, cityLabel } from "./lib/category-local.mjs";

const DIST = path.resolve(process.argv[2] || "dist");
const SITE = "https://tecnico.curitiba.br";
const CLIENT = existsSync(path.join(DIST, "client")) ? path.join(DIST, "client") : DIST;
const curated = new Set(CURATED_ROUTES.map((r) => r.path));
let handler;
let checkedStatic = 0;
let checkedSSR = 0;

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
    const file = path.join(CLIENT, cat.slug, local.slug, "index.html");
    let html;
    if (existsSync(file)) {
      html = readFileSync(file, "utf8");
      checkedStatic++;
    } else if (curated.has(route)) {
      errors.push(`${route}: HTML estático curado ausente (${path.relative(DIST, file)})`);
      continue;
    } else {
      // Estas landings não entram no prerender curado. Teste o handler real
      // compilado (sem hidratação), nunca o shell SPA nem um HTML inventado.
      try {
        handler ??= (await import(pathToFileURL(path.join(DIST, "server/index.mjs")).href)).default;
        const res = await handler.fetch(new Request(`${SITE}${route}`), {}, { waitUntil() {} });
        if (res.status !== 200) {
          errors.push(`${route}: SSR HTTP ${res.status} (esperado 200)`);
          continue;
        }
        html = await res.text();
        const robots = html.match(/<meta\b[^>]*\bname="robots"[^>]*>/i)?.[0] ?? "";
        if (!/\bcontent="noindex,\s*follow"/i.test(robots)) {
          errors.push(`${route}: SSR fora da política noindex, follow`);
        }
        checkedSSR++;
      } catch (error) {
        errors.push(`${route}: SSR indisponível (${error.message})`);
        continue;
      }
    }
    checked++;
    const blocks = [...html.matchAll(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
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
    const canonicalTag = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/i)?.[0] ?? "";
    const canonical = canonicalTag.match(/\bhref="([^"]+)"/i)?.[1];
    if (canonical !== `${SITE}${route}`)
      errors.push(`${route}: canonical="${canonical}" difere do último nível do breadcrumb`);

    // Trilha visível.
    const nav = html.match(/<nav[^>]+aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
    if (!nav) { errors.push(`${route}: trilha de navegação visível ausente`); continue; }
    const text = norm(nav.replace(/<[^>]+>/g, " "));
    for (const exp of expected.slice(0, 2)) {
      const href = new URL(exp.item).pathname;
      if (!nav.includes(`href="${href}"`)) errors.push(`${route}: link visível ${href} ausente`);
    }
    let previous = -1;
    for (const exp of expected) {
      const at = text.indexOf(norm(exp.name), previous + 1);
      if (at < 0) errors.push(`${route}: rótulo "${exp.name}" ausente ou fora de ordem na trilha`);
      else previous = at;
    }
  }
}

if (errors.length) {
  console.error(`BLOQUEADO — BreadcrumbList inválido em ${errors.length} verificação(ões):`);
  errors.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 40) console.error(`  … +${errors.length - 40}`);
  process.exit(1);
}

console.log(`OK — BreadcrumbList Home > Serviço > Cidade válido em ${checked} páginas serviço × local (${checkedStatic} estáticas; ${checkedSSR} SSR).`);
