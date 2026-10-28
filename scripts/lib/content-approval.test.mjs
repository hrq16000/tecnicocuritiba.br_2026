import assert from "node:assert/strict";
import test from "node:test";
import { blockedFromContentApproval } from "./content-approval.mjs";

const curated = ["/", "/servicos/formatacao", "/problemas/computador-lento"];
const report = (approved, blocked) => JSON.stringify({ approved, blocked });

test("sem relatório: preservar manifesto curado existente (prebuild)", () => {
  assert.deepEqual([...blockedFromContentApproval(null, curated)], []);
});

test("relatório completo: excluir somente URLs bloqueadas", () => {
  const blocked = blockedFromContentApproval(
    report(["/", "/servicos/formatacao"], [{ path: "/problemas/computador-lento", reasons: ["thin"] }]),
    curated,
  );
  assert.deepEqual([...blocked], ["/problemas/computador-lento"]);
});

test("relatório completo sem bloqueios não remove URLs", () => {
  assert.equal(blockedFromContentApproval(report(curated, []), curated).size, 0);
});

test("relatório inválido nunca libera URLs por engano", () => {
  for (const json of ["{", "{}", "null", report(["/"], []), report(curated, [{ path: "/" }])]) {
    assert.throws(() => blockedFromContentApproval(json, curated), /content-approval\.json/);
  }
});

test("rejeitar caminhos estranhos e decisões duplicadas", () => {
  assert.throws(() => blockedFromContentApproval(report([...curated, "/fora"], []), curated));
  assert.throws(() => blockedFromContentApproval(report([curated[0], curated[0]], [{ path: curated[1] }]), curated));
  assert.throws(() => blockedFromContentApproval(report([curated[0], curated[1]], [{ path: curated[2] }, { path: curated[2] }]), curated));
});
