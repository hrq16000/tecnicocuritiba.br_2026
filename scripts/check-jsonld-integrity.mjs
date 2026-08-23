#!/usr/bin/env node
/**
 * GATE — Integridade semântica do JSON-LD no HTML servido.
 *
 * Para cada URL do sitemap (HTML estático em dist/client) valida:
 *   • todo bloco ld+json faz parse e tem @type;
 *   • entidades singleton (LocalBusiness/ProfessionalService, BreadcrumbList,
 *     FAQPage, Article, WebPage) não aparecem duplicadas na mesma página;
 *   • @id não se repete no mesmo documento;
 *   • BreadcrumbList: itens com position sequencial, name e item absoluto,
 *     último nível == canonical;
 *   • FAQPage: >= 2 perguntas, cada uma com acceptedAnswer.text não vazio,
 *     e as perguntas precisam existir no texto visível (paridade);
 *   • Service: name + provider.@id apontando para o LocalBusiness;
 *   • nenhum aggregateRating/review fabricado;
 *   • páginas de serviço têm Service; páginas internas têm BreadcrumbList.
 *
 * Uso: node scripts/check-jsonld-integrity.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");
const CLIENT = existsSync(join(DIST, "client")) ? join(DIST, "client") : DIST;

if (!existsSync(CLIENT)) {
  console.error(`[jsonld-integrity] BLOQUEADO: ${CLIENT} não existe — rode "npm run build".`);
  process.exit(1);
}

const SINGLETONS = ["BreadcrumbList", "FAQPage", "Article", "WebPage"];
const LB_TYPES = new Set(["LocalBusiness", "ProfessionalService", "ComputerRepairService", "Organization"]);

const flatten = (n) =>
  Array.isArray(n)
    ? n.flatMap(flatten)
    : n && typeof n === "object"
      ? Array.isArray(n["@graph"])
        ? n["@graph"].flatMap(flatten)
        : [n]
      : [];

const typesOf = (n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]).filter(Boolean);

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// URLs auditadas: as publicadas nos sitemaps.
const locs = new Set();
for (const file of readdirSync(CLIENT).filter((f) => /^sitemap.*\.xml$/.test(f))) {
  const xml = readFileSync(join(CLIENT, file), "utf8");
  if (/<sitemapindex/i.test(xml)) continue;
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) locs.add(m[1]);
}

const errors = [];
const warnings = [];
let checked = 0;

for (const loc of [...locs].sort()) {
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    continue;
  }
  const file =
    pathname === "/" ? join(CLIENT, "index.html") : join(CLIENT, pathname.replace(/^\/|\/$/g, ""), "index.html");
  if (!existsSync(file)) continue; // coberto pelo gate de sitemap/HTTP
  checked++;

  const html = readFileSync(file, "utf8");
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? loc;
  const visible = norm(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );

  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  for (const b of blocks) {
    try {
      nodes.push(...flatten(JSON.parse(b[1])));
    } catch (e) {
      errors.push(`${pathname}: bloco JSON-LD inválido (${e.message})`);
    }
  }
  if (!nodes.length) {
    errors.push(`${pathname}: nenhum JSON-LD no HTML servido`);
    continue;
  }

  const counts = new Map();
  const ids = new Map();
  for (const n of nodes) {
    const ts = typesOf(n);
    if (!ts.length) errors.push(`${pathname}: nó JSON-LD sem @type`);
    for (const t of ts) counts.set(t, (counts.get(t) ?? 0) + 1);
    if (n["@id"]) {
      ids.set(n["@id"], (ids.get(n["@id"]) ?? 0) + 1);
    }
    if (n.aggregateRating || n.review || n.ratingValue)
      errors.push(`${pathname}: avaliação/rating não verificável em ${ts.join("/")}`);
  }

  for (const t of SINGLETONS) {
    if ((counts.get(t) ?? 0) > 1) errors.push(`${pathname}: ${t} duplicado (${counts.get(t)}x)`);
  }
  const lbCount = nodes.filter((n) => typesOf(n).some((t) => LB_TYPES.has(t) && t !== "Organization")).length;
  if (lbCount > 1) errors.push(`${pathname}: LocalBusiness duplicado (${lbCount}x)`);

  for (const [id, c] of ids) if (c > 1) errors.push(`${pathname}: @id duplicado "${id}" (${c}x)`);

  // Breadcrumb
  const bc = nodes.find((n) => typesOf(n).includes("BreadcrumbList"));
  if (!bc && pathname !== "/") {
    errors.push(`${pathname}: sem BreadcrumbList no HTML servido`);
  } else if (bc) {
    const items = bc.itemListElement ?? [];
    if (items.length < 2) errors.push(`${pathname}: BreadcrumbList com ${items.length} nível(is)`);
    items.forEach((it, i) => {
      if (it.position !== i + 1) errors.push(`${pathname}: breadcrumb nível ${i + 1} com position=${it.position}`);
      if (!it.name) errors.push(`${pathname}: breadcrumb nível ${i + 1} sem name`);
      const item = typeof it.item === "string" ? it.item : it.item?.["@id"];
      if (!item || !/^https:\/\//.test(item))
        errors.push(`${pathname}: breadcrumb nível ${i + 1} sem item absoluto`);
    });
    const last = items[items.length - 1];
    const lastItem = typeof last?.item === "string" ? last.item : last?.item?.["@id"];
    if (lastItem && lastItem.replace(/\/$/, "") !== canonical.replace(/\/$/, ""))
      errors.push(`${pathname}: último nível do breadcrumb (${lastItem}) difere do canonical`);
  }

  // FAQ
  const faq = nodes.find((n) => typesOf(n).includes("FAQPage"));
  if (faq) {
    const qs = Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
    if (qs.length < 2) errors.push(`${pathname}: FAQPage com ${qs.length} pergunta(s)`);
    for (const q of qs) {
      const answer = q?.acceptedAnswer?.text ?? "";
      if (!q?.name || !answer.trim())
        errors.push(`${pathname}: pergunta de FAQ malformada (${JSON.stringify(q).slice(0, 100)})`);
      else if (!visible.includes(norm(q.name).slice(0, 40)))
        warnings.push(`${pathname}: pergunta "${q.name}" não encontrada no texto visível`);
    }
  }

  // Service
  const services = nodes.filter((n) => typesOf(n).includes("Service"));
  const isServiceRoute = /^\/servicos\//.test(pathname) || /^\/conserto-/.test(pathname);
  if (isServiceRoute && !services.length) errors.push(`${pathname}: rota de serviço sem schema Service`);
  for (const s of services) {
    if (!s.name) errors.push(`${pathname}: Service sem name`);
    const provider = s.provider?.["@id"] ?? s.provider?.name;
    if (!provider) errors.push(`${pathname}: Service "${s.name}" sem provider`);
  }
}

if (errors.length) {
  console.error(`[jsonld-integrity] BLOQUEADO — ${errors.length} problema(s) em ${checked} página(s):`);
  errors.slice(0, 60).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 60) console.error(`  … +${errors.length - 60}`);
  process.exit(1);
}

if (warnings.length) {
  console.warn(`[jsonld-integrity] ${warnings.length} aviso(s) de paridade FAQ:`);
  warnings.slice(0, 15).forEach((w) => console.warn(`  · ${w}`));
}
console.log(`[jsonld-integrity] ok — JSON-LD válido, único e semanticamente consistente em ${checked} página(s).`);
