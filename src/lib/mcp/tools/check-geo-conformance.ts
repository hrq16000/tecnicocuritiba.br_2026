import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { extractJsonLd, fetchPublicPage, meta, normalizePath, SITE, textOf } from "../lib/fetchPage";

/**
 * Conformidade GEO (Generative Engine Optimization) por rota pública:
 * o conteúdo precisa ser legível e citável por buscadores generativos
 * SEM depender de JavaScript — ou seja, já no HTML estático entregue.
 */
export default defineTool({
  name: "check_geo_conformance",
  title: "Checar conformidade GEO de rotas",
  description:
    "Audita rotas públicas quanto à conformidade GEO: H1 único, title/description dentro dos limites, canonical e og:url self-referentes, robots indexável, JSON-LD válido e corpo de texto suficiente já no HTML pré-hidratação.",
  inputSchema: {
    paths: z.array(z.string()).describe("Rotas públicas a auditar, ex.: ['/', '/servicos']"),
    minPalavras: z.number().optional().describe("Mínimo de palavras no HTML estático (padrão 300)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ paths, minPalavras }) => {
    const minimo = minPalavras && minPalavras > 0 ? Math.min(minPalavras, 2000) : 300;
    const alvos = paths.slice(0, 25).map(normalizePath);
    const linhas: string[] = [];
    const resultados: Record<string, unknown>[] = [];

    for (const rota of alvos) {
      const page = await fetchPublicPage(rota);
      const problemas: string[] = [];
      if (!page.ok) {
        problemas.push(`HTTP ${page.status}`);
        resultados.push({ rota, aprovado: false, problemas });
        linhas.push(`✖ ${rota} — HTTP ${page.status}`);
        continue;
      }
      const html = page.html;
      const esperado = `${SITE}${rota}`;
      const norm = (u?: string) => (u || "").replace(/\/$/, "") || "/";
      const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
      const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
      const title = textOf(html, "title") ?? "";
      const description = meta(html, "description") ?? "";
      const robots = (meta(html, "robots") ?? "index, follow").toLowerCase();
      const ogUrl = meta(html, "og:url");
      const corpo = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ");
      const palavras = corpo.split(/\s+/).filter((w) => w.length > 1).length;
      const jsonld = extractJsonLd(html);

      if (h1s !== 1) problemas.push(`${h1s} H1 (esperado 1)`);
      if (!title) problemas.push("title ausente");
      else if (title.length > 65) problemas.push(`title ${title.length} chars`);
      if (!description) problemas.push("description ausente");
      else if (description.length > 250) problemas.push(`description ${description.length} chars`);
      if (norm(canonical) !== norm(esperado)) problemas.push(`canonical não self (${canonical ?? "ausente"})`);
      if (norm(ogUrl) !== norm(esperado)) problemas.push(`og:url não self (${ogUrl ?? "ausente"})`);
      if (robots.includes("noindex")) problemas.push("robots noindex");
      if (jsonld.length === 0) problemas.push("sem JSON-LD");
      if (jsonld.some((b) => !b.valido)) problemas.push("JSON-LD inválido");
      if (palavras < minimo) problemas.push(`${palavras} palavras no HTML estático (< ${minimo})`);

      resultados.push({ rota, palavras, h1s, canonical, ogUrl, robots, aprovado: problemas.length === 0, problemas });
      linhas.push(problemas.length ? `✖ ${rota} — ${problemas.join("; ")}` : `✓ ${rota} — conforme (${palavras} palavras)`);
    }

    const reprovadas = resultados.filter((r) => !r.aprovado).length;
    return {
      content: [{ type: "text", text: `${alvos.length} rota(s) auditada(s), ${reprovadas} reprovada(s):\n${linhas.join("\n")}` }],
      structuredContent: { total: alvos.length, reprovadas, resultados },
    };
  },
});
