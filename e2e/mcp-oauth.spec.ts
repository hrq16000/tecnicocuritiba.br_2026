import { test, expect, request } from "@playwright/test";

/**
 * Controle de acesso às ferramentas MCP.
 *  • sem token OAuth válido  → acesso NEGADO (401) + metadata de recurso protegido;
 *  • com token válido        → acesso PERMITIDO (executa só se houver token no ambiente).
 *
 * Nenhum segredo é escrito aqui: o token vem de MCP_TEST_ACCESS_TOKEN quando existir.
 */
const BASE = (process.env["MCP_BASE_URL"] ?? "https://hisepaayuwxjrnumbqeq.supabase.co").replace(/\/$/, "");
const ENDPOINT = `${BASE}/functions/v1/mcp`;

const listTools = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {},
};

const headersBase = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
};

test.describe("MCP OAuth", () => {
  test("nega acesso sem token", async () => {
    const ctx = await request.newContext();
    const res = await ctx.post(ENDPOINT, { headers: headersBase, data: listTools });
    expect(res.status(), "sem token o MCP não pode responder 200").toBe(401);
    const www = res.headers()["www-authenticate"] ?? "";
    expect(www.toLowerCase()).toContain("bearer");
    await ctx.dispose();
  });

  test("nega acesso com token inválido", async () => {
    const ctx = await request.newContext();
    const res = await ctx.post(ENDPOINT, {
      headers: { ...headersBase, authorization: "Bearer token-invalido" },
      data: listTools,
    });
    expect(res.status()).toBe(401);
    await ctx.dispose();
  });

  test("permite acesso com token válido", async () => {
    const token = process.env["MCP_TEST_ACCESS_TOKEN"];
    test.skip(!token, "MCP_TEST_ACCESS_TOKEN não configurado neste ambiente");
    const ctx = await request.newContext();
    const res = await ctx.post(ENDPOINT, {
      headers: { ...headersBase, authorization: `Bearer ${token}` },
      data: listTools,
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("validate_seo");
    await ctx.dispose();
  });
});
