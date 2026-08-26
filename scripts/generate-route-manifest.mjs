// Pós-build: gera o manifesto de rotas, o arquivo de redirects do host e a
// página 404 estática. Executado automaticamente no `postbuild`.
//
// Saídas:
//   dist/route-manifest.json  → contrato único consumido por servidor/gates/testes
//   dist/_redirects           → aliases 301 + rotas válidas 200 + catch-all 404
//   dist/404.html             → resposta 404 sem conteúdo, canonical ou schema da home

import { promises as fs } from "node:fs";
import path from "node:path";
import { buildRouteManifest } from "./lib/route-manifest.mjs";
import { injectRootBody } from "./prerender-cities.mjs";

const DIST = path.resolve(process.argv[2] || "dist");

const TITLE_404 = "Página não encontrada | Técnico Curitiba";
const DESC_404 =
  "A página que você tentou acessar não existe ou foi movida. Veja os serviços disponíveis ou volte para a página inicial.";

const BODY_404 = `
  <main style="min-height:100vh;box-sizing:border-box;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 88% 8%,rgba(45,181,218,.24),transparent 32%),linear-gradient(145deg,#082534 0%,#0d3b4d 55%,#092c3c 100%);color:#f8fcff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
    <section aria-labelledby="not-found-title" style="box-sizing:border-box;width:min(100%,760px);padding:clamp(28px,6vw,56px);border:1px solid rgba(255,255,255,.18);border-radius:24px;background:rgba(5,28,40,.64);box-shadow:0 26px 70px rgba(0,0,0,.28);backdrop-filter:blur(10px)">
      <a href="/" style="display:inline-flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:800;letter-spacing:-.02em"><span aria-hidden="true" style="display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:#26b9dc;color:#073143">TC</span>Técnico em Curitiba</a>
      <p style="margin:38px 0 10px;color:#8ce6ff;font-size:.82rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Erro 404</p>
      <h1 id="not-found-title" style="max-width:560px;margin:0;font-size:clamp(2rem,6vw,3.8rem);line-height:1.04;letter-spacing:-.045em">Esta página não está mais neste endereço.</h1>
      <p style="max-width:610px;margin:22px 0 0;color:rgba(248,252,255,.82);font-size:1.06rem;line-height:1.7">O conteúdo pode ter sido movido, atualizado ou digitado com outro endereço. Escolha um caminho abaixo para continuar no site.</p>
      <nav aria-label="Caminhos para continuar" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:30px">
        <a href="/" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 19px;border-radius:12px;background:#26b9dc;color:#073143;font-weight:800;text-decoration:none">Ir para o início</a>
        <a href="/servicos" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 19px;border:1px solid rgba(255,255,255,.28);border-radius:12px;color:#fff;font-weight:700;text-decoration:none">Ver serviços</a>
        <a href="/tecnico-informatica-curitiba" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 19px;border:1px solid rgba(255,255,255,.28);border-radius:12px;color:#fff;font-weight:700;text-decoration:none">Técnico em Curitiba</a>
      </nav>
      <div style="margin-top:32px;padding-top:22px;border-top:1px solid rgba(255,255,255,.16);color:rgba(248,252,255,.7);font-size:.92rem;line-height:1.6">Procurava um artigo técnico? Veja o <a href="/blog" style="color:#8ce6ff;font-weight:700">blog</a> ou use a lista de serviços para encontrar a solução adequada.</div>
    </section>
  </main>`;

/** Remove canonical, hreflang, JSON-LD e metadados comerciais herdados da home. */
function build404Html(baseHtml) {
  let html = baseHtml;
  html = html.replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, "");
  html = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*hreflang[^>]*>/gi, "");
  html = html.replace(/\s*<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/\s*<meta\s+name=["']robots["'][^>]*>/gi, "");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${TITLE_404}</title>`);
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${DESC_404}">`,
  );
  for (const [prop, value] of [
    ["og:title", TITLE_404],
    ["twitter:title", TITLE_404],
    ["og:description", DESC_404],
    ["twitter:description", DESC_404],
  ]) {
    const attr = prop.startsWith("og:") ? "property" : "name";
    const re = new RegExp(`<meta\\s+${attr}=["']${prop}["'][^>]*>`, "gi");
    html = html.replace(re, `<meta ${attr}="${prop}" content="${value}">`);
  }
  html = html.replace(
    /<\/head>/i,
    `    <meta name="robots" content="noindex, nofollow">\n  </head>`,
  );
  // Corpo estático real dentro do #root (sem depender de JavaScript):
  // sem oferta, preço, CTA de WhatsApp ou schema da home.
  html = injectRootBody(html, BODY_404.trim());
  return html;
}

function buildRedirectsFile(manifest) {
  const lines = [
    "# GERADO AUTOMATICAMENTE por scripts/generate-route-manifest.mjs — não editar à mão.",
    "# Ordem: aliases 301 → rotas válidas 200 (SPA) → catch-all 404.",
    "",
    "# ── B. Aliases legítimos (301, salto único) ──",
  ];
  for (const r of manifest.redirects) lines.push(`${r.from}    ${r.to}    301!`);
  lines.push("", "# ── A/C. Rotas públicas válidas e administrativas (SPA fallback 200) ──");
  for (const p of manifest.validExact) lines.push(`${p}    /index.html    200`);
  for (const p of manifest.validPatterns) lines.push(`${p}    /index.html    200`);
  lines.push("", "# ── D. Qualquer outra URL: 404 real ──", "/*    /404.html    404", "");
  return lines.join("\n");
}

async function main() {
  const manifest = await buildRouteManifest({ distDir: DIST });

  await fs.writeFile(path.join(DIST, "route-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(path.join(DIST, "_redirects"), buildRedirectsFile(manifest));

  const baseHtml = await fs.readFile(path.join(DIST, "index.html"), "utf8");
  await fs.writeFile(path.join(DIST, "404.html"), build404Html(baseHtml));

  console.log(
    `[route-manifest] ${manifest.counts.validExact} rotas exatas, ${manifest.counts.validPatterns} padrões, ` +
      `${manifest.counts.redirects} redirects, ${manifest.counts.prerendered} páginas estáticas.`,
  );
  console.log("[route-manifest] dist/route-manifest.json, dist/_redirects e dist/404.html emitidos.");
}

main().catch((err) => {
  console.error("[route-manifest] falhou:", err);
  process.exit(1);
});
