/**
 * Conteúdo localizado (meta, FAQ e Offer) das rotas categoria × local.
 * Espelho em runtime de scripts/lib/category-local.mjs — a paridade entre os
 * dois é validada no CI por scripts/check-faq-parity.mjs.
 */
import { CATEGORIES, type CategoryData, type CategoryId } from "@/pages/hubs/categories";
import { LOCAIS, type LocalData } from "@/pages/hubs/locais";

export const PRECO_MINIMO_REPARO = 300;
export const PRECO_DIAGNOSTICO = 99.99;
export const GARANTIA_DIAS = 90;

export interface Faixa {
  nome: string;
  raio: string;
  taxa: string;
  janelas: string;
  prazoColetaDias: number;
}

export const FAIXAS: Record<string, Faixa> = {
  f1: { nome: "Faixa 1", raio: "até 8 km", taxa: "sem custo adicional de deslocamento", janelas: "segunda a sexta, sob agendamento", prazoColetaDias: 1 },
  f2: { nome: "Faixa 2", raio: "de 8 a 15 km", taxa: "taxa reduzida informada no aceite", janelas: "terças e quintas", prazoColetaDias: 2 },
  f3: { nome: "Faixa 3", raio: "de 15 a 30 km", taxa: "taxa por distância informada no aceite", janelas: "quartas, em janela única consolidada", prazoColetaDias: 3 },
};

/** faixa + referência de roteiro por local (mesma tabela do prerender). */
export const LOCAL_LOGISTICA: Record<string, { faixa: keyof typeof FAIXAS; referencia: string }> = {
  "curitiba": { faixa: "f1", referencia: "Centro, Batel e Água Verde" },
  "sao-jose-dos-pinhais": { faixa: "f3", referencia: "Centro, Afonso Pena e Costeira" },
  "araucaria": { faixa: "f3", referencia: "Centro, Fazenda Velha e Costeira" },
  "pinhais": { faixa: "f2", referencia: "Centro, Weissópolis e Emiliano Perneta" },
  "colombo": { faixa: "f3", referencia: "Centro, Guaraituba e Maracanã" },
  "campo-largo": { faixa: "f3", referencia: "Centro, Jardim Itália e Ferraria" },
  "almirante-tamandare": { faixa: "f3", referencia: "Centro, Tanguá e Cachoeira" },
  "fazenda-rio-grande": { faixa: "f3", referencia: "Centro, Eucaliptos e Nações" },
  "piraquara": { faixa: "f3", referencia: "Centro, Guarituba e Vila Macedo" },
  "quatro-barras": { faixa: "f3", referencia: "Centro, Jardim Menino Deus e Borda do Campo" },
  "campo-magro": { faixa: "f3", referencia: "Centro e Jardim Cecília" },
  "batel": { faixa: "f1", referencia: "Praça do Japão e Avenida do Batel" },
  "centro": { faixa: "f1", referencia: "Praça Osório e Rua XV de Novembro" },
  "cic": { faixa: "f2", referencia: "Cidade Industrial e Avenida Juscelino Kubitschek" },
  "portao": { faixa: "f1", referencia: "Avenida República Argentina e Parque do Portão" },
  "santa-felicidade": { faixa: "f2", referencia: "Avenida Manoel Ribas e Bosque do Papa" },
  "boqueirao": { faixa: "f2", referencia: "Avenida Marechal Floriano e Terminal do Boqueirão" },
  "cajuru": { faixa: "f2", referencia: "Avenida Prefeito Maurício Fruet e Terminal do Cajuru" },
  "agua-verde": { faixa: "f1", referencia: "Avenida República Argentina e Parque da Barigui" },
};

/** Sintomas curtos por categoria — usados na FAQ localizada (mesma ordem do prerender). */
export const SINTOMAS_FAQ: Record<CategoryId, string[]> = {
  tv: ["TV não liga", "sem imagem (só som)", "linhas e manchas na tela", "backlight apagando", "Smart TV travando", "não reconhece HDMI"],
  som: ["caixa Bluetooth não liga", "soundbar sem som", "home theater chiando", "receiver travando", "bateria de caixa portátil viciada", "Bluetooth não pareia"],
  videogame: ["console não liga", "HDMI sem imagem", "superaquecimento", "não lê disco", "controle com drift", "desliga sozinho"],
  celular: ["tela trincada", "não carrega", "oxidação após queda d'água", "bateria acabando rápido", "sem som no alto-falante", "não liga (placa)"],
};

export const BANCADA: Record<CategoryId, string> = {
  tv: "fonte, placa principal, T-CON e backlight",
  som: "amplificador, fonte, alto-falante e placas de áudio",
  videogame: "microsoldagem de HDMI, troca de pasta térmica e reparo de placa",
  celular: "display, conector de carga, bateria e microsoldagem de placa",
};

export const TITULO_CURTO: Record<CategoryId, string> = {
  tv: "Conserto de TV",
  som: "Conserto de Som",
  videogame: "Conserto de Videogame",
  celular: "Conserto de Celular",
};

