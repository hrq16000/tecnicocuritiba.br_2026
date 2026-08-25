#!/usr/bin/env node
/**
 * GATE FAIL-CLOSED — PRIVACIDADE DA ORDEM DE SERVIÇO
 *
 * Impede que qualquer superfície de O.S. administrativa escape para o índice:
 *  1. rotas /admin/ordens* precisam declarar noindex;
 *  2. nenhuma URL de O.S. pode aparecer em sitemaps públicos;
 *  3. nenhum dado de O.S. pode ser enviado para analytics (PII);
 *  4. nenhuma página pública pode importar os server functions de O.S.;
 *  5. nada de service_role/chave secreta em código de frontend.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const falhas = [];
const ok = [];

const ler = (p) => readFileSync(path.join(raiz, p), "utf8");

// 1. rotas admin de O.S. com noindex
const rotasOs = readdirSync(path.join(raiz, "src/routes")).filter((f) =>
  f.startsWith("admin.ordens"),
);
if (rotasOs.length === 0) falhas.push("Nenhuma rota admin.ordens encontrada.");
for (const f of rotasOs) {
  const src = ler(`src/routes/${f}`);
  if (!/noindex/.test(src)) falhas.push(`Rota sem noindex: src/routes/${f}`);
}
ok.push(`${rotasOs.length} rota(s) admin de O.S. com noindex`);

// 2. sitemaps públicos sem O.S.
const sitemaps = readdirSync(path.join(raiz, "public")).filter(
  (f) => f.startsWith("sitemap") && f.endsWith(".xml"),
);
for (const f of sitemaps) {
  const src = ler(`public/${f}`);
  if (/\/admin|ordem-de-servico|ordens/i.test(src)) {
    falhas.push(`Sitemap expõe superfície de O.S.: public/${f}`);
  }
}
ok.push(`${sitemaps.length} sitemap(s) sem URL de O.S.`);

// 3. analytics sem PII de O.S.
const CAMPOS_PII = ["telefone", "cliente_nome", "clienteNome", "diagnostico", "numeroSerie"];
const arquivosAnalytics = ["src/lib/analytics.ts", "src/lib/funnelAnalytics.ts", "src/lib/clickInsights.ts"]
  .filter((p) => existsSync(path.join(raiz, p)));
for (const p of arquivosAnalytics) {
  const src = ler(p);
  // Só conta uso real do dado (propriedade lida/atribuída), não menções em
  // listas de bloqueio de PII nem em comentários.
  const linhas = src.split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
  for (const campo of CAMPOS_PII) {
    const uso = new RegExp(`(\\.${campo}\\b|\\b${campo}\\s*[:=][^:=])`);
    if (linhas.some((l) => uso.test(l))) falhas.push(`Campo sensível "${campo}" em ${p}`);
  }
}
ok.push(`${arquivosAnalytics.length} módulo(s) de analytics sem PII de O.S.`);

// 4. server functions de O.S. só em superfície administrativa
const alcance = [];
const andar = (dir) => {
  for (const nome of readdirSync(path.join(raiz, dir), { withFileTypes: true })) {
    const rel = `${dir}/${nome.name}`;
    if (nome.isDirectory()) andar(rel);
    else if (/\.tsx?$/.test(nome.name) && ler(rel).includes("os/osAdmin.functions")) alcance.push(rel);
  }
};
andar("src");
for (const p of alcance) {
  const administrativo =
    p.includes("/admin/") || p.includes("admin.ordens") || p.includes("/os/") || p.includes("__tests__");
  if (!administrativo) falhas.push(`Superfície pública importa O.S. admin: ${p}`);
}
ok.push(`${alcance.length} import(s) de O.S. admin, todos em superfície interna`);

// 5. segredos fora do servidor
for (const p of ["src/lib/os/osAdmin.functions.ts", "src/lib/os/osAdminPdf.ts"]) {
  if (/SERVICE_ROLE|sb_secret_/.test(ler(p))) falhas.push(`Segredo referenciado em ${p}`);
}
ok.push("nenhuma referência a service_role no código de O.S. administrativo");

console.log("GATE — PRIVACIDADE DE O.S.\n");
for (const o of ok) console.log(`  ✓ ${o}`);
if (falhas.length) {
  console.error("\n🚨 OS_PRIVACY_LEAK");
  for (const f of falhas) console.error(`  • ${f}`);
  process.exit(1);
}
console.log("\nPASS — nenhuma exposição pública de O.S.");
