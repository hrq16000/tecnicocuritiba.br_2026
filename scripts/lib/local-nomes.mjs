/**
 * Nomes humanos de bairros e serviços — usados para gerar âncoras naturais
 * de links internos (bairro → serviços, serviço → bairros).
 *
 * Fonte única para não repetir dicionário em vários scripts.
 */

export const BAIRRO_NOMES = {
  cic: "CIC",
  batel: "Batel",
  "agua-verde": "Água Verde",
  centro: "Centro",
  portao: "Portão",
  bigorrilho: "Bigorrilho",
  "santa-felicidade": "Santa Felicidade",
  cabral: "Cabral",
  "cristo-rei": "Cristo Rei",
  "boa-vista": "Boa Vista",
  cajuru: "Cajuru",
  boqueirao: "Boqueirão",
  "jardim-das-americas": "Jardim das Américas",
  ecoville: "Ecoville",
  "alto-da-xv": "Alto da XV",
  reboucas: "Rebouças",
};

/** Preposição correta para cada bairro ("no Batel", "na CIC"). */
export const BAIRRO_PREP = {
  cic: "na",
  "boa-vista": "na",
  "santa-felicidade": "em",
  "jardim-das-americas": "no",
};

export const prepDe = (slug) => BAIRRO_PREP[slug] ?? "no";

export const nomeBairro = (slug) =>
  BAIRRO_NOMES[slug] ??
  slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

/** Rótulos naturais dos serviços (usados nas âncoras). */
export const SERVICO_NOMES = {
  "/servicos/formatacao": "formatação de computador",
  "/servicos/manutencao-de-notebook": "manutenção de notebook",
  "/servicos/manutencao-de-computador": "manutenção de computador",
  "/servicos/upgrade-ssd-ram": "upgrade de SSD e memória",
  "/servicos/remocao-de-virus": "remoção de vírus",
  "/servicos/recuperacao-de-dados": "recuperação de dados",
  "/servicos/redes-e-wifi": "redes e Wi-Fi",
  "/servicos/suporte-tecnico-empresarial": "suporte técnico empresarial",
  "/servicos/manutencao-preventiva-empresas": "manutenção preventiva para empresas",
  "/servicos/backup-para-empresas": "backup para empresas",
  "/servicos/suporte-home-office": "suporte para home office",
  "/servicos/montagem-de-pc": "montagem de PC",
  "/servicos/conserto-tv": "conserto de TV",
  "/servicos/conserto-placa": "conserto de placa eletrônica",
  "/servicos/conserto-monitor": "conserto de monitor",
  "/servicos/formatacao-computador": "formatação de computador",
  "/servicos/remocao-virus": "remoção de vírus",
  "/servicos/conserto-pc-notebook": "conserto de PC e notebook",
  "/servicos/upgrade-ssd-memoria": "upgrade de SSD e memória",
  "/servicos/redes-wifi": "instalação e ajuste de Wi-Fi",
  "/servicos/manutencao-tv": "manutenção de Smart TV",
};

export const nomeServico = (path) =>
  SERVICO_NOMES[path] ??
  path
    .replace(/^\/servicos\//, "")
    .split("-")
    .join(" ");
