import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "../src/lib/siteConfig";

const ROUTE = "/termos-e-condicoes";

type Schema = Record<string, unknown> & { "@type"?: string | string[] };

async function collectJsonLd(page: Page): Promise<Schema[]> {
  return await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => {
        try { return JSON.parse(n.textContent || "null"); }
        catch { return null; }
      }).filter(Boolean)
  );
}

const hasType = (schemas: Schema[], type: string) =>
  schemas.find((s) => {
    const t = s["@type"];
    return Array.isArray(t) ? t.includes(type) : t === type;
  });

test.describe("/termos-e-condicoes — alias consolidado, schema e política de sitemap", () => {
  test("renders BreadcrumbList, LocalBusiness, FAQPage JSON-LD", async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");

    const schemas = await collectJsonLd(page);
    const breadcrumb = hasType(schemas, "BreadcrumbList");
    const localBusiness = hasType(schemas, "LocalBusiness");
    const faq = hasType(schemas, "FAQPage");

    expect(breadcrumb, "BreadcrumbList required").toBeTruthy();
    expect(localBusiness, "LocalBusiness required").toBeTruthy();
    expect(faq, "FAQPage required").toBeTruthy();

    // LocalBusiness: Curitiba in areaServed, telephone matches WhatsApp, no postal address
    const area = JSON.stringify((localBusiness as { areaServed?: unknown }).areaServed || "");
    expect(area.toLowerCase()).toContain("curitiba");
    expect((localBusiness as { telephone?: string }).telephone).toBe(siteConfig.phoneE164);
    expect(JSON.stringify(localBusiness)).not.toMatch(/PostalAddress|streetAddress/i);

    // FAQPage: minimum 5 questions
    const mainEntity = (faq as { mainEntity?: Array<{ name?: string; acceptedAnswer?: { text?: string } }> }).mainEntity || [];
    expect(mainEntity.length).toBeGreaterThanOrEqual(5);
    for (const q of mainEntity) {
      expect(q.name).toBeTruthy();
      expect(q.acceptedAnswer?.text).toBeTruthy();
    }

    // BreadcrumbList: at least 2 items, last item matches canonical
    const items = (breadcrumb as { itemListElement?: Array<{ item?: string }> }).itemListElement || [];
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[items.length - 1].item).toContain("/precos-e-politicas");
  });

  test("single H1 + correct canonical + SEO meta tags", async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://tecnico.curitiba.br/precos-e-politicas");

    await expect(page).toHaveTitle(/Termos.*Condi[çc]/i);

    const description = await page.locator('head meta[name="description"]').getAttribute("content");
    expect(description || "").toMatch(/R\$\s?99,99/);
    expect(description || "").toMatch(/R\$\s?299,99/);

    const ogTitle = await page.locator('head meta[property="og:title"]').getAttribute("content");
    const twTitle = await page.locator('head meta[name="twitter:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
    expect(twTitle).toBeTruthy();
  });

  test("sitemap-main.xml inclui destino canônico e exclui alias consolidado", async () => {
    const sitemapPath = join(process.cwd(), "public", "sitemap-main.xml");
    const xml = readFileSync(sitemapPath, "utf8");
    expect(xml).toContain("<loc>https://tecnico.curitiba.br/precos-e-politicas</loc>");
    expect(xml).not.toContain("<loc>https://tecnico.curitiba.br/termos-e-condicoes</loc>");
  });

  test("h1 does not overflow on mobile and desktop", async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");
    for (const vp of [
      { width: 375, height: 812, label: "mobile" },
      { width: 1440, height: 900, label: "desktop" },
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const dims = await page.locator("h1").first().evaluate((el) => ({
        sw: (el as HTMLElement).scrollWidth,
        cw: (el as HTMLElement).clientWidth,
      }));
      expect(dims.sw, `h1 overflow on ${vp.label} (${dims.sw} vs ${dims.cw})`).toBeLessThanOrEqual(dims.cw + 2);
    }
  });
});
