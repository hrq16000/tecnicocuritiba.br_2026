import { test, expect, devices } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:8080";

// Simula iPhone no navegador do projeto (Chromium no gate obrigatório).
// Não importar defaultBrowserType=webkit: o runner rápido instala Chromium.
const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices["iPhone 13"];
test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

test.describe("Como Funciona + modais — CTAs e CLS", () => {
  test("CTA real de /como-funciona abre a triagem e não publica tel:", async ({ page }) => {
    await page.goto(`${BASE}/como-funciona`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Como Funciona o Atendimento Técnico/i, level: 1 })).toBeVisible();

    expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
    const primary = page.getByRole("link", { name: /Chamar no WhatsApp/i }).first();
    await expect(primary).toBeVisible();
    await expect(primary).toBeEnabled();
    expect(await primary.getAttribute("href")).toContain("wa.me/");

    await primary.click();
    const triage = page.getByRole("dialog").filter({ hasText: /Triagem antes do atendimento/i });
    await expect(triage).toBeVisible({ timeout: 10000 });
    await expect(triage.getByText(/Triagem antes do atendimento/i)).toBeVisible();
  });

  test("passos e CTA final permanecem acessíveis no viewport mobile, com CLS controlado", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!e.hadRecentInput && typeof e.value === "number") {
            (window as unknown as { __cls: number }).__cls += e.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(`${BASE}/como-funciona`, { waitUntil: "domcontentloaded" });
    for (let i = 1; i <= 4; i++) {
      const step = page.locator(`#passo-${i}`);
      await expect(step, `passo ${i} deve existir e ser visível`).toBeVisible();
    }
    const finalCta = page.getByRole("link", { name: /Iniciar Atendimento Agora/i }).first();
    await expect(finalCta).toBeVisible();
    await expect(finalCta).toBeEnabled();
    expect(await finalCta.getAttribute("href")).toContain("wa.me/");

    await page.waitForTimeout(800);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls || 0);
    expect(cls, `CLS regrediu: ${cls}`).toBeLessThan(0.1);
  });
});
