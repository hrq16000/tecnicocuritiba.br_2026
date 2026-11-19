import { describe, expect, it } from "vitest";
import { getAllProblemaSlugs, getProblemaPageBySlug } from "../lib/problemaPagesData";
import { getProblemaPage } from "../lib/problemaPage.functions";

describe("dados estáticos por artigo", () => {
  it("preserva integralmente os artigos e a primeira ocorrência dos slugs", async () => {
    for (const slug of new Set(getAllProblemaSlugs())) {
      expect(await getProblemaPage({ data: { slug } }), slug).toEqual(getProblemaPageBySlug(slug));
    }
  });

  it("não inventa artigo para slug ausente", async () => {
    expect(await getProblemaPage({ data: { slug: "sem-cadastro-regressao74" } })).toBeNull();
  });

  it("recusa caminhos e caracteres fora do formato de slug", async () => {
    for (const slug of ["../fora", "__proto__", "com espaço", ""]) {
      await expect(getProblemaPage({ data: { slug } })).rejects.toThrow("Slug");
    }
  });
});
