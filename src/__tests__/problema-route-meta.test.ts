import { describe, expect, it } from "vitest";
import { getAllProblemaSlugs, getProblemaPageBySlug } from "../lib/problemaPagesData";
import { getAllProblemaRouteSlugs, getProblemaRouteMeta } from "../lib/seo/problemaRouteMeta";

describe("índice leve de metadata das páginas de problema", () => {
  it("cobre exatamente os slugs reais, sem incluir novas URLs", () => {
    expect(getAllProblemaRouteSlugs()).toEqual([...new Set(getAllProblemaSlugs())]);
  });

  it("preserva título e descrição da primeira ocorrência de cada slug", () => {
    for (const slug of getAllProblemaRouteSlugs()) {
      const full = getProblemaPageBySlug(slug);
      expect(getProblemaRouteMeta(slug), slug).toEqual({
        title: full?.title,
        metaDescription: full?.metaDescription,
        h1: full?.h1,
      });
    }
  });

  it("recusa slugs ausentes e nomes herdados do protótipo", () => {
    for (const slug of ["nao-existe-regressao", "__proto__", "constructor", "toString"]) {
      expect(getProblemaRouteMeta(slug)).toBeUndefined();
    }
  });
});
