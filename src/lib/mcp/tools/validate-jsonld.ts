import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { extractJsonLd, fetchPublicPage, normalizePath } from "../lib/fetchPage";

export default defineTool({
  name: "validate_jsonld",
  title: "Validar JSON-LD de uma rota",
  description:
    "Extrai todos os blocos JSON-LD do HTML público de uma rota, reporta erros de parse, lista os @type encontrados e alerta sobre rating/review inventados ou blocos duplicados.",
  inputSchema: {
    path: z.string().describe("Caminho público da rota, ex.: /problemas/computador-nao-liga"),
    tiposEsperados: z
      .array(z.string())
      .optional()
      .describe("Tipos schema.org que devem existir, ex.: ['FAQPage','Service']"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ path, tiposEsperados }) => {
    const rota = normalizePath(path);
    const page = await fetchPublicPage(rota);
    if (!page.ok) {
      return { content: [{ type: "text", text: `HTTP ${page.status} em ${page.url}` }], isError: true };
    }

    const blocos = extractJsonLd(page.html);
    const tipos = [...new Set(blocos.flatMap((b) => b.tipos))];
    const problemas: string[] = [];

    if (blocos.length === 0) problemas.push("nenhum bloco JSON-LD encontrado");
    blocos.forEach((b, i) => {
      if (!b.valido) problemas.push(`bloco ${i + 1} inválido: ${b.erro}`);
    });
    for (const esperado of tiposEsperados ?? []) {
      if (!tipos.includes(esperado)) problemas.push(`@type esperado ausente: ${esperado}`);
    }
    const duplicados = tipos.filter(
      (t) => ["FAQPage", "BreadcrumbList", "Organization", "LocalBusiness"].includes(t) &&
        blocos.flatMap((b) => b.tipos).filter((x) => x === t).length > 1,
    );
    for (const d of new Set(duplicados)) problemas.push(`@type duplicado no documento: ${d}`);
    if (/"aggregateRating"|"reviewRating"/.test(page.html)) {
      problemas.push("rating/review presente — só é permitido com avaliações reais verificadas");
    }

    return {
      content: [
        {
          type: "text",
          text: `${rota}: ${blocos.length} bloco(s) JSON-LD — tipos: ${tipos.join(", ") || "nenhum"}` +
            (problemas.length ? `\nProblemas:\n- ${problemas.join("\n- ")}` : "\nSem problemas."),
        },
      ],
      structuredContent: { url: page.url, blocos: blocos.length, tipos, problemas, aprovado: problemas.length === 0 },
    };
  },
});
