import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Gate do acervo editorial indexável (Micro-rodada 3).
 *
 * Protege o que o build não pega:
 *  1. Todo <Link to="/..."> dentro dos artigos indexáveis precisa apontar
 *     para uma rota existente (evita repetir o 404 de /blog/<slug> não aprovado).
 *  2. Artigo indexável precisa de metadata SSR e FAQ visível (paridade com JSON-LD).
 */
const ROOT = resolve(__dirname, "../..");
const CONTENT = readFileSync(resolve(ROOT, "src/data/blogPostsContent.tsx"), "utf8");
const META = readFileSync(resolve(ROOT, "src/lib/seo/blogPostsMeta.ts"), "utf8");
const FAQ = readFileSync(resolve(ROOT, "src/components/BlogPostFAQ.tsx"), "utf8");

const INDEXABLE_SLUGS = [
  "organizacao-de-ti-para-pequenos-escritorios",
  "como-escolher-uma-workstation",
];

/** Caminhos servidos, derivados dos arquivos de rota do TanStack Router. */
const routePaths = new Set(
  readdirSync(resolve(ROOT, "src/routes"))
    .filter((f) => /\.tsx?$/.test(f) && !f.startsWith("__"))
    .map((f) =>
      "/" +
      f
        .replace(/\.tsx?$/, "")
        .replace(/\.index$/, "")
        .split(".")
        .join("/"),
    ),
);

/** Trecho do artigo entre a chave do slug e o fim do bloco de conteúdo. */
function articleSource(slug: string): string {
  const start = CONTENT.indexOf(`"${slug}": {`);
  expect(start, `slug ${slug} ausente em blogPostsContent`).toBeGreaterThan(-1);
  const end = CONTENT.indexOf("\n  },\n", start);
  return CONTENT.slice(start, end === -1 ? CONTENT.length : end);
}

describe("acervo editorial indexável", () => {
  for (const slug of INDEXABLE_SLUGS) {
    it(`${slug}: metadata SSR e FAQ visível declarados`, () => {
      expect(META).toContain(`"${slug}"`);
      expect(FAQ).toContain(`"${slug}"`);
    });

    it(`${slug}: links internos apontam para rotas existentes`, () => {
      const src = articleSource(slug);
      const hrefs = [...src.matchAll(/<Link\s+to="(\/[^"#?]*)"/g)].map((m) => m[1]);
      const broken = hrefs.filter((href) => {
        const clean = href.replace(/\/$/, "") || "/";
        if (routePaths.has(clean)) return true === false;
        // rotas dinâmicas/aninhadas: aceita quando existe rota-pai declarada
        return ![...routePaths].some(
          (p) => clean === p || clean.startsWith(`${p}/`),
        );
      });
      expect(broken, `links quebrados em ${slug}`).toEqual([]);
    });

    it(`${slug}: não linka para artigo de blog não aprovado`, () => {
      const src = articleSource(slug);
      const blogLinks = [...src.matchAll(/<Link\s+to="\/blog\/([^"/]+)"/g)].map((m) => m[1]);
      for (const target of blogLinks) {
        expect(META, `/blog/${target} não está aprovado`).toContain(`"${target}"`);
      }
    });
  }
});
