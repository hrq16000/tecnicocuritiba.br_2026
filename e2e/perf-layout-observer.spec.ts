import { test, expect } from "@playwright/test";

/**
 * Evidência observacional para as falhas Lighthouse persistentes.
 * Asserts de performance permanecem exclusivamente nos gates Lighthouse.
 * Só executa no workflow de auditoria empresarial, nunca na matriz genérica.
 */
test.describe("performance: fontes reais de LCP e CLS (observacional)", () => {
  test.skip(process.env.PERF_DIAGNOSTICS !== "1", "Ativado apenas pelo CI Lighthouse empresarial");
  test.use({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });

  for (const path of ["/empresa-de-ti-curitiba", "/servicos/backup-para-empresas"]) {
    test(path + ": diagnosticar pintura principal e deslocamentos", async ({ page }) => {
      await page.addInitScript(() => {
        const data = {
          lcp: [] as Array<{ start: number; size: number; element: string | null; text: string | null }>,
          shifts: [] as Array<{ start: number; value: number; sources: Array<{ element: string | null; previous: unknown; current: unknown }> }>,
        };
        (window as Window & { __perfDiagnostics?: typeof data }).__perfDiagnostics = data;
        const label = (el?: Element | null) => {
          if (!el) return null;
          const id = el.id ? "#" + el.id : "";
          const classes = typeof el.className === "string" ? "." + el.className.split(/\s+/).filter(Boolean).slice(0, 3).join(".") : "";
          return (el.tagName.toLowerCase() + id + classes).slice(0, 160);
        };
        try {
          new PerformanceObserver((list) => {
            for (const item of list.getEntries()) {
              const entry = item as PerformanceEntry & { size?: number; element?: Element | null };
              data.lcp.push({
                start: Math.round(entry.startTime),
                size: Math.round(entry.size ?? 0),
                element: label(entry.element),
                text: entry.element?.textContent?.trim().slice(0, 110) ?? null,
              });
            }
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch { /* Navegador sem suporte: valor nulo documentado no relatório. */ }
        try {
          new PerformanceObserver((list) => {
            for (const item of list.getEntries()) {
              const entry = item as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
                sources?: Array<{ node?: Node | null; previousRect?: DOMRectReadOnly; currentRect?: DOMRectReadOnly }>;
              };
              if (entry.hadRecentInput) continue;
              data.shifts.push({
                start: Math.round(entry.startTime),
                value: Number((entry.value ?? 0).toFixed(5)),
                sources: (entry.sources ?? []).slice(0, 6).map((s) => ({
                  element: label(s.node instanceof Element ? s.node : s.node?.parentElement),
                  previous: s.previousRect ? { x: s.previousRect.x, y: s.previousRect.y, w: s.previousRect.width, h: s.previousRect.height } : null,
                  current: s.currentRect ? { x: s.currentRect.x, y: s.currentRect.y, w: s.currentRect.width, h: s.currentRect.height } : null,
                })),
              });
            }
          }).observe({ type: "layout-shift", buffered: true });
        } catch { /* Suporte do browser verificado pelo evento capturado. */ }
      });
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), "Rota observada precisa responder HTTP 200").toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await page.waitForTimeout(3200);
      const result = await page.evaluate(() =>
        (window as Window & { __perfDiagnostics?: unknown }).__perfDiagnostics ?? null,
      );
      expect(result, "PerformanceObserver não inicializou").toBeTruthy();
      console.log("[PERF_LAYOUT_OBSERVER]", JSON.stringify({ path, result }));
    });
  }
});
