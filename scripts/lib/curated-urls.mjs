/**
 * ============================================================================
 * FONTE ÚNICA DE VERDADE — URLs INDEXÁVEIS CURADAS
 * ============================================================================
 * Todo URL indexável do projeto é declarado aqui, agrupado por sub-sitemap.
 * `scripts/generate-sitemaps.mjs` emite o XML a partir deste manifesto e os
 * gates (`check:editorial-governance`, `check:sitemap-source`) comparam o
 * conjunto emitido com o conjunto declarado.
 *
 * Regra: o número de URLs NUNCA é a fonte da verdade — a lista é.
 * Incluir uma URL aqui significa afirmar que ela é curada, indexável,
 * canônica (não alias, não redirect) e aprovada pela hierarquia local.
 */

import { EDITORIAL_WAVE_SLUGS } from "./editorial-wave.mjs";

export const BASE_URL = "https://tecnico.curitiba.br";

export const MAIN = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/servicos", changefreq: "weekly", priority: "0.9" },
  { path: "/como-funciona", changefreq: "monthly", priority: "0.8" },
  { path: "/precos-e-politicas", changefreq: "monthly", priority: "0.8" },
  { path: "/sobre", changefreq: "monthly", priority: "0.6" },
  { path: "/contato", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/anuncie", changefreq: "monthly", priority: "0.5" },
  { path: "/atendimento-domicilio", changefreq: "monthly", priority: "0.7" },
  { path: "/atendimento-remoto", changefreq: "monthly", priority: "0.7" },
  { path: "/equipamentos-atendidos", changefreq: "monthly", priority: "0.6" },
  { path: "/areas-atendidas", changefreq: "monthly", priority: "0.7" },
  { path: "/diagnostico-tecnico", changefreq: "monthly", priority: "0.6" },
  { path: "/coleta-e-entrega", changefreq: "monthly", priority: "0.6" },
  { path: "/quando-nao-compensa", changefreq: "monthly", priority: "0.5" },
  { path: "/seguranca-dos-dados", changefreq: "monthly", priority: "0.6" },
  { path: "/politica-de-pecas-do-cliente", changefreq: "monthly", priority: "0.6" },
];

/** Hubs de SEO temáticos (entram no sitemap-main). */
export const HUBS = [
  { path: "/empresa-de-ti-curitiba", changefreq: "weekly", priority: "0.8" },
  // Pillar informacional do cluster de informática (apoio das páginas comerciais).
  { path: "/guia-tecnico-informatica", changefreq: "monthly", priority: "0.7" },
];

/** Serviços essenciais — slugs canônicos (nunca variações com redirect). */
export const SERVICOS = [
  "/servicos/formatacao",
  "/servicos/manutencao-de-notebook",
  "/servicos/manutencao-de-computador",
  "/servicos/upgrade-ssd-ram",
  "/servicos/remocao-de-virus",
  "/servicos/recuperacao-de-dados",
  "/servicos/redes-e-wifi",
  "/servicos/suporte-tecnico-empresarial",
  "/servicos/manutencao-preventiva-empresas",
  "/servicos/backup-para-empresas",
  "/servicos/suporte-home-office",
  "/servicos/montagem-de-pc",
  "/servicos/conserto-tv",
  "/servicos/conserto-placa",
  "/servicos/conserto-monitor",
].map((path) => ({ path, changefreq: "weekly", priority: "0.85" }));

/** Hubs de cidade reais (NÃO 215 bairros). */
export const REGIOES = [
  "/tecnico-informatica-curitiba",
  "/tecnico-informatica-sao-jose-pinhais",
  "/tecnico-informatica-pinhais",
  "/tecnico-informatica-colombo",
  "/tecnico-informatica-araucaria",
  "/tecnico-informatica-campo-largo",
  // Onda 5 — cidades da RMC reformadas com narrativa local exclusiva.
  "/tecnico-informatica-piraquara",
  "/tecnico-informatica-quatro-barras",
  "/tecnico-informatica-campo-magro",
  "/tecnico-informatica-almirante-tamandare",
  "/tecnico-informatica-fazenda-rio-grande",
].map((path) => ({ path, changefreq: "monthly", priority: "0.7" }));

