#!/usr/bin/env node
/**
 * GATE — INVENTÁRIO DE ORIGENS × CSP (Prompt 12, Fase 5 offline).
 *
 * Substitui, de forma determinística, a coleta de violações no navegador
 * quando não há Chromium disponível: varre o bundle emitido (dist/) e confere
 * se TODA origem externa referenciada está autorizada por alguma diretiva da
 * política em scripts/lib/security-headers.mjs.
 *
 * O que é analisado:
 *   - HTML pré-renderizado: <script src>, <link href>, <img src>, <iframe src>,
 *     preconnect/dns-prefetch;
 *   - JavaScript emitido: literais de URL absoluta usados em fetch/connect.
 *
 * O que NÃO é analisado (limitação registrada):
 *   - violações que só aparecem em runtime (ex.: origem montada por
 *     concatenação de strings) — exigem CSP Report-Only observada no
 *     navegador, via DevTools, após o deploy.
 *
 * Este gate NÃO escreve nada, não acessa banco e não imprime segredos.
 *
 * Uso:  node scripts/check-csp-inventory.mjs [dist]
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { CSP_DIRECTIVES } from "./lib/security-headers.mjs";

const DIST = path.resolve(process.argv[2] || "dist");

if (!existsSync(DIST)) {
  console.log(`[csp-inventory] dist ausente em ${DIST} — rode "npm run build" antes. Ignorando.`);
  process.exit(0);
}

/**
 * Origens que aparecem no HTML como destino de navegação/citação editorial
 * (href de <a>, links de fontes E-E-A-T, JSON-LD @id/schema.org). Não são
 * subrecursos carregados pelo navegador, logo não passam pela CSP.
 */
const NAO_E_SUBRECURSO = /^(https:\/\/schema\.org|https:\/\/wa\.me|https:\/\/api\.whatsapp\.com)/;

const origemDe = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

const autorizada = (origem, diretivas) =>
  diretivas.some((d) => (CSP_DIRECTIVES[d] ?? []).some((v) => v === origem || v === "https:"));

function arquivos(dir, ext) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = path.join(dir, e);
    const s = statSync(f);
    if (s.isDirectory()) out.push(...arquivos(f, ext));
    else if (ext.some((x) => f.endsWith(x))) out.push(f);
  }
  return out;
}

/** origem -> { diretivas:Set, exemplos:Set } */
const inventario = new Map();
const registrar = (url, diretiva, ondeVisto) => {
  const origem = origemDe(url);
  if (!origem || NAO_E_SUBRECURSO.test(origem)) return;
  if (origem === "https://tecnico.curitiba.br") return; // 'self'
  const reg = inventario.get(origem) ?? { diretivas: new Set(), exemplos: new Set() };
  reg.diretivas.add(diretiva);
  if (reg.exemplos.size < 3) reg.exemplos.add(ondeVisto);
  inventario.set(origem, reg);
};

// ── 1. HTML pré-renderizado
for (const f of arquivos(DIST, [".html"])) {
  const html = readFileSync(f, "utf8");
  const rel = path.relative(DIST, f);
  for (const m of html.matchAll(/<script[^>]+src="(https?:\/\/[^"]+)"/gi)) registrar(m[1], "script-src", rel);
  for (const m of html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/gi)) registrar(m[1], "img-src", rel);
  for (const m of html.matchAll(/<iframe[^>]+src="(https?:\/\/[^"]+)"/gi)) registrar(m[1], "frame-src", rel);
  for (const m of html.matchAll(/<link[^>]+rel="(?:stylesheet)"[^>]+href="(https?:\/\/[^"]+)"/gi))
    registrar(m[1], "style-src", rel);
  for (const m of html.matchAll(/<link[^>]+rel="(?:preconnect|dns-prefetch)"[^>]+href="(https?:\/\/[^"]+)"/gi))
    registrar(m[1], "connect-src", rel);
}

// ── 2. JavaScript emitido: literais passados a fetch/EventSource/WebSocket
for (const f of arquivos(path.join(DIST, "assets"), [".js"])) {
  const js = readFileSync(f, "utf8");
  const rel = path.relative(DIST, f);
  for (const m of js.matchAll(/["'`](https?:\/\/[a-z0-9.-]+\.[a-z]{2,}[^"'`\s]*)["'`]/gi))
    registrar(m[1], "connect-src", rel);
  for (const m of js.matchAll(/["'`](wss:\/\/[a-z0-9.-]+[^"'`\s]*)["'`]/gi))
    registrar(m[1], "connect-src", rel);
}

const linhas = [...inventario.entries()].sort(([a], [b]) => a.localeCompare(b));
const naoAutorizadas = linhas.filter(([o, r]) => !autorizada(o, [...r.diretivas]));

console.log(`\n[csp-inventory] ${linhas.length} origem(ns) externa(s) referenciada(s) em ${DIST}\n`);
for (const [origem, r] of linhas) {
  const ok = autorizada(origem, [...r.diretivas]);
  console.log(
    `  ${ok ? "✔" : "✗"} ${origem.padEnd(46)} ${[...r.diretivas].join(",").padEnd(14)} ` +
      `(${[...r.exemplos][0] ?? ""})`,
  );
}

if (naoAutorizadas.length) {
  console.error(
    `\n[csp-inventory] BLOQUEADO: ${naoAutorizadas.length} origem(ns) sem autorização na CSP.\n` +
      "Autorize na diretiva correta em scripts/lib/security-headers.mjs (com consumidor real\n" +
      "identificado) ou remova a referência do código.\n",
  );
  process.exit(1);
}

console.log("\n[csp-inventory] OK — nenhuma origem externa fora da política CSP.\n");
