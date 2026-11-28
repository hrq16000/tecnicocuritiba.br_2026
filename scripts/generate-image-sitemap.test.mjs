import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const generator = fileURLToPath(new URL("./generate-image-sitemap.mjs", import.meta.url));
const checker = fileURLToPath(new URL("./check-image-sitemap.mjs", import.meta.url));
const run = (script, root) => spawnSync(process.execPath, [script, root], { encoding: "utf8" });

for (const nested of [false, true]) {
  test(`image sitemap usa URLs do build ${nested ? "TanStack" : "plano"}`, () => {
    const root = mkdtempSync(join(tmpdir(), "image-sitemap-"));
    try {
      const served = nested ? join(root, "client") : root;
      mkdirSync(join(served, "assets"), { recursive: true });
      mkdirSync(join(served, "servico"), { recursive: true });
      mkdirSync(join(served, "privado"), { recursive: true });
      const file = join(served, "assets", "foto.webp");
      writeFileSync(file, "fixture");
      const date = new Date("2026-01-15T00:00:00Z");
      utimesSync(file, date, date);
      writeFileSync(join(served, "index.html"), '<meta name="robots" content="index, follow"><img src="/assets/foto.webp" alt="Bancada">');
      writeFileSync(join(served, "servico", "index.html"), '<meta content="index, follow" name="robots"><img src="/assets/foto.webp">');
      writeFileSync(join(served, "privado", "index.html"), '<meta content="noindex, follow" name="robots"><img src="/assets/foto.webp">');
      // Não deve varrer um HTML ou asset fora de client/ quando houver essa pasta.
      if (nested) writeFileSync(join(root, "index.html"), '<img src="/assets/foto.webp">');
      const result = run(generator, root);
      assert.equal(result.status, 0, result.stderr);
      const xml = readFileSync(join(served, "sitemap-images.xml"), "utf8");
      assert.match(xml, /<loc>https:\/\/tecnico\.curitiba\.br\/<\/loc>/);
      assert.match(xml, /<loc>https:\/\/tecnico\.curitiba\.br\/servico<\/loc>/);
      assert.match(xml, /<lastmod>2026-01-15<\/lastmod>/);
      assert.doesNotMatch(xml, /\/client\/|\/privado/);
      assert.equal((xml.match(/<url>/g) || []).length, 2);
      if (nested) assert.equal(readFileSync(join(root, "sitemap-images.xml"), "utf8"), xml);
      const checked = run(checker, root);
      assert.equal(checked.status, 0, checked.stderr);
      rmSync(file);
      const missing = run(checker, root);
      assert.notEqual(missing.status, 0);
      assert.match(missing.stderr, /asset inexistente/);
      const empty = run(generator, root);
      assert.notEqual(empty.status, 0);
      assert.match(empty.stderr, /nenhuma imagem local/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}
