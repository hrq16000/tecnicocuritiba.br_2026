#!/usr/bin/env node
/**
 * GATE DE REUSO DE CONTEÚDO (hash por imagem e por bloco de texto).
 *
 * Percorre o DOM renderizado de todas as URLs curadas e calcula:
 *   - hash de cada imagem (arquivo de origem, sem querystring/variação de CDN);
 *   - hash de cada bloco de texto próprio (parágrafos e itens de lista com
 *     MIN_CHARS+ caracteres, normalizados).
 *
 * Qualquer hash que apareça em mais de uma URL é reuso — o objetivo é impedir
 * que uma foto ou um trecho de texto seja reaproveitado em outra página antes
 * da liberação de índice.
 *
 * Saída: public/content-hashes.json (consumido pelo painel /admin/publicacao).
 *
 * Uso:
 *   node scripts/check-content-hashes.mjs dist            # relatório
 *   node scripts/check-content-hashes.mjs dist --gate     # falha se houver reuso
 *                                                         # em URL já no sitemap
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { classificarEstatico } from "./lib/static-heuristics.mjs";

const args = process.argv.slice(2);
const GATE = args.includes("--gate");
const STATIC_MODE = args.includes("--static");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");

const MIN_CHARS = 120;
/** Imagens estruturais que legitimamente se repetem (logo, selos, OG). */
const IMAGENS_GLOBAIS = /(logo|favicon|og-image|placeholder|selo|icone|icon)/i;
/** Blocos institucionais que se repetem por obrigação legal/comercial. */
const TEXTO_GLOBAL =
  /(termos e condi|política de privacidade|cnpj|todos os direitos reservados|coleta e entrega em curitiba e região metropolitana\.$)/i;

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const curatedSet = new Set(curated);

const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 12);
const normTexto = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const normImagem = (src) => {
  try {
    const u = new URL(src, "https://x.invalid");
    return u.pathname.replace(/-\d+w(?=\.[a-z]+$)/i, "").toLowerCase();
  } catch {
    return src.toLowerCase();
  }
};

