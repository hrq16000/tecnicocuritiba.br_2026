/**
 * Testes unitários do núcleo IndexNow (node --test).
 * Garantem que o reenvio só acontece quando há mudança e que URL pulada
 * não dispara nenhum fetch/ping.
 */
import { strict as assert } from "node:assert";
import test from "node:test";
import { MOTIVOS, diagnosticar, planejar, postComRetry, seoHash } from "./indexnow-core.mjs";

const html = (titulo, corpo = "conteudo") =>
  `<html><head><title>${titulo}</title></head><body><main><h1>${titulo}</h1><p>${corpo}</p></main></body></html>`;

const mapa = (obj) => new Map(Object.entries(obj));

test("pula URL cujo lastmod não mudou desde a última submissão", () => {
  const { fila, puladas } = planejar({
    paths: ["/a"],
    lastmodPorPath: mapa({ "/a": "2026-08-01" }),
    manifest: { "/a": { hash: "x", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 } },
  });
  assert.equal(fila.length, 0);
  assert.deepEqual(puladas.map((p) => [p.path, p.motivo]), [["/a", MOTIVOS.LASTMOD_INALTERADO]]);
});

test("enfileira quando lastmod muda, quando é nova e quando nunca foi submetida", () => {
  const { fila, puladas } = planejar({
    paths: ["/a", "/b", "/c"],
    lastmodPorPath: mapa({ "/a": "2026-08-02", "/b": "2026-08-01", "/c": "2026-08-01" }),
    manifest: {
      "/a": { hash: "x", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 },
      "/c": { hash: "x", lastmod: "2026-08-01", lastSubmitted: null, submissions: 0 },
    },
  });
  assert.equal(puladas.length, 0);
  assert.deepEqual(
    fila.map((f) => [f.path, f.motivo]),
    [
      ["/a", MOTIVOS.LASTMOD_MUDOU],
      ["/b", MOTIVOS.NOVA],
      ["/c", MOTIVOS.NUNCA_SUBMETIDA],
    ],
  );
});

test("--all e --recheck ignoram o atalho de lastmod", () => {
  const entrada = {
    paths: ["/a"],
    lastmodPorPath: mapa({ "/a": "2026-08-01" }),
    manifest: { "/a": { hash: "x", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 } },
  };
  assert.equal(planejar({ ...entrada, forceAll: true }).fila[0].motivo, MOTIVOS.FORCE_ALL);
  assert.equal(planejar({ ...entrada, recheck: true }).fila[0].motivo, MOTIVOS.RECHECK);
});

test("URLs puladas não disparam fetch algum", async () => {
  const chamadas = [];
  const fetchSpy = async (url) => {
    chamadas.push(url);
    return { status: 200, ok: true, text: async () => html("A") };
  };
  const { fila, puladas, atualizado } = planejar({
    paths: ["/a", "/b"],
    lastmodPorPath: mapa({ "/a": "2026-08-01", "/b": "2026-08-05" }),
    manifest: {
      "/a": { hash: "x", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 },
      "/b": { hash: "x", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 },
    },
  });
  await diagnosticar({ fila, manifest: {}, base: "https://exemplo.test", fetchImpl: fetchSpy, atualizado, concurrency: 2 });
  assert.deepEqual(chamadas, ["https://exemplo.test/b"]);
  assert.equal(puladas[0].path, "/a");
});

test("conteúdo idêntico não vira candidato a ping", async () => {
  const corpo = html("Página A");
  const fetchImpl = async () => ({ status: 200, ok: true, text: async () => corpo });
  const manifest = { "/a": { hash: seoHash(corpo), lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 } };
  const { novas, mudadas, iguais } = await diagnosticar({
    fila: [{ path: "/a", lastmod: "2026-08-09", motivo: MOTIVOS.LASTMOD_MUDOU }],
    manifest,
    base: "https://exemplo.test",
    fetchImpl,
  });
  assert.deepEqual([novas.length, mudadas.length, iguais.length], [0, 0, 1]);
});

test("conteúdo diferente é marcado como alterado", async () => {
  const fetchImpl = async () => ({ status: 200, ok: true, text: async () => html("Novo título") });
  const manifest = { "/a": { hash: "hash-antigo", lastmod: "2026-08-01", lastSubmitted: "2026-08-01T00:00:00Z", submissions: 1 } };
  const { mudadas } = await diagnosticar({
    fila: [{ path: "/a", lastmod: "2026-08-09", motivo: MOTIVOS.LASTMOD_MUDOU }],
    manifest,
    base: "https://exemplo.test",
    fetchImpl,
  });
  assert.equal(mudadas.length, 1);
  assert.equal(mudadas[0].motivo, MOTIVOS.LASTMOD_MUDOU);
});

test("páginas noindex e não-200 são ignoradas, não submetidas", async () => {
  const respostas = {
    "/noindex": { status: 200, ok: true, text: async () => `<html><head><meta name="robots" content="noindex"></head><main>x</main></html>` },
    "/erro": { status: 500, ok: false, text: async () => "" },
  };
  const { falhas, novas } = await diagnosticar({
    fila: [
      { path: "/noindex", lastmod: null, motivo: MOTIVOS.NOVA },
      { path: "/erro", lastmod: null, motivo: MOTIVOS.NOVA },
    ],
    base: "",
    fetchImpl: async (url) => respostas[url],
    concurrency: 1,
  });
  assert.equal(novas.length, 0);
  assert.equal(falhas.length, 2);
});

test("postComRetry aplica backoff exponencial e conclui após 5xx transitório", async () => {
  const esperas = [];
  let n = 0;
  const resultado = await postComRetry({
    endpoint: "https://api.test",
    payload: {},
    fetchImpl: async () => {
      n++;
      return n < 3 ? { ok: false, status: 503, text: async () => "indisponível" } : { ok: true, status: 200 };
    },
    baseDelayMs: 100,
    sleep: async (ms) => esperas.push(ms),
  });
  assert.deepEqual(esperas, [100, 200]);
  assert.deepEqual([resultado.ok, resultado.tentativas], [true, 3]);
});

test("postComRetry retenta erro de rede e reporta falha explícita ao esgotar", async () => {
  const esperas = [];
  const resultado = await postComRetry({
    endpoint: "https://api.test",
    payload: {},
    fetchImpl: async () => {
      throw new Error("ECONNRESET");
    },
    tentativas: 3,
    baseDelayMs: 50,
    sleep: async (ms) => esperas.push(ms),
  });
  assert.deepEqual(esperas, [50, 100]);
  assert.equal(resultado.ok, false);
  assert.match(resultado.erro, /ECONNRESET/);
});

test("postComRetry não retenta erro definitivo 4xx", async () => {
  let chamadas = 0;
  const resultado = await postComRetry({
    endpoint: "https://api.test",
    payload: {},
    fetchImpl: async () => {
      chamadas++;
      return { ok: false, status: 403, text: async () => "chave inválida" };
    },
    sleep: async () => {},
  });
  assert.equal(chamadas, 1);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.status, 403);
});
