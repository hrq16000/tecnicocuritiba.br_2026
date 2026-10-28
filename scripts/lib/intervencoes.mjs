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
  {
    "id": "INT-2026-10-27-001",
    "tipo": "PUBLIC_INTERVENTION",
    "timestamp": "2026-10-27T17:53:40.095Z",
    "deploymentId": null,
    "commit": null,
    "urlsDiretas": [
      "/",
      "/empresas",
      "/bairros/xaxim",
      "/bairros/uberaba",
      "/servicos/conserto-impressora-3d"
    ],
    "urlsIndiretas": [],
    "arquivos": [
      "src/routes/__root.tsx",
      "src/pages/Empresas.tsx",
      "src/lib/bairroEnriquecimento.ts",
      "src/lib/bairrosData.ts",
      "src/lib/servicosCore.ts"
    ],
    "mudanca": "COPY_TRUTHFULNESS",
    "motivo": "Retirar prazos de coleta e reparo não confirmados. Preservar perguntas e orientações técnicas, a política de indexação, os destinos de CTA e o histórico do freeze.",
    "impacto": {
      "seo": "Sem promoção de indexação nem mudança de canonical; correções pontuais de texto em componentes compartilhados.",
      "internalLinking": "Nenhum link novo.",
      "conteudo": "Prazos passam a depender da triagem, agenda e teste.",
      "schema": "FAQ empresarial atualizada no cliente a partir da mesma fonte do texto visível.",
      "metadata": "Alt padrão OpenGraph compartilhado em todas as rotas passa a Suporte e manutenção; URLs listadas destacam o texto visível alterado, e bairroEnriquecimento também é compartilhado entre bairros.",
      "lastmod": "Sem data artificial nem reescrita do histórico.",
      "conversao": "Destino WhatsApp e comportamento dos CTAs preservados."
    },
    "coorte": "INTERVENTION_COHORT",
    "experimentalStatus": "INTERVENED"
  },
  {
    "id": "INT-2026-10-27-002",
    "tipo": "PUBLIC_INTERVENTION",
    "timestamp": "2026-10-27T18:03:16.717Z",
    "deploymentId": null,
    "commit": null,
    "urlsDiretas": [
      "/problemas/computador-nao-liga-curitiba"
    ],
    "urlsIndiretas": [],
    "arquivos": [
      "src/routes/problemas.$slug.tsx",
      "src/routes/procedimentos.$slug.tsx",
      "src/pages/ProblemaPage.tsx",
      "src/lib/problemaPage.functions.ts",
      "src/lib/seo/problemaRouteMeta.ts",
      "src/data/problema-route-meta.generated.json"
    ],
    "mudanca": "SSR_AND_BUNDLE_SPLITTING",
    "motivo": "Separar metadata compacta do corpo editorial de problemas para reduzir o JavaScript inicial. Nenhum texto, slug, canonical, robots ou destino de CTA é modificado.",
    "impacto": {
      "seo": "Mesma metadata nos 189 slugs distintos; ausência continua 404. Arquivo de entrada compartilhado pode mudar em todas as rotas.",
      "internalLinking": "Sem novos links.",
      "conteudo": "Problemas e procedimentos usam loader de artigo no servidor em vez do esqueleto vazio. Canonical da hidratação acompanha o path, sem promoção de indexação.",
      "schema": "Sem mudança intencional.",
      "metadata": "Paridade exata com a primeira ocorrência da base original, incluindo 33 slugs repetidos.",
      "lastmod": "Sem promoção artificial de datas.",
      "conversao": "Sem mudança."
    },
    "coorte": "INTERVENTION_COHORT",
    "experimentalStatus": "INTERVENED"
  },
  {
    "id": "INT-2026-10-28-003",
    "tipo": "PUBLIC_INTERVENTION",
    "timestamp": "2026-10-28T01:06:46.425Z",
    "deploymentId": null,
    "commit": null,
    "urlsDiretas": [
      "/problemas/computador-nao-liga-curitiba",
      "/procedimentos/computador-nao-liga-curitiba"
    ],
    "urlsIndiretas": [],
    "arquivos": [
      "src/server.ts",
      "src/lib/serverCanonical.ts"
    ],
    "mudanca": "INTERNAL_ENDPOINT_ROUTING",
    "motivo": "Preservar a caixa de /_serverFn/ no host público; a canonicalização de SEO alterava esse endpoint interno e quebrava navegação SPA. Host, HTTPS e regras de caminho das páginas públicas preservados.",
    "impacto": {
      "seo": "Sem promoção de indexação ou mudança de canonical público.",
      "internalLinking": "Sem novos links.",
      "conteudo": "Sem alteração de texto.",
      "schema": "Sem alteração.",
      "metadata": "Sem alteração.",
      "lastmod": "Sem mudança artificial.",
      "conversao": "Restaura navegação entre artigos mantendo o carregamento por Server Function."
    },
    "coorte": "INTERVENTION_COHORT",
    "experimentalStatus": "INTERVENED"
  },
  {
    "id": "INT-2026-10-28-004",
    "tipo": "PUBLIC_INTERVENTION",
    "timestamp": "2026-10-28T01:20:51.137Z",
    "deploymentId": null,
    "commit": null,
    "urlsDiretas": [
      "/problemas/computador-nao-liga-curitiba",
      "/procedimentos/computador-nao-liga-curitiba"
    ],
    "urlsIndiretas": [],
    "arquivos": [
      "src/lib/problemaPage.functions.ts",
      "src/generated/problema-articles/"
    ],
    "mudanca": "STATIC_ARTICLE_DATA",
    "motivo": "Navegação entre artigos passa a importar módulos estáticos individuais; elimina dependência de RPC rejeitado no host publicado. Mesma fonte, conteúdo, SSR e política noindex.",
    "impacto": {
      "seo": "Sem promoção de indexação.",
      "internalLinking": "Sem novos links.",
      "conteudo": "Paridade integral validada com a primeira ocorrência da base editorial.",
      "schema": "Sem mudança intencional.",
      "metadata": "Sem alteração.",
      "lastmod": "Sem mudança artificial.",
      "conversao": "Restaura a navegação sem endpoint de dados."
    },
    "coorte": "INTERVENTION_COHORT",
    "experimentalStatus": "INTERVENED"
  },
];

export default { LEDGER_SCHEMA, D0, INTERVENCOES };
