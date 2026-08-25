/**
 * ============================================================================
 * CLASSIFICADOR DE DECISÃO DE MARCO — FUNÇÃO PURA
 * ============================================================================
 * Fonte única da regra de decisão A/B/C/D. Não lê disco, não acessa rede e não
 * escreve nada: recebe o estado congelado de dois marcos e devolve a decisão.
 * Isso permite testar o classificador com fixtures sintéticas sem risco de
 * contaminar o painel real.
 *
 *   A — CONTINUE WAITING              sistema saudável, tempo normal
 *   B — PREPARE 3–5 QUICK WINS        oportunidade concreta e limitada
 *   C — INVESTIGATE BOTTLENECK        estagnação sem regressão técnica
 *   D — FIX TECHNICAL REGRESSION      sinal técnico objetivo
 */

export const DECISOES = {
  A: { codigo: "A", rotulo: "CONTINUE WAITING", severidade: "informativa", alerta: false },
  B: { codigo: "B", rotulo: "PREPARE QUICK WINS", severidade: "media", alerta: false },
  C: { codigo: "C", rotulo: "INVESTIGATE INDEXATION BOTTLENECK", severidade: "alta", alerta: true },
  D: { codigo: "D", rotulo: "FIX TECHNICAL REGRESSION", severidade: "critica", alerta: true },
};

/** Máximo de quick wins ativos permitido pela governança. */
export const LIMITE_QUICK_WINS = 5;

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const tier = (m, chave = "A") => m?.tiers?.find((t) => t.chave === chave) ?? null;

/**
 * URLs elegíveis a quick win: indexadas, com impressão real e posição 5–20.
 * @param {{path:string,estado:string,impressions:number,clicks:number,position:number|null}[]} urls
 */
export function quickWinsElegiveis(urls = []) {
  return urls
    .filter(
      (u) =>
        u.estado === "indexed" &&
        (u.impressions ?? 0) > 0 &&
        num(u.position) !== null &&
        u.position >= 5 &&
        u.position <= 20,
    )
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, LIMITE_QUICK_WINS)
    .map((u) => ({
      url: u.path,
      impressoes: u.impressions ?? 0,
      cliques: u.clicks ?? 0,
      posicao: Math.round(u.position * 100) / 100,
      ctr: u.impressions ? Math.round(((u.clicks ?? 0) / u.impressions) * 10000) / 100 : 0,
      problema:
        (u.clicks ?? 0) === 0
          ? "impressões sem clique — título/description não vencem a SERP"
          : "posição fora do top 5",
      acao: "OPTIMIZE_EXISTING (backlog — não executar automaticamente)",
    }));
}

/**
 * Sinais objetivos de regressão técnica. Qualquer um deles força a decisão D.
 * @returns {{sinal:string, detalhe:string}[]}
 */
export function sinaisDeRegressao({ anterior, atual, serpDiff } = {}) {
  const out = [];
  const add = (sinal, detalhe) => out.push({ sinal, detalhe });

  if ((atual?.grafo?.linksParaRedirect ?? 0) > 0)
    add("LINKS_PARA_CONSOLIDADAS", `${atual.grafo.linksParaRedirect} link(s) internos apontam para URL consolidada`);
  if ((atual?.sitemap?.bloqueadas ?? 0) > 0)
    add("SITEMAP_INCONSISTENTE", `${atual.sitemap.bloqueadas} URL(s) no sitemap bloqueadas por robots/noindex`);
  if ((atual?.tecnico?.canonicalIncorreto ?? 0) > 0)
    add("CANONICAL_INCORRETO", `${atual.tecnico.canonicalIncorreto} URL(s) com canonical apontando para outra página`);
  if ((atual?.tecnico?.noindexInesperado ?? 0) > 0)
    add("NOINDEX_INESPERADO", `${atual.tecnico.noindexInesperado} URL(s) curada(s) com noindex`);
  if ((atual?.tecnico?.robotsBloqueando ?? 0) > 0)
    add("ROBOTS_BLOQUEANDO", `${atual.tecnico.robotsBloqueando} URL(s) bloqueada(s) no robots.txt`);
  if ((atual?.consolidacao?.falhas ?? 0) > 0)
    add("REDIRECT_QUEBRADO", `${atual.consolidacao.falhas} redirect(s) 301 fora do contrato`);
  if ((serpDiff?.severidade?.alta ?? 0) > 0)
    add("SERP_IDENTITY", `${serpDiff.severidade.alta} mudança(s) de alta severidade em title/H1/canonical`);

  const perdaIndexadas = (atual?.google?.indexed ?? 0) - (anterior?.google?.indexed ?? 0);
  if (anterior && perdaIndexadas <= -3)
    add("PERDA_DE_INDEXADAS", `${Math.abs(perdaIndexadas)} URL(s) saíram do índice desde ${anterior.marco}`);

  return out;
}

