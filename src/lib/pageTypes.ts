/**
 * Classificação de rotas por TIPO DE PÁGINA.
 *
 * Usada no monitoramento de Core Web Vitals: o gargalo raramente é de uma URL
 * isolada — é do template que ela usa (serviço, bairro, problema, editorial).
 * Agrupar por tipo mostra onde corrigir uma vez e melhorar dezenas de URLs.
 */
export type PageType =
  | "home"
  | "servico-bairro"
  | "servico"
  | "bairro"
  | "cidade"
  | "problema"
  | "editorial"
  | "hub"
  | "admin"
  | "institucional";

export const PAGE_TYPE_LABEL: Record<PageType, string> = {
  home: "Home",
  "servico-bairro": "Serviço × bairro",
  servico: "Serviço",
  bairro: "Bairro",
  cidade: "Cidade",
  problema: "Problema/sintoma",
  editorial: "Editorial/blog",
  hub: "Hub",
  admin: "Painel interno",
  institucional: "Institucional",
};

export function pageTypeOf(pathname: string): PageType {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  if (p.startsWith("/admin")) return "admin";
  if (p.startsWith("/blog")) return "editorial";
  if (p.startsWith("/problemas/")) return "problema";
  if (p === "/problemas" || p === "/servicos" || p === "/areas-atendidas") return "hub";
  if (p.startsWith("/servicos/")) return p.split("/").length > 3 ? "servico-bairro" : "servico";
  if (p.startsWith("/bairros/")) return "bairro";
  if (p.startsWith("/tecnico-informatica-")) return "cidade";
  return "institucional";
}

/** Limites do Google (bom / precisa melhorar) por métrica. */
export const VITALS_THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

export function ratingOf(metric: string, value: number): "good" | "needs-improvement" | "poor" {
  const t = VITALS_THRESHOLDS[metric];
  if (!t) return "good";
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}
