import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("metadados SSR leves de impressora 3D", () => {
  it("mantém title, description e os 10 FAQs idênticos ao catálogo", () => {
    const core = readFileSync(resolve(process.cwd(), "src/lib/servicosCore.ts"), "utf8");
    const route = readFileSync(resolve(process.cwd(), "src/routes/servicos.conserto-impressora-3d.tsx"), "utf8");
    const source = core.split('  "conserto-impressora-3d": {')[1];
    expect(source, "serviço 3D ausente do catálogo").toBeTruthy();
    const title = source.match(/metaTitle:\s*("(?:[^"\\]|\\.)*")/)?.[1];
    const description = source.match(/metaDescription:\s*\n\s*("(?:[^"\\]|\\.)*")/)?.[1];
    const first = source.indexOf("    faqs: [");
    const last = source.indexOf("\n    ],", first);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(last).toBeGreaterThan(first);
    const faqs = source.slice(first, last + 7);
    expect((faqs.match(/\{ question:/g) ?? []).length).toBe(10);
    expect(route).not.toContain('import { SERVICOS_CORE } from "@/lib/servicosCore"');
    expect(route).toContain("metaTitle: " + title);
    expect(route).toContain("metaDescription: " + description);
    expect(route).toContain(faqs);
    expect(route).toContain("noindex: isNoindexByEnrichment(PATH)");
  });
});
