import { test, expect } from "@playwright/test";

/**
 * Smoke do hub /problemas: percorre o hub e páginas de sintoma e confirma que
 * os CTAs disparam eventos de tracking (gtag) sem quebrar a página.
 * Regra de negócio: contato só por WhatsApp — nenhum link tel: pode existir.
 */
const ROTAS = [
  "/problemas",
  "/problemas/tela-azul-windows",
  "/problemas/notebook-nao-conecta-no-wifi",
  "/problemas/webcam-nao-funciona",
];

const spy = () => {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; __gaEvents: unknown[] };
  w.__gaEvents = [];
  const original = w.gtag;
  w.gtag = (...args: unknown[]) => {
    w.__gaEvents.push(args);
    try {
      original?.(...args);
    } catch {
      /* noop */
    }
  };
};

for (const rota of ROTAS) {
  test(`hub /problemas — CTAs rastreados em ${rota}`, async ({ page }) => {
    const erros: string[] = [];
    page.on("pageerror", (e) => erros.push(e.message));

    await page.addInitScript(spy);
    await page.goto(rota);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === "1", null, {
      timeout: 15000,
    });

    // Sem telefone visível/clicável: funil é exclusivamente WhatsApp
    expect(await page.locator("a[href^='tel:']").count()).toBe(0);

    const wa = page.locator("a[href*='wa.me']").first();
    await expect(wa).toBeVisible({ timeout: 10000 });

    // Clica sem navegar para fora
    await wa.evaluate((el) => el.setAttribute("target", "_blank"));
    await wa.click({ noWaitAfter: true });

    const eventos = await page.evaluate(
      () => (window as unknown as { __gaEvents: unknown[][] }).__gaEvents.map((a) => String(a[1])),
    );
    expect(eventos.some((e) => /cta_click|generate_lead|whatsapp/i.test(e))).toBe(true);
    expect(erros, `erros de runtime em ${rota}`).toEqual([]);
  });
}

test("hub /problemas — links internos rastreiam sem contar conversão", async ({ page }) => {
  await page.addInitScript(spy);
  await page.goto("/problemas");
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === "1", null, {
    timeout: 15000,
  });

  const link = page.locator("a[href^='/problemas/']").first();
  await expect(link).toBeVisible({ timeout: 10000 });
  await link.click();
  await page.waitForLoadState("domcontentloaded");

  const eventos = await page.evaluate(
    () => (window as unknown as { __gaEvents: unknown[][] }).__gaEvents.map((a) => String(a[1])),
  );
  expect(eventos.includes("generate_lead")).toBe(false);
});
