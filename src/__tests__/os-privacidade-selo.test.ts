import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const ler = (p: string) => readFileSync(path.join(raiz, p), "utf8");

describe("privacidade das rotas de O.S.", () => {
  const rotas = readdirSync(path.join(raiz, "src/routes")).filter((f) => f.startsWith("admin.ordens"));

  it("existe pelo menos a listagem, a criação e o detalhe", () => {
    expect(rotas.length).toBeGreaterThanOrEqual(3);
  });

  it("toda rota administrativa de O.S. declara noindex", () => {
    for (const f of rotas) expect(ler(`src/routes/${f}`)).toMatch(/noindex/);
  });

  it("nenhum sitemap público referencia O.S. ou área administrativa", () => {
    const sitemaps = readdirSync(path.join(raiz, "public")).filter(
      (f) => f.startsWith("sitemap") && f.endsWith(".xml"),
    );
    for (const f of sitemaps) {
      expect(ler(`public/${f}`)).not.toMatch(/\/admin|ordens/i);
    }
  });

  it("o painel de O.S. não envia dados do cliente para analytics", () => {
    for (const p of ["src/pages/admin/AdminOrdemDetalhe.tsx", "src/pages/admin/AdminOrdens.tsx"]) {
      const src = ler(p);
      expect(src).not.toMatch(/track[A-Za-z]*\(/);
      expect(src).not.toMatch(/gtag\(/);
    }
  });
});

/**
 * Detector de discrepância entre o selo (freeze) e o estado real das rotas
 * críticas. Roda antes de qualquer promoção pós-D14: se o hash selado não
 * corresponder ao arquivo em disco, o teste falha e a promoção para.
 */
describe("selo × metadata das rotas críticas", () => {
  const seloPath = "public/freeze-v2.json";

  it("o selo existe e cobre as rotas públicas", () => {
    expect(existsSync(path.join(raiz, seloPath))).toBe(true);
  });

  it("nenhuma rota selada divergiu do arquivo em disco", async () => {
    const selo = JSON.parse(ler(seloPath)) as {
      arquivos?: Record<string, { hash: string }>;
    };
    const arquivos = selo.arquivos ?? {};
    const { createHash } = await import("node:crypto");
    const divergentes: string[] = [];

    for (const [rel, meta] of Object.entries(arquivos)) {
      if (!rel.startsWith("src/routes/")) continue;
      const abs = path.join(raiz, rel);
      if (!existsSync(abs)) {
        divergentes.push(`${rel} (ausente)`);
        continue;
      }
      const hash = createHash("sha256").update(readFileSync(abs)).digest("hex").slice(0, 32);
      if (hash !== meta.hash) divergentes.push(`${rel} (hash divergente)`);
    }

    expect(divergentes).toEqual([]);
  });
});
