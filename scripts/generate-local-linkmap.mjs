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

/**
 * Contagem de links de entrada já atribuídos pelo próprio mapa.
 * A seleção é orientada por cobertura: destinos com menos inbound entram
 * primeiro, para que nenhuma URL curada fique órfã.
 */
const inbound = new Map(curated.map((p) => [p, 0]));
const registra = (href) => inbound.set(href, (inbound.get(href) ?? 0) + 1);

const add = (lista, usados, href, anchor, limite = MAX_LINKS) => {
  if (!curatedSet.has(href) || lista.length >= limite) return false;
  const chave = anchor.toLowerCase();
  if (usados.has(chave) || usados.has(href)) return false;
  usados.add(chave);
  usados.add(href);
  lista.push({ href, anchor });
  registra(href);
  return true;
};

/** Menos linkados primeiro; empate resolvido pelo path (determinístico). */
const porCobertura = (a, b) => (inbound.get(a) ?? 0) - (inbound.get(b) ?? 0) || a.localeCompare(b);

/** bairro → serviços atendidos naquele bairro. */
const porBairro = {};
for (const bairro of bairros) {
  const slug = slugBairro(bairro);
  const nome = nomeBairro(slug);
  const prep = prepDe(slug);
  const links = [];
  const usados = new Set([bairro]);

  for (const p of servicoBairro.filter((x) => slugBairro(x) === slug).sort(porCobertura)) {
    add(links, usados, p, `${nomeServico(servicoDe(p))} ${prep} ${nome}`);
  }
  for (const p of ["/servicos/manutencao-de-computador", "/servicos/formatacao", "/servicos/redes-e-wifi"]) {
    add(links, usados, p, `${nomeServico(p)} para quem está ${prep} ${nome}`);
  }
  if (links.length >= 2) porBairro[bairro] = links;
}

/** serviço → bairros onde o serviço é atendido. */
const porServico = {};
const usadosPorServico = new Map();
for (const servico of servicos) {
  const links = [];
  const usados = new Set([servico]);
  usadosPorServico.set(servico, usados);
  const filhos = servicoBairro
    .filter((p) => servicoDe(p) === servico || HUB_EQUIVALENTE[servicoDe(p)] === servico)
    .sort(porCobertura);
  for (const p of filhos) {
    const slug = slugBairro(p);
    add(links, usados, p, `${nomeServico(servicoDe(p))} ${prepDe(slug)} ${nomeBairro(slug)}`);
  }
  for (const b of [...bairros].sort(porCobertura)) {
    const slug = slugBairro(b);
    add(links, usados, b, `atendimento técnico ${prepDe(slug)} ${nomeBairro(slug)}`);
  }
  porServico[servico] = links;
}

/**
 * Passagem de cobertura (fail-closed contra órfãs): toda landing local e todo
 * bairro curado precisa de pelo menos um link de entrada. O destino é inserido
 * no hub de serviço semanticamente correspondente — nunca em página aleatória.
 */
const semInbound = [...bairros, ...servicoBairro].filter((p) => (inbound.get(p) ?? 0) === 0);
for (const destino of semInbound) {
  const slug = slugBairro(destino);
  const ehLanding = /^\/servicos\/[^/]+\/[^/]+$/.test(destino);
  const hubs = ehLanding
    ? [HUB_EQUIVALENTE[servicoDe(destino)], servicoDe(destino)].filter(Boolean)
    : [...servicos].sort((a, b) => (porServico[a]?.length ?? 0) - (porServico[b]?.length ?? 0));
  const anchor = ehLanding
    ? `${nomeServico(servicoDe(destino))} ${prepDe(slug)} ${nomeBairro(slug)}`
    : `atendimento técnico ${prepDe(slug)} ${nomeBairro(slug)}`;

  for (const hub of hubs) {
    if (!porServico[hub]) continue;
    const usados = usadosPorServico.get(hub);
    if (add(porServico[hub], usados, destino, anchor, MAX_LINKS_COBERTURA)) break;
  }
}

for (const [servico, links] of Object.entries(porServico)) {
  if (links.length < 2) delete porServico[servico];
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
