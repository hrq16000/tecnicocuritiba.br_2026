import { test, expect, type Page } from "@playwright/test";

/**
 * /assistencia-tecnica-curitiba — metadados sociais (og/twitter) em mobile e desktop.
 * Fail-closed: og:image/twitter:image precisam ser absolutos e responder 200.
 */

const ROUTE = "/assistencia-tecnica-curitiba";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
] as const;

const metaContent = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

for (const vp of VIEWPORTS) {
  test.describe(`/assistencia-tecnica-curitiba — social meta — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("og/twitter title, description e image válidos", async ({ page }) => {
      await page.goto(ROUTE);
      await page.waitForLoadState("networkidle");

      const ogTitle = await metaContent(page, 'meta[property="og:title"]');
      const ogDesc = await metaContent(page, 'meta[property="og:description"]');
      const twTitle = await metaContent(page, 'meta[name="twitter:title"]');
      const twDesc = await metaContent(page, 'meta[name="twitter:description"]');
      const twCard = await metaContent(page, 'meta[name="twitter:card"]');

      for (const [label, value] of Object.entries({ ogTitle, ogDesc, twTitle, twDesc })) {
        expect(value, `${label} deve existir`).toBeTruthy();
        expect(value!.length, `${label} não pode ser vazio`).toBeGreaterThan(20);
      }
      expect(ogTitle).toMatch(/Curitiba/i);
      expect(twCard).toBe("summary_large_image");

      const ogUrl = await metaContent(page, 'meta[property="og:url"]');
      expect(ogUrl, "og:url deve ser self-referente").toContain(ROUTE);

      const ogImage = await metaContent(page, 'meta[property="og:image"]');
      const twImage = await metaContent(page, 'meta[name="twitter:image"]');

      for (const img of [ogImage, twImage]) {
        expect(img, "og:image/twitter:image devem existir").toBeTruthy();
        expect(img!, "crawler social exige URL absoluta https").toMatch(/^https:\/\//);
      }

      const imgPath = new URL(ogImage!).pathname;
      const imgResponse = await page.request.get(imgPath);
      expect(imgResponse.status(), `og:image ${imgPath} deve responder 200`).toBe(200);
      expect(imgResponse.headers()["content-type"] || "").toContain("image");
    });
  });
}

// A Home usa a imagem PNG de marca; o tamanho declarado deve refletir os bytes reais.
test("Home declara as dimensões reais da imagem social", async ({ page }) => {
  await page.goto("/");
  const image = await metaContent(page, 'meta[property="og:image"]');
  expect(image).toBeTruthy();
  const url = new URL(image!);
  expect(url.pathname).toBe("/og-image.png");
  const response = await page.request.get(url.pathname);
  expect(response.status()).toBe(200);
  const png = await response.body();
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(await metaContent(page, 'meta[property="og:image:width"]')).toBe(String(png.readUInt32BE(16)));
  expect(await metaContent(page, 'meta[property="og:image:height"]')).toBe(String(png.readUInt32BE(20)));
});
