import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchPublicPage, meta, normalizePath, textOf, SITE } from "../lib/fetchPage";

export default defineTool({
  name: "validate_seo",
  title: "Validar SEO técnico de uma rota",
  description:
    "Verifica, no HTML público de uma rota do site, o status HTTP, title, meta description, robots, canonical único e self-referente, og:url e presença de H1 único.",
  inputSchema: {
    path: z.string().describe("Caminho público da rota, ex.: /servicos/conserto-monitor"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ path }) => {
    const rota = normalizePath(path);
    const page = await fetchPublicPage(rota);
    if (!page.ok) {
      return {
        content: [{ type: "text", text: `HTTP ${page.status} em ${page.url}` }],
        structuredContent: { url: page.url, status: page.status, problemas: [`HTTP ${page.status}`] },
        isError: true,
      };
    }

    const html = page.html;
    const esperado = `${SITE}${rota}`;
    const canonicals = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) ?? [];
    const canonical = canonicals[0]?.match(/href=["']([^"']+)["']/i)?.[1];
    const h1s = html.match(/<h1[\s>]/gi) ?? [];
    const title = textOf(html, "title") ?? "";
    const description = meta(html, "description") ?? "";
    const robots = meta(html, "robots") ?? "index, follow";
    const ogUrl = meta(html, "og:url");
    const norm = (u?: string) => (u || "").replace(/\/$/, "") || "/";

    const problemas: string[] = [];
    if (!title) problemas.push("title ausente");
    else if (title.length > 65) problemas.push(`title com ${title.length} caracteres (>65)`);
    if (!description) problemas.push("meta description ausente");
    else if (description.length > 250) problemas.push(`description com ${description.length} caracteres (>250)`);
    if (canonicals.length !== 1) problemas.push(`${canonicals.length} tags canonical (esperado 1)`);
    else if (norm(canonical) !== norm(esperado)) problemas.push(`canonical não self-referente: ${canonical}`);
    if (!ogUrl) problemas.push("og:url ausente");
    else if (norm(ogUrl) !== norm(esperado)) problemas.push(`og:url não self-referente: ${ogUrl}`);
    if (h1s.length !== 1) problemas.push(`${h1s.length} H1 na página (esperado 1)`);

    const resumo = {
      url: page.url,
      status: page.status,
      title,
      description,
      robots,
      canonical,
      ogUrl,
      h1Count: h1s.length,
      problemas,
      aprovado: problemas.length === 0,
    };
    return {
      content: [
        {
          type: "text",
          text: problemas.length
            ? `${rota}: ${problemas.length} problema(s)\n- ${problemas.join("\n- ")}`
            : `${rota}: SEO técnico aprovado (title, description, canonical, og:url e H1 corretos).`,
        },
      ],
      structuredContent: resumo,
    };
  },
});
