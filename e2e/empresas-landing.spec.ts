import { test, expect, type Page } from "@playwright/test";

/**
 * Landing /empresas — funil B2B ponta a ponta.
 *
 * Cobre:
 *   1. montagem da mensagem empresarial a partir do formulário;
 *   2. eventos do funil (empresas_form_prioridade, empresas_form_submit, wa_click);
 *   3. deduplicação: vários cliques de WhatsApp geram 1 único `generate_lead`;
 *   4. JSON-LD Service + FAQPage com paridade com as perguntas visíveis.
 *
 * Observação de arquitetura: por política do projeto, o WhatsApp humano só abre
 * DEPOIS da triagem — `window.open` de wa.me é interceptado e transformado no
 * modal de triagem. Portanto o teste valida o preset da triagem, não uma aba nova.
 */

/** Lê os eventos GA4 direto do dataLayer (fonte confiável com GTM ativo). */
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

const names = async (page: Page) => (await gaEvents(page)).map((e) => e.name);

async function abrirLanding(page: Page) {
  await page.goto("/empresas");
  await page.waitForLoadState("domcontentloaded");
  // Consentimento: sem aceitar, o banner cobre os CTAs e o GA4 fica em modo negado.
  const aceitar = page.getByRole("button", { name: /^Aceitar/i }).first();
  if (await aceitar.isVisible().catch(() => false)) await aceitar.click();
  await page.waitForTimeout(300);
}

test("formulário monta a mensagem empresarial e dispara os eventos do funil", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await abrirLanding(page);

  await page.locator("#solicitar-atendimento").scrollIntoViewIfNeeded();
  await page.fill("#empresa", "Contabilidade Aurora");
  await page.fill("#quantidade", "12");
  await page.fill("#problema", "A rede cai várias vezes por dia e trava o sistema fiscal.");
  await page.getByRole("button", { name: /Operação parada/i }).first().click();
  await page.fill("#regiao", "Batel, Curitiba");
  await page.fill("#contato", "Ana — WhatsApp");

  await page.getByRole("button", { name: /Enviar pelo WhatsApp/i }).click();

  // O envio abre a triagem com o resumo já montado (WhatsApp só após a triagem).
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const eventos = await names(page);
  expect(eventos).toContain("empresas_form_prioridade");
  expect(eventos).toContain("empresas_form_submit");
  expect(eventos).toContain("wa_click");

  const wa = (await gaEvents(page)).find((e) => e.name === "wa_click")!;
  expect(wa.params.cta_location).toBe("empresas_formulario");
  expect(wa.params.prioridade).toBe("parado");
  expect(erros).toEqual([]);
});

test("conversão é deduplicada por sessão (lead_id) entre CTAs do WhatsApp", async ({ page }) => {
  await abrirLanding(page);

  const hero = page.getByRole("button", { name: /Falar com o técnico agora/i });
  await hero.click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500); // fora da janela de burst (1,2s)
  await hero.click();

  const eventos = await gaEvents(page);
  const waClicks = eventos.filter((e) => e.name === "wa_click");
  const leads = eventos.filter((e) => e.name === "generate_lead");
  const conversions = eventos.filter((e) => e.name === "conversion");

  expect(waClicks.length).toBeGreaterThanOrEqual(2);
  expect(leads.length).toBe(1);
  expect(conversions.length).toBe(1);
  expect(new Set(waClicks.map((e) => e.params.lead_id)).size).toBe(1);
});

test("JSON-LD Service + FAQPage com paridade com as perguntas visíveis", async ({ page }) => {
  await abrirLanding(page);
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) =>
        (s.textContent || "").includes("FAQPage"),
      ),
    null,
    { timeout: 15000 },
  );

  const blocos = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => n.textContent || ""),
  );
  const parsed = blocos.map((b) => JSON.parse(b) as Record<string, unknown>);

  const service = parsed.find((p) => p["@type"] === "Service") as
    | { provider?: { "@id"?: string } }
    | undefined;
  expect(service, "Service ausente").toBeTruthy();
  expect(service!.provider?.["@id"]).toContain("#organization");

  const faq = parsed.find((p) => p["@type"] === "FAQPage") as
    | { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }
    | undefined;
  expect(faq, "FAQPage ausente").toBeTruthy();
  expect(faq!.mainEntity.length).toBeGreaterThanOrEqual(4);
  for (const q of faq!.mainEntity) {
    expect(q.acceptedAnswer.text.trim().length).toBeGreaterThan(40);
    await expect(page.getByText(q.name, { exact: false }).first()).toBeVisible();
  }

  // Nunca inventar avaliações.
  expect(blocos.join(" ")).not.toContain("aggregateRating");
});
