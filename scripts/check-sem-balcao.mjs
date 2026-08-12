// ============================================================================
// GATE: POLÍTICA "SEM BALCÃO" — só coleta e entrega
// ============================================================================
// A operação não tem balcão de atendimento ao público. Nenhuma copy pode
// convidar o cliente a levar o equipamento até nós, nem prometer loja física.
// Fonte única do texto: src/lib/precosConfig.ts (REGRA_SEM_BALCAO).
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const PROIBIDOS = [
  { re: /traga (?:o|a|seu|sua) [\wçãáéíóêôõ-]+ (?:à|na|para a) (?:oficina|loja)/gi, motivo: "convida o cliente a levar o equipamento" },
  { re: /trazer (?:o|a|seu|sua)? ?[\wçãáéíóêôõ-]* ?(?:à|na|para a) (?:oficina|loja)/gi, motivo: "convida o cliente a levar o equipamento" },
  { re: /presencial(?:mente)? na oficina/gi, motivo: "sugere atendimento de balcão" },
  { re: /balc[ãa]o de atendimento(?! ao p[úu]blico[:,]? o equipamento| ao p[úu]blico\.)/gi, motivo: "menciona balcão fora da negativa oficial" },
  { re: /(?:nossa|nossa nova) loja f[íi]sica/gi, motivo: "promete loja física inexistente" },
  { re: /venha at[ée] (?:n[óo]s|nossa)/gi, motivo: "convida visita do cliente" },
];

// Arquivos de conteúdo público (src), excluindo scripts e testes do próprio gate.
const files = execSync('rg -l --glob "src/**/*.{ts,tsx}" "" src', { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => f && !f.endsWith(".test.ts") && !f.endsWith(".test.tsx"));

const violacoes = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const { re, motivo } of PROIBIDOS) {
    for (const m of src.matchAll(re)) {
      const linha = src.slice(0, m.index).split("\n").length;
      violacoes.push(`${file}:${linha} — "${m[0].trim()}" (${motivo})`);
    }
  }
}

// A regra oficial precisa continuar existindo em fonte única.
const cfg = readFileSync("src/lib/precosConfig.ts", "utf8");
if (!/export const REGRA_SEM_BALCAO\s*=/.test(cfg)) {
  violacoes.push("src/lib/precosConfig.ts — REGRA_SEM_BALCAO removida da fonte única");
}
if (!/export const GATILHO_COLETA_SEM_CUSTO\s*=/.test(cfg)) {
  violacoes.push("src/lib/precosConfig.ts — GATILHO_COLETA_SEM_CUSTO removido da fonte única");
}

if (violacoes.length) {
  console.error("✖ check:sem-balcao — copy incompatível com a operação (só coleta e entrega):");
  for (const v of violacoes) console.error("  • " + v);
  process.exit(1);
}
console.log(`✔ check:sem-balcao — ${files.length} arquivos sem convite a balcão; regra em fonte única.`);
