// @vitest-environment node
import { describe, expect, it } from "vitest";
import { canonicalRedirect } from "../lib/serverCanonical";

describe("canonical de produção preserva o protocolo do TanStack", () => {
  it("não redireciona uma Server Function no host canônico", () => {
    const request = new Request("https://tecnico.curitiba.br/_serverFn/aB12?payload=AbC");
    expect(canonicalRedirect(request)).toBeNull();
  });

  it("corrige host/protocolo preservando a caixa do endpoint e payload", () => {
    const response = canonicalRedirect(new Request("http://www.tecnico.curitiba.br/_serverFn/aB12?payload=AbC"));
    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe("https://tecnico.curitiba.br/_serverFn/aB12?payload=AbC");
  });

  it("respeita o protocolo encaminhado pelo proxy de produção", () => {
    const request = new Request("http://tecnico.curitiba.br/_serverFn/abcdef", {
      headers: { "x-forwarded-proto": "https" },
    });
    expect(canonicalRedirect(request)).toBeNull();
  });

  it.each([
    ["/Servicos/", "/servicos"],
    ["//Servicos///", "/servicos"],
    ["/index.html", "/"],
    ["/index", "/"],
    ["/Blog/ARTIGO/", "/blog/artigo"],
  ])("mantém um único 301 para a URL pública %s", (from, to) => {
    const response = canonicalRedirect(new Request("https://tecnico.curitiba.br" + from + "?origem=AbC"));
    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe("https://tecnico.curitiba.br" + to + "?origem=AbC");
  });

  it("não trata uma menção no meio de um caminho público como endpoint interno", () => {
    const response = canonicalRedirect(new Request("https://tecnico.curitiba.br/blog/_serverFn/"));
    expect(response?.headers.get("location")).toBe("https://tecnico.curitiba.br/blog/_serverfn");
  });

  it.each(["http://localhost:8080/Servicos/", "https://preview.lovable.app/Servicos/"])(
    "preserva o comportamento de preview em %s", (url) => {
      expect(canonicalRedirect(new Request(url))).toBeNull();
    },
  );
});
