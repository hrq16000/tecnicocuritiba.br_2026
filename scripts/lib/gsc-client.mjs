/**
 * Cliente mínimo do Google Search Console via connector gateway do Lovable.
 * Segredos esperados no ambiente do job:
 *   LOVABLE_API_KEY                auth no gateway
 *   GOOGLE_SEARCH_CONSOLE_API_KEY  chave da conexão
 * Opcional: GSC_SITE_URL para fixar a propriedade (evita ambiguidade).
 */
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function headers() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !gscKey) {
    throw new Error(
      "Credenciais ausentes: defina LOVABLE_API_KEY e GOOGLE_SEARCH_CONSOLE_API_KEY.",
    );
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": gscKey,
    "Content-Type": "application/json",
  };
}

export async function gsc(path, init = {}) {
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers: headers() });
  const body = await res.text();
  if (!res.ok) throw new Error(`GSC [${res.status}] ${path} → ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
}

const covers = (siteUrl, target) => {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = new URL(target).hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return new URL(target).href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
};

/** Resolve a propriedade verificada que cobre `targetUrl`. */
export async function resolveSite(targetUrl) {
  const fixed = process.env.GSC_SITE_URL;
  const { siteEntry = [] } = await gsc("/webmasters/v3/sites");
  const verified = siteEntry.filter((e) => e.permissionLevel !== "siteUnverifiedUser");
  if (fixed) {
    const match = verified.find((e) => e.siteUrl === fixed);
    if (!match) throw new Error(`GSC_SITE_URL="${fixed}" não é uma propriedade verificada.`);
    return match.siteUrl;
  }
  const matches = verified.filter((e) => covers(e.siteUrl, targetUrl));
  if (matches.length === 0) throw new Error(`Nenhuma propriedade verificada cobre ${targetUrl}.`);
  if (matches.length > 1) {
    throw new Error(
      `Múltiplas propriedades cobrem ${targetUrl}: ${matches
        .map((m) => m.siteUrl)
        .join(", ")}. Defina GSC_SITE_URL.`,
    );
  }
  return matches[0].siteUrl;
}

/** Estado da URL no índice do Google (leitura — não solicita indexação). */
export async function inspectUrl(siteUrl, inspectionUrl) {
  const data = await gsc("/v1/urlInspection/index:inspect", {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });
  const idx = data?.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: idx.verdict ?? "UNKNOWN",
    coverageState: idx.coverageState ?? "unknown",
    robotsTxtState: idx.robotsTxtState ?? "unknown",
    indexingState: idx.indexingState ?? "unknown",
    googleCanonical: idx.googleCanonical ?? null,
    userCanonical: idx.userCanonical ?? null,
    lastCrawlTime: idx.lastCrawlTime ?? null,
  };
}

/**
 * Inspeção completa (leitura): estado de índice + Rich Results detectados.
 * `richResults` traz, por tipo (FAQ, LocalBusiness, Service…), a contagem de
 * itens detectados e de itens com erro/aviso — base do monitoramento diário.
 */
export async function inspectRichResults(siteUrl, inspectionUrl) {
  const data = await gsc("/v1/urlInspection/index:inspect", {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });
  const result = data?.inspectionResult ?? {};
  const idx = result.indexStatusResult ?? {};
  const rich = result.richResultsResult ?? {};
  const tipos = {};
  for (const item of rich.detectedItems ?? []) {
    const nome = item.richResultType ?? "desconhecido";
    const itens = item.items ?? [];
    tipos[nome] = {
      detectados: itens.length,
      comErro: itens.filter((i) => (i.issues ?? []).some((x) => x.severity === "ERROR")).length,
      comAviso: itens.filter((i) => (i.issues ?? []).some((x) => x.severity === "WARNING")).length,
    };
  }
  return {
    verdict: idx.verdict ?? "UNKNOWN",
    coverageState: idx.coverageState ?? "unknown",
    lastCrawlTime: idx.lastCrawlTime ?? null,
    richVerdict: rich.verdict ?? "UNKNOWN",
    tipos,
  };
}

export async function searchAnalytics(siteUrl, body) {
  const data = await gsc(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return data.rows ?? [];
}

/** YYYY-MM-DD com deslocamento em dias a partir de hoje (UTC). */
export function dayOffset(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
