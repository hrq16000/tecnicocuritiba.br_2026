#!/usr/bin/env node
// Preview local do build TanStack/Nitro, incluindo assets e respostas SSR.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip, gzipSync } from "node:zlib";

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".ico": "image/x-icon", ".pdf": "application/pdf", ".woff": "font/woff", ".woff2": "font/woff2",
};

const compressible = (type = "") => /^(text\/|application\/(javascript|json|xml))|image\/svg\+xml/.test(type);
const acceptsGzip = (value = "") => String(value).split(",").some((entry) => {
  const [encoding, ...params] = entry.trim().split(";");
  return encoding === "gzip" && !params.some((p) => /^\s*q\s*=\s*0(?:\.0*)?\s*$/.test(p));
});

export async function createBuiltPreview({ distDir = "dist", handler } = {}) {
  const dist = path.resolve(distDir);
  const client = path.join(dist, "client");
  // Mesma negociação HTTP usada no CDN: o preview deve medir bytes de rede
  // comprimidos, sem trocar o HTML, os assets ou as regras de indexação.
  const compressedAssets = new Map();
  handler ??= (await import(pathToFileURL(path.join(dist, "server/index.mjs")).href)).default;
  if (typeof handler?.fetch !== "function") throw new Error("Build sem handler.fetch; rode npm run build.");

  return http.createServer(async (req, res) => {
    try {
      const forwarded = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
      const protocol = forwarded === "https" ? "https" : "http";
      const url = new URL(req.url || "/", `${protocol}://${req.headers.host || "localhost"}`);
      const pathname = decodeURIComponent(url.pathname);
      const asset = path.resolve(client, "." + pathname);
      const relative = path.relative(client, asset);
      if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) {
        res.writeHead(403).end();
        return;
      }
      if (req.method === "GET" || req.method === "HEAD") {
        // Só arquivos reais. Não usar shell SPA para mascarar 404/redirects SSR.
        for (const file of [asset, path.join(asset, "index.html")]) {
          try {
            const info = await stat(file);
            if (!info.isFile()) continue;
            const contentType = MIME[path.extname(file)] || "application/octet-stream";
            const useGzip = acceptsGzip(req.headers["accept-encoding"]) && compressible(contentType) && info.size >= 1024;
            let body;
            if (useGzip) {
              const key = `${file}:${info.mtimeMs}:${info.size}`;
              body = compressedAssets.get(key);
              if (!body) {
                body = gzipSync(await readFile(file));
                if (compressedAssets.size >= 128) compressedAssets.delete(compressedAssets.keys().next().value);
                compressedAssets.set(key, body);
              }
            } else body = await readFile(file);
            res.writeHead(200, { "Content-Type": contentType, "Content-Length": body.length,
              ...(compressible(contentType) ? { Vary: "Accept-Encoding" } : {}),
              ...(useGzip ? { "Content-Encoding": "gzip" } : {}),
            });
            res.end(req.method === "HEAD" ? undefined : body);
            return;
          } catch (error) {
            if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
          }
        }
      }
      const chunks = [];
      if (req.method !== "GET" && req.method !== "HEAD") for await (const chunk of req) chunks.push(chunk);
      const request = new Request(url, {
        method: req.method, headers: req.headers,
        ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
      });
      const response = await handler.fetch(request, {}, { waitUntil(p) { Promise.resolve(p).catch(() => {}); } });
      res.statusCode = response.status;
      for (const [name, value] of response.headers) if (name !== "set-cookie") res.setHeader(name, value);
      const cookies = response.headers.getSetCookie();
      if (cookies.length) res.setHeader("set-cookie", cookies);
      if (req.method === "HEAD" || !response.body) res.end();
      else if (acceptsGzip(req.headers["accept-encoding"]) && compressible(response.headers.get("content-type")) && !response.headers.has("content-encoding")) {
        res.removeHeader("content-length");
        res.setHeader("Content-Encoding", "gzip");
        const vary = response.headers.get("vary");
        res.setHeader("Vary", vary ? `${vary}, Accept-Encoding` : "Accept-Encoding");
        await pipeline(Readable.fromWeb(response.body), createGzip(), res);
      }
      else await pipeline(Readable.fromWeb(response.body), res);
    } catch (error) {
      console.error("[preview-built]", error.message);
      if (!res.headersSent) res.writeHead(error instanceof URIError ? 400 : 500);
      res.end();
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { values } = parseArgs({
    options: { port: { type: "string", default: "8080" }, host: { type: "string", default: "127.0.0.1" },
      dist: { type: "string", default: "dist" }, strictPort: { type: "boolean" } },
  });
  const port = Number(values.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Porta inválida.");
  const server = await createBuiltPreview({ distDir: values.dist });
  server.listen(port, values.host, () => console.log(`[preview-built] http://${values.host}:${port}`));
}
