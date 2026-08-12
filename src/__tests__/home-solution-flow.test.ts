import { describe, expect, it } from "vitest";
import { SOLUTION_FLOW, SOLUTION_FLOW_ROUTES } from "@/lib/homeSolutionFlow";
import { CURATED_PATHS } from "../../scripts/lib/curated-urls.mjs";

describe("fluxo O que está acontecendo (Home)", () => {
  it("aponta apenas para rotas curadas existentes", () => {
    const curated = new Set(CURATED_PATHS as string[]);
    for (const path of SOLUTION_FLOW_ROUTES) {
      expect(curated.has(path), `rota fora do manifesto curado: ${path}`).toBe(true);
    }
  });

  it("todo problema tem ao menos uma opção completa", () => {
    for (const p of SOLUTION_FLOW) {
      expect(p.opcoes.length).toBeGreaterThan(0);
      for (const o of p.opcoes) {
        expect(o.solucao.path.startsWith("/")).toBe(true);
        expect(o.mensagem.length).toBeGreaterThan(20);
        expect(["domicilio", "remoto", "coleta"]).toContain(o.modalidade);
      }
    }
  });
});
