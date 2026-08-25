import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { REGIOES_COBERTURA, BAIRROS_MAPEADOS, seoDepth } from "@/lib/bairrosBaseline";

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