const extractor = () => {
  const root = document.querySelector("main") ?? document.body;
  const imgs = [...root.querySelectorAll("img")]
    .map((i) => i.currentSrc || i.getAttribute("src") || "")
    .filter(Boolean);
  const blocos = [...root.querySelectorAll("p, li, h2, h3, blockquote")]
    .map((n) => (n.textContent || "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return { imgs, blocos };
};

/** confiança da leitura por rota: "renderizado" | "estatico-confiavel" | "shell" | "ausente" */
const confiancaPorPath = new Map();

function lerEstatico(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (!existsSync(file)) {
    confiancaPorPath.set(routePath, { confianca: "ausente", motivo: "HTML não encontrado no dist" });
    return null;
  }
  const html = readFileSync(file, "utf8");
  const cls = classificarEstatico(html);
  confiancaPorPath.set(routePath, { confianca: cls.confianca, motivo: cls.motivo });
  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]);
  const blocos = [...html.matchAll(/<(p|li|h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) =>
    m[2].replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim(),
  );
  return { imgs, blocos };
}

const dados = new Map();
if (STATIC_MODE) {
  for (const p of curated) dados.set(p, lerEstatico(p));
} else {
  const { withRenderedPages } = await import("./lib/rendered-dom.mjs");
  try {
    const { results } = await withRenderedPages({
      dist: DIST,
      paths: curated,
      port: Number(process.env.HASH_AUDIT_PORT || 4193),
      extractor,
    });
    for (const p of curated) {
      if (results.has(p)) {
        dados.set(p, results.get(p));
        confiancaPorPath.set(p, { confianca: "renderizado", motivo: "DOM renderizado no Chromium" });
      } else {
        dados.set(p, lerEstatico(p));
      }
    }
  } catch (err) {
    console.warn(`AVISO: checagem por hash caiu para o modo estático — ${err.message}`);
    for (const p of curated) dados.set(p, lerEstatico(p));
  }
}

/** hash -> { tipo, amostra, paths:Set } */
const registro = new Map();
const porPagina = new Map();

for (const p of curated) {
  const d = dados.get(p);
  if (!d) continue;
  porPagina.set(p, { imagens: [], textos: [] });
  for (const src of new Set(d.imgs.map(normImagem))) {
    if (IMAGENS_GLOBAIS.test(src)) continue;
    const h = `img:${hash(src)}`;
    const r = registro.get(h) ?? { tipo: "imagem", amostra: src, paths: new Set() };
    r.paths.add(p);
    registro.set(h, r);
    porPagina.get(p).imagens.push(h);
  }
  for (const bloco of new Set(d.blocos)) {
    const norm = normTexto(bloco);
    if (norm.length < MIN_CHARS) continue;
    if (TEXTO_GLOBAL.test(bloco.toLowerCase())) continue;
    const h = `txt:${hash(norm)}`;
    const r = registro.get(h) ?? { tipo: "texto", amostra: bloco.slice(0, 220), paths: new Set() };
    r.paths.add(p);
    registro.set(h, r);
    porPagina.get(p).textos.push(h);
  }
}

const duplicados = [...registro.entries()]
  .filter(([, r]) => r.paths.size > 1)
  .map(([h, r]) => ({ hash: h, tipo: r.tipo, amostra: r.amostra, paths: [...r.paths].sort() }))
  .sort((a, b) => b.paths.length - a.paths.length);

const porUrl = curated.map((p) => {
  const meus = duplicados.filter((d) => d.paths.includes(p));
  const conf = confiancaPorPath.get(p)?.confianca ?? "ausente";
  const conclusiva = conf === "renderizado" || conf === "estatico-confiavel";
  const reuso = meus.length;
  return {
    path: p,
    noSitemap: curatedSet.has(p),
    avaliada: porPagina.has(p),
    confianca: conf,
    confiancaMotivo: confiancaPorPath.get(p)?.motivo ?? null,
    conclusiva,
    status: !conclusiva ? "pendente" : reuso ? "reprovada" : "aprovada",
    evidencias: meus.slice(0, 6).map((d) => ({
      tipo: d.tipo,
      hash: d.hash,
      amostra: d.amostra,
      tambemEm: d.paths.filter((x) => x !== p),
    })),
    comoResolver: meus.slice(0, 6).map((d) =>
      d.tipo === "imagem"
        ? `Trocar a imagem ${d.amostra} nesta página por uma foto real exclusiva (ou movê-la para só uma das URLs: ${d.paths.join(", ")}).`
        : `Reescrever o bloco "${d.amostra.slice(0, 70)}…" com texto próprio desta URL — hoje é idêntico ao de ${d.paths.filter((x) => x !== p).join(", ")}.`,
    ),
    imagensReutilizadas: meus.filter((d) => d.tipo === "imagem").length,
    textosReutilizados: meus.filter((d) => d.tipo === "texto").length,
    ocorrencias: meus.slice(0, 12).map((d) => ({
      tipo: d.tipo,
      amostra: d.amostra,
      tambemEm: d.paths.filter((x) => x !== p).slice(0, 5),
    })),
  };
});

mkdirSync("public", { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  regras: { MIN_CHARS, modo: STATIC_MODE ? "estatico-heuristico" : "renderizado" },
  totals: {
    urls: curated.length,
    avaliadas: porPagina.size,
    hashesUnicos: registro.size,
    duplicados: duplicados.length,
    urlsComReuso: porUrl.filter((u) => u.imagensReutilizadas + u.textosReutilizados > 0).length,
    conclusivas: porUrl.filter((u) => u.conclusiva).length,
    pendentes: porUrl.filter((u) => !u.conclusiva).length,
  },
  duplicados: duplicados.slice(0, 300),
  urls: porUrl,
};
writeFileSync("public/content-hashes.json", `${JSON.stringify(payload, null, 2)}\n`);

console.log(
  `check-content-hashes: ${payload.totals.avaliadas}/${payload.totals.urls} URLs — ` +
    `${payload.totals.duplicados} hash(es) reutilizado(s) em ${payload.totals.urlsComReuso} URL(s) → public/content-hashes.json`,
);

if (GATE) {
  // Modo heurístico: em --static só reprovamos URLs cujo HTML estático já traz
  // corpo real. Shell-only vira PENDENTE (não aprovada, não bloqueia o build).
  const avaliaveis = porUrl.filter((u) => u.noSitemap && u.conclusiva);
  const pendentes = porUrl.filter((u) => u.noSitemap && !u.conclusiva);
  const falhas = avaliaveis.filter((u) => u.imagensReutilizadas + u.textosReutilizados > 0);
  if (falhas.length) {
    console.error(`BLOQUEADO: ${falhas.length} URL(s) indexáveis com conteúdo reutilizado:`);
    for (const f of falhas.slice(0, 20)) {
      console.error(
        `  - ${f.path}: ${f.imagensReutilizadas} imagem(ns), ${f.textosReutilizados} bloco(s)\n` +
          `      evidência: ${f.evidencias[0]?.amostra?.slice(0, 90) ?? ""} (também em ${f.evidencias[0]?.tambemEm?.join(", ")})\n` +
          `      como passar: ${f.comoResolver[0] ?? ""}`,
      );
    }
    process.exit(1);
  }
  if (pendentes.length) {
    console.warn(
      `AVISO: ${pendentes.length} URL(s) ficaram PENDENTES (HTML sem corpo conclusivo). ` +
        'Rode com DOM renderizado ("npx playwright install --with-deps chromium") antes de liberar o índice.',
    );
  }
  console.log(
    `gate de hash: ${avaliaveis.length - falhas.length} URL(s) conclusivas sem reuso, ${pendentes.length} pendente(s).`,
  );
}