/** Bairros âncora indexáveis (política de poda: conteúdo exclusivo real). */
export const BAIRROS = [
  "/bairros/cic",
  "/bairros/batel",
  "/bairros/agua-verde",
  "/bairros/centro",
  "/bairros/portao",
  "/bairros/bigorrilho",
  "/bairros/santa-felicidade",
  "/bairros/cabral",
  "/bairros/cristo-rei",
  "/bairros/boa-vista",
  "/bairros/cajuru",
  "/bairros/boqueirao",
].map((path) => ({ path, changefreq: "monthly", priority: "0.65" }));

/**
 * Landings serviço × bairro-âncora (src/lib/servicoBairroFactory.ts).
 * Auditadas na Rodada 4G: rota estática própria, canonical self, robots index,
 * H1 e narrativa exclusivos por bairro, CTA do funil e links para o serviço-mãe
 * e para o hub de Curitiba. Devem permanecer em sincronia com
 * `GENERATED_INDEXABLE_PATHS`.
 */
export const SERVICO_BAIRRO = [
  "/servicos/formatacao-computador/cic",
  "/servicos/formatacao-computador/batel",
  "/servicos/formatacao-computador/agua-verde",
  "/servicos/formatacao-computador/jardim-das-americas",
  "/servicos/formatacao-computador/ecoville",
  "/servicos/formatacao-computador/alto-da-xv",
  "/servicos/formatacao-computador/reboucas",
  "/servicos/remocao-virus/cic",
  "/servicos/remocao-virus/agua-verde",
  "/servicos/remocao-virus/jardim-das-americas",
  "/servicos/remocao-virus/ecoville",
  "/servicos/remocao-virus/alto-da-xv",
  "/servicos/remocao-virus/reboucas",
  "/servicos/conserto-pc-notebook/centro",
  "/servicos/conserto-pc-notebook/agua-verde",
  "/servicos/conserto-pc-notebook/jardim-das-americas",
  "/servicos/conserto-pc-notebook/ecoville",
  "/servicos/conserto-pc-notebook/alto-da-xv",
  "/servicos/conserto-pc-notebook/reboucas",
  "/servicos/upgrade-ssd-memoria/cic",
  "/servicos/upgrade-ssd-memoria/centro",
  "/servicos/upgrade-ssd-memoria/agua-verde",
  "/servicos/upgrade-ssd-memoria/portao",
  "/servicos/upgrade-ssd-memoria/jardim-das-americas",
  "/servicos/upgrade-ssd-memoria/ecoville",
  "/servicos/upgrade-ssd-memoria/alto-da-xv",
  "/servicos/upgrade-ssd-memoria/reboucas",
].map((path) => ({ path, changefreq: "monthly", priority: "0.6" }));

/**
 * Liberação de índice — landings Wi-Fi e Smart TV dos bairros com
 * `narrativaLocal` exclusiva (≥300 palavras) em `wifiTvBairroData.ts`.
 * Rota estática dedicada, canonical self e robots index.
 * Onda 2: conclui 100% dos bairros herdados reformados.
 */
export const WIFI_TV_BAIRRO = [
  "jardim-das-americas",
  "ecoville",
  "alto-da-xv",
  "reboucas",
  "batel",
  "centro",
  "agua-verde",
  "cic",
  "portao",
  "bigorrilho",
  "cabral",
  "santa-felicidade",
  "boa-vista",
  "cristo-rei",
  "cajuru",
  "boqueirao",
].flatMap((slug) => [
  `/servicos/redes-wifi/${slug}`,
  `/servicos/manutencao-tv/${slug}`,
]).map((path) => ({ path, changefreq: "monthly", priority: "0.6" }));

/**
 * Cluster de problemas (sintomas). Piloto controlado da Rodada 3B: só entram
 * URLs com conteúdo próprio de sintoma, distinto da página de serviço-mãe.
 */
