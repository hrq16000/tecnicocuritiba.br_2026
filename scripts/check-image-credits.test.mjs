import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const gate = fileURLToPath(new URL("./check-image-credits.mjs", import.meta.url));
function run(html, { ownAsset = false } = {}, t) {
  const root = mkdtempSync(path.join(tmpdir(), "credits-gate-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, "assets"), { recursive: true });
  if (ownAsset) writeFileSync(path.join(root, "assets", "capa.jpg"), "fixture");
  writeFileSync(path.join(root, "index.html"), "<!doctype html><html><body>" + html + "</body></html>");
  return spawnSync(process.execPath, [gate, root], { encoding: "utf8" });
}

test("aprova foto Unsplash com crédito visível em figcaption e licença", (t) => {
  const html = '<figure><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998" alt="Equipamento">' +
    '<figcaption><a href="https://unsplash.com/license">Foto: Unsplash (licença livre para uso comercial)</a></figcaption></figure>';
  assert.equal(run(html, {}, t).status, 0);
});

test("reprova foto Unsplash sem crédito", (t) => {
  const output = run('<img src="https://images.unsplash.com/photo-1531482615713-2afd69097998" alt="Equipamento">', {}, t);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /sem crédito visível/);
});

test("imagem absoluta do próprio domínio somente é aprovada se existir no build", (t) => {
  const html = '<img src="https://tecnico.curitiba.br/assets/capa.jpg" alt="Capa">';
  assert.equal(run(html, { ownAsset: true }, t).status, 0);
});

test("imagem absoluta do próprio domínio ausente reprova", (t) => {
  const html = '<img src="https://tecnico.curitiba.br/assets/capa.jpg" alt="Capa">';
  const output = run(html, {}, t);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /não encontrada no build/);
});

test("host remoto desconhecido permanece bloqueado", (t) => {
  const output = run('<img src="https://unknown.example/image.jpg" alt="Foto">', {}, t);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /host de imagem não licenciado/);
});
