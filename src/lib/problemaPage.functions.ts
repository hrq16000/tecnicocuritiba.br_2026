import type { ProblemaPageData } from "./problemaPagesData";

// Módulos de dados por artigo: SSR e navegação usam o mesmo resultado.
// O navegador busca um asset do build, sem depender de endpoints de RPC.
const articles = import.meta.glob<ProblemaPageData>("../generated/problema-articles/*.json", {
  import: "default",
});

export async function getProblemaPage({ data }: { data: { slug: string } }): Promise<ProblemaPageData | null> {
  if (!data || typeof data.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(data.slug)) {
    throw new Error("Slug de problema inválido.");
  }
  const load = articles[`../generated/problema-articles/${data.slug}.json`];
  return load ? await load() : null;
}
