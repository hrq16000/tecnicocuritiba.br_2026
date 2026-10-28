import { test, expect } from "@playwright/test";
import { getProblemaPageBySlug } from "../src/lib/problemaPagesData";

test("problema dinâmico preserva head e conteúdo no HTML sem hidratação", async ({ request }) => {
  const response = await request.get("/problemas/computador-nao-liga-curitiba");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Computador Não Liga em Curitiba | Diagnóstico Profissional");
  expect(html).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex, follow"/);
  expect(html).toMatch(/<link[^>]+rel="canonical"[^>]+href="https:\/\/tecnico\.curitiba\.br\/problemas\/computador-nao-liga-curitiba"/);
  expect(html).toMatch(/<h1[\s>]/);
});

test("problema inexistente continua respondendo 404 HTTP", async ({ request }) => {
  const response = await request.get("/problemas/sem-cadastro-regressao72", { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("navegação interna carrega outro artigo sem recarregar o documento", async ({ page }) => {
  const current = "/problemas/computador-nao-liga-curitiba";
  await page.goto(current);
  await page.locator('html[data-hydrated="1"]').waitFor();
  const links = await page.locator('a[href^="/problemas/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
  );
  const target = links.find((href) => href !== current && getProblemaPageBySlug(href.split("/").at(-1) ?? ""));
  expect(target).toBeTruthy();
  const expected = getProblemaPageBySlug(target!.split("/").at(-1) ?? "")!;
  let documentNavigations = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documentNavigations += 1;
  });
  await page.locator(`a[href="${target}"]`).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(expected.h1);
  expect(documentNavigations).toBe(0);
});

test("procedimento preserva SSR, canonical e conteúdo após hidratar", async ({ page, request }) => {
  const path = "/procedimentos/computador-nao-liga-curitiba";
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Procedimento técnico:");
  expect(html).toContain('href="https://tecnico.curitiba.br' + path + '"');
  expect(html).toMatch(/<h1[\s>]/);
  await page.goto(path);
  await page.locator('html[data-hydrated="1"]').waitFor();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    getProblemaPageBySlug("computador-nao-liga-curitiba")!.h1,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://tecnico.curitiba.br" + path);
});

test("procedimento inexistente continua 404 HTTP", async ({ request }) => {
  expect((await request.get("/procedimentos/sem-cadastro-regressao72", { maxRedirects: 0 })).status()).toBe(404);
});
