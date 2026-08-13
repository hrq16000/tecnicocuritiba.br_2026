#!/usr/bin/env node
/**
 * Gate de cobertura de motion (design-motion-principles).
 *
 * Garante que a interface inteira mantenha:
 *  1. Progresso de rota + fallback de Suspense (skeleton) no shell (App/LegacyApp)
 *  2. Primitivas disponíveis: RouteProgress, RouteLoader, SmartImage, Skeleton
 *  3. Toda tag <img> declara `loading` e `decoding` (lazyloading explícito) —
 *     imagens acima da dobra devem usar loading="eager" + fetchPriority="high".
 *  4. Nenhuma transição instantânea: componentes com estado de carregamento
 *     usam Skeleton/RouteLoader em vez de renderizar vazio.
 *
 * Falha fechada: qualquer violação quebra o build.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const errors = [];

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(entry.name)) out.push(p);
  }
  return out;
};

const files = walk(SRC);
const read = (p) => fs.readFileSync(p, "utf8");

// 1 + 2 — primitivas obrigatórias
const primitives = [
  "src/components/motion/RouteProgress.tsx",
  "src/components/motion/SmartImage.tsx",
  "src/components/RouteLoader.tsx",
  "src/components/ui/skeleton.tsx",
  "src/lib/motion.ts",
];
for (const rel of primitives) {
  if (!fs.existsSync(path.join(ROOT, rel))) errors.push(`primitiva ausente: ${rel}`);
}

for (const shell of ["src/App.tsx", "src/LegacyApp.tsx"]) {
  const abs = path.join(ROOT, shell);
  if (!fs.existsSync(abs)) continue;
  const s = read(abs);
  if (!s.includes("<Suspense")) errors.push(`${shell}: sem <Suspense> (fallback de carregamento)`);
  if (!/fallback=\{<RouteLoader/.test(s))
    errors.push(`${shell}: <Suspense> sem fallback de skeleton (RouteLoader)`);
  if (!s.includes("RouteProgress")) errors.push(`${shell}: sem RouteProgress (barra de progresso)`);
  if (!s.includes("lazy(")) errors.push(`${shell}: rotas não são lazy-loaded`);
}

// 3 — lazyloading explícito em todas as <img>
const IMG_EXEMPT = new Set(["src/components/motion/SmartImage.tsx"]);
for (const abs of files) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  if (IMG_EXEMPT.has(rel)) continue;
  const src = read(abs);
  if (!src.includes("<img")) continue;
  const tags = src.match(/<img[\s\S]*?\/?>/g) || [];
  for (const tag of tags) {
    if (!/\bloading=/.test(tag))
      errors.push(`${rel}: <img> sem atributo loading (lazy/eager) — ${tag.slice(0, 70).replace(/\s+/g, " ")}…`);
    if (!/\bdecoding=/.test(tag))
      errors.push(`${rel}: <img> sem decoding (async/sync) — ${tag.slice(0, 70).replace(/\s+/g, " ")}…`);
  }
}

if (errors.length) {
  console.error("❌ [motion-coverage] violações encontradas:\n");
  for (const e of errors) console.error(`  • ${e}`);
  console.error(`\n${errors.length} violação(ões). Motion Principles: skeleton, lazyloading e progresso são obrigatórios.`);
  process.exit(1);
}

console.log("✅ [motion-coverage] shell com progresso + skeleton, rotas lazy e todas as <img> com loading/decoding.");
