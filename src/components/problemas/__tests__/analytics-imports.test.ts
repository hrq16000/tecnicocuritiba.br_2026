import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import * as analytics from "@/lib/analytics";

/**
 * Gate de import/export: garante que TODO símbolo importado de "@/lib/analytics"
 * dentro de src/components/problemas existe de fato no módulo.
 * Falha aqui = TS2305 / ReferenceError em produção.
 */
const DIR = resolve(__dirname, "..");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

function analyticsImports(code: string): string[] {
  const names: string[] = [];
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]@\/lib\/analytics['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    for (const raw of m[1].split(",")) {
      const n = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (n) names.push(n);
    }
  }
  return names;
}

describe("src/components/problemas — imports de @/lib/analytics", () => {
  const files = walk(DIR);

  it("encontra componentes para validar", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("exporta trackInternalLink como função", () => {
    expect(typeof analytics.trackInternalLink).toBe("function");
  });

  for (const file of files) {
    const code = readFileSync(file, "utf8");
    const names = analyticsImports(code);
    if (!names.length) continue;
    it(`${file.split("/problemas/")[1]} importa apenas exports existentes`, () => {
      for (const name of names) {
        expect(
          Object.prototype.hasOwnProperty.call(analytics, name),
          `"${name}" não é exportado por @/lib/analytics`,
        ).toBe(true);
        expect(typeof (analytics as Record<string, unknown>)[name]).toBe("function");
      }
    });
  }
});
