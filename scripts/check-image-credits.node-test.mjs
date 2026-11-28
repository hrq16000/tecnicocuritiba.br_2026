import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const gate = join(dirname(fileURLToPath(import.meta.url)), "check-image-credits.mjs");
const photo = '<img src="https://images.unsplash.com/photo-example" alt="Foto real" />';
const credit = '<figcaption>Foto: Unsplash <a href="https://unsplash.com/license">Licença</a></figcaption>';
function fixture(t, html, nested = true, ownAsset = false) {
  const dir = mkdtempSync(join(tmpdir(), "tcbr-credits-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const output = nested ? join(dir, "client") : dir;
  mkdirSync(join(output, "blog"), { recursive: true });
  writeFileSync(join(output, "blog", "index.html"), html);
  if (ownAsset) {
    mkdirSync(join(output, "images"), { recursive: true });
    writeFileSync(join(output, "images", "photo.webp"), "fixture");
  }
  return spawnSync(process.execPath, [gate, dir], { encoding: "utf8" });
}
test("nested output accepts licensed photo and verifies first-party asset", (t) => {
  const result = fixture(t, '<figure>' + photo + credit + '</figure><img src="https://tecnico.curitiba.br/images/photo.webp">', true, true);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 foto\(s\).*1 asset\(s\)/s);
});
test("legacy flat output still verifies credit", (t) => {
  assert.equal(fixture(t, '<figure>' + photo + credit + '</figure>', false).status, 0);
});
test("missing own absolute asset fails with the actual public route", (t) => {
  const r = fixture(t, '<img src="https://tecnico.curitiba.br/images/missing.webp">');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /\/blog: asset próprio ausente/);
  assert.doesNotMatch(r.stderr, /\/client\/blog/);
});
test("remote unlicensed source, missing attribution, missing license and AI markers still fail", (t) => {
  for (const [html, error] of [
    ['<img src="https://example.com/photo.jpg">', /host de imagem não licenciado/],
    [photo, /sem crédito visível/],
    [photo + '<figcaption>Foto: Unsplash</figcaption>', /crédito sem link/],
    ['<img src="/ai-generated.jpg">', /imagem gerada por IA/],
  ]) {
    const r = fixture(t, html);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, error);
  }
});
