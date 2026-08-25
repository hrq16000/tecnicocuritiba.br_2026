import { describe, expect, it, vi } from "vitest";
import mcp from "../index";
import { buildMcpAuditEntry, logMcpToolAccess, resolveOwner } from "../lib/audit";

describe("MCP — autorização OAuth obrigatória", () => {
  it("o servidor declara auth (nenhuma ferramenta pública sem token)", () => {
    expect(mcp.auth).toBeTruthy();
  });

  it("exige token da audiência autenticada do backend do projeto", () => {
    const auth = JSON.stringify(mcp.auth ?? {});
    expect(auth).toContain("authenticated");
    expect(auth).toMatch(/jwks/i);
  });

  it("todas as ferramentas expostas são somente leitura", () => {
    for (const tool of mcp.tools ?? []) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }
  });
});

describe("MCP — logs de auditoria privacy-first", () => {
  it("registra rota, owner e resultado", () => {
    const entry = buildMcpAuditEntry({
      tool: "validate_seo",
      route: "/servicos/conserto-placa",
      outcome: "authorized",
      ctx: { auth: { claims: { sub: "8f1c-user" } } },
    });
    expect(entry).toMatchObject({
      event: "mcp_tool_access",
      tool: "validate_seo",
      route: "/servicos/conserto-placa",
      outcome: "authorized",
    });
    expect(entry.owner).toMatch(/^owner_[0-9a-f]{8}$/);
  });

  it("nunca grava PII: e-mail no sub sai anonimizado", () => {
    const owner = resolveOwner({ claims: { sub: "Cliente@example.com" } });
    expect(owner).not.toContain("@");
    expect(owner).toMatch(/^owner_[0-9a-f]{8}$/);
  });

  it("owner é 'anonymous' quando não há claims (acesso negado)", () => {
    expect(resolveOwner(undefined)).toBe("anonymous");
    expect(resolveOwner({})).toBe("anonymous");
  });

  it("emite uma linha JSON sem token nem cabeçalhos", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logMcpToolAccess({
      tool: "validate_jsonld",
      route: "/",
      outcome: "unauthorized",
      ctx: { auth: { claims: { sub: "abc" } }, headers: { authorization: "Bearer segredo" } },
    });
    const linha = spy.mock.calls[0]?.[0] as string;
    spy.mockRestore();
    expect(() => JSON.parse(linha)).not.toThrow();
    expect(linha).not.toContain("Bearer");
    expect(linha).not.toContain("segredo");
    expect(JSON.parse(linha).outcome).toBe("unauthorized");
  });
});
