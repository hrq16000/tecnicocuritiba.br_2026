import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./check-eeat-coverage.mjs", import.meta.url));
const routes = [
  ["/", "src/components/home/HomeSections.tsx"],
  ["/tecnico-informatica-curitiba", "src/pages/TecnicoInformaticaCuritiba.tsx"],
  ["/atendimento-domicilio", "src/pages/AtendimentoDomicilio.tsx"],
  ["/empresa-de-ti-curitiba", "src/pages/EmpresaDeTiCuritiba.tsx"],
];
const html = '<article>Técnico em Curitiba desde 1998 <a href="/gestor-responsavel">Gestor</a><a href="/precos-e-politicas">Política</a><a href="https://wa.me/5541997086380">Contato</a></article><script type="application/ld+json">{"@id":"https://tecnico.curitiba.br/#organization"}</script>';

test("E-E-A-T reads real prerendered pages in dist/client and rejects missing evidence", () => {
  const cwd = mkdtempSync(join(tmpdir(), "eeat-gate-"));
  try {
    for (const [route, src] of routes) {
      const dir = join(cwd, "dist/client", route.replace(/^\//, ""));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html);
      const source = join(cwd, src);
      mkdirSync(join(source, ".."), { recursive: true });
      writeFileSync(source, "<EeatProofsSection />");
    }
    const run = () => spawnSync(process.execPath, [script], { cwd, encoding: "utf8" });
    const success = run();
    assert.equal(success.status, 0, success.stderr);
    assert.match(success.stdout, /4 página/);
    writeFileSync(join(cwd, "dist/client/index.html"), html.replace("wa.me/5541997086380", "example.org"));
    assert.notEqual(run().status, 0);
    rmSync(join(cwd, "dist/client/atendimento-domicilio/index.html"));
    const missing = run();
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /HTML estático ausente em dist\/client/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
