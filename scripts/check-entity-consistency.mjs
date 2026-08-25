#!/usr/bin/env node
/**
 * ============================================================================
 * GATE — CONSISTÊNCIA DE ENTIDADE (Organization / LocalBusiness / author)
 * ============================================================================
 * Fase de Operação. Depois das otimizações locais, o risco não é mais "faltar
 * schema" — é schema DUPLICADO, INSTÁVEL entre páginas ou com CLAIM que o
 * projeto não pode provar.
 *
 * Verifica, no HTML servido de cada URL curada:
 *   1. Organization: no máximo um nó por @id e assinatura idêntica em todas as
 *      páginas (name, url, telephone, legalName, logo, areaServed).
 *   2. LocalBusiness: NAP idêntico (name/telephone/addressLocality/Region) e
 *      parentOrganization apontando para o #organization canônico.
 *   3. author/publisher/provider: quando presentes, referenciam entidade
 *      existente no próprio documento (@id resolvível) — nada de autor órfão.
 *   4. Claims não comprovadas: aggregateRating, review, award, hasCredential,
 *      slogan superlativo, "certificado/autorizado", número de clientes.
 *   5. Schema duplicado/instável nas páginas locais: mesmo @id repetido, dois
 *      nós do mesmo @type principal (LocalBusiness/Service/BreadcrumbList) ou
 *      @id ausente em nó de entidade.
 *
 * Uso:
 *   node scripts/check-entity-consistency.mjs [dist] [--json] [--gate]
 * Saída: reports/entity-consistency.json + .md · exit 1 com --gate em falha.
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CURATED_PATHS, BASE_URL } from "./lib/curated-urls.mjs";
import { clusterOf } from "./lib/indexation-tiers.mjs";

const args = process.argv.slice(2);
const DIST = args.find((a) => !a.startsWith("--")) ?? "dist";
const GATE = args.includes("--gate");
const ORG_ID = `${BASE_URL}/#organization`;

const CLAIMS = [
  { id: "aggregateRating", test: (n) => !!n.aggregateRating, msg: "aggregateRating sem prova verificável" },
  { id: "review", test: (n) => !!n.review || !!n.reviews, msg: "review embarcado sem origem verificável" },
  { id: "award", test: (n) => !!n.award, msg: "award/prêmio não comprovável" },
  { id: "hasCredential", test: (n) => !!n.hasCredential, msg: "credencial/certificação sem emissor" },
  {
    id: "slogan-superlativo",
    test: (n) => /melhor|l[íi]der|n[ºo]\s*1|mais recomendad/i.test(String(n.slogan ?? "")),
    msg: "slogan superlativo",
  },
  {
    id: "descricao-claim",
    test: (n) =>
      /(assist[êe]ncia\s+(t[ée]cnica\s+)?autorizada|t[ée]cnicos?\s+certificad|\d[\d.]*\+?\s*clientes)/i.test(
        String(n.description ?? ""),
      ),
    msg: "descrição com claim não comprovável (autorizada/certificado/nº de clientes)",
  },
];

const ENTIDADES_UNICAS = ["Organization", "LocalBusiness", "WebSite", "BreadcrumbList"];

function htmlDe(path) {
  const base = DIST.endsWith("client") ? DIST : join(DIST, "client");
  const cands = [
    join(base, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
    join(DIST, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
  ];
  const f = cands.find((c) => existsSync(c));
  return f ? readFileSync(f, "utf8") : null;
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

const tipos = (n) => [].concat(n["@type"] ?? []);
const temTipo = (n, t) => tipos(n).includes(t);

const problemas = [];
const push = (path, tipo, msg) => problemas.push({ path, tipo, msg });

const assinaturasOrg = new Map();
const assinaturasNap = new Map();
const analisadas = [];

for (const path of CURATED_PATHS) {
  const html = htmlDe(path);
  if (!html) {
    push(path, "html-ausente", `HTML estático não encontrado em ${DIST}`);
    continue;
  }
  const nodes = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      flatten(JSON.parse(m[1].trim()), nodes);
    } catch (e) {
      push(path, "json-invalido", `JSON-LD inválido: ${e.message}`);
    }
  }
  if (!nodes.length) {
    push(path, "sem-schema", "página sem nenhum JSON-LD");
    continue;
  }
  const cluster = clusterOf(path);
  const local = ["BAIRRO", "CIDADE", "SERVICO_BAIRRO"].includes(cluster);
  analisadas.push({ path, cluster, nos: nodes.length });

  // 1 · Organization consistente ------------------------------------------
  const orgs = nodes.filter((n) => temTipo(n, "Organization") && !temTipo(n, "LocalBusiness"));
  const orgCanonica = orgs.find((o) => o["@id"] === ORG_ID);
  if (orgs.filter((o) => o["@id"] === ORG_ID).length > 1)
    push(path, "schema-duplicado", `Organization ${ORG_ID} declarada mais de uma vez`);
  if (orgCanonica) {
    const assinatura = JSON.stringify({
      name: orgCanonica.name ?? null,
      url: orgCanonica.url ?? null,
      legalName: orgCanonica.legalName ?? null,
      telephone: orgCanonica.telephone ?? null,
      logo: orgCanonica.logo ?? null,
      areaServed: orgCanonica.areaServed ?? null,
    });
    if (!assinaturasOrg.has(assinatura)) assinaturasOrg.set(assinatura, []);
    assinaturasOrg.get(assinatura).push(path);
  }

  // 2 · LocalBusiness / NAP ------------------------------------------------
  const lbs = nodes.filter((n) => temTipo(n, "LocalBusiness"));
  if (lbs.length > 1 && new Set(lbs.map((l) => l["@id"] ?? "sem-id")).size < lbs.length)
    push(path, "schema-duplicado", "mais de um LocalBusiness com o mesmo @id");
  for (const lb of lbs) {
    if (!lb["@id"]) push(path, "schema-instavel", "LocalBusiness sem @id (instável entre renders)");
    const parent = lb.parentOrganization?.["@id"] ?? lb.parentOrganization;
    if (parent && parent !== ORG_ID)
      push(path, "entidade-divergente", `LocalBusiness.parentOrganization "${parent}" ≠ ${ORG_ID}`);
    const nap = JSON.stringify({
      name: lb.name ?? null,
      telephone: lb.telephone ?? null,
      locality: lb.address?.addressLocality ?? null,
      region: lb.address?.addressRegion ?? null,
      country: lb.address?.addressCountry ?? null,
    });
    if (!assinaturasNap.has(nap)) assinaturasNap.set(nap, []);
    assinaturasNap.get(nap).push(path);
  }

  // 3 · author / publisher / provider resolvíveis --------------------------
  const ids = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
  for (const n of nodes) {
    for (const campo of ["author", "publisher", "provider", "worksFor", "about"]) {
      const v = n[campo];
      if (!v) continue;
      for (const item of [].concat(v)) {
        if (typeof item === "string") continue;
        const ref = item["@id"];
        if (ref && !ids.has(ref) && !ref.startsWith(ORG_ID))
          push(path, "referencia-orfa", `${campo}.@id "${ref}" não existe no documento`);
        if (!ref && !item.name)
          push(path, "referencia-orfa", `${campo} sem @id nem name (entidade indefinida)`);
      }
    }
  }

  // 4 · Claims não comprovadas --------------------------------------------
  for (const n of nodes)
    for (const c of CLAIMS)
      if (c.test(n)) push(path, "claim-nao-comprovada", `${tipos(n).join("/") || "nó"}: ${c.msg}`);

  // 5 · Duplicação/instabilidade em páginas locais -------------------------
  if (local) {
    for (const tipo of ENTIDADES_UNICAS) {
      const doTipo = nodes.filter((n) => temTipo(n, tipo));
      if (doTipo.length > 1)
        push(path, "schema-duplicado", `${doTipo.length} nós do tipo ${tipo} na mesma página local`);
    }
    const repetidos = new Map();
    for (const n of nodes) {
      // Referência curta (`{"@id": ...}` sem @type) é o padrão correto de
      // ligação entre nós — só conta como declaração o nó que traz @type.
      if (!n["@id"] || !n["@type"]) continue;
      repetidos.set(n["@id"], (repetidos.get(n["@id"]) ?? 0) + 1);
    }
    for (const [id, qtd] of repetidos)
      if (qtd > 1) push(path, "schema-duplicado", `@id "${id}" declarado ${qtd}× na mesma página`);
  }
}

if (assinaturasOrg.size > 1)
  push("*", "entidade-divergente", `Organization com ${assinaturasOrg.size} assinaturas diferentes entre páginas`);
if (assinaturasNap.size > 1)
  push("*", "entidade-divergente", `NAP de LocalBusiness com ${assinaturasNap.size} variações entre páginas`);

const porTipo = problemas.reduce((acc, p) => ({ ...acc, [p.tipo]: (acc[p.tipo] ?? 0) + 1 }), {});
const out = {
  geradoEm: new Date().toISOString(),
  fonte: DIST,
  urlsAnalisadas: analisadas.length,
  assinaturasOrganization: assinaturasOrg.size,
  assinaturasNap: assinaturasNap.size,
  problemas,
  porTipo,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/entity-consistency.json", `${JSON.stringify(out, null, 2)}\n`);
writeFileSync(
  "reports/entity-consistency.md",
  [
    "# Consistência de entidade — Organization / LocalBusiness / author",
    "",
    `Gerado em ${out.geradoEm} · fonte \`${DIST}\` · ${out.urlsAnalisadas} URLs curadas.`,
    "",
    `- Assinaturas distintas de Organization: **${out.assinaturasOrganization}** (esperado 1)`,
    `- Variações de NAP em LocalBusiness: **${out.assinaturasNap}** (esperado 1)`,
    `- Problemas encontrados: **${problemas.length}**`,
    "",
    problemas.length
      ? ["| URL | Tipo | Problema |", "| --- | --- | --- |", ...problemas.map((p) => `| ${p.path} | ${p.tipo} | ${p.msg} |`)].join("\n")
      : "Sem divergências de entidade, claims ou schema duplicado.",
    "",
  ].join("\n"),
);

if (args.includes("--json")) console.log(JSON.stringify(out, null, 2));
console.log(
  `[entidade] ${out.urlsAnalisadas} URLs · ${problemas.length} problema(s) → reports/entity-consistency.md`,
);
for (const p of problemas.slice(0, 25)) console.log(`  · ${p.path} [${p.tipo}] ${p.msg}`);
if (problemas.length > 25) console.log(`  … +${problemas.length - 25}`);

if (GATE && problemas.length) process.exit(1);
