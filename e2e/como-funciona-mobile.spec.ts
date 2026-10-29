import { test, expect, devices } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:8080";

// Simula iPhone no navegador do projeto (Chromium no gate obrigatório).
// Não importar defaultBrowserType=webkit: o runner rápido instala Chromium.
const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices["iPhone 13"];
test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

test.describe("Como Funciona + modais — CTAs e CLS", () => {
  test("CTAs WhatsApp permanecem clicáveis e sem links tel:", async ({ page }) => {
    // Coletor de CLS via PerformanceObserver
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          const e = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!e.hadRecentInput && typeof e.value === "number") {
            (window as unknown as { __cls: number }).__cls += e.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });

    // Hidratação básica do hero antes do fallback
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Regra do projeto: sem links tel:
    const telCount = await page.locator('a[href^="tel:"]').count();
    expect(telCount).toBe(0);

    // Abre o modal "Prefiro agendar"
    await page.getByRole("button", { name: /prefiro agendar/i }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // CTA WhatsApp dentro do modal continua clicável
    const modalCta = modal.getByRole("link", { name: /continuar no whatsapp/i });
    await expect(modalCta).toBeVisible();
    await expect(modalCta).toBeEnabled();
    expect(await modalCta.getAttribute("href")).toContain("wa.me");

    // Fecha modal
    await modal.getByRole("button", { name: /fechar/i }).click();
    await expect(modal).toBeHidden();

    // Scroll até "Como funciona" e verifica CTAs por etapa
    await page.evaluate(() => {
      const el = document.getElementById("como-funciona-fluxo");
      el?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    });
    for (let i = 1; i <= 4; i++) {
      const cta = page.getByTestId(`como-funciona-cta-${i}`);
      await expect(cta).toBeVisible();
      await expect(cta).toBeEnabled();
      const href = await cta.getAttribute("href");
      expect(href).toContain("wa.me");
    }

    // Sticky WhatsApp mobile permanece visível e clicável
    const sticky = page.locator('[data-cta-location="hero_sticky_mobile"]');
    await expect(sticky).toBeVisible();
    await expect(sticky).toBeEnabled();

    // CLS abaixo do limite aceitável após interações
    await page.waitForTimeout(800);
    const cls = await page.evaluate(
      () => (window as unknown as { __cls: number }).__cls || 0,
    );
    expect(cls, `CLS regrediu: ${cls}`).toBeLessThan(0.1);
  });
});
