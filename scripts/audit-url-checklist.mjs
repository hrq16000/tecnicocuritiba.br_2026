#!/usr/bin/env node
/**
 * AUDITORIA AUTOMÁTICA POR URL (checklist pré-aprovação de onda).
 *
 * Consolida, para cada URL curada / declarada em onda, quatro critérios
 * objetivos exigidos antes de qualquer liberação de índice:
 *
 *   1. CORPO       — mínimo de MIN_PALAVRAS palavras de texto próprio;
 *   2. IMAGENS     — provas visuais reais aprovadas (reports/real-images.json);
 *   3. EXCLUSIVIDADE — mínimo de MIN_SECOES <h2> e conjunto de seções que não
 *                      se repete integralmente em outra URL auditada;
 *   4. LINKS       — mínimo de MIN_LINKS links internos para URLs curadas
 *                    distintas da própria página.
 *
 * Saída: public/url-audit.json (lido pelo painel /admin/publicacao)
 *
 * Uso:
 *   node scripts/audit-url-checklist.mjs dist            # relatório
 *   node scripts/audit-url-checklist.mjs dist --gate     # falha se houver
 *                                                        # URL no sitemap reprovada
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { WAVES } from "./lib/content-waves.mjs";

const args = process.argv.slice(2);
const GATE = args.includes("--gate");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");

export const MIN_PALAVRAS = 800;
export const MIN_SECOES = 4;
export const MIN_LINKS = 5;
export const MIN_FOTOS = 2;

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const realImages = readJson("reports/real-images.json");
const originality = readJson("reports/originality.json");

const fotosPorPath = new Map((realImages?.pages ?? []).map((p) => [p.path, p]));
const origPorPath = new Map((originality?.pages ?? []).map((p) => [p.path, p]));

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);
const alvos = [...new Set([...curated, ...WAVES.flatMap((w) => w.paths)])].sort();

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

const semTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const secoesDe = (html) =>
  [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((m) => semTags(m[1]).toLowerCase())
    .filter(Boolean);

const linksDe = (html, self) =>
  [
    ...new Set(
      [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/gi)]
        .map((m) => m[1].replace(/\/$/, "") || "/")
        .filter((href) => href !== self && curatedSet.has(href)),
    ),
  ];

const assinaturas = new Map();
const paginas = [];

for (const p of alvos) {
  const html = readHtml(p);
  const fotos = fotosPorPath.get(p);
  const orig = origPorPath.get(p);

  const palavras = html ? semTags(html).split(" ").filter(Boolean).length : (orig?.words ?? 0);
  const secoes = html ? secoesDe(html) : [];
  const links = html ? linksDe(html, p.replace(/\/$/, "")) : [];
  const provas = fotos?.provas?.length ?? null;

  const assinatura = secoes.slice().sort().join("|");
  if (assinatura) assinaturas.set(assinatura, [...(assinaturas.get(assinatura) ?? []), p]);

  paginas.push({
    path: p,
    renderizou: Boolean(html),
    noSitemap: curatedSet.has(p),
    palavras,
    secoes: secoes.length,
    secoesAssinatura: assinatura,
    linksInternos: links.length,
    linksExemplo: links.slice(0, 5),
    fotos: provas,
    fotosProblemas: fotos?.problems ?? [],
  });
}

const itens = paginas.map((p) => {
  const duplicadas = (assinaturas.get(p.secoesAssinatura) ?? []).filter((x) => x !== p.path);
  const checklist = [
    {
      id: "corpo",
      label: `Corpo com ${MIN_PALAVRAS}+ palavras`,
      ok: p.palavras >= MIN_PALAVRAS,
      detalhe: `${p.palavras} palavras`,
    },
    {
      id: "imagens",
      label: `${MIN_FOTOS}+ fotos reais aprovadas`,
      ok: p.fotos == null ? null : p.fotos >= MIN_FOTOS && p.fotosProblemas.length === 0,
      detalhe: p.fotos == null ? "não avaliada pelo gate de prova visual" : `${p.fotos} foto(s)`,
    },
    {
      id: "secoes",
      label: `${MIN_SECOES}+ seções exclusivas`,
      ok: p.secoes >= MIN_SECOES && duplicadas.length === 0,
      detalhe: duplicadas.length
        ? `mesmo conjunto de seções de ${duplicadas.slice(0, 3).join(", ")}`
        : `${p.secoes} seção(ões)`,
    },
    {
      id: "links",
      label: `${MIN_LINKS}+ links internos curados`,
      ok: p.linksInternos >= MIN_LINKS,
      detalhe: `${p.linksInternos} link(s): ${p.linksExemplo.join(", ") || "—"}`,
    },
  ];
  const reprovados = checklist.filter((c) => c.ok === false).map((c) => c.label);
  const pendentes = checklist.filter((c) => c.ok === null).map((c) => c.label);
  return {
    ...p,
    checklist,
    reprovados,
    pendentes,
    aprovada: reprovados.length === 0 && pendentes.length === 0,
  };
});

mkdirSync("public", { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  regras: { MIN_PALAVRAS, MIN_SECOES, MIN_LINKS, MIN_FOTOS },
  totals: {
    auditadas: itens.length,
    aprovadas: itens.filter((i) => i.aprovada).length,
    reprovadas: itens.filter((i) => i.reprovados.length).length,
    pendentes: itens.filter((i) => !i.reprovados.length && i.pendentes.length).length,
    naoRenderizadas: itens.filter((i) => !i.renderizou).length,
  },
  urls: itens,
};
writeFileSync("public/url-audit.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `auditoria por URL: ${payload.totals.aprovadas}/${payload.totals.auditadas} aprovadas ` +
    `(${payload.totals.reprovadas} reprovadas, ${payload.totals.pendentes} pendentes) → public/url-audit.json`,
);

if (GATE) {
  const falhas = itens.filter((i) => i.noSitemap && i.reprovados.length);
  if (falhas.length) {
    console.error(
      `BLOQUEADO: ${falhas.length} URL(s) já no sitemap reprovadas na auditoria:\n` +
        falhas.slice(0, 20).map((f) => ` - ${f.path}: ${f.reprovados.join("; ")}`).join("\n"),
    );
    process.exit(1);
  }
  console.log("gate de auditoria por URL: todas as URLs do sitemap aprovadas.");
}
