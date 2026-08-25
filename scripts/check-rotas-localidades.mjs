#!/usr/bin/env node
/**
 * GATE FAIL-CLOSED — INTEGRIDADE DE LINKS DO MAPA DE LOCALIDADES
 * ============================================================================
 * Garante que TODA localidade listada em src/lib/bairrosBaseline.ts
 * (45 bairros de Curitiba + 9 municípios da RMC) e todo serviço linkado nas
 * páginas de bairro possuem rota real em src/routes — ou seja: nenhum chip do
 * hub /areas-atendidas pode apontar para 404.
 *
 * Uso:
 *   node scripts/check-rotas-localidades.mjs            # estático (CI)
 *   node scripts/check-rotas-localidades.mjs --live     # + HTTP 200 e SSR (H1)
 *   BASE_URL=http://localhost:8080 ... --live
 *
 * Páginas baseline (noindex) são válidas: o requisito é EXISTIR, não indexar.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTES_DIR = resolve(ROOT, "src/routes");
const LIVE = process.argv.includes("--live");
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

const src = readFileSync(resolve(ROOT, "src/lib/bairrosBaseline.ts"), "utf8");

const alvos = [
  ...[...src.matchAll(/bairro\("([^"]+)",\s*"([^"]+)"\)/g)].map((m) => ({
    nome: m[1],
    to: `/bairros/${m[2]}`,
    tipo: "bairro",
  })),
  ...[...src.matchAll(/\{\s*nome:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g)].map((m) => ({
    nome: m[1],
    to: m[2],
    tipo: "cidade",
  })),
  ...[...src.matchAll(/\{\s*to:\s*"([^"]+)",\s*label:\s*"([^"]+)"\s*\}/g)].map((m) => ({
    nome: m[2],
    to: m[1],
    tipo: "servico",
  })),
];

if (alvos.length < 60) {
  console.error(`✖ Parser encontrou apenas ${alvos.length} alvos — mapeamento suspeito.`);
  process.exit(1);
}

const arquivos = new Set(readdirSync(ROUTES_DIR));
const temRota = (to) => {
  const base = to.replace(/^\//, "").replace(/\/$/, "");
  const dotted = base.replace(/\//g, ".");
  return (
    arquivos.has(`${dotted}.tsx`) ||
    arquivos.has(`${dotted}.ts`) ||
    arquivos.has(`${dotted}.index.tsx`) ||
    existsSync(resolve(ROUTES_DIR, base, "index.tsx"))
  );
};

const faltando = alvos.filter((a) => !temRota(a.to));

const falhasLive = [];
if (LIVE) {
  for (const alvo of alvos) {
    try {
      const res = await fetch(BASE_URL + alvo.to);
      const html = await res.text();
      const temH1 = /<h1[\s>]/i.test(html);
      if (res.status !== 200 || !temH1) {
        falhasLive.push(`${alvo.to} → HTTP ${res.status}${temH1 ? "" : " (SSR sem <h1>)"}`);
      }
    } catch (err) {
      falhasLive.push(`${alvo.to} → ${err.message}`);
    }
  }
}

const bairros = alvos.filter((a) => a.tipo === "bairro").length;
const cidades = alvos.filter((a) => a.tipo === "cidade").length;
const servicos = alvos.filter((a) => a.tipo === "servico").length;

console.log(
  `Mapa de localidades: ${bairros} bairros + ${cidades} cidades RMC + ${servicos} serviços interligados`,
);

if (faltando.length) {
  console.error("✖ ROTAS INEXISTENTES (link quebrado / 404):");
  for (const f of faltando) console.error(`   - ${f.nome} → ${f.to}`);
}
if (falhasLive.length) {
  console.error(`✖ FALHAS LIVE em ${BASE_URL}:`);
  for (const f of falhasLive) console.error(`   - ${f}`);
}

if (faltando.length || falhasLive.length) process.exit(1);

console.log(`✓ ${alvos.length} destinos com rota real${LIVE ? " e HTTP 200 + SSR válido" : ""}.`);
