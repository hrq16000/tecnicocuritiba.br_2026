/**
 * LASTMOD DINÂMICO POR FONTE REAL (Rodada 1)
 *
 * Deriva a data de última modificação de uma URL a partir do histórico do Git
 * dos arquivos que realmente produzem aquela página (arquivo de rota +
 * módulos locais importados por ele). Nunca usa a data do build.
 *
 * Combinação com `scripts/lib/lastmod.mjs`:
 *   lastmod = max(data declarada, data real do commit)  — limitada a hoje.
 *
 * Se o Git não estiver disponível (tarball, sandbox), o módulo degrada para
 * `null` e o sitemap volta a usar apenas a data declarada.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOJE = new Date().toISOString().slice(0, 10);

let gitOk = true;
const gitCache = new Map();

/** Data (YYYY-MM-DD) do último commit que tocou o arquivo. */
function gitDate(file) {
  if (!gitOk) return null;
  if (gitCache.has(file)) return gitCache.get(file);
  let out = null;
  try {
    out =
      execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() || null;
  } catch {
    gitOk = false;
    out = null;
  }
  if (out && !/^\d{4}-\d{2}-\d{2}$/.test(out)) out = null;
  gitCache.set(file, out);
  return out;
}

/** Índice path da rota → arquivo em src/routes. */
function buildRouteIndex() {
  const dir = path.join(ROOT, "src/routes");
  const index = new Map();
  if (!existsSync(dir)) return index;
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry) && !entry.endsWith(".gen.ts")) {
        const src = readFileSync(full, "utf8");
        for (const m of src.matchAll(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/g)) {
          const route = m[1].replace(/\/$/, "") || "/";
          if (!route.includes("$")) index.set(route, full);
        }
      }
    }
  };
  walk(dir);
  return index;
}

let routeIndex = null;

/** Resolve `@/x` para um arquivo real em src/. */
function resolveAlias(spec) {
  if (!spec.startsWith("@/")) return null;
  const base = path.join(ROOT, "src", spec.slice(2));
  for (const cand of [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")]) {
    if (existsSync(cand) && statSync(cand).isFile()) return cand;
  }
  return null;
}

/**
 * Data real de modificação do conteúdo desta URL, ou null quando não há
 * fonte identificável (rota dinâmica, arquivo ausente ou Git indisponível).
 */
export function sourceLastmodFor(routePath) {
  routeIndex ??= buildRouteIndex();
  const file = routeIndex.get(routePath.replace(/\/$/, "") || "/");
  if (!file) return null;

  const files = new Set([file]);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/from\s+["'](@\/[^"']+)["']/g)) {
    const resolved = resolveAlias(m[1]);
    // Só conta módulos de página/conteúdo: libs de UI compartilhada gerariam
    // carimbo em massa sem mudança real de conteúdo da URL.
    if (resolved && /\/(pages|content)\//.test(resolved)) files.add(resolved);
  }

  let newest = null;
  for (const f of files) {
    const d = gitDate(path.relative(ROOT, f));
    if (d && (!newest || d > newest)) newest = d;
  }
  return newest && newest <= HOJE ? newest : newest ? HOJE : null;
}

/** max(declarado, git), sem passar de hoje. */
export function effectiveLastmod(routePath, declared) {
  const real = sourceLastmodFor(routePath);
  const best = [declared, real].filter(Boolean).sort().pop() ?? null;
  if (!best) return null;
  return best > HOJE ? HOJE : best;
}
