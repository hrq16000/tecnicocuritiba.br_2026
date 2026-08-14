import { test, expect, type Page } from "@playwright/test";

/**
 * GATE E2E — número de contato nunca visível.
 *
 * Em todos os breakpoints (mobile, tablet, desktop) e nas rotas críticas:
 *   1. nenhum texto visível contém o número de WhatsApp (em qualquer formatação);
 *   2. todo link de WhatsApp aponta apenas para wa.me (nunca `tel:`);
 *   3. não existe link/botão `tel:` ou rótulo "Ligar"/"Telefone" clicável;
 *   4. o CTA correto continua funcionando (abre o funil ou navega para wa.me).
 */

const BREAKPOINTS = [
  { nome: "mobile", width: 390, height: 844 },
  { nome: "tablet", width: 768, height: 1024 },
  { nome: "desktop", width: 1366, height: 900 },
];

const ROTAS = ["/", "/servicos", "/empresas", "/problemas"];

const DIGITS = "5541997086380";
const LOCAL = "41997086380";

/** Texto visível do documento, sem scripts/estilos e sem elementos ocultos. */
const textoVisivel = (page: Page) =>
  page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const out: string[] = [];
    let node = walker.nextNode();
    while (node) {
      const el = node.parentElement;
      if (el && !["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) {
        const cs = getComputedStyle(el);
        if (cs.display !== "none" && cs.visibility !== "hidden") out.push(node.textContent ?? "");
      }
      node = walker.nextNode();
    }
    return out.join(" ");
  });

for (const bp of BREAKPOINTS) {
  test.describe(`CTAs sem número visível — ${bp.nome}`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    for (const rota of ROTAS) {
      test(`${rota}`, async ({ page }) => {
        await page.goto(rota);
        await page.waitForLoadState("domcontentloaded");
        await page
          .waitForFunction(() => document.documentElement.dataset.hydrated === "1", null, { timeout: 15000 })
          .catch(() => undefined);

        // 1. número nunca em texto visível
        const compacto = (await textoVisivel(page)).replace(/[\s().+\-]/g, "");
        expect(compacto).not.toContain(DIGITS);
        expect(compacto).not.toContain(LOCAL);

        // 2. links de WhatsApp usam apenas wa.me
        const hrefs = await page.locator("a[href]").evaluateAll((as) =>
          (as as HTMLAnchorElement[]).map((a) => a.getAttribute("href") ?? ""),
        );
        for (const href of hrefs) {
          if (/whats/i.test(href)) expect(href).toMatch(/^https:\/\/wa\.me\//);
        }

        // 3. nenhum tel: ativo e nenhum rótulo de ligação
        expect(hrefs.filter((h) => h.startsWith("tel:"))).toHaveLength(0);
        await expect(page.getByRole("link", { name: /ligar( agora)?/i })).toHaveCount(0);
        await expect(page.getByRole("button", { name: /ligar( agora)?/i })).toHaveCount(0);

        // 4. CTA de contato existe e é acionável
        const waLink = page.locator("a[href^='https://wa.me/']").first();
        const waBtn = page.getByRole("button", { name: /whatsapp|agendar|falar/i }).first();
        const temLink = await waLink.count();
        if (temLink) {
          await expect(waLink).toHaveAttribute("href", new RegExp(`wa\\.me/${DIGITS}`));
        } else {
          await expect(waBtn).toBeVisible({ timeout: 8000 });
          await waBtn.click();
          await expect(page.locator("a[href^='https://wa.me/'], [role='dialog']").first()).toBeVisible({
            timeout: 8000,
          });
        }
      });
    }
  });
}
