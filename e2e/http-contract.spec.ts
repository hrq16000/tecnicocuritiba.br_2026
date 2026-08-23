import { test, expect, request } from "@playwright/test";

/**
 * Contrato HTTP servido pelo SSR:
 *  - artigo/slug dinâmico inexistente → 404 real (nunca 200 + noindex)
 *  - variantes de URL → 301 de salto único até a forma canônica
 */

const BASE = process.env.HTTP_CONTRACT_BASE ?? "http://localhost:8080";

const NOT_FOUND_PATHS = [
  "/blog/artigo-inexistente-xyz",
  "/blog/post-que-nao-existe-2026",
  "/problemas/problema-inexistente-xyz",
  "/procedimentos/procedimento-inexistente-xyz",
  "/marcas/marca-inexistente-xyz",
];

const VALID_PATHS = [
  "/blog",
  "/blog/como-escolher-uma-workstation",
  "/problemas/computador-lento",
  "/marcas/dell",
  "/servicos",
];

const NORMALIZATIONS: Array<[string, string]> = [
  ["/Servicos", "/servicos"],
  ["/index.html", "/"],
];

test.describe("contrato HTTP", () => {
  test("slugs inexistentes retornam 404 real", async () => {
    const api = await request.newContext({ baseURL: BASE });
    for (const path of NOT_FOUND_PATHS) {
      const res = await api.get(path, { maxRedirects: 0 });
      expect(res.status(), `${path} deveria responder 404`).toBe(404);
    }
    await api.dispose();
  });

  test("rotas válidas continuam 200", async () => {
    const api = await request.newContext({ baseURL: BASE });
    for (const path of VALID_PATHS) {
      const res = await api.get(path, { maxRedirects: 0 });
      expect(res.status(), `${path} deveria responder 200`).toBe(200);
    }
    await api.dispose();
  });

  test("variantes de URL redirecionam permanentemente em salto único", async () => {
    const api = await request.newContext({ baseURL: BASE });
    for (const [from, to] of NORMALIZATIONS) {
      const res = await api.get(from, { maxRedirects: 0 });
      expect([301, 308], `${from} deveria ser redirect permanente`).toContain(res.status());
      const location = res.headers()["location"] ?? "";
      expect(location.replace(BASE, "")).toBe(to);

      const hop = await api.get(location.replace(BASE, ""), { maxRedirects: 0 });
      expect(hop.status(), `${to} deveria responder 200 no primeiro salto`).toBe(200);
    }
    await api.dispose();
  });
});
