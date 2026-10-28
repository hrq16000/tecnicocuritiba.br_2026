import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const gate = fileURLToPath(new URL("./check-analytics-parity.mjs", import.meta.url));
const funnelSource = readFileSync(path.join(ROOT, "src/lib/funnelAnalytics.ts"), "utf8");
const weeklySource = readFileSync(path.join(ROOT, "scripts/report-weekly-seo.mjs"), "utf8");

function run(t, funnel = funnelSource, weekly = weeklySource) {
  const dir = mkdtempSync(path.join(tmpdir(), "analytics-parity-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const f = path.join(dir, "funnel.ts");
  const w = path.join(dir, "weekly.mjs");
  writeFileSync(f, funnel);
  writeFileSync(w, weekly);
  return spawnSync(process.execPath, [gate, f, w], { encoding: "utf8" });
}

test("dispatcher tipado envia eventos verdadeiros a GA4, DB e relatório", (t) => {
  const result = run(t);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /analytics-parity.*OK/);
});

test("não aprova evento quando GA4 deixa de ser chamado", (t) => {
  assert.ok(funnelSource.includes("track(eventName, payload);"));
  const result = run(t, funnelSource.replace("track(eventName, payload);", "void payload;"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GA4 não dispara/);
});

test("não aprova evento quando persistência deixa de ser chamada", (t) => {
  const pattern = /persistClickEvent\(eventName, location, ctx, \{ \.\.\.extra, lead_id: leadId \}\);/;
  assert.match(funnelSource, pattern);
  const result = run(t, funnelSource.replace(pattern, "void ctx;"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /não é persistido/);
});

test("não aprova ligação sem mapeamento correto da exportação", (t) => {
  const before = 'trackConversionClick("phone", "call_click", location, extra)';
  assert.ok(funnelSource.includes(before));
  const result = run(t, funnelSource.replace(before, 'trackConversionClick("phone", "wa_click", location, extra)'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /call_click/);
});

test("não aprova relatório sem evento de conversão", (t) => {
  const result = run(t, funnelSource, weeklySource.replaceAll('"call_click"', '"outro_evento"'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /relatório semanal não contabiliza "call_click"/);
});
