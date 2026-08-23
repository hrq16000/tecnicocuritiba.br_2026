import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/** Domínio canônico público (sem www, sempre https). */
const CANONICAL_HOST = "tecnico.curitiba.br";

/**
 * Canonicalização de host, protocolo e caminho em UM único salto 301.
 *   http://…            → https://tecnico.curitiba.br/…
 *   www.tecnico…        → tecnico.curitiba.br
 *   /Servicos, /servicos/, //servicos, /index.html → /servicos, /
 * Nunca atua em previews (*.lovable.app) nem em localhost.
 */
function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const isCanonicalFamily = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;
  if (!isCanonicalFamily) return null;

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");

  let path = url.pathname.replace(/\/{2,}/g, "/");
  path = path.replace(/\/index\.html?$/i, "/");
  path = path.toLowerCase();
  path = path.replace(/(.)\/+$/, "$1");
  if (path === "/index") path = "/";
  if (path === "") path = "/";

  const needsRedirect = proto !== "https" || host !== CANONICAL_HOST || path !== url.pathname;
  if (!needsRedirect) return null;

  const location = `https://${CANONICAL_HOST}${path}${url.search}`;
  return new Response(null, {
    status: 301,
    headers: { location, "cache-control": "public, max-age=86400" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const canonical = canonicalRedirect(request);
      if (canonical) return canonical;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

