import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  REGIOES_COBERTURA,
  BAIRROS_MAPEADOS,
  SERVICOS_INTERLINK_LOCAL,
  seoDepth,
} from "@/lib/bairrosBaseline";

const ROOT = resolve(__dirname, "../..");
const sitemapBairros = readFileSync(resolve(ROOT, "public/sitemap-bairros.xml"), "utf8");

describe("cobertura oficial de bairros", () => {
  it("cobre as 7 regiões do mapeamento", () => {
    expect(REGIOES_COBERTURA).toHaveLength(7);
  });

  it("mapeia 45 bairros de Curitiba", () => {
    expect(BAIRROS_MAPEADOS).toHaveLength(45);
  });

  for (const b of BAIRROS_MAPEADOS) {
    it(`${b.nome} tem rota e página (sem 404/SSR quebrado)`, async () => {
      expect(existsSync(resolve(ROOT, `src/routes/bairros.${b.slug}.tsx`))).toBe(true);
      const route = readFileSync(resolve(ROOT, `src/routes/bairros.${b.slug}.tsx`), "utf8");
      const comp = /import\s+(\w+)\s+from\s+"@\/pages\/bairros\/(\w+)"/.exec(route);
      expect(comp, `rota ${b.slug} sem import de página`).toBeTruthy();
      const mod = await import(`../pages/bairros/${comp![2]}.tsx`);
      expect(mod.default).toBeTypeOf("function");
    });
  }

  it("nenhum bairro baseline (noindex) está no sitemap", () => {
    const vazados = BAIRROS_MAPEADOS.filter(
      (b) => seoDepth(b.slug!) === "baseline" && sitemapBairros.includes(`/bairros/${b.slug}<`),
    );
    expect(vazados.map((b) => b.slug)).toEqual([]);
  });
});

const RMC = REGIOES_COBERTURA.find((r) => r.id === "rmc")!;

describe("integridade de links do mapa de localidades", () => {
  const rotaExiste = (to: string) => {
    const base = to.replace(/^\//, "");
    const dotted = base.replace(/\//g, ".");
    return (
      existsSync(resolve(ROOT, `src/routes/${dotted}.tsx`)) ||
      existsSync(resolve(ROOT, `src/routes/${dotted}.index.tsx`)) ||
      existsSync(resolve(ROOT, `src/routes/${base}/index.tsx`))
    );
  };

  it("cobre os 9 municípios da Região Metropolitana", () => {
    expect(RMC.itens).toHaveLength(9);
  });

  for (const cidade of RMC.itens) {
    it(`${cidade.nome} tem rota real (sem 404)`, () => {
      expect(rotaExiste(cidade.to), `${cidade.to} inexistente`).toBe(true);
    });
  }

  for (const servico of SERVICOS_INTERLINK_LOCAL) {
    it(`interlink "${servico.label}" aponta para rota real`, () => {
      expect(rotaExiste(servico.to), `${servico.to} inexistente`).toBe(true);
    });
  }

  it("toda localidade do mapa tem destino único", () => {
    const tos = REGIOES_COBERTURA.flatMap((r) => r.itens.map((i) => i.to));
    expect(new Set(tos).size).toBe(tos.length);
  });
});
