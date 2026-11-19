import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const gate = path.join(root, "scripts/check-cohort-reconciliation.mjs");
const historicalLedger = JSON.parse(readFileSync(path.join(root, "public/intervencoes-d0.json"), "utf8"));
const freeze = JSON.parse(readFileSync(path.join(root, "public/freeze-v2.json"), "utf8"));

function checkLedger(change = () => {}) {
  const fixture = mkdtempSync(path.join(os.tmpdir(), "pr79-cohort-regression-"));
  const ledger = structuredClone(historicalLedger);
  change(ledger);
  try {
    mkdirSync(path.join(fixture, "public"));
    writeFileSync(path.join(fixture, "public/intervencoes-d0.json"), JSON.stringify(ledger));
    const result = spawnSync(process.execPath, [gate], { cwd: fixture, encoding: "utf8" });
    if (result.error) throw result.error;
    return result;
  } finally {
    const relative = path.relative(path.resolve(os.tmpdir()), path.resolve(fixture));
    if (!relative.startsWith("pr79-cohort-regression-") || relative.includes(path.sep) || path.isAbsolute(relative)) {
      throw new Error("Diretório temporário fora do destino esperado.");
    }
    rmSync(fixture, { recursive: true });
  }
}

test("aceita o ledger do evento 005 já selado no FREEZE_V2", () => {
  assert.deepEqual(freeze.coortes, { CLEAN_COHORT: 91, DIRECT_INTERVENTION: 29, INDIRECT_DISCOVERY_INTERVENTION: 10 });
  assert.ok(historicalLedger.eventos.some((event) => event.id === "INT-2026-08-25-005"));
  const result = checkLedger();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /91 \+ 29 \+ 10 = 130/);
});

test("bloqueia a distribuição antiga 91/28/11 mesmo conservando 130 URLs", () => {
  const result = checkLedger((ledger) => {
    const direct = ledger.coortes.INTERVENTION_COHORT.urls;
    const index = direct.findIndex((item) => item.url === "/tecnico-informatica-curitiba");
    assert.notEqual(index, -1);
    ledger.coortes.INDIRECT_DISCOVERY_COHORT.urls.push(direct.splice(index, 1)[0]);
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /INTERVENTION_COHORT: 28 URL\(s\), esperado 29/);
  assert.match(result.stderr, /INDIRECT_DISCOVERY_COHORT: 11 URL\(s\), esperado 10/);
});

test("bloqueia duplicidade apesar de as quantidades continuarem corretas", () => {
  const result = checkLedger((ledger) => {
    ledger.coortes.INTERVENTION_COHORT.urls[1] = structuredClone(ledger.coortes.INTERVENTION_COHORT.urls[0]);
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /URLs duplicadas dentro da coorte/);
});

test("bloqueia URL fora do universo e a URL curada que ficou sem coorte", () => {
  const result = checkLedger((ledger) => {
    ledger.coortes.CLEAN_COHORT.urls[0] = "/fora-do-universo-curado-pr79";
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /URL curada sem classificação de coorte/);
  assert.match(result.stderr, /URL classificada fora do conjunto curado/);
});