export const PROBLEMAS = [
  // Hub do cluster de sintomas: índice autoral que distribui autoridade interna.
  { path: "/problemas", changefreq: "weekly", priority: "0.7" },
  { path: "/problemas/notebook-nao-liga", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/computador-lento", changefreq: "monthly", priority: "0.6" },
  // Onda 6 — sintomas reformados com conteúdo exclusivo (tela azul e aquecimento).
  { path: "/problemas/tela-azul-windows", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/notebook-superaquecendo", changefreq: "monthly", priority: "0.6" },
  // Onda 8 — sintoma de carga (notebook) e vertical de TV, ambos com conteúdo autoral.
  { path: "/problemas/notebook-nao-carrega-bateria", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tv-nao-liga", changefreq: "monthly", priority: "0.6" },
  // Onda 9 — sintoma de desligamento (hardware/energia) e instabilidade de rede.
  { path: "/problemas/computador-desliga-sozinho", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/wifi-caindo-toda-hora", changefreq: "monthly", priority: "0.6" },
  // Onda 10
  { path: "/problemas/tv-com-som-sem-imagem", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/notebook-molhado", changefreq: "monthly", priority: "0.6" },
  // Onda 12 — energia/POST em desktop e teclado de notebook, ambos autorais.
  { path: "/problemas/computador-nao-liga", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/teclado-de-notebook-nao-funciona", changefreq: "monthly", priority: "0.6" },
  // Onda 14 — tela preta em notebook e desligamento espontâneo de TV.
  { path: "/problemas/notebook-com-tela-preta", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tv-desligando-sozinha", changefreq: "monthly", priority: "0.6" },
  // Onda 15 — áudio de TV e impressão.
  { path: "/problemas/tv-sem-som", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/impressora-nao-imprime", changefreq: "monthly", priority: "0.6" },
  // Onda 16 — vídeo em desktop e lentidão em notebook.
  { path: "/problemas/monitor-sem-sinal", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/notebook-lento", changefreq: "monthly", priority: "0.6" },
  // Onda 17 — travamento em desktop e touchpad em notebook.
  { path: "/problemas/computador-travando", changefreq: "monthly", priority: "0.6" },
  // Onda 18 — desligamento em notebook e mídia removível não reconhecida.
  { path: "/problemas/notebook-desligando-sozinho", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/pen-drive-nao-reconhecido", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/touchpad-nao-funciona", changefreq: "monthly", priority: "0.6" },
  // Onda 19 — dano estrutural em notebook e ausência de áudio em desktop.
  { path: "/problemas/dobradica-do-notebook-quebrada", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/computador-sem-som", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tela-do-computador-piscando", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/notebook-nao-conecta-no-wifi", changefreq: "monthly", priority: "0.6" },
  // Onda 22 — falha de inicialização do sistema e tela escura em TV.
  { path: "/problemas/windows-nao-inicia", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/webcam-nao-funciona", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tv-nao-conecta-no-wifi", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tv-com-imagem-escura", changefreq: "monthly", priority: "0.6" },
  // Onda 21 — smart TV lenta e periférico apontador em desktop.
  { path: "/problemas/tv-travando", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/mouse-nao-funciona", changefreq: "monthly", priority: "0.6" },
  // Onda 13 — ruído em desktop e linhas na tela de TV, ambos autorais.
  { path: "/problemas/computador-fazendo-barulho", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/tv-com-linhas-na-tela", changefreq: "monthly", priority: "0.6" },
  // Onda 11
  { path: "/problemas/tela-de-notebook-quebrada", changefreq: "monthly", priority: "0.6" },
  { path: "/problemas/hd-nao-reconhecido", changefreq: "monthly", priority: "0.6" },
];

/**
 * Onda editorial indexável (Rodada 4H). O hub /blog só é declarado aqui
 * porque passou a listar artigos aprovados de verdade. Cada artigo vem de
 * `scripts/lib/editorial-wave.mjs` — espelho de APPROVED_EDITORIAL_CONTENT.
 */
export const EDITORIAL = [
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  ...EDITORIAL_WAVE_SLUGS.map((slug) => ({
    path: `/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.55",
  })),
];


/** Sub-sitemaps ativos, na ordem em que aparecem no índice. */
export const ACTIVE_SITEMAPS = [
  ["sitemap-main.xml", [...MAIN, ...HUBS]],
  ["sitemap-servicos.xml", [...SERVICOS, ...SERVICO_BAIRRO, ...WIFI_TV_BAIRRO]],
  ["sitemap-regioes.xml", REGIOES],
  ["sitemap-bairros.xml", BAIRROS],
  ["sitemap-problemas.xml", PROBLEMAS],
  ["sitemap-editorial.xml", EDITORIAL],
];

/** Sub-sitemaps herdados, mantidos vazios de propósito. */
export const EMPTY_SITEMAPS = ["sitemap-marcas.xml", "sitemap-news.xml"];


/** Conjunto plano de todas as URLs indexáveis declaradas. */
export const CURATED_PATHS = ACTIVE_SITEMAPS.flatMap(([, entries]) => entries.map((e) => e.path));
