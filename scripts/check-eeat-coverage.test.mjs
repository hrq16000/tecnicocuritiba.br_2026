import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = fileURLToPath(new URL("./check-eeat-coverage.mjs", import.meta.url));
const paths = [
  ["/", "src/components/home/HomeSections.tsx"],
  ["/tecnico-informatica-curitiba", "src/pages/TecnicoInformaticaCuritiba.tsx"],
  ["/atendimento-domicilio", "src/pages/AtendimentoDomicilio.tsx"],
  ["/empresa-de-ti-curitiba", "src/pages/EmpresaDeTiCuritiba.tsx"],
];

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "eeat-ci-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [route, source] of paths) {
    const file = path.join(root, "dist/client", route.replace(/^\//, ""), "index.html");
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, [
      '<html lang="pt-BR"><head><script type="application/ld+json">',
      '{"@type":"Organization","@id":"https://tecnico.curitiba.br/#organization"}',
      '</script></head><body>',
      'Técnico em Curitiba - desde 1998 - Curitiba',
      '<a href="/gestor-responsavel">Gestor</a>',
      '<a href="/precos-e-politicas">Políticas</a>',
      '<a href="https://wa.me/5541997086380">Contato</a>',
      '</body></html>',
    ].join(""));
    const sourcePath = path.join(root, source);
    mkdirSync(path.dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, "/* EeatProofsSection */");
  }
  return root;
}

const run = (root) => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });

test("inspeciona os HTMLs reais de dist/client por padrão", (t) => {
  const root = fixture(t);
  const r = run(root);
  assert.equal(r.status, 0, r.stderr + r.stdout);
  assert.match(r.stdout, /E-E-A-T OK em 4 página/);
});

test("página P0 ausente continua bloqueando", (t) => {
  const root = fixture(t);
  unlinkSync(path.join(root, "dist/client", "atendimento-domicilio/index.html"));
  const r = run(root);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /HTML estático ausente em dist\/client/);
});

test("prova não verificável continua bloqueando", (t) => {
  const root = fixture(t);
  const file = path.join(root, "dist/client/index.html");
  writeFileSync(file, readFileSync(file, "utf8").replace("</body>", "melhor técnico</body>"));
  const r = run(root);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /prova não verificável/);
});

test("sem WhatsApp oficial continua bloqueando", (t) => {
  const root = fixture(t);
  const file = path.join(root, "dist/client/index.html");
  writeFileSync(file, readFileSync(file, "utf8").replace("wa.me/5541997086380", "example.invalid"));
  const r = run(root);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /nenhum canal oficial/);
});
