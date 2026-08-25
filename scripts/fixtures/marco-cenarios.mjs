/**
 * ============================================================================
 * FIXTURES SINTÉTICAS DE MARCO — NUNCA TOCAM DADOS REAIS
 * ============================================================================
 * Cenários controlados para provar que o classificador distingue tempo normal,
 * oportunidade, gargalo e regressão. Estes objetos NÃO são gravados em
 * reports/ nem em public/: vivem apenas em memória durante os testes e o
 * relatório de prontidão.
 *
 * Base: o D0 real publicado (130 curadas, 22 indexadas, 56 unknown,
 * 48 discovered, 0 crawled-not-indexed, Tier A 18/31) reproduzido como número
 * sintético — igual em forma, isolado em efeito.
 */

const UNIVERSO = 130;

const tiers = (indexadasA, totalA = 31) => [
  {
    chave: "A",
    total: totalA,
    indexadas: indexadasA,
    unknown: totalA - indexadasA,
    discovered: 0,
    crawledNaoIndexadas: 0,
    taxaIndexacao: Math.round((indexadasA / totalA) * 1000) / 10,
    impressoes: 300,
    cliques: 5,
    posicaoMedia: 18.2,
  },
];

function urlsSinteticas({ indexadasComImpressao = 0, posicao = 12 } = {}) {
  return Array.from({ length: indexadasComImpressao }, (_, i) => ({
    path: `/fixture/indexada-${i + 1}`,
    estado: "indexed",
    tier: "A",
    cluster: "SERVICO",
    impressions: 120 - i * 5,
    clicks: i % 2 === 0 ? 0 : 1,
    position: posicao + i * 0.4,
  }));
}

function marco({
  nome,
  indexed,
  unknown,
  discovered,
  crawled = 0,
  tierA = 18,
  registradoEm,
  grafo = { linksParaRedirect: 0, orfas: 0, urls: UNIVERSO },
  sitemapBloqueadas = 0,
  consolidacaoFalhas = 0,
  tecnico = {},
}) {
  const outros = UNIVERSO - (indexed + unknown + discovered + crawled);
  return {
    marco: nome,
    registradoEm,
    denominador: { curadas: UNIVERSO },
    google: {
      indexed,
      unknown,
      discovered,
      crawled_not_indexed: crawled,
      duplicate: 0,
      redirect: 0,
      soft_404: 0,
      canonical_different: 0,
      outros: outros > 0 ? outros : 0,
      impressoes28d: 473,
      cliques28d: 6,
      ctr28d: 1.27,
      posicaoMedia28d: 22.4,
    },
    tiers: tiers(tierA),
    clusters: [],
    grafo,
    sitemap: { total: UNIVERSO, bloqueadas: sitemapBloqueadas },
    consolidacao: { total: 40, pass: 40 - consolidacaoFalhas, falhas: consolidacaoFalhas },
    tecnico: { canonicalIncorreto: 0, noindexInesperado: 0, robotsBloqueando: 0, ...tecnico },
  };
}

const D0 = marco({
  nome: "D0",
  indexed: 22,
  unknown: 56,
  discovered: 48,
  crawled: 0,
  tierA: 18,
  registradoEm: "2026-08-11T03:00:00.000Z",
});

const D14_EM = "2026-08-25T03:00:00.000Z";

/** Cenários A–H. `esperado` é a decisão que o classificador precisa produzir. */
export const CENARIOS = [
  {
    id: "A",
    titulo: "22 → 25 indexadas, funil andando",
    esperado: "A",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 25, unknown: 52, discovered: 49, crawled: 1, tierA: 19, registradoEm: D14_EM }),
    urls: [],
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "B",
    titulo: "crawled-not-indexed 0 → 4 sem avanço",
    esperado: "C",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 22, unknown: 56, discovered: 44, crawled: 4, tierA: 18, registradoEm: D14_EM }),
    urls: [],
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "C",
    titulo: "Tier A 18/31 → 20/31 com quick wins reais",
    esperado: "B",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 26, unknown: 50, discovered: 50, crawled: 2, tierA: 20, registradoEm: D14_EM }),
    urls: urlsSinteticas({ indexadasComImpressao: 4 }),
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "D",
    titulo: "3 URLs indexadas saem do índice",
    esperado: "D",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 19, unknown: 59, discovered: 48, crawled: 0, tierA: 16, registradoEm: D14_EM }),
    urls: [],
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "E",
    titulo: "canonical alterado em URLs curadas",
    esperado: "D",
    d0: D0,
    anterior: D0,
    atual: marco({
      nome: "D14",
      indexed: 22, unknown: 56, discovered: 48, crawled: 0, tierA: 18, registradoEm: D14_EM,
      tecnico: { canonicalIncorreto: 5 },
    }),
    urls: [],
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "F",
    titulo: "robots/noindex alterado",
    esperado: "D",
    d0: D0,
    anterior: D0,
    atual: marco({
      nome: "D14",
      indexed: 22, unknown: 56, discovered: 48, crawled: 0, tierA: 18, registradoEm: D14_EM,
      sitemapBloqueadas: 3,
      tecnico: { noindexInesperado: 3, robotsBloqueando: 1 },
    }),
    urls: [],
    serpDiff: { severidade: { alta: 2, media: 1 } },
  },
  {
    id: "G",
    titulo: "cluster PROBLEMA começa a avançar",
    esperado: "A",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 24, unknown: 53, discovered: 50, crawled: 1, tierA: 18, registradoEm: D14_EM }),
    urls: urlsSinteticas({ indexadasComImpressao: 1 }),
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
  {
    id: "H",
    titulo: "nenhuma mudança",
    esperado: "C",
    d0: D0,
    anterior: D0,
    atual: marco({ nome: "D14", indexed: 22, unknown: 56, discovered: 48, crawled: 0, tierA: 18, registradoEm: D14_EM }),
    urls: [],
    serpDiff: { severidade: { alta: 0, media: 0 } },
  },
];

/** Mapa cenário → decisão de negócio (usado no relatório de prontidão). */
export const CENARIOS_POR_DECISAO = {
  A: CENARIOS.find((c) => c.id === "A"),
  B: CENARIOS.find((c) => c.id === "C"),
  C: CENARIOS.find((c) => c.id === "H"),
  D: CENARIOS.find((c) => c.id === "D"),
};

export const D0_FIXTURE = D0;
export default CENARIOS;
