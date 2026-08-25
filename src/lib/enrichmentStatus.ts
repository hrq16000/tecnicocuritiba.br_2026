/**
 * ============================================================================
 * ENRICHMENT STATUS — governança fail-closed de indexação por rota
 * ============================================================================
 * Uma rota só é indexável (`index, follow` + sitemap) quando está classificada
 * como RICH. RICH exige, cumulativamente:
 *
 *   1. conteúdo autoral próprio da rota (declarado aqui, revisado por humano);
 *   2. prova visual aprovada da vertical (fotografia real da operação ou
 *      imagem livre não gerada por IA, validada no painel admin).
 *
 * Enquanto qualquer requisito falhar, o status é SHALLOW: a página continua
 * pública e útil, mas emite `noindex` e fica FORA do sitemap — protegendo o
 * crawl budget e evitando página fina no índice.
 *
 * Fonte única: qualquer consumidor (seoHead, sitemap, gates de CI, painel
 * admin) deve ler daqui e nunca duplicar a decisão.
 */

export type EnrichmentStatus = "RICH" | "SHALLOW";

export interface EnrichmentRecord {
  /** Conteúdo autoral exclusivo já publicado na rota. */
  conteudoAutoral: boolean;
  /** Galeria de prova visual aprovada (nunca imagem com aspecto de IA). */
  provaVisualAprovada: boolean;
  /** Motivo legível exibido no painel de governança. */
  nota: string;
}

export const ENRICHMENT: Record<string, EnrichmentRecord> = {
  "/servicos/conserto-impressora-3d": {
    conteudoAutoral: true,
    provaVisualAprovada: false,
    nota:
      "Conteúdo autoral publicado. Aguardando galeria de prova visual da bancada de impressora 3D (foto real ou imagem livre não gerada por IA) para promoção a RICH.",
  },
};

/** Status efetivo da rota (fail-closed: rota desconhecida é SHALLOW). */
export function enrichmentStatusOf(path: string): EnrichmentStatus {
  const rec = ENRICHMENT[path.replace(/\/$/, "") || "/"];
  if (!rec) return "SHALLOW";
  return rec.conteudoAutoral && rec.provaVisualAprovada ? "RICH" : "SHALLOW";
}

/** `true` quando a rota deve emitir `<meta name="robots" content="noindex">`. */
export function isNoindexByEnrichment(path: string): boolean {
  const key = path.replace(/\/$/, "") || "/";
  if (!(key in ENRICHMENT)) return false; // rota fora do regime de enriquecimento
  return enrichmentStatusOf(key) !== "RICH";
}

/** Rotas do regime de enriquecimento já liberadas para o sitemap. */
export function richPaths(): string[] {
  return Object.keys(ENRICHMENT).filter((p) => enrichmentStatusOf(p) === "RICH");
}
