#!/usr/bin/env node
/**
 * GATE — INTERLINKING DO HUB "empresa de TI em Curitiba"
 *
 * Garante que o hub aponte DIRETAMENTE para todas as páginas de suporte
 * empresarial e de manutenção declaradas em scripts/lib/comercial-onda2.mjs,
 * e que nenhum link interno do hub aponte para rota inexistente/não curada.
 *
 * Uso: node scripts/check-hub-empresarial-links.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { CURATED_PATHS, HUB, HUB_LINKS_OBRIGATORIOS } from "./lib/comercial-onda2.mjs";

const FILE = "src/pages/EmpresaDeTiCuritiba.tsx";
if (!existsSync(FILE)) {
  console.error(`✖ hub não encontrado: ${FILE}`);
  process.exit(1);
}
const src = readFileSync(FILE, "utf8");

const links = new Set();
// Cobre JSX (`to="/x"` / `href="/x"`) e listas de dados (`to: "/x"`).
for (const m of src.matchAll(/(?:to|href)\s*[:=]\s*["'](\/[^"'#?]*)["']/g)) {
  links.add(m[1].replace(/\/$/, "") || "/");
}

const curados = new Set(CURATED_PATHS);
const faltando = HUB_LINKS_OBRIGATORIOS.filter((p) => !links.has(p));
const quebrados = [...links].filter(
  (p) => p !== "/" && !curados.has(p) && !p.startsWith("/blog/") && !p.startsWith("/problemas/") && !p.startsWith("/admin"),
);

console.log(`Hub ${HUB.path}: ${links.size} links internos · ${HUB_LINKS_OBRIGATORIOS.length} obrigatórios`);
if (faltando.length) {
  console.error("\n✖ links obrigatórios ausentes no hub:");
  for (const p of faltando) console.error(`  · ${p}`);
}
if (quebrados.length) {
  console.error("\n✖ links do hub fora do manifesto curado (possível 404 / noindex):");
  for (const p of quebrados) console.error(`  · ${p}`);
}
if (faltando.length || quebrados.length) {
  console.error("\nComo resolver: adicione o link em `relacionados` do hub ou remova o destino não curado.");
  process.exit(1);
}
console.log("✔ hub empresarial linka todas as páginas de suporte/manutenção, sem links quebrados.");
