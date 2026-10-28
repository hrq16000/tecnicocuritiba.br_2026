import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable, Writable } from "node:stream";

async function request(server, url, options = {}) {
  const req = Readable.from(options.body ? [Buffer.from(options.body)] : []);
  req.url = url; req.method = options.method || "GET"; req.headers = { host: "localhost", ...options.headers };
  const chunks = []; const headers = new Map();
  const res = new Writable({ write(chunk, encoding, callback) { chunks.push(Buffer.from(chunk)); callback(); } });
  res.statusCode = 200;
  res.setHeader = (name, value) => headers.set(name.toLowerCase(), value);
  res.writeHead = (status, values = {}) => { res.statusCode = status; for (const [name, value] of Object.entries(values)) res.setHeader(name, value); return res; };
  await server.listeners("request")[0](req, res);
  return { status: res.statusCode, headers, async text() { return Buffer.concat(chunks).toString(); } };
}
import { createBuiltPreview } from "./preview-built.mjs";

test("preview serve assets e HTML reais; preserva SSR, redirect, 404 e POST", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "built-preview-"));
  let server;
  const requests = [];
  try {
    await mkdir(path.join(dir, "client/contato"), { recursive: true });
    await mkdir(path.join(dir, "client/assets"), { recursive: true });
    await writeFile(path.join(dir, "client/contato/index.html"), "<h1>Contato</h1>");
    await writeFile(path.join(dir, "client/assets/app.js"), "export const ok = true;");
    server = await createBuiltPreview({ distDir: dir, handler: { async fetch(req) {
      const p = new URL(req.url).pathname;
      requests.push(p);
      if (p === "/antigo") return new Response(null, { status: 301, headers: { Location: "/contato" } });
      if (p === "/request-url") return new Response(req.url);
      if (p === "/ssr") return new Response("<h1>SSR</h1>", { headers: { "Content-Type": "text/html" } });
      if (p === "/api/teste") return new Response(await req.text(), { status: 201 });
      return new Response("Não encontrado", { status: 404 });
    } } });
    let r = await request(server, "/contato");
    assert.equal(await r.text(), "<h1>Contato</h1>");
    assert.equal((await request(server, "/assets/app.js")).headers.get("content-type"), "text/javascript; charset=utf-8");
    assert.equal(await (await request(server, "/contato", { method: "HEAD" })).text(), "");
    r = await request(server, "/antigo", { redirect: "manual" });
    assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "/contato");
    assert.equal(await (await request(server, "/ssr")).text(), "<h1>SSR</h1>");
    assert.equal((await request(server, "/nao-existe")).status, 404);
    r = await request(server, "/api/teste", { method: "POST", body: "teste=ok" });
    assert.equal(r.status, 201); assert.equal(await r.text(), "teste=ok");
    r = await request(server, "/request-url?payload=AbC", { headers: { host: "tecnico.curitiba.br", "x-forwarded-proto": "https" } });
    assert.equal(await r.text(), "https://tecnico.curitiba.br/request-url?payload=AbC");
    assert.ok(!requests.includes("/contato"));
    assert.ok(!requests.includes("/assets/app.js"));
  } finally {
    if (server) server.close();
    await rm(dir, { recursive: true, force: true });
  }
});
