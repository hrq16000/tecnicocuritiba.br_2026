import { test, expect } from "@playwright/test";

// Estas URLs são medidas pelo Lighthouse, mas a política editorial mantém
// noindex intencional. Não transformar uma landing ou combinação local não
// aprovada em indexável para melhorar artificialmente o score SEO agregado.
for (const path of [
  "/empresas",
  "/conserto-tv/curitiba",
  "/conserto-tv/batel",
  "/conserto-celular/sao-jose-dos-pinhais",
]) {
  test(`${path}: política de índice e canonical no SSR e após hidratar`, async ({ request, page }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const robots = html.match(/<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="([^"]*)")[^>]*>/i)?.[1];
    expect(robots).toMatch(/\bnoindex\b/i);
    expect(robots).toMatch(/\bfollow\b/i);
    expect(html).toContain(`rel="canonical" href="https://tecnico.curitiba.br${path}"`);
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', '1');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /\bnoindex\b/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://tecnico.curitiba.br${path}`);
  });
}
