/**
 * Espelho das FAQs das cidades âncora (src/lib/cidadesData.ts) para o
 * prerender: garante FAQPage no HTML estático em paridade com o que a página
 * realmente exibe. Nenhuma pergunta é inventada aqui — o conteúdo é lido do
 * arquivo de dados no momento do build.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SOURCE = resolve("src/lib/cidadesData.ts");

function parse() {
  const src = readFileSync(SOURCE, "utf8");
  const mapa = new Map();
  // Cada cidade começa em `slug: "<slug>",` e sua FAQ vem no bloco `faqs: [...]`.
  for (const m of src.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) {
    const slug = m[1];
    const trecho = src.slice(m.index);
    const inicio = trecho.indexOf("faqs: [");
    if (inicio === -1) continue;
    const fim = trecho.indexOf("\n    ],", inicio);
    if (fim === -1) continue;
    const bloco = trecho.slice(inicio, fim);
    const itens = [];
    for (const f of bloco.matchAll(
      /\{\s*question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*"((?:[^"\\]|\\.)*)"\s*\}/g,
    )) {
      itens.push({ q: f[1].replace(/\\"/g, '"'), a: f[2].replace(/\\"/g, '"') });
    }
    if (itens.length) mapa.set(slug, itens);
  }
  return mapa;
}

let cache = null;

/** FAQ da rota /tecnico-informatica-<slug>, ou null. */
export function cidadeFaqs(path) {
  const match = /^\/tecnico-informatica-([a-z0-9-]+)$/.exec(path);
  if (!match) return null;
  cache ??= parse();
  return cache.get(match[1]) ?? null;
}
