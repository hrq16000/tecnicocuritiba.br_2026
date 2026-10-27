import { test, expect } from "@playwright/test";

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
