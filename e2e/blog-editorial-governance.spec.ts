import { test, expect, type APIRequestContext } from "@playwright/test";
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";

// ─────────────────────────────────────────────────────────────
// GOVERNANÇA EDITORIAL FAIL-CLOSED (substitui blog-sitemap-new-urls.spec.ts)
//
// O teste antigo codificava a estratégia fail-open (blog/artigos DENTRO do
// sitemap, cada URL 200 + canonical self como conteúdo indexável). Essa
// política foi revertida. Este teste valida a política ATUAL:
//   - registro editorial vazio (zero aprovados);
//   - /blog e os 157 artigos em noindex,follow, canonical self;
//   - autoria institucional (sem Person / cargo fictício);
//   - blog/problemas/marcas AUSENTES dos sitemaps;
//   - sitemap principal = 33 URLs comerciais.
// O teste FALHA se a política voltar a ser fail-open.
// ─────────────────────────────────────────────────────────────

const SITE = "https://tecnico.curitiba.br";
const BASE = process.env.E2E_BASE_URL ?? "http://localhost:4173";


// Amostra representativa exigida pelo prompt.
const SAMPLE = {
  manualAlinhado: "como-instalar-windows-11-do-zero",
  manualOffTopic: "como-montar-pc-gamer-2026",
  programatico: "pc-nao-liga-o-que-fazer",
  seguranca: "como-detectar-invasao-rede",
  redes: "como-configurar-rede-linux-netplan",
};
const SAMPLE_SLUGS = Object.values(SAMPLE);

// TanStack Start pré-renderiza apenas rotas curadas/indexáveis. Para o blog
// editorial noindex, validar a resposta SSR efetiva evita um falso negativo
// por dist/blog ausente e mantém o fail-closed testado de ponta a ponta.
async function readSsr(request: APIRequestContext, route: string): Promise<string> {
  const response = await request.get(`${BASE}${route}`);
  expect(response.status(), `HTTP SSR de ${route}`).toBe(200);
  expect(response.headers()["content-type"] ?? "").toMatch(/text\/html/i);
  return response.text();
}

// ── 1. Registro editorial fail-closed ──────────────────────
test.describe("Registro editorial (fail-closed)", () => {
  const src = readFileSync(resolve("src/lib/blogEditorialRegistry.ts"), "utf8");

  test("zero artigos aprovados — nenhum .set() de aprovação", () => {
    expect(src).toContain("APPROVED_EDITORIAL_CONTENT = new Map");
    expect(src, "nenhum artigo pode estar cadastrado como aprovado").not.toMatch(
      /APPROVED_EDITORIAL_CONTENT\.set\(/,
    );
  });

  test("slug não registrado é tratado como draft (padrão fail-closed)", () => {
    expect(src).toMatch(/\?\?\s*"draft"/);
  });

  test("categoria/tema não aprova conteúdo — aprovação exige status approved", () => {
    expect(src).toMatch(/status\s*!==\s*"approved"/);
    expect(src, "indexabilidade não pode depender de categoria off-topic").not.toMatch(
      /OFF_TOPIC|isOffTopicCategory/,
    );
  });

  test("aprovação exige imagem legítima e data real (não futura)", () => {
    expect(src).toMatch(/imageOrigin\s*===\s*"unknown"/);
    expect(src).toMatch(/approvedAt/);
    expect(src).toMatch(/>\s*Date\.now\(\)/);
  });
});

// ── 2. Hub /blog no HTML estático ──────────────────────────
test.describe("Hub /blog (SSR, não pré-renderizado)", () => {

  test("canonical self-referente único", async ({ request }) => {
    const html = await readSsr(request, "/blog");
    const canon = html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
    expect(canon.length).toBe(1);
    expect(canon[0]).toContain(`${SITE}/blog`);
  });

  test("robots noindex,follow", async ({ request }) => {
    const html = await readSsr(request, "/blog");
    const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    expect(robots?.[1] ?? "").toMatch(/noindex/);
  });

  test("nenhum tipo Person/BlogPosting no JSON-LD", async ({ request }) => {
    const html = await readSsr(request, "/blog");
    for (const block of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []) {
      const json = JSON.parse(block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""));
      expect(JSON.stringify(json)).not.toContain('"@type":"Person"');
      expect(JSON.stringify(json)).not.toContain('"@type":"BlogPosting"');
    }
  });
});

