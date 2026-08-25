#!/usr/bin/env node
/**
 * ============================================================================
 * FASE FINAL — APLICA A CONSOLIDAÇÃO DAS URLs LOCAIS
 * ============================================================================
 * Lê `reports/servico-bairro-decisions.json` e materializa as decisões:
 *
 *  1. `src/lib/consolidatedLocalUrls.ts` — fonte única dos 301 de consolidação
 *     (importada por `redirectMatrix.ts`, pelos gates e pelo sitemap).
 *  2. Rotas estáticas das URLs consolidadas passam a ser rotas de redirect 301.
 *
 * Nada é inventado: só entram no arquivo os paths com decisão CONSOLIDATE.
 * Uso: node scripts/apply-local-consolidation.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const decisions = JSON.parse(
  fs.readFileSync(path.join(ROOT, "reports/servico-bairro-decisions.json"), "utf8"),
);

const consolidados = decisions.decisoes
  .filter((d) => d.decisao === "CONSOLIDATE")
  .map((d) => ({ from: d.path, to: d.melhorDestinoAlternativo, motivo: d.motivo }))
  .sort((a, b) => a.from.localeCompare(b.from));

const ts = `/**
 * ============================================================================
 * URLs LOCAIS CONSOLIDADAS (FASE FINAL) — ARQUIVO GERADO
 * ============================================================================
 * Gerado por \`scripts/apply-local-consolidation.mjs\` a partir de
 * \`reports/servico-bairro-decisions.json\`. NÃO editar à mão.
 *
 * Cada entrada é uma landing serviço × bairro que não sustentava intenção
 * independente (texto quase idêntico às irmãs, sem demanda observada) e passou
 * a redirecionar 301 para a página-pilar semanticamente mais próxima.
 * Consolidada ⇒ fora do sitemap, fora da malha interna, sem canonical próprio.
 */

export interface ConsolidatedLocalUrl {
  /** Path consolidado (301 de origem). */
  from: string;
  /** Destino canônico e indexável. */
  to: string;
  /** Evidência editorial que motivou a consolidação. */
  motivo: string;
}

export const CONSOLIDATED_LOCAL_URLS: ConsolidatedLocalUrl[] = ${JSON.stringify(
  consolidados,
  null,
  2,
)};

export const CONSOLIDATED_LOCAL_PATHS = new Set(
  CONSOLIDATED_LOCAL_URLS.map((r) => r.from),
);

export function getConsolidatedTarget(pathname: string): string | null {
  const clean = pathname.replace(/\\/+$/, "") || "/";
  return CONSOLIDATED_LOCAL_URLS.find((r) => r.from === clean)?.to ?? null;
}
`;

fs.writeFileSync(path.join(ROOT, "src/lib/consolidatedLocalUrls.ts"), ts);

// Espelho para scripts Node (gates, sitemap, interlinking).
const mjs = `/**
 * Espelho Node do contrato de consolidação local (ARQUIVO GERADO).
 * Gerado por \`scripts/apply-local-consolidation.mjs\`. NÃO editar à mão.
 */
export const CONSOLIDATED_LOCAL_URLS = ${JSON.stringify(consolidados, null, 2)};

export const CONSOLIDATED_LOCAL_PATHS = new Set(
  CONSOLIDATED_LOCAL_URLS.map((r) => r.from),
);
`;
fs.writeFileSync(path.join(ROOT, "scripts/lib/consolidated-local-urls.mjs"), mjs);

// ── Rotas estáticas das URLs consolidadas → rotas de redirect 301 ───────────
let rotasReescritas = 0;
for (const { from, to } of consolidados) {
  const file = path.join(ROOT, "src/routes", `${from.slice(1).split("/").join(".")}.tsx`);
  if (!fs.existsSync(file)) continue;
  const content = `import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidada na Fase Final: sem intenção independente comprovada.
export const Route = createFileRoute("${from}")({
  beforeLoad: () => {
    throw redirect({ to: "${to}", statusCode: 301 });
  },
});
`;
  fs.writeFileSync(file, content);
  rotasReescritas += 1;
}

console.log(`[consolidacao] ${consolidados.length} URLs consolidadas`);
console.log(`[consolidacao] ${rotasReescritas} rotas estáticas convertidas em 301`);
console.log("  → src/lib/consolidatedLocalUrls.ts");
console.log("  → scripts/lib/consolidated-local-urls.mjs");
