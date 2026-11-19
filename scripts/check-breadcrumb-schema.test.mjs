import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { CATEGORIES, LOCAIS, cityLabel } from "./lib/category-local.mjs";

const SCRIPT = fileURLToPath(new URL("./check-breadcrumb-schema.mjs", import.meta.url));
const SITE = "https://tecnico.curitiba.br";

function fixture(t, corrupted = false) {
  const root = mkdtempSync(path.join(tmpdir(), "breadcrumb-gate-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, "dist/client");
  for (const cat of CATEGORIES) {
    for (const local of LOCAIS) {
      const route = "/" + cat.slug + "/" + local.slug;
      const title = cityLabel(local);
      const items = [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: cat.titlePrefix, item: SITE + "/" + cat.slug + "-curitiba" },
        { "@type": "ListItem", position: 3, name: title, item: SITE + route },
      ];
      if (corrupted && route === "/conserto-tv/curitiba") items[2].position = 4;
      const ld = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
      const html = '<!doctype html><html><head><link rel="canonical" href="' + SITE + route + '">' +
        '<script type="application/ld+json">' + JSON.stringify(ld) + '</script></head><body>' +
        '<nav>Início · ' + cat.titlePrefix + ' · ' + title + '</nav></body></html>';
      const file = path.join(dir, cat.slug, local.slug, "index.html");
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, html);
    }
  }
  return { root, dir };
}

const run = (cwd, args = []) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" });

test("verifica todas as rotas em dist/client por padrão", (t) => {
  const { root } = fixture(t);
  const p = run(root, ["--all"]);
  assert.equal(p.status, 0, p.stderr + p.stdout);
  assert.match(p.stdout, new RegExp("válido em " + CATEGORIES.length * LOCAIS.length + " URL"));
});

test("não aprova rotas ausentes", (t) => {
  const { root, dir } = fixture(t);
  unlinkSync(path.join(dir, "conserto-tv/curitiba/index.html"));
  const p = run(root, ["--all"]);
  assert.equal(p.status, 1);
  assert.match(p.stderr, /HTML estático ausente/);
});

test("não ignora BreadcrumbList com position incorreta", (t) => {
  const { root } = fixture(t, true);
  const p = run(root, ["--all"]);
  assert.equal(p.status, 1);
  assert.match(p.stderr, /position=4/);
});

test("aceita caminho explícito para distribuição alternativa", (t) => {
  const { root, dir } = fixture(t);
  const p = run(root, [dir, "--all"]);
  assert.equal(p.status, 0, p.stderr + p.stdout);
});


test("modo normal não promove automaticamente as 76 combinações fora do manifesto curado", (t) => {
  const { root } = fixture(t);
  const p = run(root);
  assert.equal(p.status, 0, p.stderr + p.stdout);
  assert.match(p.stdout, /válido em 0 URL\(s\) curada\(s\)/);
});
