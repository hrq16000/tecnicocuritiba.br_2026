// Confirma, no HTML ENTREGUE (sem execução de JS), que toda rota comercial
// curada traz canonical self-referente, og:url coerente e og:site_name correto.
// Roda no CI contra o preview do dist e, com E2E_BASE_URL, contra produção.
import { test, expect, request as pwRequest } from "@playwright/test";
// @ts-expect-error — fonte única em JS compartilhada com os gates de build.
import { COMERCIAL_ONDA2, BASE_URL, SITE_NAME } from "../scripts/lib/comercial-onda2.mjs";

type Pagina = { path: string };
const rotas: Pagina[] = COMERCIAL_ONDA2 as Pagina[];

const pick = (html: string, re: RegExp) => html.match(re)?.[1]?.trim() ?? "";
const semBarra = (u: string) => u.replace(/\/$/, "");

test.describe("SEO estático das rotas comerciais", () => {
  for (const { path } of rotas) {
    test(`canonical/og em ${path}`, async ({ baseURL }) => {
      const ctx = await pwRequest.newContext({ baseURL: process.env.E2E_BASE_URL ?? baseURL });
      const res = await ctx.get(path);
      expect(res.status(), `status de ${path}`).toBe(200);
      let html = await res.text();

      // Servidores estáticos locais (vite preview) só entregam o HTML pré-renderizado
      // na forma /rota/ — em produção o edge normaliza. Reconsulta com barra final.
      if (!/rel="canonical"/i.test(html) || /href="[^"]+\/"/.test(html.match(/<link[^>]+rel="canonical"[^>]+>/i)?.[0] ?? "")) {
        const alt = await ctx.get(`${path}/`);
        if (alt.status() === 200) {
          const altHtml = await alt.text();
          if (altHtml.includes(`${path}"`)) html = altHtml;
        }
      }

      const canonical = pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
      const ogUrl = pick(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i);
      const ogSite = pick(html, /<meta[^>]+property="og:site_name"[^>]+content="([^"]+)"/i);
      const esperado = semBarra(`${BASE_URL}${path}`);

      expect(semBarra(canonical), `canonical de ${path}`).toBe(esperado);
      expect(semBarra(ogUrl), `og:url de ${path}`).toBe(esperado);
      expect(ogSite, `og:site_name de ${path}`).toBe(SITE_NAME);
      expect(html, `${path} não pode sair noindex`).not.toMatch(/<meta[^>]+name="robots"[^>]+noindex/i);

      await ctx.dispose();
    });
  }
});
