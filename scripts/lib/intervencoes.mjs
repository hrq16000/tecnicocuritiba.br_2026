/**
 * ============================================================================
 * REGISTRO DECLARATIVO DE INTERVENÇÕES PÚBLICAS DURANTE A JANELA D0 → D14
 * ============================================================================
 * Política do experimento: ZERO PUBLIC SEO DIFF entre D0 e D14.
 * Quando uma alteração pública legítima acontece dentro da janela, ela NÃO é
 * apagada nem revertida: é registrada aqui como evento `PUBLIC_INTERVENTION`
 * e passa a separar as coortes de leitura do D14.
 *
 * Regras:
 *  • append-only — nunca editar ou remover um evento já publicado;
 *  • D0/D7 históricos permanecem intactos;
 *  • cada evento declara URLs diretas e URLs que passaram a receber inbound novo
 *    (descoberta indireta);
 *  • o script `scripts/registrar-intervencao.mjs` valida e sela o ledger.
 */

export const LEDGER_SCHEMA = "intervencao/1.0";

/** Marco base do experimento — não pode ser reescrito. */
export const D0 = {
  marco: "D0",
  registradoEm: "2026-08-25T01:49:17.273Z",
  universoCurado: 130,
  politica: "ZERO_PUBLIC_SEO_DIFF",
  freeze: "freeze_v1",
};

/**
 * Eventos de intervenção pública. Ordem cronológica, append-only.
 * `urlsDiretas`   → páginas cujo HTML público mudou.
 * `urlsIndiretas` → páginas que passaram a receber novo link interno (inbound),
 *                   sem alteração no próprio HTML.
 */
