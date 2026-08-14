import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke mobile da landing /empresas.
 *
 * Cobre no viewport de celular (390x844):
 *   1. CTAs de WhatsApp visíveis, clicáveis e com alvo ≥ 44px;
 *   2. política de contato: nenhum botão "Ligar" / link `tel:` na página
 *      (contato exclusivo por WhatsApp — ver memória do projeto);
 *   3. deduplicação: vários toques em CTAs distintos geram 1 `generate_lead`
 *      e 1 `conversion` por sessão, com o mesmo `lead_id`.
 */

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const gaEvents = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).map((entry) => {
      try {
        const args = Array.from(entry as ArrayLike<unknown>);
        return args[0] === "event"
          ? { name: String(args[1]), params: (args[2] || {}) as Record<string, unknown> }
          : { name: String((entry as { event?: string }).event ?? args[0]), params: {} };
      } catch {
        return { name: String((entry as { event?: string })?.event), params: {} };
      }
    }),
  );

async function abrirLanding(page: Page) {
  await page.goto("/empresas");
  await page.waitForLoadState("domcontentloaded");
  const aceitar = page.getByRole("button", { name: /^Aceitar/i }).first();
  if (await aceitar.isVisible().catch(() => false)) await aceitar.click();
  await page.waitForTimeout(300);
}

test("mobile: CTA de WhatsApp é tocável e não existe botão de ligar", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await abrirLanding(page);

  const hero = page.getByRole("button", { name: /Falar com o técnico agora/i });
  await expect(hero).toBeVisible();
  const box = await hero.boundingBox();
  expect(box, "CTA sem caixa renderizada").toBeTruthy();
  expect(box!.height).toBeGreaterThanOrEqual(44);

  // Política do projeto: nenhum telefone visível nem link tel:.
  expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
  await expect(page.getByRole("button", { name: /^Ligar/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /^Ligar/i })).toHaveCount(0);

  // O WhatsApp humano só abre após a triagem (interceptação global).
  await hero.tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(erros).toEqual([]);
});

test("mobile: conversões deduplicadas entre CTAs diferentes", async ({ page }) => {
  await abrirLanding(page);

  await page.getByRole("button", { name: /Falar com o técnico agora/i }).tap();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500); // fora da janela de burst (1,2s)

  const duvidas = page.getByRole("button", { name: /Tirar dúvidas pelo WhatsApp/i });
  await duvidas.scrollIntoViewIfNeeded();
  await duvidas.tap();
  await page.keyboard.press("Escape");

  const eventos = await gaEvents(page);
  const waClicks = eventos.filter((e) => e.name === "wa_click");
  expect(waClicks.length).toBeGreaterThanOrEqual(2);
  expect(new Set(waClicks.map((e) => e.params.cta_location)).size).toBeGreaterThanOrEqual(2);
  expect(eventos.filter((e) => e.name === "generate_lead").length).toBe(1);
  expect(eventos.filter((e) => e.name === "conversion").length).toBe(1);
  expect(new Set(waClicks.map((e) => e.params.lead_id)).size).toBe(1);
});
