#!/usr/bin/env node
/**
 * GATE DE COBERTURA E-E-A-T
 *
 * Falha o build quando a página-mãe, as páginas comerciais P0 ou as páginas
 * locais indexáveis ficam sem os mínimos de confiança:
 *
 *   1. Componente de provas E-E-A-T montado na página (data-eeat-section).
 *   2. Identidade verificável no HTML: marca + ano de atuação + praça.
 *      (Razão social, CNPJ e e-mail são PROIBIDOS no HTML público.)
 *   3. Organization/LocalBusiness com o @id institucional canônico.
 *   4. Caminho de verificação: link para /gestor-responsavel e para
 *      /precos-e-politicas (garantia e política de preço).
 *   5. Ausência de "lacuna de confiança": página comercial sem nenhum canal
 *      oficial de contato (wa.me oficial).
 *   6. Ausência de prova não verificável (nota, depoimento, "melhor", "nº 1",
 *      "X mil clientes", certificação sem emissor).
 *
 * Uso: node scripts/check-eeat-coverage.mjs [dist/client]
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "dist/client";
const BASE = "https://tecnico.curitiba.br";
const ORG_ID = `${BASE}/#organization`;
const WA = "wa.me/5541997086380";
const SITEMAPS = ["public/sitemap-bairros.xml", "public/sitemap-regioes.xml"];

const P0 = ["/", "/tecnico-informatica-curitiba", "/atendimento-domicilio", "/empresa-de-ti-curitiba"];

const IDENTITY = [/T[ée]cnico em Curitiba/i, /\b1998\b/, /Curitiba/i];
const UNVERIFIABLE = [
  /\bnota\s*[45](?:[.,]\d)?\s*(?:estrelas|\/\s*5)/i,
  /\b\d+(?:[.,]\d+)?\s*(?:mil\s*)?(?:clientes|atendimentos)\s*(?:satisfeitos|realizados)/i,
  /\bmelhor (?:assist[êe]ncia|t[ée]cnico|empresa)\b/i,
  /\bn[ºo°]\s*1\b/i,
  /\bdepoimento\b/i,
  /\bavalia(?:ç|c)[ãa]o de \d/i,
];

const errors = [];
const warnings = [];
const rows = [];

if (!existsSync(DIST)) {
  console.error(`✖ ${DIST}/ ausente — rode "npm run build" antes do gate.`);
  process.exit(1);
}

const localPaths = [];
for (const f of SITEMAPS) {
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].replace(BASE, "") || "/";
    if (!P0.includes(p)) localPaths.push(p);
  }
}

function htmlOf(path) {
  const file = join(DIST, path === "/" ? "" : path.replace(/^\//, ""), "index.html");
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

/** Componentes montados só existem no bundle React; checamos a fonte da rota. */
const SOURCES = {
  "/": "src/components/home/HomeSections.tsx",
  "/tecnico-informatica-curitiba": "src/pages/TecnicoInformaticaCuritiba.tsx",
  "/atendimento-domicilio": "src/pages/AtendimentoDomicilio.tsx",
  "/empresa-de-ti-curitiba": "src/pages/EmpresaDeTiCuritiba.tsx",
};

for (const path of [...P0, ...localPaths]) {
  const html = htmlOf(path);
  if (!html) {
    errors.push(`${path}: HTML estático ausente em ${DIST}`);
    continue;
  }
  const isP0 = P0.includes(path);
  const row = { path, tier: isP0 ? "P0" : "local", issues: 0 };

  // 1. componente de provas (só exigido nas P0)
  if (isP0) {
    const src = SOURCES[path];
    if (!src || !existsSync(src) || !/EeatProofsSection/.test(readFileSync(src, "utf8"))) {
      errors.push(`${path}: EeatProofsSection não montado em ${src ?? "(fonte desconhecida)"}`);
      row.issues++;
    }
  }

  // 2. identidade verificável
  const missingIdentity = IDENTITY.filter((re) => !re.test(html));
  if (missingIdentity.length) {
    errors.push(`${path}: identidade verificável incompleta no HTML (${missingIdentity.length} item[ns] ausente[s]: marca/ano/praça)`);
    row.issues++;
  }

  // 3. Organization consistente
  const ids = [...html.matchAll(/"@id"\s*:\s*"([^"]*#organization)"/gi)].map((m) => m[1]);
  if (ids.length === 0) {
    errors.push(`${path}: nenhum nó Organization/LocalBusiness com @id institucional`);
    row.issues++;
  } else if (ids.some((id) => id !== ORG_ID)) {
    errors.push(`${path}: @id institucional divergente (${[...new Set(ids)].join(", ")})`);
    row.issues++;
  }

  // 4. caminho de verificação
  for (const link of ["/gestor-responsavel", "/precos-e-politicas"]) {
    if (!html.includes(`href="${link}"`)) {
      if (isP0) {
        errors.push(`${path}: sem link de verificação para ${link}`);
        row.issues++;
      } else {
        warnings.push(`${path}: sem link de verificação para ${link}`);
      }
    }
  }

  // 5. canal oficial
  if (!html.includes(WA)) {
    errors.push(`${path}: nenhum canal oficial de contato (WhatsApp) no HTML — lacuna de confiança`);
    row.issues++;
  }

  // 6. prova não verificável
  for (const re of UNVERIFIABLE) {
    if (re.test(html)) {
      errors.push(`${path}: prova não verificável encontrada (${re})`);
      row.issues++;
    }
  }

  rows.push(row);
}

console.log("── Gate de cobertura E-E-A-T ──");
for (const r of rows) console.log(`  ${r.issues === 0 ? "✓" : "✗"} [${r.tier}] ${r.path}`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} lacuna(s) de E-E-A-T:`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log(`\n✔ E-E-A-T OK em ${rows.length} página(s): identidade verificável, Organization consistente e canal oficial presentes.`);
