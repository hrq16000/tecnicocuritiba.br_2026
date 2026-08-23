#!/usr/bin/env node
/**
 * MAPA DE LINKS LOCAIS (bairro → serviços · serviço → bairros).
 *
 * Gera, a partir das URLs curadas, blocos de links internos com âncoras
 * naturais em português ("formatação de computador no Batel"), sem criar
 * nenhuma página nova e sem repetir âncora dentro da mesma página.
 *
 * Regras:
 *   • só entram destinos presentes no sitemap curado (fail-closed);
 *   • nenhuma página linka para si mesma;
 *   • máximo MAX_LINKS por bloco;
 *   • âncora sempre descritiva (nunca "clique aqui" / "saiba mais").
 *
 * Saída: src/lib/localLinkMap.ts (+ --check para o gate de build)
 * Uso: node scripts/generate-local-linkmap.mjs [--check]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { nomeBairro, prepDe, nomeServico } from "./lib/local-nomes.mjs";

const CHECK = process.argv.includes("--check");
const OUT = "src/lib/localLinkMap.ts";
const MAX_LINKS = 8;
/** Folga permitida apenas na passagem de cobertura (destino sem inbound). */
const MAX_LINKS_COBERTURA = 11;

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);

const bairros = curated.filter((p) => /^\/bairros\/[^/]+$/.test(p));
const servicos = curated.filter((p) => /^\/servicos\/[^/]+$/.test(p));
const servicoBairro = curated.filter((p) => /^\/servicos\/[^/]+\/[^/]+$/.test(p));

const slugBairro = (p) => p.split("/").pop();
const servicoDe = (p) => `/servicos/${p.split("/")[2]}`;

/** Hub de serviço "irmão" de uma landing serviço×bairro, quando existir. */
const HUB_EQUIVALENTE = {
  "/servicos/formatacao-computador": "/servicos/formatacao",
  "/servicos/remocao-virus": "/servicos/remocao-de-virus",
  "/servicos/conserto-pc-notebook": "/servicos/manutencao-de-computador",
  "/servicos/upgrade-ssd-memoria": "/servicos/upgrade-ssd-ram",
  "/servicos/redes-wifi": "/servicos/redes-e-wifi",
  "/servicos/manutencao-tv": "/servicos/conserto-tv",
};

const add = (lista, usados, href, anchor) => {
  if (!curatedSet.has(href) || lista.length >= MAX_LINKS) return;
  const chave = anchor.toLowerCase();
  if (usados.has(chave) || usados.has(href)) return;
  usados.add(chave);
  usados.add(href);
  lista.push({ href, anchor });
};

/** bairro → serviços atendidos naquele bairro. */
const porBairro = {};
for (const bairro of bairros) {
  const slug = slugBairro(bairro);
  const nome = nomeBairro(slug);
  const prep = prepDe(slug);
  const links = [];
  const usados = new Set([bairro]);

  for (const p of servicoBairro.filter((x) => slugBairro(x) === slug)) {
    add(links, usados, p, `${nomeServico(servicoDe(p))} ${prep} ${nome}`);
  }
  for (const p of ["/servicos/manutencao-de-computador", "/servicos/formatacao", "/servicos/redes-e-wifi"]) {
    add(links, usados, p, `${nomeServico(p)} para quem está ${prep} ${nome}`);
  }
  if (links.length >= 2) porBairro[bairro] = links;
}

/** serviço → bairros onde o serviço é atendido. */
const porServico = {};
for (const servico of servicos) {
  const links = [];
  const usados = new Set([servico]);
  const filhos = servicoBairro.filter(
    (p) => servicoDe(p) === servico || HUB_EQUIVALENTE[servicoDe(p)] === servico,
  );
  for (const p of filhos) {
    const slug = slugBairro(p);
    add(links, usados, p, `${nomeServico(servicoDe(p))} ${prepDe(slug)} ${nomeBairro(slug)}`);
  }
  for (const b of bairros) {
    const slug = slugBairro(b);
    add(links, usados, b, `atendimento técnico ${prepDe(slug)} ${nomeBairro(slug)}`);
  }
  if (links.length >= 2) porServico[servico] = links;
}

const ts = `// ⚠️ ARQUIVO GERADO por scripts/generate-local-linkmap.mjs — não editar à mão.
// Mapa de links internos locais com âncoras naturais (bairro ⇄ serviço).
// Regenerar: npm run linkmap:local

export interface LocalLink {
  href: string;
  anchor: string;
}

/** Serviços atendidos em cada bairro-âncora. */
export const SERVICOS_POR_BAIRRO: Record<string, LocalLink[]> = ${JSON.stringify(porBairro, null, 2)};

/** Bairros cobertos por cada serviço. */
export const BAIRROS_POR_SERVICO: Record<string, LocalLink[]> = ${JSON.stringify(porServico, null, 2)};

/** Links locais da rota atual (vazio quando não há mapa curado). */
export function localLinksDe(pathname: string): LocalLink[] {
  return SERVICOS_POR_BAIRRO[pathname] ?? BAIRROS_POR_SERVICO[pathname] ?? [];
}
`;

if (CHECK) {
  const atual = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (atual !== ts) {
    console.error('BLOQUEADO: src/lib/localLinkMap.ts fora de sincronia — rode "npm run linkmap:local".');
    process.exit(1);
  }
  console.log(
    `linkmap local: ${Object.keys(porBairro).length} bairros e ${Object.keys(porServico).length} serviços em sincronia.`,
  );
} else {
  writeFileSync(OUT, ts);
  console.log(
    `linkmap local: ${Object.keys(porBairro).length} bairros → serviços e ${Object.keys(porServico).length} serviços → bairros gerados em ${OUT}.`,
  );
}
