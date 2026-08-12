import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const DIALOG = '[role="dialog"][data-triage="1"]';

/**
 * Deep link #agendamento: abre a triagem, mas dispensar o modal precisa ser
 * definitivo na sessão (sem reabrir em reload nem em navegação interna) e o
 * foco deve voltar ao documento com o teclado funcionando.
 */
test.describe("Triagem — deep link e acessibilidade", () => {
  test("abre por hash, fecha e não reabre em reload", async ({ page }) => {
    await page.goto(`${BASE}/#agendamento`, { waitUntil: "domcontentloaded" });
    const dialog = page.locator(DIALOG);
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Fecha sem respostas (sem confirm nativo nesse estado).
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 5000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test("dispensa persiste ao navegar internamente na mesma sessão", async ({ page }) => {
    await page.goto(`${BASE}/#agendamento`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(DIALOG)).toBeVisible({ timeout: 10000 });
    await page.keyboard.press("Escape");
    await expect(page.locator(DIALOG)).toBeHidden({ timeout: 5000 });

    await page.goto(`${BASE}/servicos`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await expect(page.locator(DIALOG)).toHaveCount(0);
  });

  test("modal mantém foco interno e devolve ao fechar", async ({ page }) => {
    await page.goto(`${BASE}/#agendamento`, { waitUntil: "domcontentloaded" });
    const dialog = page.locator(DIALOG);
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Foco inicia dentro do diálogo (trap do Radix).
    const insideAtStart = await page.evaluate((sel) => {
      const d = document.querySelector(sel);
      return !!(d && document.activeElement && d.contains(document.activeElement));
    }, DIALOG);
    expect(insideAtStart).toBeTruthy();

    // Tab cicla apenas entre elementos do diálogo.
    for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
    const stillInside = await page.evaluate((sel) => {
      const d = document.querySelector(sel);
      return !!(d && document.activeElement && d.contains(document.activeElement));
    }, DIALOG);
    expect(stillInside).toBeTruthy();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 5000 });

    const focusOutside = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return !el || !el.closest('[role="dialog"]');
    });
    expect(focusOutside).toBeTruthy();
  });
});
