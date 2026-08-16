/**
 * REGISTRO DE PROVA VISUAL REAL POR BAIRRO (fail-closed).
 *
 * Regra: uma página de bairro só é indexável quando tem fotos REAIS da operação
 * (nunca imagens geradas por IA) OU quando está na lista de páginas já
 * publicadas sem foto (grandfathered) enquanto o acervo fotográfico é montado.
 *
 * Ao criar um bairro novo: se ele não tiver entrada em `BAIRRO_PHOTOS` nem
 * estiver em `BAIRROS_SEM_FOTO_APROVADOS`, o build injeta `noindex`
 * automaticamente (ver scripts/inject-route-head.mjs).
 */

export interface BairroPhoto {
  /** Caminho servido de public/ — ex.: /fotos/bairros/hauer-bancada.webp */
  src: string;
  /** Alt descritivo e específico do bairro. */
  alt: string;
}

/** Fotos reais por slug de bairro. Preencher conforme o acervo for enviado. */
export const BAIRRO_PHOTOS: Record<string, BairroPhoto[]> = {};

/**
 * Bairros publicados antes do acervo fotográfico, com conteúdo autoral próprio
 * aprovado. Permanecem indexáveis; novos bairros NÃO entram nesta lista.
 */
export const BAIRROS_SEM_FOTO_APROVADOS = [
  "cic",
  "batel",
  "agua-verde",
  "centro",
  "portao",
  "bigorrilho",
  "santa-felicidade",
  "cabral",
  "cristo-rei",
  "boa-vista",
  "cajuru",
  "boqueirao",
  "xaxim",
  "novo-mundo",
  "uberaba",
  "reboucas",
  "hauer",
  "pinheirinho",
  "bacacheri",
  "capao-raso",
] as const;

export const bairroPhotos = (slug: string): BairroPhoto[] =>
  BAIRRO_PHOTOS[slug] ?? [];

/** true quando o bairro pode ser indexado (foto real ou aprovação explícita). */
export const bairroIndexavel = (slug: string): boolean =>
  bairroPhotos(slug).length > 0 ||
  (BAIRROS_SEM_FOTO_APROVADOS as readonly string[]).includes(slug);
