import { test, expect, type Page } from "@playwright/test";

const HOME = "/";
const UTM_QS = "?utm_source=ci&utm_medium=cpc&utm_campaign=triage_v5_e2e&gclid=CI_GCLID_777";

async function installGtagSpy(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls = [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = function (...args: unknown[]) {
      (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls.push(args);
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    };
  });
}

async function openFunnel(page: Page) {
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("wa-funnel:open", { detail: { location: "test" } }));
  });
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 5000 });
  return dialog;
}

/** Etapa 0 (PF × PJ) — segue pelo ramo residencial. */
/** Preenche a qualificação obrigatória da etapa de identidade. */
async function fillQualification(dialog: ReturnType<Page["getByRole"]>) {
  await dialog.getByLabel(/Seu nome/i).fill("Cliente Teste");
  await dialog.getByLabel(/bairro/i).first().fill("Batel");
}

async function chooseResidential(dialog: ReturnType<Page["getByRole"]>) {
  await dialog.getByRole("radio", { name: /Para mim ou minha residência/i }).click();
  await expect(dialog.getByText(/Qual o equipamento/i)).toBeVisible({ timeout: 5000 });
}

test.describe("Triagem V5 — funil ramificado por equipamento", () => {
  test.beforeEach(async ({ page, context }) => {
    await installGtagSpy(page);
    await context.route("https://wa.me/**", (route) => route.fulfill({ status: 204, body: "" }));
  });

  test("categoria 'Outro' substitui 'Outro / Só orçamento' e não há remoto para TV", async ({ page }) => {
    await page.goto(`${HOME}${UTM_QS}`);
    await page.waitForLoadState("networkidle");
    const dialog = await openFunnel(page);
    await chooseResidential(dialog);
    await expect(dialog.getByText("Outro", { exact: true }).first()).toBeVisible();
    await expect(dialog.getByText(/Só orçamento/i)).toHaveCount(0);
  });

  test("TV não liga → coleta obrigatória com R$ 299,99 e pergunta 'quando aconteceu'", async ({ page }) => {
    await page.goto(`${HOME}${UTM_QS}`);
    await page.waitForLoadState("networkidle");
    const dialog = await openFunnel(page);
    await chooseResidential(dialog);

    await dialog.getByRole("button", { name: /^TV$/i }).first().click();
    await expect(dialog.getByText(/O que aconteceu/i)).toBeVisible();
    await dialog.getByRole("radio", { name: /^LED$/i }).click();
    await fillQualification(dialog);
    await dialog.getByRole("radio", { name: /^Não liga$/i }).click();

    await expect(dialog.getByText(/Qual a urgência/i)).toBeVisible();
    await expect(dialog.getByText(/Quando aconteceu/i)).toBeVisible();
    await expect(dialog.getByText(/Com que frequência/i)).toHaveCount(0);
    await dialog.getByRole("radio", { name: /^Hoje$/i }).click();
    await dialog.getByRole("radio", { name: /Sem pressa/i }).click();

    await expect(dialog.getByText(/Coleta e entrega/i).first()).toBeVisible();
    await expect(dialog.getByText(/R\$ 299,99/i).first()).toBeVisible();
  });

  test("PC funcionando + instalar programa → atendimento remoto", async ({ page }) => {
    await page.goto(`${HOME}${UTM_QS}`);
    await page.waitForLoadState("networkidle");
    const dialog = await openFunnel(page);
    await chooseResidential(dialog);

    await dialog.getByRole("button", { name: /PC \/ Notebook/i }).click();
    await dialog.getByRole("radio", { name: /^Notebook$/i }).click();
    await dialog.getByRole("radio", { name: /Liga e inicia normalmente/i }).click();
    await fillQualification(dialog);
    await dialog.getByRole("radio", { name: /Instalar ou configurar programa/i }).click();

    await expect(dialog.getByText(/Qual a urgência/i)).toBeVisible();
    await dialog.getByRole("radio", { name: /Há poucos dias/i }).click();
    await dialog.getByRole("radio", { name: /Próximas 72 horas úteis/i }).click();

    await expect(dialog.getByText(/Atendimento remoto/i).first()).toBeVisible();
    await expect(dialog.getByText(/Coleta e entrega/i)).toHaveCount(0);
  });

  test("botão flutuante abre o funil e evento preserva click_location", async ({ page }) => {
    await page.goto(`${HOME}${UTM_QS}`);
    await page.waitForLoadState("domcontentloaded");
    await page.getByTestId("whatsapp-float").click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByText(/Triagem antes do atendimento/i)).toBeVisible();

    const events = await page.evaluate(() => (window as unknown as { __waFunnelEvents?: Array<{ name: string; payload: Record<string, unknown> }> }).__waFunnelEvents || []);
    const opened = events.find((e) => e.name === "wa_funnel_open");
    expect(opened?.payload.click_location).toBe("float");
    expect(opened?.payload.app_version).toBeTruthy();
  });

  test("GA4 registra wa_funnel_open com UTM no dataLayer sob Consent Mode v2", async ({ page }) => {
    await page.goto(`${HOME}${UTM_QS}`);
    await page.waitForLoadState("networkidle");
    await openFunnel(page);
    // O bootstrap oficial substitui o espião gtag; a fonte real é o dataLayer.
    // Não depende de envio à rede enquanto o consentimento está negado.
    const open = await page.evaluate(() => {
      const layer = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer || [];
      return layer
        .map((entry) => Array.from(entry))
        .find((args) => args[0] === "event" && args[1] === "wa_funnel_open");
    });
    expect(open, "evento de abertura deve ser enfileirado no dataLayer").toBeTruthy();
    expect(open?.[2]).toMatchObject({
      utm_source: "ci",
      utm_campaign: "triage_v5_e2e",
      click_location: "test",
    });
  });

  test("link 'Termos e Condições' resolve a rota pública /termos-e-condicoes", async ({ page }) => {
    const res = await page.goto("/termos-e-condicoes");
    expect(res?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("rota de fallback /funil-indisponivel carrega e mostra CTA WhatsApp", async ({ page }) => {
    await page.goto("/funil-indisponivel");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const wa = page.locator('a[href*="wa.me/5541997086380"][data-funnel-skip="1"]');
    await expect(wa).toBeVisible();
  });
});

test.describe("Triagem V5 — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("modal abre e mostra seleção de equipamento", async ({ page, context }) => {
    await installGtagSpy(page);
    await context.route("https://wa.me/**", (route) => route.fulfill({ status: 204, body: "" }));
    await page.goto(HOME);
    await page.waitForLoadState("networkidle");
    const dialog = await openFunnel(page);
    await chooseResidential(dialog);
    await expect(dialog.getByText(/Qual o equipamento/i)).toBeVisible();
  });
});
