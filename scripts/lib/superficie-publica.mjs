/**
 * CLASSIFICAÇÃO DE SUPERFÍCIE PARA O FREEZE DO EXPERIMENTO
 *
 * Nem toda mudança de código é uma intervenção de SEO. O experimento D0→D14 só
 * é contaminado quando muda o HTML público de uma URL curada. Este módulo é a
 * fonte única dessa distinção.
 *
 *  ADMIN_CHANGE               → painéis internos, autenticados, fora do índice.
 *  CI_CHANGE                  → scripts, gates, workflows, dependências.
 *  OBSERVABILITY_CHANGE       → relatórios, snapshots, ledger, documentação.
 *  NON_CURATED_PUBLIC_CHANGE  → rotas públicas fora do conjunto curado.
 *  PUBLIC_CHANGE              → superfície pública curada: afeta o experimento.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const IGNORAR = new Set([
  "node_modules", ".git", "dist", ".output", ".vite", ".cache", "coverage",
  "playwright-report", "test-results", "merged-report", "all-blob-reports", ".nitro",
]);

/** Rotas públicas que existem fora do conjunto curado (não entram no sitemap). */
const PUBLICO_NAO_CURADO = [
  "src/pages/OrdemDeServico",
  "src/pages/admin/",
  "src/lib/os/",
  "src/routes/ordem-de-servico",
  "src/routes/api/",
];

const ADMIN = ["src/pages/admin/", "src/components/admin/", "src/routes/admin", "src/hooks/useAdminAuth"];
const CI = [".github/", "scripts/", "e2e/", "playwright", "vitest", "package.json", "package-lock.json",
  "bun.lockb", "tsconfig", "eslint", "lighthouserc", "vite.config", "supabase/"];
const OBSERVABILIDADE = ["reports/", "docs/", ".lovable/", "public/fotos/manifest"];

const ehJsonArtefato = (rel) => rel.startsWith("public/") && rel.endsWith(".json") && !rel.includes("/fotos/");

/** @returns {"ADMIN_CHANGE"|"CI_CHANGE"|"OBSERVABILITY_CHANGE"|"NON_CURATED_PUBLIC_CHANGE"|"PUBLIC_CHANGE"|"IGNORED"} */
export function classificarArquivo(rel) {
  const p = rel.replace(/\\/g, "/");
  if (ADMIN.some((a) => p.startsWith(a) || p.includes(a))) return "ADMIN_CHANGE";
  if (PUBLICO_NAO_CURADO.some((a) => p.startsWith(a))) return "NON_CURATED_PUBLIC_CHANGE";
  if (CI.some((a) => p.startsWith(a) || p.includes(a))) return "CI_CHANGE";
  if (OBSERVABILIDADE.some((a) => p.startsWith(a)) || ehJsonArtefato(p)) return "OBSERVABILITY_CHANGE";
  if (p.startsWith("src/") || p.startsWith("public/") || p === "index.html") return "PUBLIC_CHANGE";
  return "IGNORED";
}

/** Percorre o repositório e devolve `{ rel: { hash, classe } }` (determinístico). */
export function impressaoDigitalRepo(raiz = process.cwd()) {
  const saida = {};
  const andar = (dir) => {
    for (const nome of readdirSync(dir).sort()) {
      if (IGNORAR.has(nome) || nome.startsWith(".DS")) continue;
      const abs = path.join(dir, nome);
      const st = statSync(abs);
      if (st.isDirectory()) { andar(abs); continue; }
      const rel = path.relative(raiz, abs).replace(/\\/g, "/");
      const classe = classificarArquivo(rel);
      if (classe === "IGNORED") continue;
      saida[rel] = {
        hash: createHash("sha256").update(readFileSync(abs)).digest("hex").slice(0, 32),
        classe,
      };
    }
  };
  andar(raiz);
  return saida;
}

export default { classificarArquivo, impressaoDigitalRepo };