export const INTERVENCOES = [
  {
    id: "INT-2026-08-25-001",
    tipo: "PUBLIC_INTERVENTION",
    timestamp: "2026-08-25T04:40:00.000Z",
    deploymentId: null,
    commit: null,
    urlsDiretas: ["/areas-atendidas"],
    urlsIndiretas: "DERIVAR_DO_DIRETORIO",
    arquivos: [
      "src/components/areas/DiretorioLocalidades.tsx",
      "src/pages/AreasAtendidas.tsx",
      ".github/workflows/ci.yml",
    ],
    mudanca: "CONTENT_AND_INTERNAL_LINKS",
    motivo:
      "Diretório de localidades com busca acento-insensível, filtro por modalidade e valores vindos de precosConfig, atendendo pedido de usabilidade do usuário durante a janela WAIT.",
    impacto: {
      seo: "Conteúdo público novo em um hub. Title/description/canonical/robots inalterados; corpo e malha interna alterados.",
      internalLinking:
        "Novos links internos para páginas de bairro e cidade já curadas — aumenta inbound e pode acelerar descoberta.",
      conteudo: "Bloco 'Encontre seu bairro ou cidade' adicionado acima do mapa de cobertura.",
      schema: "Sem alteração de JSON-LD.",
      metadata: "Sem alteração de metadata.",
      lastmod: "Elegível para atualização apenas nesta URL.",
      conversao: "CTA adicional abrindo a triagem com localidade e modalidade no contexto.",
    },
    coorte: "INTERVENTION_COHORT",
    experimentalStatus: "INTERVENED",
  },
  {
    id: "INT-2026-08-25-002",
    tipo: "PUBLIC_INTERVENTION",
    timestamp: "2026-08-25T05:30:00.000Z",
    deploymentId: null,
    commit: null,
    urlsDiretas: ["/"],
    urlsIndiretas: [],
    arquivos: [
      "src/lib/galeriaIlustrativa.ts",
      "src/components/home/GaleriaIlustrativaSection.tsx",
      "src/components/home/HomeSections.tsx",
      "public/fotos/galeria/*",
    ],
    mudanca: "CONTENT_AND_MEDIA",
    motivo:
      "Substituição da galeria vazia por fotografias reais licenciadas (Pexels) em AVIF/WebP, declaradas como ilustrativas. Prova fotográfica própria (provasBancada) segue fail-closed.",
    impacto: {
      seo: "Conteúdo e mídia novos na home. Title/description/canonical/robots inalterados.",
      internalLinking: "Nenhum link interno novo.",
      conteudo: "Seção 'Bancada, notebook, desktop e rede' com 6 figuras e legendas factuais.",
      schema: "Sem alteração de JSON-LD.",
      metadata: "Sem alteração de metadata.",
      lastmod: "Elegível para atualização apenas nesta URL.",
      conversao: "Nenhum CTA novo.",
    },
    coorte: "INTERVENTION_COHORT",
    experimentalStatus: "INTERVENED",
  },
  {
    id: "INT-2026-08-25-003",
    tipo: "PUBLIC_INTERVENTION",
    timestamp: "2026-08-25T07:30:00.000Z",
    deploymentId: null,
    commit: null,
    urlsDiretas: [
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
      "/bairros/xaxim",
      "/bairros/novo-mundo",
      "/bairros/uberaba",
      "/bairros/reboucas",
      "/bairros/hauer",
      "/bairros/pinheirinho",
      "/bairros/bacacheri",
      "/bairros/capao-raso",
      "/bairros/sitio-cercado",
      "/bairros/fazendinha",
      "/bairros/campo-comprido",
      "/bairros/merces",
      "/bairros/juveve",
      "/bairros/seminario",
    ],
    urlsIndiretas: [],
    arquivos: [
      "src/components/areas/BairroInterlinkLocal.tsx",
      "src/pages/bairros/BairroTemplate.tsx",
      "src/lib/bairrosBaseline.ts",
      "scripts/check-rotas-localidades.mjs",
      ".github/workflows/ci.yml",
    ],
    mudanca: "INTERNAL_LINKS",
    motivo:
      "Interlinking básico obrigatório do template de localidade (servicos, bairros vizinhos, hub) e correção de dois destinos de serviço que apontavam para rotas inexistentes (404): /servicos/formatacao-de-computador e /servicos/conserto-de-notebook.",
    impacto: {
      seo: "Malha interna alterada em páginas de bairro. Title/description/canonical/robots inalterados.",
      internalLinking:
        "Novos links bairro→serviços e bairro→bairros vizinhos da mesma região; dois links quebrados eliminados.",
      conteudo: "Bloco de navegação adicionado ao rodapé do conteúdo, sem texto editorial novo.",
      schema: "Sem alteração de JSON-LD.",
      metadata: "Sem alteração de metadata.",
      lastmod: "Elegível apenas para as URLs de bairro curadas.",
      conversao: "Sem CTA novo.",
    },
    coorte: "INTERVENTION_COHORT",
    experimentalStatus: "INTERVENED",
  },
  {
    id: "INT-2026-08-25-004",
    tipo: "PUBLIC_INTERVENTION",
    timestamp: "2026-08-25T07:40:00.000Z",
    deploymentId: null,
    commit: null,
    urlsDiretas: ["/"],
    urlsIndiretas: [],
    arquivos: [
      "src/components/home/RegioesCuritibaSection.tsx",
      "src/lib/whatsappDeepLink.ts",
      "src/pages/bairros/BairroTemplate.tsx",
      "scripts/check-bairros-noindex.mjs",
    ],
    mudanca: "INTERNAL_LINKS",
    motivo:
      "Grid de regiões da home passou a linkar as 45 localidades de Curitiba + 9 municípios da RMC (antes só 5 chips eram clicáveis) e os CTAs de bairro receberam deep link contextual de WhatsApp (local + serviço).",
    impacto: {
      seo: "Malha interna da home ampliada. Title/description/canonical/robots inalterados.",
      internalLinking: "54 destinos de localidade agora descobríveis a partir de /.",
      conteudo: "Sem texto editorial novo; chips passaram de span para Link.",
      schema: "Sem alteração de JSON-LD.",
      metadata: "Sem alteração de metadata.",
      lastmod: "Elegível apenas para /.",
      conversao: "Deep links de WhatsApp com serviço e bairro pré-preenchidos.",
    },
    coorte: "INTERVENTION_COHORT",
    experimentalStatus: "INTERVENED",
  },
  {
    id: "INT-2026-08-25-005",
    tipo: "PUBLIC_INTERVENTION",
    timestamp: "2026-08-25T08:40:00.000Z",
    deploymentId: null,
    commit: null,
    urlsDiretas: ["/tecnico-informatica-curitiba"],
    urlsIndiretas: [],
    arquivos: [
      "src/pages/TecnicoInformaticaCuritiba.tsx",
      "src/pages/bairros/BairroTemplate.tsx",
      "src/components/areas/BairroInterlinkLocal.tsx",
      "src/components/areas/DiretorioLocalidades.tsx",
      "src/components/home/RegioesCuritibaSection.tsx",
    ],
    mudanca: "INTERNAL_LINKS",
    motivo:
      "Bloco 'Principais regiões de Curitiba atendidas' passou de lista estática de texto para malha real de links por bairro/RMC, com prefetch por intenção; BreadcrumbList das páginas de bairro ganhou o nível de região.",
    impacto: {
      seo: "Profundidade de clique reduzida para as localidades. Title/description/canonical/robots inalterados.",
      internalLinking: "54 destinos de localidade descobríveis a partir do pilar de Curitiba.",
      conteudo: "Sem texto editorial novo.",
      schema: "BreadcrumbList das páginas de bairro passa a ter Home > Cidade > Bairros > Região > Bairro.",
      metadata: "Sem alteração de metadata.",
      lastmod: "Elegível para /tecnico-informatica-curitiba e páginas de bairro curadas.",
      conversao: "Sem CTA novo.",
    },
    coorte: "INTERVENTION_COHORT",
    experimentalStatus: "INTERVENED",
  },
];

export default { LEDGER_SCHEMA, D0, INTERVENCOES };
