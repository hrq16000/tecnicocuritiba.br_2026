#!/usr/bin/env node
/**
 * GERADOR DE INTERLINKAGEM CONTEXTUAL (hubs de serviço ⇄ /problemas ⇄ bairros).
 *
 * Lê o conteúdo real de cada URL curada no dist/ (h1 + title + primeiro
 * parágrafo) e monta blocos de links contextuais com ÂNCORAS ÚNICAS derivadas
 * desse conteúdo — nunca "clique aqui" nem âncora repetida na mesma página.
 *
 * Regras:
 *   • âncora nunca se repete dentro da mesma página de origem;
 *   • a mesma âncora não é usada para o mesmo destino mais de MAX_REUSO vezes
 *     no site inteiro (evita padrão de rodapé automático);
 *   • nenhuma página linka para si mesma nem para URL fora do sitemap curado;
 *   • no máximo MAX_LINKS links por bloco.
 *
 * Saída: src/lib/interlinksGerados.ts (consumido por
 * src/components/InterlinksContextuais.tsx) + reports/interlinks.json
 *
 * Uso: node scripts/generate-interlinks.mjs dist
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");
const MAX_LINKS = 4;
const MAX_REUSO = 2;

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);

const familyOf = (p) => {
  if (/^\/problemas\/[^/]+$/.test(p)) return "problema";
  if (/^\/servicos\/(redes-wifi|manutencao-tv)\//.test(p)) return "wifi-tv-bairro";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(p)) return "servico-bairro";
  if (/^\/servicos\/[^/]+$/.test(p)) return "servico";
  if (/^\/bairros?\//.test(p)) return "bairro";
  if (/^\/tecnico-informatica-/.test(p)) return "cidade";
  if (/^\/blog\//.test(p)) return "editorial";
  return "institucional";
};

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

const clean = (s) =>
  (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Conteúdo mínimo de cada rota, extraído do HTML do dist. */
const conteudo = new Map();
for (const p of curated) {
  const html = readHtml(p);
  if (!html) continue;
  const h1 = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const title = clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const desc = clean(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]);
  conteudo.set(p, { h1, title, desc, family: familyOf(p) });
}

/** Frase-âncora derivada do conteúdo da página de destino. */
function ancora(destino) {
  const c = conteudo.get(destino);
  const base = c?.h1 || c?.title || "";
  // corta sufixos de marca e chamadas comerciais do <title>
  let texto = base.split(/[|–—]/)[0].trim();
  texto = texto.replace(/\s*[-–]\s*(técnico|atendimento|assistência).*$/i, "").trim();
  if (texto.length > 68) texto = `${texto.slice(0, 65).trim()}…`;
  return texto || destino;
}

const slug = (p) => p.split("/").filter(Boolean).pop() || "";
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ");
const palavras = (s) => new Set(norm(s).split(/[\s-]+/).filter((w) => w.length > 3));

/** Afinidade temática entre duas rotas: sobreposição de vocabulário do conteúdo. */
function afinidade(a, b) {
  const ca = conteudo.get(a);
  const cb = conteudo.get(b);
  if (!ca || !cb) return 0;
  const wa = palavras(`${ca.h1} ${ca.desc} ${slug(a)}`);
  const wb = palavras(`${cb.h1} ${cb.desc} ${slug(b)}`);
  if (!wa.size || !wb.size) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.min(wa.size, wb.size);
}

/** Famílias que cada família de origem deve alcançar (rota de crawl desejada). */
const ALVOS = {
  problema: ["servico", "problema", "bairro"],
  servico: ["problema", "servico-bairro", "bairro"],
  "wifi-tv-bairro": ["servico", "problema", "bairro"],
  "servico-bairro": ["servico", "problema"],
  bairro: ["servico", "problema", "wifi-tv-bairro"],
  cidade: ["servico", "problema"],
  editorial: ["problema", "servico"],
};

const usoAncora = new Map(); // `${destino}::${ancora}` -> vezes
const blocos = [];

for (const origem of curated) {
  const c = conteudo.get(origem);
  if (!c) continue;
  const alvos = ALVOS[c.family];
  if (!alvos) continue;

  const candidatos = [];
  for (const alvo of alvos) {
    const doAlvo = curated
      .filter((p) => p !== origem && curatedSet.has(p) && familyOf(p) === alvo)
      .map((p) => ({ path: p, score: afinidade(origem, p) }))
      .filter((x) => x.score > 0.12)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    candidatos.push(...doAlvo);
  }

  const links = [];
  const usadasNaPagina = new Set();
  for (const cand of candidatos.sort((a, b) => b.score - a.score)) {
    if (links.length >= MAX_LINKS) break;
    const texto = ancora(cand.path);
    if (!texto || usadasNaPagina.has(texto.toLowerCase())) continue;
    const chave = `${cand.path}::${texto.toLowerCase()}`;
    if ((usoAncora.get(chave) ?? 0) >= MAX_REUSO) continue;
    usoAncora.set(chave, (usoAncora.get(chave) ?? 0) + 1);
    usadasNaPagina.add(texto.toLowerCase());
    links.push({ href: cand.path, anchor: texto, family: familyOf(cand.path), score: Number(cand.score.toFixed(3)) });
  }

  if (links.length >= 2) blocos.push({ path: origem, family: c.family, links });
}

mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/interlinks.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), totals: { blocos: blocos.length }, blocos }, null, 2)}\n`,
);

const ts = `// ⚠️ ARQUIVO GERADO por scripts/generate-interlinks.mjs — não editar à mão.
// Blocos de interlinkagem contextual com âncoras derivadas do conteúdo
// renderizado de cada destino (sem "clique aqui", sem âncora repetida).
// Regenerar: npm run interlinks

export interface InterlinkItem {
  href: string;
  anchor: string;
  family: string;
}

export const INTERLINKS_POR_ROTA: Record<string, InterlinkItem[]> = ${JSON.stringify(
  Object.fromEntries(blocos.map((b) => [b.path, b.links.map(({ href, anchor, family }) => ({ href, anchor, family }))])),
  null,
  2,
)};

/** Links contextuais gerados para uma rota (vazio quando não há afinidade). */
export function interlinksDe(pathname: string): InterlinkItem[] {
  return INTERLINKS_POR_ROTA[pathname] ?? [];
}
`;

const OUT = "src/lib/interlinksGerados.ts";
if (CHECK) {
  const atual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (atual !== ts) {
    console.error('BLOQUEADO: src/lib/interlinksGerados.ts está fora de sincronia — rode "npm run interlinks".');
    process.exit(1);
  }
  console.log(`interlinks: ${blocos.length} blocos em sincronia.`);
} else {
  writeFileSync(OUT, ts);
  console.log(`interlinks: ${blocos.length} blocos gerados em ${OUT} (máx. ${MAX_LINKS} links, âncoras únicas).`);
}
