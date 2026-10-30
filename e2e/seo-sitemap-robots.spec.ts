import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";

test.describe("SEO — sitemap & robots", () => {
  test("robots.txt allows core routes", async ({ request }) => {
    const res = await request.get(`${BASE}/robots.txt`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).not.toMatch(/^Disallow:\s*\/\s*$/m);
  });

  test("sitemap-main.xml contém apenas as rotas comerciais canônicas aprovadas", async ({ request }) => {
    const res = await request.get(`${BASE}/sitemap-main.xml`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("<loc>https://tecnico.curitiba.br/</loc>");
    expect(body).toContain("<loc>https://tecnico.curitiba.br/precos-e-politicas</loc>");
    expect(body).toContain("<loc>https://tecnico.curitiba.br/empresa-de-ti-curitiba</loc>");
    // /termos foi consolidada; páginas não curadas não podem entrar automaticamente.
    expect(body).not.toContain("<loc>https://tecnico.curitiba.br/termos-e-condicoes</loc>");
    expect(body).not.toContain("<loc>https://tecnico.curitiba.br/assistencia-tecnica-curitiba</loc>");
  });

  test("/assistencia-tecnica-curitiba canonical self-references", async ({ page }) => {
    await page.goto(`${BASE}/assistencia-tecnica-curitiba`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/assistencia-tecnica-curitiba");
  });
});


test("serviços essenciais preservam HTML SSR e indexabilidade após split por rota", async ({ request }) => {
  for (const path of ["/servicos", "/servicos/backup-para-empresas", "/servicos/formatacao", "/servicos/redes-e-wifi"]) {
    const response = await request.get(BASE + path);
    expect(response.status(), "HTTP SSR " + path).toBe(200);
    const html = await response.text();
    expect(html, "H1 SSR " + path).toMatch(/<h1\b/i);
    const canonical = html.match(/<link\b(?=[^>]*rel=["']canonical["'])(?=[^>]*href=["']([^"']+)["'])[^>]*>/i)?.[1];
    expect(canonical).toBe("https://tecnico.curitiba.br" + path);
    const robots = html.match(/<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=["']([^"']+)["'])[^>]*>/i)?.[1] ?? "";
    expect(robots, "robots SSR " + path).not.toMatch(/\bnoindex\b/i);
  }
});
