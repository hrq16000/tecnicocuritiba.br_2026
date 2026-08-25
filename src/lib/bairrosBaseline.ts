/**
 * ============================================================================
 * MAPEAMENTO OFICIAL DE COBERTURA LOCAL + FILA DE ENRIQUECIMENTO AGRESSIVO
 * ============================================================================
 * Fonte única do escopo geográfico publicado no hub /areas-atendidas:
 * 45 bairros de Curitiba (7 regiões) + 9 municípios da Região Metropolitana.
 *
 * GOVERNANÇA (bairro-pruning-policy):
 *   - `seoDepth: "curated"`   → conteúdo autoral aprovado, indexável, entra no
 *                               sitemap curado.
 *   - `seoDepth: "baseline"`  → página estrutural existente e navegável, porém
 *                               `noindex` e FORA do sitemap até receber
 *                               conteúdo autoral + prova visual real.
 *
 * A flag `enrichmentStatus` é o backlog explícito: tudo que estiver como
 * "pending" pertence à FILA DE ENRIQUECIMENTO AGRESSIVO e só pode ser promovido
 * a indexável quando passar nos gates de originalidade (Jaccard/shingles) e de
 * prova visual real (src/lib/bairroPhotos.ts). Promoção manual sem gate é
 * proibida — é assim que se cria doorway page.
 *
 * Relatório: `npm run report:fila-bairros` → reports/fila-enriquecimento-bairros.md
 */
import { bairroIndexavel } from "@/lib/bairroPhotos";

export type SeoDepth = "curated" | "baseline";
export type EnrichmentStatus = "done" | "pending";

export interface CoberturaLocal {
  /** Nome de exibição usado nos hubs regionais. */
  nome: string;
  /** Caminho canônico da página. */
  to: string;
  /** Slug de bairro (apenas Curitiba). */
  slug?: string;
}

export interface RegiaoCobertura {
  id: string;
  titulo: string;
  itens: CoberturaLocal[];
}

const bairro = (nome: string, slug: string): CoberturaLocal => ({
  nome,
  slug,
  to: `/bairros/${slug}`,
});

export const REGIOES_COBERTURA: RegiaoCobertura[] = [
  {
    id: "centro",
    titulo: "Centro e região central",
    itens: [
      bairro("Centro", "centro"),
      bairro("Centro Cívico", "centro-civico"),
      bairro("São Francisco", "sao-francisco"),
      bairro("Alto da Glória", "alto-da-gloria"),
      bairro("Alto da XV", "alto-da-xv"),
      bairro("Rebouças", "reboucas"),
      bairro("Prado Velho", "prado-velho"),
    ],
  },
  {
    id: "matriz-batel",
    titulo: "Matriz / Batel",
    itens: [
      bairro("Batel", "batel"),
      bairro("Água Verde", "agua-verde"),
      bairro("Bigorrilho", "bigorrilho"),
      bairro("Mercês", "merces"),
      bairro("Campina do Siqueira", "campina-do-siqueira"),
      bairro("Vila Izabel", "vila-izabel"),
      bairro("Seminário", "seminario"),
    ],
  },
  {
    id: "norte",
    titulo: "Norte",
    itens: [
      bairro("Juvevê", "juveve"),
      bairro("Cabral", "cabral"),
      bairro("Hugo Lange", "hugo-lange"),
      bairro("Jardim Social", "jardim-social"),
      bairro("Bacacheri", "bacacheri"),
      bairro("Bairro Alto", "bairro-alto"),
      bairro("Tingui", "tingui"),
      bairro("Atuba", "atuba"),
      bairro("Boa Vista", "boa-vista"),
    ],
  },
  {
    id: "leste",
    titulo: "Leste",
    itens: [
      bairro("Cristo Rei", "cristo-rei"),
      bairro("Jardim das Américas", "jardim-das-americas"),
      bairro("Cajuru", "cajuru"),
      bairro("Capão da Imbuia", "capao-da-imbuia"),
      bairro("Uberaba", "uberaba"),
      bairro("Guabirotuba", "guabirotuba"),
    ],
  },
  {
    id: "sul",
    titulo: "Sul",
    itens: [
      bairro("Portão", "portao"),
      bairro("Novo Mundo", "novo-mundo"),
      bairro("Fanny", "fanny"),
      bairro("Lindóia", "lindoia"),
      bairro("Pinheirinho", "pinheirinho"),
      bairro("Xaxim", "xaxim"),
      bairro("Boqueirão", "boqueirao"),
      bairro("Hauer", "hauer"),
      bairro("Sítio Cercado", "sitio-cercado"),
    ],
  },
  {
    id: "oeste-cic",
    titulo: "Oeste e CIC",
    itens: [
      bairro("Campo Comprido", "campo-comprido"),
      bairro("Cidade Industrial (CIC)", "cic"),
      bairro("Fazendinha", "fazendinha"),
      bairro("Santa Quitéria", "santa-quiteria"),
      bairro("Vista Alegre", "vista-alegre"),
      bairro("Santa Felicidade", "santa-felicidade"),
      bairro("Butiatuvinha", "butiatuvinha"),
    ],
  },
  {
    id: "rmc",
    titulo: "Região Metropolitana",
    itens: [
      { nome: "São José dos Pinhais", to: "/tecnico-informatica-sao-jose-pinhais" },
      { nome: "Pinhais", to: "/tecnico-informatica-pinhais" },
      { nome: "Colombo", to: "/tecnico-informatica-colombo" },
      { nome: "Araucária", to: "/tecnico-informatica-araucaria" },
      { nome: "Campo Largo", to: "/tecnico-informatica-campo-largo" },
      { nome: "Almirante Tamandaré", to: "/tecnico-informatica-almirante-tamandare" },
      { nome: "Fazenda Rio Grande", to: "/tecnico-informatica-fazenda-rio-grande" },
      { nome: "Piraquara", to: "/tecnico-informatica-piraquara" },
      { nome: "Quatro Barras", to: "/tecnico-informatica-quatro-barras" },
    ],
  },
];

export const BAIRROS_MAPEADOS = REGIOES_COBERTURA.filter((r) => r.id !== "rmc").flatMap(
  (r) => r.itens.map((i) => ({ ...i, regiao: r.id, regiaoTitulo: r.titulo })),
);

/** Profundidade de SEO derivada do gate real de indexação (fail-closed). */
export function seoDepth(slug: string): SeoDepth {
  return bairroIndexavel(slug) ? "curated" : "baseline";
}

export function enrichmentStatus(slug: string): EnrichmentStatus {
  return seoDepth(slug) === "curated" ? "done" : "pending";
}

/** Fila de enriquecimento agressivo: bairros mapeados ainda em baseline. */
export const FILA_ENRIQUECIMENTO = BAIRROS_MAPEADOS.filter(
  (b) => b.slug && enrichmentStatus(b.slug) === "pending",
);

/** Serviços linkados de toda página de bairro (malha interna agressiva). */
export const SERVICOS_INTERLINK_LOCAL = [
  { to: "/servicos/formatacao-computador", label: "Formatação com backup" },
  { to: "/servicos/conserto-notebook-curitiba", label: "Conserto de notebook" },
  { to: "/servicos/manutencao-de-computador", label: "Manutenção de computador" },
  { to: "/servicos/remocao-de-virus", label: "Remoção de vírus" },
  { to: "/servicos/upgrade-ssd-memoria", label: "Upgrade de SSD e memória" },
  { to: "/servicos/redes-e-wifi", label: "Redes e Wi-Fi" },
] as const;