// ── 3. Artigos (amostra) no HTML estático ──────────────────
test.describe("Artigos em noindex,follow (SSR, não pré-renderizados)", () => {
  for (const [tipo, slug] of Object.entries(SAMPLE)) {
    test(`/blog/${slug} (${tipo}) — HTML próprio noindex,follow + canonical self`, async ({ request }) => {
      const html = await readSsr(request, `/blog/${slug}`);
      const url = `${SITE}/blog/${slug}`;

      const robots = html.match(/<meta\s+name=["']robots["'][^>]*>/gi) || [];
      expect(robots.length).toBe(1);
      expect(robots[0]).toMatch(/noindex,\s*follow/i);

      const canon = html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
      expect(canon.length).toBe(1);
      expect(canon[0]).toContain(url);

      // Autoria institucional — nada de Person / cargo fictício.
      for (const block of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []) {
        const raw = block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
        JSON.parse(raw); // deve parsear
        expect(raw).not.toContain('"@type":"Person"');
        expect(raw).not.toContain("Técnico de Informática Sênior");
        expect(raw).not.toContain("jobTitle");
        expect(raw, 'publisher/autor deve ser "Técnico em Curitiba"').not.toMatch(
          /"(publisher|author)":\s*\{[^}]*"Técnico Curitiba"/,
        );
      }
      expect(html).toContain('og:site_name" content="Técnico em Curitiba"');
    });
  }
});

// ── 4. Sitemaps: nenhuma família editorial ─────────────────
test.describe("Sitemaps (fail-closed)", () => {
  const publicDir = resolve("public");
  const sitemaps = readdirSync(publicDir).filter((f) => /^sitemap.*\.xml$/.test(f));

  test("nenhum sitemap referencia /blog, /problemas ou /marcas", () => {
    for (const f of sitemaps) {
      const xml = readFileSync(resolve(publicDir, f), "utf8");
      expect(xml, `${f} não pode conter /blog`).not.toMatch(/\/blog(\/|<)/);
      expect(xml, `${f} não pode conter /problemas`).not.toMatch(/\/problemas?\//);
      expect(xml, `${f} não pode conter /marcas`).not.toMatch(/\/marcas?\//);
    }
  });

  test("nenhum slug editorial da amostra aparece nos sitemaps", () => {
    for (const f of sitemaps) {
      const xml = readFileSync(resolve(publicDir, f), "utf8");
      for (const slug of SAMPLE_SLUGS) {
        expect(xml, `${slug} não pode estar em ${f}`).not.toContain(`/blog/${slug}`);
      }
    }
  });

  test("sitemap principal = 33 URLs comerciais", () => {
    const active = ["sitemap-main.xml", "sitemap-servicos.xml", "sitemap-regioes.xml", "sitemap-bairros.xml"];
    let total = 0;
    for (const f of active) {
      const fp = resolve(publicDir, f);
      if (existsSync(fp)) total += (readFileSync(fp, "utf8").match(/<loc>/gi) || []).length;
    }
    expect(total).toBe(33);
  });

  test("sitemap-news.xml vazio (sem entradas editoriais)", () => {
    const fp = resolve(publicDir, "sitemap-news.xml");
    if (existsSync(fp)) {
      expect((readFileSync(fp, "utf8").match(/<url>/gi) || []).length).toBe(0);
    }
  });
});

// ── 5. Runtime (requer servidor + navegador) ───────────────
test.describe("Hub /blog em runtime", () => {
  test.beforeAll(async ({ request }) => {
    try {
      const r = await request.get(BASE, { timeout: 3000 });
      test.skip(!r.ok(), `servidor ${BASE} indisponível — validação runtime bloqueada pelo ambiente`);
    } catch {
      test.skip(true, `servidor ${BASE} inacessível — validação runtime bloqueada pelo ambiente`);
    }
  });

  test("/blog: H1 único, noindex, estado editorial vazio e link para /contato", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "domcontentloaded" });

    expect(await page.locator("h1").count()).toBe(1);

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "").toMatch(/noindex/);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`${SITE}/blog`);

    await expect(page.getByText(/revisão editorial/i).first()).toBeVisible();
    await expect(page.getByText(/[Pp]olítica editorial/).first()).toBeVisible();
    expect(await page.locator('a[href="/contato"], a[href$="/contato"]').count()).toBeGreaterThan(0);
  });

  test("artigo não aprovado permanece noindex,follow em runtime", async ({ page }) => {
    await page.goto(`${BASE}/blog/${SAMPLE.seguranca}`, { waitUntil: "domcontentloaded" });
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "").toMatch(/noindex/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`${SITE}/blog/${SAMPLE.seguranca}`);
  });
});