/** Corta em fronteira de palavra (espelha scripts/lib/seo-meta.mjs). */
export function clamp(text: string, max = 165): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:·|—-]+$/, "")}…`;
}

export const cityLabel = (l: LocalData) =>
  l.kind === "bairro" ? `${l.nome}, ${l.cidadeMae}` : l.nome;

/** Trilha canônica compartilhada pelo head SSR e pela navegação visível. */
export function categoryLocalBreadcrumbs(cat: CategoryData, local: LocalData) {
  return [
    { name: "Início", path: "/" },
    { name: cat.titlePrefix, path: `/${cat.slug}-curitiba` },
    { name: cityLabel(local), path: `/${cat.slug}/${local.slug}` },
  ];
}

export const shortLabel = (l: LocalData) =>
  l.kind === "bairro" ? `${l.nome} (Curitiba)` : l.nome;

export const faixaDe = (l: LocalData): Faixa =>
  FAIXAS[LOCAL_LOGISTICA[l.slug]?.faixa ?? "f3"];

export const referenciaDe = (l: LocalData) =>
  LOCAL_LOGISTICA[l.slug]?.referencia ?? "Centro";

export function sintomasDoLocal(cat: CategoryData, local: LocalData): [string, string] {
  const lista = SINTOMAS_FAQ[cat.id];
  const i = Math.max(0, LOCAIS.findIndex((l) => l.slug === local.slug));
  return [lista[i % lista.length], lista[(i + 2) % lista.length]];
}

export const TITLE_MAX = 70;

function titleFor(cat: CategoryData, local: LocalData) {
  const base = `${TITULO_CURTO[cat.id]} em ${shortLabel(local)}`;
  const long = `${base} | Coleta e Bancada`;
  return long.length <= TITLE_MAX ? long : `${base} | Coleta`;
}

export function categoryLocalMeta(cat: CategoryData, local: LocalData) {
  const faixa = faixaDe(local);
  const [s1] = sintomasDoLocal(cat, local);
  return {
    path: `/${cat.slug}/${local.slug}`,
    title: titleFor(cat, local),
    description: clamp(
      `${cat.titlePrefix} em ${cityLabel(local)}/PR: coleta ${faixa.raio}, diagnóstico em bancada de ` +
        `${s1} e reparo mínimo de R$ ${PRECO_MINIMO_REPARO},00 com ${GARANTIA_DIAS} dias de garantia.`,
    ),
  };
}

export function localizedFaqs(cat: CategoryData, local: LocalData) {
  const label = cityLabel(local);
  const faixa = faixaDe(local);
  const [s1, s2] = sintomasDoLocal(cat, local);
  return [
    {
      q: `Vocês fazem ${cat.titlePrefix.toLowerCase()} em ${label}?`,
      a: `Sim. ${label} está dentro da nossa área de coleta (${faixa.raio}, ${faixa.nome}). Buscamos o equipamento no endereço, avaliamos em bancada e devolvemos no mesmo endereço após a autorização do serviço.`,
    },
    {
      q: `Como funciona a coleta em ${label}?`,
      a: `A coleta em ${label} é agendada em ${faixa.janelas}, com ${faixa.taxa}. O prazo entre o aceite e a retirada é de ${faixa.prazoColetaDias} dia(s) útil(eis), e a região de referência para o roteiro é ${referenciaDe(local)}.`,
    },
    {
      q: `Quanto custa o ${cat.titlePrefix.toLowerCase()} em ${label}?`,
      a: `O reparo mínimo é R$ ${PRECO_MINIMO_REPARO},00, já com o diagnóstico incluso. Se você não autorizar o serviço após o laudo, paga apenas R$ ${PRECO_DIAGNOSTICO.toFixed(2).replace(".", ",")} referentes ao diagnóstico. Nenhuma execução acontece sem autorização por escrito.`,
    },
    {
      q: `Qual o prazo do serviço para quem é de ${label}?`,
      a: `O prazo de bancada para ${cat.nome.toLowerCase()} é de ${cat.prazoEntrega}, contado a partir da autorização. Peças sob encomenda podem alongar esse prazo, e avisamos por WhatsApp antes de qualquer alteração.`,
    },
    {
      q: `Atendem ${s1} e ${s2} em ${label}?`,
      a: `Sim. ${s1} e ${s2} estão entre os chamados mais frequentes que recebemos de ${label}. A avaliação envolve ${BANCADA[cat.id]}, e o laudo informa se o reparo compensa antes de qualquer gasto com peça.`,
    },
  ];
}

export function offerFor(cat: CategoryData, local: LocalData, site = "https://tecnico.curitiba.br") {
  const url = `${site}/${cat.slug}/${local.slug}`;
  return {
    "@type": "Offer",
    name: `${cat.titlePrefix} em ${cityLabel(local)}`,
    priceCurrency: "BRL",
    price: String(PRECO_MINIMO_REPARO),
    url,
    availability: "https://schema.org/InStock",
    areaServed: { "@type": local.kind === "bairro" ? "Place" : "City", name: cityLabel(local) },
    priceSpecification: [
      {
        "@type": "PriceSpecification",
        name: "Reparo mínimo com diagnóstico incluso",
        priceCurrency: "BRL",
        minPrice: String(PRECO_MINIMO_REPARO),
        price: String(PRECO_MINIMO_REPARO),
        valueAddedTaxIncluded: true,
      },
      {
        "@type": "PriceSpecification",
        name: "Diagnóstico em bancada (caso o serviço não seja autorizado)",
        priceCurrency: "BRL",
        price: PRECO_DIAGNOSTICO.toFixed(2),
        valueAddedTaxIncluded: true,
      },
    ],
  };
}

export const findCategoryById = (id: CategoryId) => CATEGORIES[id];
