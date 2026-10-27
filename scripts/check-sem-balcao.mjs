// ============================================================================
// GATE: POLÍTICA "SEM BALCÃO" — só coleta e entrega
// ============================================================================
// A operação não tem balcão de atendimento ao público. Nenhuma copy pode
// convidar o cliente a levar o equipamento até nós, nem prometer loja física.
// Fonte única do texto: src/lib/precosConfig.ts (REGRA_SEM_BALCAO).
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PROIBIDOS = [
  { re: /traga (?:o|a|seu|sua) [\wçãáéíóêôõ-]+ (?:à|na|para a) (?:oficina|loja)/gi, motivo: "convida o cliente a levar o equipamento" },
  { re: /trazer (?:o|a|seu|sua)? ?[\wçãáéíóêôõ-]* ?(?:à|na|para a) (?:oficina|loja)/gi, motivo: "convida o cliente a levar o equipamento" },
  { re: /presencial(?:mente)? na oficina/gi, motivo: "sugere atendimento de balcão" },
  { id: "balcao", re: /balc[ãa]o de atendimento(?! ao p[úu]blico[:,]? o equipamento| ao p[úu]blico\.)/gi, motivo: "menciona balcão fora da negativa oficial" },
  { re: /(?:nossa|nossa nova) loja f[íi]sica/gi, motivo: "promete loja física inexistente" },
  { re: /venha at[ée] (?:n[óo]s|nossa)/gi, motivo: "convida visita do cliente" },
];

// Arquivos de conteúdo público (src), excluindo scripts e testes do próprio gate.
const files = [];
function collectFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    // Como no rg: arquivos ocultos não são superfícies de conteúdo público.
    if (entry.name.startsWith(".")) continue;
    const file = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(file);
    else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) files.push(file);
  }
}
collectFiles("src");

const violacoes = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const { id, re, motivo } of PROIBIDOS) {
    for (const m of src.matchAll(re)) {
      // A negativa explícita descreve a operação; não oferece atendimento físico.
      const before = src.slice(Math.max(0, m.index - 16), m.index);
      const after = src.slice(m.index + m[0].length);
      if (id === "balcao" && /não temos\s+$/i.test(before) && /^ ao p[úu]blico[:.]/i.test(after)) continue;
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