/**
 * Decide o marco.
 * @param {{d0:object|null, anterior:object|null, atual:object, urls?:any[], serpDiff?:object|null}} entrada
 */
export function decidirMarco({ d0 = null, anterior = null, atual, urls = [], serpDiff = null, fase = null } = {}) {
  if (!atual) {
    return {
      decisao: "PENDENTE",
      rotulo: "MARCO NÃO REGISTRADO",
      severidade: "informativa",
      alerta: false,
      justificativa: "Marco ainda não coletado — nada a decidir.",
      regressoes: [],
      quickWins: [],
      sinais: {},
    };
  }

  const base = anterior ?? d0;
  const regressoes = sinaisDeRegressao({ anterior: base, atual, serpDiff });
  const quickWins = quickWinsElegiveis(urls.length ? urls : (atual.urls ?? []));

  const tierABase = num(tier(d0)?.taxaIndexacao);
  const tierAAtual = num(tier(atual)?.taxaIndexacao);
  const tierAAvanca = tierABase !== null && tierAAtual !== null && tierAAtual > tierABase;
  const unknownBase = num(base?.google?.unknown);
  const unknownAtual = num(atual?.google?.unknown);
  const unknownCai = unknownBase !== null && unknownAtual !== null && unknownAtual < unknownBase;
  const indexedBase = num(base?.google?.indexed);
  const indexedAtual = num(atual?.google?.indexed);
  const indexedSobe = indexedBase !== null && indexedAtual !== null && indexedAtual > indexedBase;
  const crawledNaoIndexadas = atual?.google?.crawled_not_indexed ?? 0;
  const crawledBaixo = crawledNaoIndexadas <= 3;

  const sinais = {
    tierABase, tierAAtual, tierAAvanca, unknownBase, unknownAtual, unknownCai,
    indexedBase, indexedAtual, indexedSobe, crawledNaoIndexadas, crawledBaixo,
    quickWinsElegiveis: quickWins.length,
  };

  /* Fase do marco. Em D0/D7 o tempo normal ainda está correndo: estagnação
   * não é gargalo e quick win não é autorizado pela governança. Só a partir
   * do D14 as decisões B e C ficam disponíveis. */
  const faseEfetiva = fase ?? (["D0", "D7"].includes(atual.marco) ? "inicial" : "decisoria");
  const decisoria = faseEfetiva === "decisoria";

  const responder = (codigo, justificativa) => ({
    ...DECISOES[codigo],
    decisao: codigo,
    justificativa,
    regressoes,
    quickWins: codigo === "B" ? quickWins : [],
    sinais,
  });

  if (regressoes.length)
    return responder("D", `Regressão técnica objetiva: ${regressoes.map((r) => r.sinal).join(", ")}.`);

  const crawledDisparou =
    (base?.google?.crawled_not_indexed ?? 0) + 3 < crawledNaoIndexadas;
  if (!decisoria)
    return crawledDisparou
      ? responder("C", `Crawled-not-indexed saltou para ${crawledNaoIndexadas} acima do limiar operacional — investigar antes do próximo marco.`)
      : responder("A", "Sete dias após a consolidação, processamento dentro do esperado — não mexer.");

  if (!crawledBaixo && !indexedSobe && !tierAAvanca)
    return responder(
      "C",
      `Crawled-not-indexed em ${crawledNaoIndexadas} sem avanço de Tier A nem de indexadas — gargalo de indexação, investigar com experimento controlado.`,
    );

  if (quickWins.length >= 3)
    return responder("B", `${quickWins.length} páginas indexadas com impressões reais em posição 5–20.`);

  if (!tierAAvanca && !unknownCai && !indexedSobe)
    return responder(
      "C",
      "Tier A estagnado, unknown sem redução e indexadas paradas — investigar gargalo antes de alterar qualquer página.",
    );

  return responder(
    "A",
    tierAAvanca || unknownCai || indexedSobe
      ? "Movimento positivo no funil, sem regressão e com crawled-not-indexed sob controle — não mexer."
      : "Sistema estável sem oportunidade concreta o bastante para abrir backlog.",
  );
}

export default decidirMarco;
