#!/usr/bin/env node
/**
 * Valida a exigência de copy exclusiva por bairro para as landings âncora
 * Wi-Fi/TV Smart. Regras:
 *
 *  - Todo bairro com `indexable !== false` em BAIRROS_INDEXAVEIS precisa
 *    render, entre `descricaoLocal + narrativaLocal`, ≥ 200 tokens
 *    "próprios" (não-stopword, não-template). Empiricamente, 200 tokens
 *    próprios ≈ 300 palavras brutas de copy densa e exclusiva — o alvo
 *    editorial acordado na política bairro-pruning.
 *  - Jaccard entre dois bairros indexáveis ≤ 0.55, para evitar canibalização.
 *
 * Fail-closed: bairro indexável sem `narrativaLocal` quebra o build.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";


const STOPWORDS = new Set(
  ("a à ao aos as até com como da das de do dos e em entre é era eram essa esse essas esses esta estas este estes eu foi for foram há isso isto já lhe lhes mais mas me mesmo meu meus minha minhas na nas no nos nós num numa o os ou para pela pelas pelo pelos por qual quando que quem se sem ser será seu seus só sob sobre sua suas também te tem tém tinha tinham um uma umas uns você vocês")
    .split(/\s+/)
);

// Vocabulário genérico do template (marketing puro) — removido antes da
// contagem. Termos técnicos ficam preservados porque descrevem o serviço
// real; a uniqueness cruzada é checada pelo Jaccard abaixo.
const TEMPLATE_VOCAB = new Set([
  "orçamento","whatsapp","curitiba","cliente","aprovação","valor","mínimo",
  "r$","serviço","serviços","atendimento","técnico","técnica","técnicos",
]);

const src = readFileSync(resolve("src/pages/servico-bairro/wifiTvBairroData.ts"), "utf8");

// Extração leve (regex) do bloco BAIRROS_INDEXAVEIS. Suficiente porque o arquivo
// segue estrutura estável e este script roda no CI antes do build.
function extractEntries() {
  const entries = [];
  // Slugs válidos vêm entre aspas ou como chave direta seguindo `,\n  `.
  const bairroBlocks = src.matchAll(/\n  "?([a-z][a-z0-9-]*)"?:\s*\{\s*\n\s*slug:\s*"([a-z0-9-]+)",([\s\S]*?)\n\s{2}\},/g);
  for (const m of bairroBlocks) {
    const slug = m[2];
    const body = m[3];
    const nome = /nome:\s*"([^"]+)"/.exec(body)?.[1] || slug;
    const descricao = /descricaoLocal:\s*\n?\s*"([\s\S]*?)"(?=,\n)/.exec(body)?.[1] || "";
    const narrativa = /narrativaLocal:\s*\n?\s*"([\s\S]*?)"(?=,\n)/.exec(body)?.[1] || "";
    const indexable = /indexable:\s*false/.test(body) ? false : true;
    entries.push({ slug, nome, descricao, narrativa, indexable });
  }
  return entries;
}

function tokenize(text) {
  return (text.toLowerCase().normalize("NFC").match(/[a-záâãàéêíóôõúüç0-9$,]+/g) || [])
    .filter((w) => w.length >= 3)
    .filter((w) => !STOPWORDS.has(w));
}

function ownTokens(text) {
  // Lista (com repetição) usada para contagem de palavras.
  return tokenize(text).filter((w) => !TEMPLATE_VOCAB.has(w));
}
function ownWordSet(text) {
  return new Set(ownTokens(text));
}

function jaccard(a, b) {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const uni = new Set([...a, ...b]);
  return uni.size === 0 ? 0 : inter.size / uni.size;
}

const entries = extractEntries();
const indexable = entries.filter((e) => e.indexable);

let failed = false;
const wordSets = new Map();
const report = { generatedAt: new Date().toISOString(), bairros: [], pairs: [] };

for (const e of indexable) {
  const combined = `${e.descricao} ${e.narrativa}`;
  const tokens = ownTokens(combined);
  const set = ownWordSet(combined);
  wordSets.set(e.slug, set);

  const bairroReport = {
    slug: e.slug,
    nome: e.nome,
    palavrasProprias: tokens.length,
    palavrasUnicas: set.size,
    status: "ok",
  };

  if (!e.narrativa) {
    // Fail-closed desde a onda de reforma: todo bairro indexável precisa de narrativa exclusiva.
    console.error(`[fail] ${e.slug} (${e.nome}) — sem narrativaLocal. Escreva copy exclusiva antes de indexar.`);
    bairroReport.status = "fail:sem-narrativa";
    failed = true;
  } else if (tokens.length < 200) {
    console.error(`[fail] ${e.slug} (${e.nome}) — ${tokens.length} palavras próprias (mínimo 200).`);
    bairroReport.status = "fail:palavras-insuficientes";
    failed = true;
  } else {
    console.log(`[ok]   ${e.slug} (${e.nome}) — ${tokens.length} palavras próprias (${set.size} únicas).`);
  }
  report.bairros.push(bairroReport);
}

const slugs = [...wordSets.keys()];
for (let i = 0; i < slugs.length; i++) {
  for (let j = i + 1; j < slugs.length; j++) {
    const a = wordSets.get(slugs[i]);
    const b = wordSets.get(slugs[j]);
    if (!a || !b || a.size === 0 || b.size === 0) continue;
    const jc = jaccard(a, b);
    const pair = { a: slugs[i], b: slugs[j], jaccard: Number(jc.toFixed(3)) };
    if (jc > 0.55) {
      console.error(`[fail] Jaccard ${slugs[i]} × ${slugs[j]} = ${jc.toFixed(2)} (>0.55).`);
      pair.status = "fail";
      failed = true;
    } else {
      pair.status = "ok";
    }
    report.pairs.push(pair);
  }
}

// Emite relatório humano + JSON em reports/bairro-validation.*
try {
  const md = [
    `# Relatório de Validação de Bairros`,
    ``,
    `Gerado em: ${report.generatedAt}`,
    `Bairros indexáveis: ${indexable.length}`,
    ``,
    `## Contagem de palavras próprias`,
    ``,
    `| Slug | Nome | Palavras próprias | Únicas | Status |`,
    `| --- | --- | --- | --- | --- |`,
    ...report.bairros.map(b => `| ${b.slug} | ${b.nome} | ${b.palavrasProprias} | ${b.palavrasUnicas} | ${b.status} |`),
    ``,
    `## Similaridade Jaccard (limite ≤ 0.55)`,
    ``,
    `| A | B | Jaccard | Status |`,
    `| --- | --- | --- | --- |`,
    ...report.pairs
      .slice()
      .sort((x, y) => y.jaccard - x.jaccard)
      .slice(0, 30)
      .map(p => `| ${p.a} | ${p.b} | ${p.jaccard.toFixed(3)} | ${p.status} |`),
    ``,
    failed ? `**Resultado: FAIL — corrija antes de indexar.**` : `**Resultado: OK — pronto para indexar.**`,
  ].join("\n");
  const mdPath = resolve("reports/bairro-validation.md");
  const jsonPath = resolve("reports/bairro-validation.json");
  mkdirSync(dirname(mdPath), { recursive: true });
  writeFileSync(mdPath, md);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\nRelatório gerado em reports/bairro-validation.{md,json}`);
} catch (err) {
  console.warn(`[warn] falha ao gravar relatório: ${err instanceof Error ? err.message : err}`);
}

if (failed) {
  console.error(`\nbairro-copy: FAIL. Reescreva narrativaLocal dos bairros acima.`);
  process.exit(1);
}
console.log(`\nbairro-copy: OK (${indexable.length} bairros indexáveis).`);

