#!/usr/bin/env node
/**
 * GATE DE JSON-LD DAS 4 PÁGINAS COMERCIAIS P0
 *
 * Rotas: /, /tecnico-informatica-curitiba, /atendimento-domicilio,
 *        /empresa-de-ti-curitiba
 *
 * Valida no HTML pré-renderizado (dist/client/):
 *   1. BreadcrumbList presente (exceto home), com positions 1..n sequenciais,
 *      primeiro item = Início ("/") e último item = a própria URL.
 *   2. Ausência de AggregateRating e de Review/reviews.
 *   3. Ausência de Offer com preço mensal / recorrente (price mensal,
 *      billingDuration, unitText "MÊS", "por mês", "/mês", priceSpecification
 *      recorrente) — o projeto não vende plano nem SLA mensal.
 *   4. Ausência de claims inventados no JSON-LD (SLA em horas, "melhor",
 *      "nº 1", "certificado pela", "atendimento no mesmo dia", "24h").
 *   5. Organization consistente: sempre o mesmo @id institucional.
 *
 * Uso: node scripts/check-jsonld-p0.mjs [dist/client]
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "dist/client";
const BASE = "https://tecnico.curitiba.br";
const ORG_ID = `${BASE}/#organization`;
const ROUTES = ["/", "/tecnico-informatica-curitiba", "/atendimento-domicilio", "/empresa-de-ti-curitiba"];

const FORBIDDEN_CLAIMS = [
  /\bmelhor (assist[êe]ncia|t[ée]cnico|empresa)\b/i,
  /\bn[ºo°]\s*1\b/i,
  /\bcertificad[oa]s? pel[ao]\b/i,
  /atendimento no mesmo dia/i,
  /\bSLA\b/i,
  /\b24\s*h(oras)?\b/i,
  /\bgarantia vital[íi]cia\b/i,
];
const MONTHLY = [/\bmensal\b/i, /por m[êe]s/i, /\/m[êe]s/i, /billingDuration/i, /\bMON\b/, /\bmonthly\b/i];

const errors = [];
const notes = [];

if (!existsSync(DIST)) {
  console.error(`✖ ${DIST}/ ausente — rode "npm run build" antes do gate.`);
  process.exit(1);
}

function blocksOf(path) {
  const file = join(DIST, path === "/" ? "" : path.replace(/^\//, ""), "index.html");
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const out = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch (e) {
      errors.push(`${path}: JSON-LD inválido (${e.message})`);
    }
  }
  return out;
}

const flatten = (node, acc = []) => {
  if (Array.isArray(node)) node.forEach((n) => flatten(n, acc));
  else if (node && typeof node === "object") {
    acc.push(node);
    if (Array.isArray(node["@graph"])) node["@graph"].forEach((n) => flatten(n, acc));
    for (const v of Object.values(node)) if (v && typeof v === "object") flatten(v, acc);
  }
  return acc;
};

const orgIds = new Set();

for (const path of ROUTES) {
  const blocks = blocksOf(path);
  if (!blocks) {
    errors.push(`${path}: HTML estático ausente em ${DIST}`);
    continue;
  }
  const nodes = flatten(blocks);
  const raw = JSON.stringify(blocks);
  const typeOf = (n) => [].concat(n["@type"] ?? []).map(String);

  // 1. BreadcrumbList
  const crumbs = nodes.filter((n) => typeOf(n).includes("BreadcrumbList"));
  if (path === "/") {
    notes.push(`${path}: home — BreadcrumbList opcional (${crumbs.length} encontrado[s])`);
  } else if (crumbs.length === 0) {
    errors.push(`${path}: BreadcrumbList ausente`);
  } else if (crumbs.length > 1) {
    errors.push(`${path}: ${crumbs.length} BreadcrumbList — deve haver exatamente 1`);
  } else {
    const items = crumbs[0].itemListElement || [];
    items.forEach((it, i) => {
      if (Number(it.position) !== i + 1)
        errors.push(`${path}: breadcrumb position fora de ordem (${it.position} na posição ${i + 1})`);
    });
    const url = (it) => (typeof it?.item === "string" ? it.item : it?.item?.["@id"]) || "";
    if (url(items[0]).replace(/\/$/, "") !== BASE)
      errors.push(`${path}: primeiro item do breadcrumb não é a home (${url(items[0]) || "vazio"})`);
    const last = url(items[items.length - 1]).replace(/\/$/, "");
    if (last !== `${BASE}${path}`.replace(/\/$/, ""))
      errors.push(`${path}: último item do breadcrumb não auto-referencia a página (${last})`);
    notes.push(`${path}: breadcrumb com ${items.length} nível(is)`);
  }

  // 2. AggregateRating / Review
  for (const n of nodes) {
    if (typeOf(n).some((t) => /AggregateRating|Review/.test(t)))
      errors.push(`${path}: tipo proibido no JSON-LD: ${typeOf(n).join(",")}`);
  }
  for (const key of ["aggregateRating", "review", "reviews", "ratingValue", "reviewCount"]) {
    if (new RegExp(`"${key}"`).test(raw)) errors.push(`${path}: campo proibido no JSON-LD: "${key}"`);
  }

  // 3. Offer mensal / recorrente
  const offers = nodes.filter((n) => typeOf(n).some((t) => /Offer/.test(t)));
  for (const o of offers) {
    const s = JSON.stringify(o);
    for (const re of MONTHLY)
      if (re.test(s)) errors.push(`${path}: Offer com sinal de preço mensal/recorrente (${re})`);
  }
  if (offers.length) notes.push(`${path}: ${offers.length} Offer(s) — sem preço mensal`);

  // 4. Claims inventados
  for (const re of FORBIDDEN_CLAIMS)
    if (re.test(raw)) errors.push(`${path}: claim não verificável no JSON-LD (${re})`);

  // 5. Organization consistente
  for (const n of nodes) {
    if (typeOf(n).some((t) => /Organization|LocalBusiness|ProfessionalService|ComputerRepairService/.test(t))) {
      if (n["@id"]) orgIds.add(n["@id"]);
    }
  }
  notes.push(`${path}: ${blocks.length} bloco(s) JSON-LD, ${nodes.length} nó(s)`);
}

const institutional = [...orgIds].filter((id) => /#organization/i.test(id));
if (institutional.length > 1)
  errors.push(`@id institucional inconsistente entre páginas: ${institutional.join(", ")}`);
if (institutional.length === 1 && institutional[0] !== ORG_ID)
  errors.push(`@id institucional inesperado: ${institutional[0]} (esperado ${ORG_ID})`);

console.log("── Gate JSON-LD das 4 páginas P0 ──");
for (const n of notes) console.log(`  · ${n}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s):`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log("\n✔ JSON-LD P0 OK: breadcrumb correto, sem rating/review, sem Offer mensal e sem claims inventados.");
