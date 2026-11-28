import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const SITE = "https://tecnico.curitiba.br";
const cases = [
  { width: 390, path: "/conserto-tv/curitiba", hub: "/conserto-tv-curitiba", service: "Conserto de TV", local: "Curitiba" },
  { width: 768, path: "/conserto-som/batel", hub: "/conserto-som-curitiba", service: "Conserto de Som e Áudio", local: "Batel, Curitiba" },
  { width: 1440, path: "/conserto-videogame/pinhais", hub: "/conserto-videogame-curitiba", service: "Conserto de Videogame", local: "Pinhais" },
];

for (const scenario of cases) {
  test(`trilha serviço × local em ${scenario.width}px: SSR e hidratação`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: 900 });
    const response = await page.goto(`${BASE}${scenario.path}`, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    const nav = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    await expect(nav.getByRole("link", { name: scenario.service })).toHaveAttribute("href", scenario.hub);
    await expect(nav.getByText(scenario.local, { exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-hydrated", "1");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${scenario.path}`);
    const schema = page.locator('script[type="application/ld+json"][data-schema-key="breadcrumb"]');
    await expect(schema).toHaveCount(1);
    await expect.poll(async () => {
      const data = JSON.parse(await schema.textContent() ?? "{}");
      return data.itemListElement?.map((item: { item: string; name: string }) => [item.name, item.item]);
    }).toEqual([
      ["Início", `${SITE}/`],
      [scenario.service, `${SITE}${scenario.hub}`],
      [scenario.local, `${SITE}${scenario.path}`],
    ]);
    expect(await nav.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  });
}
