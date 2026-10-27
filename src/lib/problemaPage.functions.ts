import { createServerFn } from "@tanstack/react-start";

/** Envia apenas o artigo solicitado; a base editorial fica no servidor. */
export const getProblemaPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => {
    if (!input || typeof input.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(input.slug)) {
      throw new Error("Slug de problema inválido.");
    }
    return { slug: input.slug };
  })
  .handler(async ({ data }) => {
    const { getProblemaPageBySlug } = await import("./problemaPagesData");
    return getProblemaPageBySlug(data.slug) ?? null;
  });
