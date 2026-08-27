import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

/**
 * RODADA 2 — Varredura E2E de metadados SSR em todas as rotas indexáveis.
 *
 * Lê o HTML servido do build (dist), sem depender de hidratação, e falha
 * quando encontra:
 *   • title / description / og:title / og:description / og:url / canonical
 *     ausentes;
 *   • canonical ou og:url que não auto-referenciam a rota;
 *   • title, description ou canonical duplicados entre duas URLs distintas;
 *   • ausência de JSON-LD no load inicial.
 */

const DIST = path.resolve(process.env.E2E_DIST ?? "dist");
const BASE = "https://tecnico.curitiba.br";
const SKIP = /^\/(admin|lovable|ordem-de-servico|status|funil-indisponivel)(\/|$)/;

interface Meta {
  route: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  canonical: string;
  jsonLd: number;
}

function coletar(): Meta[] {
  const files: string[] = [];
  (function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "index.html") files.push(full);
    }
  })(DIST);

  const pick = (html: string, re: RegExp) => (html.match(re)?.[1] ?? "").replace(/\s+/g, " ").trim();

  return files
    .map((file) => {
      const route =
        ("/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/$/, "") || "/";
      const html = readFileSync(file, "utf8");
      const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
      if (noindex || SKIP.test(route)) return null;
      return {
        route,
        title: pick(html, /<title>([\s\S]*?)<\/title>/i),
        description: pick(html, /<meta name="description" content="([^"]*)"/i),
        ogTitle: pick(html, /<meta property="og:title" content="([^"]*)"/i),
        ogDescription: pick(html, /<meta property="og:description" content="([^"]*)"/i),
        ogUrl: pick(html, /<meta property="og:url" content="([^"]*)"/i),
        canonical: pick(html, /<link rel="canonical" href="([^"]*)"/i),
        jsonLd: [...html.matchAll(/application\/ld\+json/gi)].length,
      } satisfies Meta;
    })
    .filter((m): m is Meta => m !== null);
}

let paginas: Meta[] = [];
try {
  paginas = coletar();
} catch {
  paginas = [];
}

test.describe("SEO SSR — metadados únicos por rota indexável", () => {
  test("o build possui rotas indexáveis para auditar", () => {
    expect(
      paginas.length,
      `nenhum HTML indexável encontrado em ${DIST} — rode "npm run build" antes do E2E`,
    ).toBeGreaterThan(0);
  });

  test("toda rota indexável tem title, description, og:* e canonical", () => {
    const faltas = paginas.flatMap((p) => {
      const problemas: string[] = [];
      if (!p.title) problemas.push("title");
      if (!p.description) problemas.push("description");
      if (!p.ogTitle) problemas.push("og:title");
      if (!p.ogDescription) problemas.push("og:description");
      if (!p.ogUrl) problemas.push("og:url");
      if (!p.canonical) problemas.push("canonical");
      return problemas.length ? [`${p.route}: sem ${problemas.join(", ")}`] : [];
    });
    expect(faltas, faltas.join("\n")).toEqual([]);
  });

  test("canonical e og:url auto-referenciam a própria rota", () => {
    const esperado = (route: string) => `${BASE}${route === "/" ? "/" : route}`;
    const erros = paginas.flatMap((p) => {
      const alvo = esperado(p.route);
      const norm = (v: string) => v.replace(/\/$/, "") || "/";
      const problemas: string[] = [];
      if (norm(p.canonical) !== norm(alvo)) problemas.push(`canonical=${p.canonical}`);
      if (norm(p.ogUrl) !== norm(alvo)) problemas.push(`og:url=${p.ogUrl}`);
      return problemas.length ? [`${p.route}: ${problemas.join(" · ")}`] : [];
    });
    expect(erros, erros.join("\n")).toEqual([]);
  });

  test("nenhum title, description ou canonical duplicado entre URLs distintas", () => {
    const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const duplicados: string[] = [];
    for (const campo of ["title", "description", "canonical"] as const) {
      const visto = new Map<string, string>();
      for (const p of paginas) {
        const valor = fold(p[campo]);
        if (!valor) continue;
        const antes = visto.get(valor);
        if (antes) duplicados.push(`${campo} duplicado: ${p.route} == ${antes}`);
        else visto.set(valor, p.route);
      }
    }
    expect(duplicados, duplicados.join("\n")).toEqual([]);
  });

  test("toda rota indexável entrega JSON-LD no load inicial", () => {
    const sem = paginas.filter((p) => p.jsonLd === 0).map((p) => p.route);
    expect(sem, `sem structured data no SSR: ${sem.join(", ")}`).toEqual([]);
  });
});
