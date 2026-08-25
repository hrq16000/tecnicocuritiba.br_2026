/**
 * CLASSIFICAÇÃO DE CLUSTER E TIER DE DESCOBERTA
 *
 * Tier reflete valor real da página para descoberta orgânica — nunca volume de
 * URLs. A ordem das regras importa: a primeira que casar decide.
 *
 * TIER A — core comercial/hubs e páginas com impressões reais no GSC.
 * TIER B — autoridade de apoio (problemas, artigos, bairros âncora fortes).
 * TIER C — long tail local (serviço × bairro, combinações locais).
 * TIER D — auxiliar (institucional/editorial fora do funil principal).
 */

const CORE = new Set([
  "/",
  "/servicos",
  "/problemas",
  "/areas-atendidas",
  "/empresas",
  "/empresa-de-ti-curitiba",
  "/precos-e-politicas",
  "/blog",
  "/contato",
  "/como-funciona",
  "/tecnico-informatica-curitiba",
  "/assistencia-tecnica-curitiba",
]);

const AUX = new Set([
  "/sobre",
  "/faq",
  "/anuncie",
  "/quando-nao-compensa",
  "/politica-de-pecas-do-cliente",
  "/gestor-responsavel",
  "/termos-e-condicoes",
  "/parceiros",
  "/como-avaliar",
  "/excluir-meus-dados",
  "/status",
]);

export function clusterOf(path) {
  if (path === "/") return "HOME";
  if (path === "/blog") return "BLOG_HUB";
  if (path.startsWith("/blog/")) return "ARTIGO";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(path)) return "SERVICO_BAIRRO";
  if (path === "/servicos") return "HUB";
  if (path.startsWith("/servicos/")) return "SERVICO";
  if (path === "/problemas") return "HUB";
  if (path.startsWith("/problemas/")) return "PROBLEMA";
  if (path.startsWith("/bairros/")) return "BAIRRO";
  if (path.startsWith("/tecnico-informatica-")) return "CIDADE";
  if (path.startsWith("/equipamentos")) return "EQUIPAMENTO";
  if (path === "/areas-atendidas" || path === "/empresa-de-ti-curitiba" || path === "/guia-tecnico-informatica")
    return "HUB";
  return "INSTITUCIONAL";
}

/**
 * @param {string} path
 * @param {{impressions?: number, clicks?: number}} gsc métricas reais (GSC)
 */
export function tierOf(path, gsc = {}) {
  const cluster = clusterOf(path);
  if (CORE.has(path)) return "A";
  if (cluster === "SERVICO" && !path.includes("/servicos/conserto-")) return "A";
  if (cluster === "CIDADE" && (gsc.impressions ?? 0) > 0) return "A";
  if ((gsc.impressions ?? 0) >= 5 || (gsc.clicks ?? 0) > 0) return "A";
  if (AUX.has(path)) return "D";
  if (cluster === "SERVICO_BAIRRO") return "C";
  if (cluster === "PROBLEMA" || cluster === "ARTIGO" || cluster === "BAIRRO" || cluster === "HUB") return "B";
  if (cluster === "CIDADE") return "B";
  return "D";
}
