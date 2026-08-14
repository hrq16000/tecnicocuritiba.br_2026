/**
 * ============================================================================
 * ARQUITETURA COMERCIAL — ONDA 2 (fonte única)
 * ============================================================================
 * Mapeia, por URL curada já existente (NENHUMA rota nova):
 *   - a intenção de busca dominante
 *   - a keyword principal (uma única por URL — evita canibalização)
 *   - as keywords de apoio (H2 / FAQ / corpo)
 *   - o cluster a que a página pertence
 *   - os schemas estruturados obrigatórios
 *
 * Consumida por:
 *   scripts/check-comercial-seo.mjs        (gate canonical/og/schema/sitemap)
 *   scripts/check-hub-empresarial-links.mjs (interlinking do hub)
 *   scripts/report-sitemap-inclusions.mjs   (relatório de indexação esperada)
 */
import { BASE_URL, CURATED_PATHS } from "./curated-urls.mjs";

export { BASE_URL, CURATED_PATHS };

export const SITE_NAME = "Técnico em Curitiba";

const svc = (path, keyword, intencao, keywords, cluster, schemas = ["Service", "FAQPage"]) => ({
  path,
  keyword,
  intencao,
  keywords,
  cluster,
  schemas,
});

/** Hub comercial do cluster empresarial. */
export const HUB = svc(
  "/empresa-de-ti-curitiba",
  "empresa de TI em Curitiba",
  "comercial-B2B",
  ["suporte de TI para empresas Curitiba", "terceirização de TI Curitiba", "TI para escritório em Curitiba"],
  "empresarial",
  ["Service", "FAQPage", "LocalBusiness"],
);

/** Páginas de serviço (cluster comercial principal). */
export const SERVICOS_COMERCIAIS = [
  svc("/servicos/suporte-tecnico-empresarial", "suporte técnico empresarial em Curitiba", "comercial-B2B",
    ["suporte de TI mensal", "contrato de suporte técnico", "chamado técnico empresa"], "empresarial"),
  svc("/servicos/manutencao-preventiva-empresas", "manutenção preventiva para empresas", "comercial-B2B",
    ["plano de manutenção preventiva", "limpeza de parque de máquinas"], "empresarial"),
  svc("/servicos/backup-para-empresas", "backup para empresas em Curitiba", "comercial-B2B",
    ["rotina de backup", "backup em nuvem para escritório"], "empresarial"),
  svc("/servicos/suporte-home-office", "suporte para home office", "comercial-B2B",
    ["suporte remoto home office", "estação de trabalho em casa"], "empresarial"),
  svc("/servicos/montagem-de-pc", "montagem de PC em Curitiba", "transacional",
    ["montagem de workstation", "PC para edição", "orçamento de montagem"], "hardware"),
  svc("/servicos/manutencao-de-computador", "manutenção de computador em Curitiba", "transacional",
    ["conserto de PC perto de mim", "computador não liga", "orçamento manutenção computador"], "reparo"),
  svc("/servicos/manutencao-de-notebook", "manutenção de notebook em Curitiba", "transacional",
    ["conserto de notebook", "troca de tela de notebook", "notebook não carrega"], "reparo"),
  svc("/servicos/formatacao", "formatação de computador em Curitiba", "transacional",
    ["formatar notebook preço", "reinstalar Windows"], "software"),
  svc("/servicos/remocao-de-virus", "remoção de vírus em Curitiba", "transacional",
    ["limpar malware", "computador com propaganda"], "software"),
  svc("/servicos/upgrade-ssd-ram", "upgrade de SSD e memória RAM", "transacional",
    ["instalar SSD preço", "aumentar memória notebook"], "hardware"),
  svc("/servicos/recuperacao-de-dados", "recuperação de dados em Curitiba", "transacional",
    ["recuperar arquivos apagados", "HD não reconhecido"], "dados"),
  svc("/servicos/redes-e-wifi", "redes e Wi-Fi em Curitiba", "transacional",
    ["instalação de rede empresa", "wi-fi lento no escritório"], "redes"),
  svc("/servicos/conserto-tv", "conserto de TV em Curitiba", "transacional",
    ["TV com imagem escura", "TV não liga"], "multieletronicos"),
  svc("/servicos/conserto-placa", "conserto de placa e solda em Curitiba", "transacional",
    ["reparo em placa-mãe", "solda BGA"], "multieletronicos"),
  svc("/servicos/conserto-monitor", "conserto de monitor em Curitiba", "transacional",
    ["monitor sem imagem", "monitor piscando"], "multieletronicos"),
];

/** Hubs de cidade — intenção local. */
export const CIDADES_COMERCIAIS = [
  ["curitiba", "Curitiba"],
  ["sao-jose-pinhais", "São José dos Pinhais"],
  ["pinhais", "Pinhais"],
  ["colombo", "Colombo"],
  ["araucaria", "Araucária"],
  ["campo-largo", "Campo Largo"],
].map(([slug, nome]) =>
  svc(
    `/tecnico-informatica-${slug}`,
    `técnico de informática em ${nome}`,
    "local",
    [`assistência técnica de computador em ${nome}`, `técnico perto de mim ${nome}`, `atendimento a domicílio ${nome}`],
    "local",
    ["LocalBusiness", "FAQPage"],
  ),
);

/** Conjunto auditado pelo gate comercial da Onda 2. */
export const COMERCIAL_ONDA2 = [HUB, ...SERVICOS_COMERCIAIS, ...CIDADES_COMERCIAIS];

/** Páginas que o hub empresarial DEVE linkar diretamente. */
export const HUB_LINKS_OBRIGATORIOS = [
  "/servicos/suporte-tecnico-empresarial",
  "/servicos/manutencao-preventiva-empresas",
  "/servicos/backup-para-empresas",
  "/servicos/suporte-home-office",
  "/servicos/montagem-de-pc",
  "/servicos/manutencao-de-computador",
  "/servicos/manutencao-de-notebook",
  "/servicos/redes-e-wifi",
  "/servicos/conserto-placa",
];

/** Keyword principal duplicada = canibalização. */
export function keywordsDuplicadas() {
  const vistos = new Map();
  const dup = [];
  for (const item of COMERCIAL_ONDA2) {
    const k = item.keyword.toLowerCase();
    if (vistos.has(k)) dup.push({ keyword: k, paths: [vistos.get(k), item.path] });
    else vistos.set(k, item.path);
  }
  return dup;
}
