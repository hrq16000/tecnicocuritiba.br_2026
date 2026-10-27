import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./check-sem-balcao.mjs", import.meta.url));
function runFixture(copy) {
  const root = mkdtempSync(path.join(tmpdir(), "sem-balcao-"));
  try {
    mkdirSync(path.join(root, "src/lib"), { recursive: true });
    mkdirSync(path.join(root, "src/pages"), { recursive: true });
    writeFileSync(path.join(root, "src/lib/precosConfig.ts"),
      'export const REGRA_SEM_BALCAO = "coleta"; export const GATILHO_COLETA_SEM_CUSTO = "triagem";');
    writeFileSync(path.join(root, "src/pages/Atendimento.tsx"), copy);
    // Exemplos negativos no próprio teste não devem ser lidos como copy pública.
    writeFileSync(path.join(root, "src/pages/Atendimento.test.tsx"), 'const exemplo = "nossa loja física";');
    return spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
  } finally {
    const resolved = path.resolve(root);
    assert.ok(resolved.startsWith(path.resolve(tmpdir()) + path.sep));
    rmSync(resolved, { recursive: true, force: true });
  }
}
test("varre conteúdo TS/TSX sem depender de rg e ignora arquivos de teste", () => {
  const result = runFixture('export const texto = "Coleta e entrega por agendamento";');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 arquivos sem convite a balcão/);
});
test("continua bloqueando convite para loja física inexistente", () => {
  const result = runFixture('export const texto = "Visite nossa loja física";');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /promete loja física inexistente/);
});
