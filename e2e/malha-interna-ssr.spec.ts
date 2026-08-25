import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * Malha interna no HTML BRUTO (SSR, antes da hidratação).
 *
 * Asserts obrigatórios:
 *  1. os links internos das grades têm href válido (sem undefined/vazio);
 *  2. nenhum link interno aponta para página com <meta robots noindex>;
 *  3. nenhum link interno aponta para rota de redirecionamento (301/302).
 */

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";

const PAGINAS_COM_GRADE = ["/", "/servicos", "/areas-atendidas", "/problemas"];

const IGNORAR = /^(#|mailto:|tel:|https?:|\/\/)/;

async function rawHtml(request: APIRequestContext, path: string) {
  const res = await request.get(`${BASE}${path}`);
  expect(res.status(), `HTTP de ${path}`).toBe(200);
  return res.text();
}

function internalHrefs(html: string): string[] {
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  return [...new Set(hrefs.filter((h) => h.startsWith("/") && !IGNORAR.test(h)))]
    .map((h) => h.split(/[?#]/)[0])
    .filter((h) => h && !/\.(xml|txt|json|png|jpg|jpeg|webp|avif|svg|ico|css|js|pdf)$/.test(h));
}

for (const pagina of PAGINAS_COM_GRADE) {
  test(`malha interna SSR de ${pagina} — href válido, sem noindex e sem redirect`, async ({
    request,
  }) => {
    const html = await rawHtml(request, pagina);

    // 1 — href válido em todos os links renderizados no servidor
    const brutos = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    const invalidos = brutos.filter((h) => h === "" || /undefined|null|\[object/.test(h));
    expect(invalidos, `hrefs inválidos em ${pagina}`).toEqual([]);

    const alvos = internalHrefs(html).filter((h) => h !== pagina);
    expect(alvos.length, `nenhum link interno encontrado em ${pagina}`).toBeGreaterThan(0);

    const comNoindex: string[] = [];
    const comRedirect: string[] = [];

    for (const alvo of alvos) {
      const res = await request.get(`${BASE}${alvo}`, { maxRedirects: 0 });
      const status = res.status();
      if (status === 301 || status === 302 || status === 307 || status === 308) {
        comRedirect.push(`${alvo} → ${status}`);
        continue;
      }
      expect(status, `HTTP de ${alvo} (link em ${pagina})`).toBe(200);
      const alvoHtml = await res.text();
      if (/<meta[^>]+name="robots"[^>]+noindex/i.test(alvoHtml)) comNoindex.push(alvo);
    }

    expect(comRedirect, `links internos apontando para redirect em ${pagina}`).toEqual([]);
    expect(comNoindex, `links internos apontando para noindex em ${pagina}`).toEqual([]);
  });
}
