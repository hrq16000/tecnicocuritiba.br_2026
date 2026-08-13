/**
 * WORKER DE BORDA — tecnico-curitiba-route-guard
 *
 * Zona: tecnico.curitiba.br (subzona própria). Não publica enquanto a origem
 * for o placeholder LOVABLE_ORIGIN_NOT_CONFIGURED.
 *
 * Responsabilidades (ordem em scripts/lib/edge-router.mjs):
 *   1. host permitido        → demais hosts recusados
 *   2. alias conhecido       → 301 de salto único, query preservada
 *   3. asset emitido no build→ passa; asset inexistente → 404 (nunca HTML da home)
 *   4. rota válida           → proxy para a origem Lovable (método/headers/body)
 *   5. rota inexistente      → 404 real no edge, sem consultar a origem
 */
import manifest from "../dist/route-manifest.json";
import notFoundHtml from "../dist/404.html";
import { compileManifest, decide, assertManifestSane, ORIGIN_PLACEHOLDER, HEALTH_PATH, healthPayload } from "../scripts/lib/edge-router.mjs";
import { SECURITY_HEADERS } from "../scripts/lib/security-headers.mjs";

const compiled = compileManifest(manifest);
const manifestProblems = assertManifestSane(compiled);

const NOT_FOUND_HEADERS = {
  "content-type": "text/html; charset=UTF-8",
  "cache-control": "no-store",
  "x-robots-tag": "noindex, nofollow",
};

/**
 * Aplica a política de headers de segurança (fonte única em
 * scripts/lib/security-headers.mjs) sem sobrescrever valores que a origem
 * já tenha definido — a origem continua soberana sobre o que emite.
 * Só HTML recebe a política; assets herdam apenas o que a origem manda.
 */
function withSecurityHeaders(response) {
  const tipo = response.headers.get("content-type") || "";
  if (!tipo.includes("text/html")) return response;
  const out = new Response(response.body, response);
  for (const [nome, valor] of Object.entries(SECURITY_HEADERS)) {
    if (!out.headers.has(nome)) out.headers.set(nome, valor);
  }
  return out;
}

function notFound(method) {
  const body = method === "HEAD" ? null : notFoundHtml;
  return withSecurityHeaders(new Response(body, { status: 404, headers: NOT_FOUND_HEADERS }));
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health-check público e sem segredos: estado do manifesto, versão do
    // build e contagens de rotas/aliases/assets. Responde mesmo em fail-safe.
    if (url.pathname === HEALTH_PATH) {
      return new Response(JSON.stringify(healthPayload(compiled, manifest, manifestProblems), null, 2), {
        status: manifestProblems.length ? 503 : 200,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" },
      });
    }

    if (manifestProblems.length) {
      // Fail-safe: manifesto implausível não pode transformar o site em 404.
      return new Response("edge desabilitado: manifesto inválido", { status: 503 });
    }


    const d = decide({ host: url.hostname, method: request.method, pathname: url.pathname, search: url.search }, compiled);

    if (d.action === "reject") return new Response("host não atendido", { status: 421 });
    if (d.action === "redirect") {
      const location = new URL(d.location, url.origin).toString();
      return new Response(null, {
        status: 301,
        headers: { location, "cache-control": "public, max-age=86400" },
      });
    }
    if (d.action === "notfound") return notFound(request.method);

    // MODELO DE ORIGEM (Rodada 2A.3, Fase 6)
    // Padrão = "dns": a Worker Route roda antes da origem e o registro CNAME
    // proxied da própria zona define para onde a Cloudflare envia o request.
    // fetch(request) preserva host público, método, query, headers, cookies e
    // body — sem hostname inventado, sem risco de recursão/SNI/CORS.
    const mode = env?.ORIGIN_MODE ?? "dns";
    if (mode === "dns") return fetch(request);

    // Modelo alternativo (explícito) — só usar com evidência de que o DNS não serve.
    const origin = env?.LOVABLE_ORIGIN ?? ORIGIN_PLACEHOLDER;
    if (origin === ORIGIN_PLACEHOLDER) {
      return new Response("origem não configurada", { status: 503 });
    }
    const target = new URL(url.pathname + url.search, `https://${origin}`);
    const proxied = new Request(target.toString(), request);
    proxied.headers.set("host", origin);
    proxied.headers.set("x-forwarded-host", url.hostname);
    return fetch(proxied);
  },
};
