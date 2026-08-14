/**
 * Utilitários compartilhados pelas ferramentas MCP de validação.
 * Só leem HTML público do site — nenhum acesso a banco ou dado de lead.
 */
export const SITE = "https://tecnico.curitiba.br";

export function normalizePath(input: string): string {
  const raw = (input || "/").trim();
  const path = raw.startsWith("http") ? new URL(raw).pathname : raw;
  return path.startsWith("/") ? path.replace(/\s/g, "") : `/${path}`;
}

export async function fetchPublicPage(path: string) {
  const url = `${SITE}${normalizePath(path)}`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "tecnico-curitiba-mcp/1.0 (+seo-validation)" },
  });
  const html = res.ok ? await res.text() : "";
  return { url, status: res.status, ok: res.ok, html, finalUrl: res.url };
}

export function extractJsonLd(html: string) {
  const blocos: { valido: boolean; tipos: string[]; erro?: string }[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const nodes: unknown[] = [];
      const flatten = (n: unknown) => {
        if (Array.isArray(n)) n.forEach(flatten);
        else if (n && typeof n === "object") {
          nodes.push(n);
          const graph = (n as Record<string, unknown>)["@graph"];
          if (Array.isArray(graph)) graph.forEach(flatten);
        }
      };
      flatten(parsed);
      const tipos = nodes
        .map((n) => (n as Record<string, unknown>)["@type"])
        .flatMap((t) => (Array.isArray(t) ? t : [t]))
        .filter((t): t is string => typeof t === "string");
      blocos.push({ valido: true, tipos });
    } catch (e) {
      blocos.push({ valido: false, tipos: [], erro: String(e) });
    }
  }
  return blocos;
}

export const meta = (html: string, prop: string) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1];

export const textOf = (html: string, tag: string) =>
  html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))?.[1]?.replace(/<[^>]+>/g, "").trim();
