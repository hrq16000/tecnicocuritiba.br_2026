#!/usr/bin/env node
/**
 * ============================================================================
 * GRAFO DE SINTOMAS RELACIONADOS (/problemas/*) — orientado por cobertura
 * ============================================================================
 * Lê o HTML renderizado de cada página de sintoma curada e monta, para cada
 * rota, 3–4 vizinhos de investigação com âncora real (H1 da página de destino)
 * e descrição vinda da própria meta description.
 *
 * Regras:
 *   • afinidade por vocabulário compartilhado (equipamento + sintoma);
 *   • pares quase idênticos são descartados (anticanibalização);
 *   • seleção balanceada: destino com menos links de entrada entra primeiro,
 *     de modo que nenhuma página de sintoma dependa só do hub /problemas;
 *   • nenhuma rota linka para si mesma nem para fora do sitemap curado.
 *
 * Saída: src/lib/problemasRelacionadosGerados.ts (+ --check para o gate)
 * Uso: node scripts/generate-problema-links.mjs [dist] [--check]
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");
const CLIENT = existsSync(path.join(DIST, "client")) ? path.join(DIST, "client") : DIST;
const OUT = "src/lib/problemasRelacionadosGerados.ts";
const POR_PAGINA = 4;
/** Acima disso as páginas disputam a mesma intenção — não se linkam. */
const AFINIDADE_MAXIMA = 0.8;
const AFINIDADE_MINIMA = 0.08;

const sitemapDir = existsSync(path.join(CLIENT, "sitemap-problemas.xml")) ? CLIENT : "public";
const rotas = new Set();
for (const f of readdirSync(sitemapDir).filter((f) => /^sitemap.*\.xml$/.test(f))) {
  const xml = readFileSync(path.join(sitemapDir, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].trim().replace("https://tecnico.curitiba.br", "").replace(/\/$/, "");
    if (/^\/problemas\/[^/]+$/.test(p)) rotas.add(p);
  }
}
const lista = [...rotas].sort();

const clean = (s) =>
  (s || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

const conteudo = new Map();
for (const p of lista) {
  const file = path.join(CLIENT, `${p.replace(/^\//, "")}/index.html`);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const h1 = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const desc = clean(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]);
  const corpo = clean((html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html).slice(0, 20000));
  conteudo.set(p, { h1, desc, corpo });
}

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ");
const STOP = new Set(["para", "como", "quando", "isso", "esse", "essa", "pode", "mais", "menos", "curitiba", "tecnico", "atendimento", "whatsapp", "voce", "seu", "sua", "diagnostico"]);
const vocab = (p) => {
  const c = conteudo.get(p);
  const w = new Set(
    norm(`${c.h1} ${c.desc} ${p.split("/").pop().replace(/-/g, " ")}`)
      .split(/\s+/)
      .filter((x) => x.length > 3 && !STOP.has(x)),
  );
  return w;
};

const vocabs = new Map(lista.filter((p) => conteudo.has(p)).map((p) => [p, vocab(p)]));
const afinidade = (a, b) => {
  const wa = vocabs.get(a);
  const wb = vocabs.get(b);
  if (!wa?.size || !wb?.size) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.min(wa.size, wb.size);
};

const inbound = new Map([...vocabs.keys()].map((p) => [p, 0]));
const mapa = {};
for (const origem of [...vocabs.keys()].sort()) {
  const candidatos = [...vocabs.keys()]
    .filter((p) => p !== origem)
    .map((p) => ({ p, score: afinidade(origem, p) }))
    .filter((x) => x.score >= AFINIDADE_MINIMA && x.score <= AFINIDADE_MAXIMA)
    // menos linkados primeiro, depois maior afinidade — cobertura sem perder tema
    .sort((a, b) => inbound.get(a.p) - inbound.get(b.p) || b.score - a.score || a.p.localeCompare(b.p))
    .slice(0, POR_PAGINA);
  if (candidatos.length < 2) continue;
  for (const c of candidatos) inbound.set(c.p, inbound.get(c.p) + 1);
  mapa[origem] = candidatos.map(({ p }) => ({
    to: p,
    titulo: conteudo.get(p).h1.split(":")[0].trim(),
    desc: conteudo.get(p).desc.split(".")[0].trim() + ".",
  }));
}

const orfas = [...inbound.entries()].filter(([, n]) => n === 0).map(([p]) => p);

const ts = `// ⚠️ ARQUIVO GERADO por scripts/generate-problema-links.mjs — não editar à mão.
// Vizinhos de investigação entre páginas de sintoma, com âncora vinda do H1 real
// de cada destino e seleção balanceada por cobertura.
// Regenerar: npm run links:problemas

import type { ProblemaRelacionado } from "@/lib/problemasRelacionados";

export const PROBLEMAS_RELACIONADOS_GERADOS: Record<string, ProblemaRelacionado[]> = ${JSON.stringify(
  mapa,
  null,
  2,
)};
`;

if (CHECK) {
  const atual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (atual !== ts) {
    console.error('BLOQUEADO: src/lib/problemasRelacionadosGerados.ts fora de sincronia — rode "npm run links:problemas".');
    process.exit(1);
  }
  if (orfas.length) {
    console.error(`BLOQUEADO: ${orfas.length} sintoma(s) sem link de entrada: ${orfas.join(", ")}`);
    process.exit(1);
  }
  console.log(`links problemas: ${Object.keys(mapa).length} rotas em sincronia, 0 órfãs.`);
} else {
  writeFileSync(OUT, ts);
  console.log(
    `links problemas: ${Object.keys(mapa).length} rotas mapeadas · sem inbound: ${orfas.length ? orfas.join(", ") : "0"}`,
  );
}
