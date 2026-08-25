import { strict as assert } from "node:assert";
import { test } from "node:test";
import { decidirMarco, quickWinsElegiveis, LIMITE_QUICK_WINS } from "./marco-decisao.mjs";
import { CENARIOS } from "../fixtures/marco-cenarios.mjs";
import { reconciliarFunil, assinarMarco, verificarMarco, janelasSearchPerformance } from "./marco-integridade.mjs";

for (const c of CENARIOS) {
  test(`fixture ${c.id} — ${c.titulo} ⇒ decisão ${c.esperado}`, () => {
    const r = decidirMarco(c);
    assert.equal(r.decisao, c.esperado, `${c.id}: ${r.decisao} (${r.justificativa})`);
  });
}

test("decisão D carrega severidade crítica e alerta", () => {
  const r = decidirMarco(CENARIOS.find((c) => c.id === "D"));
  assert.equal(r.severidade, "critica");
  assert.equal(r.alerta, true);
});

test("decisão A não gera alerta", () => {
  const r = decidirMarco(CENARIOS.find((c) => c.id === "A"));
  assert.equal(r.alerta, false);
});

test("quick wins respeitam o teto de governança", () => {
  const urls = Array.from({ length: 12 }, (_, i) => ({
    path: `/x-${i}`, estado: "indexed", impressions: 100 - i, clicks: 0, position: 8,
  }));
  assert.equal(quickWinsElegiveis(urls).length, LIMITE_QUICK_WINS);
});

test("classificador é idempotente para a mesma entrada", () => {
  const c = CENARIOS.find((x) => x.id === "C");
  assert.deepEqual(decidirMarco(c), decidirMarco(c));
});

test("reconciliação do funil reprova contagem que não fecha", () => {
  assert.equal(reconciliarFunil({ indexed: 26, unknown: 56, discovered: 48 }, 130).ok, true);
  assert.equal(reconciliarFunil({ indexed: 22, unknown: 56, discovered: 40 }, 130).ok, false);
});

test("assinatura é determinística e detecta adulteração", () => {
  const base = CENARIOS[0].atual;
  const a = assinarMarco(base, { agora: new Date("2026-08-25T03:00:00Z") });
  const b = assinarMarco(base, { agora: new Date("2026-08-26T03:00:00Z") });
  assert.equal(a.integridade.hash, b.integridade.hash);
  assert.equal(verificarMarco(a).ok, true);
  const adulterado = { ...a, google: { ...a.google, indexed: 99 } };
  assert.equal(verificarMarco(adulterado).ok, false);
});

test("janelas de 28d explicitam overlap entre marcos", () => {
  const j = janelasSearchPerformance(
    { marco: "D7", registradoEm: "2026-08-18T03:00:00Z" },
    { marco: "D14", registradoEm: "2026-08-25T03:00:00Z" },
  );
  assert.equal(j.overlapDias, 21);
  assert.equal(j.naoSobreposto.dias, 7);
});
