/**
 * ============================================================================
 * GALERIA ILUSTRATIVA DE BANCADA E EQUIPAMENTOS
 * ============================================================================
 * Fotografias REAIS (câmera, nunca IA) de banco de imagens livre para uso
 * comercial (Pexels), servidas localmente em AVIF/WebP responsivos.
 *
 * Honestidade editorial (obrigatória):
 *  • esta galeria é declarada como ILUSTRATIVA no próprio bloco visível;
 *  • ela NÃO substitui `src/lib/provasBancada.ts`, que continua fail-closed
 *    e reservado a fotos comprovadamente da nossa operação;
 *  • nenhum alt/legenda afirma que a cena é da nossa bancada ou de um cliente;
 *  • nenhum dado pessoal, endereço, OS ou tela de cliente aparece.
 *
 * Pipeline: scripts/strip-photo-exif.mjs → scripts/optimize-photos.mjs
 * Variantes geradas: 640 / 960 / 1280 px em .webp e .avif.
 */

export interface FotoIlustrativa {
  /** Base do arquivo em /fotos/galeria (sem sufixo de largura/extensão). */
  base: string;
  /** Alt factual e descritivo — sem claim promocional. */
  alt: string;
  /** Legenda curta ligada ao serviço correspondente. */
  legenda: string;
  width: number;
  height: number;
}

export const LARGURAS_GALERIA = [640, 960, 1280] as const;

export const GALERIA_ILUSTRATIVA: FotoIlustrativa[] = [
  {
    base: "bancada-reparo-placa",
    alt: "Mãos usando chave de precisão para remover um dissipador em placa de circuito sobre bancada",
    legenda: "Reparo em bancada: desmontagem controlada antes de qualquer troca de peça",
    width: 1280,
    height: 914,
  },
  {
    base: "placa-notebook-desmontada",
    alt: "Placa de notebook desmontada, com conectores e trilhas visíveis em detalhe",
    legenda: "Notebook aberto para diagnóstico de placa, conectores e alimentação",
    width: 1280,
    height: 853,
  },
  {
    base: "placa-mae-diagnostico",
    alt: "Detalhe de placa-mãe de computador desktop com soquete de processador e slots de memória",
    legenda: "Diagnóstico de desktop: soquete, memória e alimentação conferidos ponto a ponto",
    width: 1280,
    height: 1920,
  },
  {
    base: "memoria-ram-instalada",
    alt: "Módulos de memória RAM instalados dentro de um gabinete de computador iluminado",
    legenda: "Upgrade de memória: peça compatível instalada e testada antes da entrega",
    width: 1280,
    height: 1920,
  },
  {
    base: "rede-infraestrutura-atendimento",
    alt: "Técnico organizando cabos de rede em rack com switch e patch panel",
    legenda: "Rede e Wi-Fi: cabeamento e equipamentos organizados no atendimento no local",
    width: 1280,
    height: 853,
  },
  {
    base: "estacao-trabalho-entregue",
    alt: "Estação de trabalho montada com monitor, teclado e mouse sobre mesa de madeira",
    legenda: "Estação de trabalho conferida e funcionando antes da devolução ao cliente",
    width: 1280,
    height: 1918,
  },
];

const dir = "/fotos/galeria";

export const srcSetPara = (base: string, ext: "webp" | "avif") =>
  LARGURAS_GALERIA.map((w) => `${dir}/${base}-${w}.${ext} ${w}w`).join(", ");

export const fallbackSrc = (base: string) => `${dir}/${base}-960.webp`;

/** Crédito visível exigido pelo gate `check:image-credits`. */
export const CREDITO_GALERIA = "Foto: Pexels (licença livre para uso comercial)";
