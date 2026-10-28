/** Domínio canônico público (sem www, sempre https). */
const CANONICAL_HOST = "tecnico.curitiba.br";

/**
 * Canonicalização de host, protocolo e caminho em UM único salto 301.
 *   http://…            → https://tecnico.curitiba.br/…
 *   www.tecnico…        → tecnico.curitiba.br
 *   /Servicos, /servicos/, //servicos, /index.html → /servicos, /
 * Nunca atua em previews (*.lovable.app) nem em localhost.
 */
export function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const isCanonicalFamily = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;
  if (!isCanonicalFamily) return null;

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");

  // Endpoints internos do TanStack são sensíveis a caixa e não são URLs de SEO.
  // /_serverFn/ não pode virar /_serverfn/ antes de chegar ao dispatcher.
  const serverFunction = url.pathname === "/_serverFn" || url.pathname.startsWith("/_serverFn/");
  let path = url.pathname;
  if (!serverFunction) {
    path = path.replace(/\/{2,}/g, "/");
    path = path.replace(/\/index\.html?$/i, "/");
    path = path.toLowerCase();
    path = path.replace(/(.)\/+$/, "$1");
    if (path === "/index") path = "/";
    if (path === "") path = "/";
  }

  const needsRedirect = proto !== "https" || host !== CANONICAL_HOST || path !== url.pathname;
  if (!needsRedirect) return null;

  const location = `https://${CANONICAL_HOST}${path}${url.search}`;
  return new Response(null, {
    status: 301,
    headers: { location, "cache-control": "public, max-age=86400" },
  });
}

