/**
 * Tipos compartilhados pelas seções do painel de monitoramento operacional.
 * Espelham o que `scripts/snapshot-marco.mjs` congela em cada marco.
 */

export interface MarcoUrl {
  path: string;
  cluster: string | null;
  tier: string | null;
  estado: string;
  gscStatus: string | null;
  gscCoverage: string | null;
  lastCrawl: string | null;
  canonical: string | null;
  canonicalSelf: boolean | null;
  googleCanonical: string | null;
  http: number | null;
  ttfbMs: number | null;
  noindex: boolean | null;
  inbound: number | null;
  inboundContextual: number | null;
  depth: number | null;
  lastmod: string | null;
  impressions: number;
  clicks: number;
  position: number | null;
}

export interface MarcoResumo {
  marco: string;
  registradoEm: string;
  urls?: MarcoUrl[];
}

export const ESTADO_LABEL: Record<string, string> = {
  indexed: "Indexada",
  unknown: "Desconhecida",
  discovered: "Descoberta",
  crawled_not_indexed: "Rastreada, não indexada",
  duplicate: "Duplicada",
  redirect: "Redirect",
  soft_404: "Soft 404",
  canonical_different: "Canonical diferente",
  outros: "Outros",
};

export const SEM_DADO = "sem dado";
