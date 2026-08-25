import { strict as assert } from "node:assert";
import { test } from "node:test";
import { avaliarJanela } from "./marco-janela.mjs";

const D0 = "2026-08-11T03:00:00.000Z";
const historico = { marcos: [{ marco: "D0", registradoEm: D0 }] };
const MS_DIA = 86_400_000;
const emD14 = new Date(new Date(D0).getTime() + 14 * MS_DIA);

test("D14 menos 1 segundo é BLOQUEADO", () => {
  const r = avaliarJanela("D14", historico, new Date(emD14.getTime() - 1000));
  assert.equal(r.ok, false);
  assert.equal(r.elegivelEm, emD14.toISOString());
  assert.ok(r.motivo.includes("D14"));
});

test("D14 exato é LIBERADO", () => {
  const r = avaliarJanela("D14", historico, emD14);
  assert.equal(r.ok, true);
  assert.equal(r.faltamDias, 0);
});

test("timezone do processo não antecipa nem atrasa o marco", () => {
  const original = process.env.TZ;
  for (const tz of ["UTC", "America/Sao_Paulo", "Pacific/Kiritimati", "Pacific/Niue", "Europe/Berlin"]) {
    process.env.TZ = tz;
    assert.equal(avaliarJanela("D14", historico, new Date(emD14.getTime() - 1000)).ok, false, `antecipou em ${tz}`);
    assert.equal(avaliarJanela("D14", historico, emD14).ok, true, `atrasou em ${tz}`);
  }
  process.env.TZ = original;
});

test("horário de verão não desloca a janela (intervalo é medido em UTC)", () => {
  // 11/08 → 25/08 atravessa mudanças de DST no hemisfério norte em outros anos;
  // o cálculo em epoch ms ignora o deslocamento por construção.
  const dstD0 = "2026-03-01T12:00:00.000Z";
  const h = { marcos: [{ marco: "D0", registradoEm: dstD0 }] };
  const alvo = new Date(new Date(dstD0).getTime() + 14 * MS_DIA);
  assert.equal(avaliarJanela("D14", h, new Date(alvo.getTime() - 1)).ok, false);
  assert.equal(avaliarJanela("D14", h, alvo).ok, true);
});

test("sem D0 registrado nenhum marco posterior é liberado", () => {
  const r = avaliarJanela("D14", { marcos: [] }, emD14);
  assert.equal(r.ok, false);
  assert.match(r.motivo, /baseline D0/);
});

test("D30 exige 30 dias", () => {
  const alvo = new Date(new Date(D0).getTime() + 30 * MS_DIA);
  assert.equal(avaliarJanela("D30", historico, new Date(alvo.getTime() - 1000)).ok, false);
  assert.equal(avaliarJanela("D30", historico, alvo).ok, true);
});
