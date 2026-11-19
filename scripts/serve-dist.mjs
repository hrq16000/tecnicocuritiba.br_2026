// Servidor estático de paridade com produção.
//
// Reproduz localmente a ordem de resolução declarada em dist/_redirects:
//   1. arquivo real no disco            → 200
//   2. alias da matriz de redirects     → 301 (salto único)
//   3. rota válida do manifesto         → 200 (shell SPA)
//   4. qualquer outra coisa             → 404 (dist/404.html)
//
// Uso: node scripts/serve-dist.mjs [porta] [distDir]

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolvePath } from "./lib/route-manifest.mjs";
import { HEALTH_PATH, healthPayload, compileManifest, assertManifestSane } from "./lib/edge-router.mjs";

const PORT = Number(process.argv[2] || process.env.PORT || 4180);
const DIST = path.resolve(process.argv[3] || "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function readIfFile(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return null;
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

export async function createServer({ distDir = DIST } = {}) {
  const manifest = JSON.parse(await fs.readFile(path.join(distDir, "route-manifest.json"), "utf8"));
  const html404 = await fs.readFile(path.join(distDir, "404.html"));

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const send = (status, body, type = "text/html; charset=utf-8", headers = {}) => {
      res.writeHead(status, { "Content-Type": type, ...headers });
      res.end(req.method === "HEAD" ? undefined : body);
    };

    // 0. Health-check de paridade com o Worker.
    if (pathname === HEALTH_PATH) {
      const compiled = compileManifest(manifest);
      const problems = assertManifestSane(compiled);
      return send(
        problems.length ? 503 : 200,
        JSON.stringify(healthPayload(compiled, manifest, problems), null, 2),
        "application/json; charset=utf-8",
        { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
      );
    }

    // 1. Aliases da matriz têm precedência sobre arquivos (equivalente ao `301!`).
    const alias = resolvePath(manifest, pathname);
    if (alias.kind === "redirect") {
      return send(301, "", "text/html; charset=utf-8", { Location: alias.location + (url.search || "") });
    }


    // 2. Arquivo real (assets, sitemaps, robots, páginas pré-renderizadas).
    const candidates = [path.join(distDir, pathname), path.join(distDir, pathname, "index.html")];
    for (const candidate of candidates) {
      if (!candidate.startsWith(distDir)) break;
      const file = await readIfFile(candidate);
      if (file) return send(200, file, MIME[path.extname(candidate)] || "application/octet-stream");
    }

    // Caminho com extensão que não existe: nunca cai no SPA.
    if (path.extname(pathname)) return send(404, html404);

    // 3/4. Manifesto decide.
    const resolved = alias;
    if (resolved.kind === "spa") {
      const shell = await readIfFile(path.join(distDir, "index.html"));
      return send(200, shell || html404);
    }
    return send(404, html404);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = await createServer();
  server.listen(PORT, () => console.log(`[serve-dist] http://localhost:${PORT} (dist: ${DIST})`));
}
