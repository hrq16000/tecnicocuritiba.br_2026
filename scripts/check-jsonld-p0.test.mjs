import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = fileURLToPath(new URL("./check-jsonld-p0.mjs", import.meta.url));
const BASE = "https://tecnico.curitiba.br";
const ROUTES = ["/", "/tecnico-informatica-curitiba", "/atendimento-domicilio", "/empresa-de-ti-curitiba"];

function fixture(t, { dir = "dist/client", badOffer = false } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "jsonld-p0-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const route of ROUTES) {
    const location = path.join(root, dir, route.replace(/^\//, ""), "index.html");
    mkdirSync(path.dirname(location), { recursive: true });
    const schemas = [{
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": BASE + "/#organization",
      name: "Técnico em Curitiba",
    }];
    if (route !== "/") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: BASE + "/" },
          { "@type": "ListItem", position: 2, name: "Página", item: BASE + route },
        ],
      });
    }
    if (badOffer && route === "/") {
      schemas.push({ "@context": "https://schema.org", "@type": "Offer", name: "Plano mensal" });
    }
    const scripts = schemas.map((s) => '<script type="application/ld+json">' + JSON.stringify(s) + "</script>").join("");
    writeFileSync(location, "<!doctype html><html lang=\"pt-BR\"><head>" + scripts + "</head><body></body></html>");
  }
  return root;
}

const run = (cwd, args = []) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });

test("default avalia páginas reais em dist/client, não em dist", (t) => {
  const cwd = fixture(t);
  const result = run(cwd);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /JSON-LD P0 OK/);
});

test("rejeita ausência de HTML prerenderizado, em vez de aprovar só dist", (t) => {
  const cwd = fixture(t, { dir: "dist" });
  const result = run(cwd);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /HTML estático ausente/);
});

test("mantém reprovação por preço mensal no JSON-LD", (t) => {
  const cwd = fixture(t, { badOffer: true });
  const result = run(cwd);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /preço mensal\/recorrente/);
});

test("caminho explícito funciona para auditar diretório alternativo", (t) => {
  const cwd = fixture(t, { dir: "resultado" });
  const result = run(cwd, ["resultado"]);
  assert.equal(result.status, 0, result.stderr + result.stdout);
});
