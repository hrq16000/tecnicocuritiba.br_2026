import { test, expect } from "@playwright/test";

/**
 * Regressão da duplicação de JSON-LD em artigos: o HTML servido já era
 * correto, mas a hidratação anexava um segundo BreadcrumbList/FAQPage e uma
 * entidade editorial concorrente. Agora tudo passa pelo registry de slots,
 * então o DOM hidratado precisa manter exatamente um nó por entidade.
 */
const ARTIGOS = ["/blog/como-escolher-uma-workstation", "/blog/organizacao-de-ti-para-pequenos-escritorios"];

const EDITORIAIS = new Set(["Article", "BlogPosting", "NewsArticle", "TechArticle"]);

for (const path of ARTIGOS) {
  test(`JSON-LD único após hidratação em ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const nodes = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((el) => el.textContent ?? ""),
    );

    const tipos: string[] = [];
    const ids: string[] = [];
    for (const raw of nodes) {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const n of list) {
        const t = Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]];
        tipos.push(...t.filter(Boolean));
        if (n["@id"]) ids.push(n["@id"]);
      }
    }

    const conta = (t: string) => tipos.filter((x) => x === t).length;
    expect(conta("BreadcrumbList"), "BreadcrumbList duplicado").toBeLessThanOrEqual(1);
    expect(conta("FAQPage"), "FAQPage duplicado").toBeLessThanOrEqual(1);

    // @type composto conta como UMA entidade editorial; nós separados, não.
    const entidades = nodes.filter((raw) => {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list.some((n) => {
        const t = Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]];
        return t.some((x: string) => EDITORIAIS.has(x));
      });
    });
    expect(entidades.length, "entidade editorial duplicada").toBeLessThanOrEqual(1);
    expect(new Set(ids).size, "@id conflitante").toBe(ids.length);
  });
}
