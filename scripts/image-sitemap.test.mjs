import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const GENERATOR = fileURLToPath(new URL("./generate-image-sitemap.mjs", import.meta.url));
const CHECKER = fileURLToPath(new URL("./check-image-sitemap.mjs", import.meta.url));
const run = (script, directory) => spawnSync(process.execPath, [script, directory], { encoding: "utf8" });

function fixture(t, { noindex = false } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "image-sitemap-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, "dist/client");
  mkdirSync(path.join(directory, "assets"), { recursive: true });
  writeFileSync(path.join(directory, "assets", "foto.jpg"), "fixture-image");
  writeFileSync(path.join(directory, "index.html"),
    '<!doctype html><html lang="pt-BR"><head><meta name="robots" content="' +
    (noindex ? "noindex, follow" : "index, follow") +
    '"></head><body><h1>Informática em Curitiba</h1><img src="/assets/foto.jpg" alt="Bancada real"></body></html>');
  return directory;
}

test("gera image sitemap no diretório servido com asset real e sem /client no URL", (t) => {
  const dir = fixture(t);
  const generated = run(GENERATOR, dir);
  assert.equal(generated.status, 0, generated.stderr + generated.stdout);
  const xml = readFileSync(path.join(dir, "sitemap-images.xml"), "utf8");
  assert.match(xml, /<loc>https:\/\/tecnico\.curitiba\.br\/<\/loc>/);
  assert.match(xml, /<image:loc>https:\/\/tecnico\.curitiba\.br\/assets\/foto\.jpg<\/image:loc>/);
  assert.doesNotMatch(xml, /tecnico\.curitiba\.br\/client\//);
  const validated = run(CHECKER, dir);
  assert.equal(validated.status, 0, validated.stderr + validated.stdout);
});

test("mantém o bloqueio: sitemap de imagens vazio não é válido", (t) => {
  const dir = fixture(t, { noindex: true });
  assert.equal(run(GENERATOR, dir).status, 0);
  const validation = run(CHECKER, dir);
  assert.equal(validation.status, 1);
  assert.match(validation.stderr, /nenhuma <url>/);
});
