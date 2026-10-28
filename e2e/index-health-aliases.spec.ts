import { test, expect, request as pwRequest } from "@playwright/test";

// Verifica a precedência de 301 sobre o 404 editorial, sempre no SSR.
// Nunca promove rascunhos nem cria aliases fora da matriz oficial.
test("artigo legado redireciona antes da proteção fail-closed do blog", async ({ baseURL }) => {
  const ctx = await pwRequest.newContext({ baseURL: process.env.E2E_BASE_URL ?? baseURL });
  try {
    const res = await ctx.get("/blog/quando-trocar-hd-por-ssd", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(new URL(res.headers()["location"], "https://tecnico.curitiba.br").pathname).toBe("/servicos/upgrade-ssd-ram");
    const target = await ctx.get("/blog/quando-trocar-hd-por-ssd");
    expect(target.status()).toBe(200);
    expect(await target.text()).toContain('rel="canonical"');
  } finally { await ctx.dispose(); }
});

test("artigo sem aprovação e sem alias continua 404", async ({ baseURL }) => {
  const ctx = await pwRequest.newContext({ baseURL: process.env.E2E_BASE_URL ?? baseURL });
  try {
    const res = await ctx.get("/blog/artigo-sem-aprovacao-verificada");
    expect(res.status()).toBe(404);
  } finally { await ctx.dispose(); }
});

test("alias institucional termina em canonical do destino e privacidade noindex", async ({ baseURL }) => {
  const ctx = await pwRequest.newContext({ baseURL: process.env.E2E_BASE_URL ?? baseURL });
  try {
    const old = await ctx.get("/privacidade", { maxRedirects: 0 });
    expect(old.status()).toBe(301);
    const page = await ctx.get("/politica-de-privacidade");
    expect(page.status()).toBe(200);
    const html = await page.text();
    expect(html).toContain('href="https://tecnico.curitiba.br/politica-de-privacidade"');
    expect(html).toMatch(/name="robots"[^>]+content="noindex,\s*follow"/i);
  } finally { await ctx.dispose(); }
});

test("preços públicos possuem WebPage JSON-LD SSR e canonical self", async ({ baseURL }) => {
  const ctx = await pwRequest.newContext({ baseURL: process.env.E2E_BASE_URL ?? baseURL });
  try {
    const page = await ctx.get("/precos-e-politicas");
    expect(page.status()).toBe(200);
    const html = await page.text();
    expect(html).toContain('href="https://tecnico.curitiba.br/precos-e-politicas"');
    const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    expect(schemas.some(([, value]) => {
      try { return JSON.stringify(JSON.parse(value)).includes('"@type":"WebPage"'); }
      catch { return false; }
    })).toBe(true);
  } finally { await ctx.dispose(); }
});
