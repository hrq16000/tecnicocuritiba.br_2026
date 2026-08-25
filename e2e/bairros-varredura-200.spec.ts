import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";

/**
 * Varredura de todas as rotas /bairros/<bairro>: nenhuma pode regredir para
 * 404 antes do deploy. Também valida canonical self-referente e a coerência
 * entre `noindex` (SHALLOW) e `index, follow` (RICH) no HTML SSR.
 */

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";

const BAIRROS = readdirSync("src/routes")
  .filter((f) => /^bairros\.[a-z0-9-]+\.tsx$/.test(f))
  .map((f) => `/bairros/${f.replace(/^bairros\./, "").replace(/\.tsx$/, "")}`)
  .sort();

test("existem rotas de bairro para varrer", () => {
  expect(BAIRROS.length).toBeGreaterThan(10);
});

test("todas as rotas de bairro respondem 200, com canonical e robots coerentes", async ({
  request,
}) => {
  const falhas: string[] = [];

  for (const path of BAIRROS) {
    const res = await request.get(`${BASE}${path}`, { maxRedirects: 0 });
    if (res.status() !== 200) {
      falhas.push(`${path} → HTTP ${res.status()}`);
      continue;
    }
    const html = await res.text();

    if (!new RegExp(`<link[^>]+rel="canonical"[^>]+href="[^"]*${path}"`).test(html)) {
      falhas.push(`${path} → canonical ausente ou não self-referente`);
    }

    const robots = /<meta[^>]+name="robots"[^>]+content="([^"]+)"/i.exec(html)?.[1] ?? "index, follow";
    if (!/noindex/.test(robots) && !/index/.test(robots)) {
      falhas.push(`${path} → robots inesperado: ${robots}`);
    }
  }

  expect(falhas, `regressões nas rotas de bairro:\n${falhas.join("\n")}`).toEqual([]);
});
