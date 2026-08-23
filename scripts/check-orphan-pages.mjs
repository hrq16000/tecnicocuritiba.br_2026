#!/usr/bin/env node
/**
 * Gate contra componentes órfãos (escopo: páginas comerciais P0).
 *
 * Detecta, dentro de src/pages (raiz), src/pages/servicos e src/App.tsx /
 * src/LegacyApp.tsx:
 *   1. componente de página sem import em nenhum roteador;
 *   2. import (lazy ou estático) declarado e nunca usado em <Route>;
 *   3. rota P0 que apenas redireciona enquanto existe componente de página
 *      dedicado ao mesmo objetivo (conteúdo ficaria inalcançável);
 *   4. duas implementações distintas montadas no mesmo slug canônico.
 *
 * Relata: arquivo, símbolo, rota provável, motivo e componente canônico esperado.
 * Fora de escopo nesta rodada: varredura genérica de todos os componentes.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tanstackRouteFiles } from "./lib/tanstack-routes.mjs";

const ROOT = process.cwd();
const ROUTERS = tanstackRouteFiles(ROOT);
const SCOPE_DIRS = ["src/pages", "src/pages/servicos"];

/** Rotas comerciais P0 desta rodada — precisam de componente próprio montado. */
const P0_ROUTES = {
  "/": "src/pages/Index.tsx",
  "/tecnico-informatica-curitiba": "src/pages/TecnicoInformaticaCuritiba.tsx",
  "/atendimento-domicilio": "src/pages/AtendimentoDomicilio.tsx",
  "/empresa-de-ti-curitiba": "src/pages/EmpresaDeTiCuritiba.tsx",
};

/** Páginas montadas indiretamente (templates data-driven, admin, ads, etc). */
const NOT_ROUTE_COMPONENTS = [
  "src/pages/admin/",
  "src/pages/ads/",
  "src/pages/bairros/",
  "src/pages/servico-bairro/",
  "src/pages/arrumar-pc/",
  "src/pages/cftv/",
  "src/pages/hubs/",
];

const routerSrc = ROUTERS.map((f) => readFileSync(f, "utf8")).join("\n");
const failures = [];
const notices = [];

function listPages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((e) => join(dir, e))
    .filter((p) => statSync(p).isFile() && p.endsWith(".tsx"));
}

const pages = [...new Set(SCOPE_DIRS.flatMap(listPages))].filter(
  (p) => !NOT_ROUTE_COMPONENTS.some((skip) => p.startsWith(skip)),
);

// 1) Componente de página sem import em nenhum roteador.
for (const file of pages) {
  const importPath = file.replace(/\\/g, "/").replace(/^src\//, "").replace(/\.tsx$/, "");
  const short = importPath.replace(/^pages\//, "");
  const referenced =
    routerSrc.includes(`/${short}"`) ||
    routerSrc.includes(`/${short}'`) ||
    routerSrc.includes(`@/${importPath}`) ||
    routerSrc.includes(`./${importPath}`);
  if (!referenced) {
    failures.push({
      file,
      symbol: short.split("/").pop(),
      route: "(nenhuma)",
      reason: "componente de página sem import em src/App.tsx ou src/LegacyApp.tsx",
      expected: "montar na rota canônica ou remover o arquivo",
    });
  }
}

// 2) Imports declarados e nunca usados como elemento de rota.
for (const routerFile of ROUTERS) {
  const src = readFileSync(routerFile, "utf8");
  const imports = [
    ...src.matchAll(/(?:const|import)\s+(\w+)\s*=\s*lazy\(/g),
    ...src.matchAll(/^import\s+(\w+)\s+from\s+["']\.\/pages\//gm),
  ].map((m) => m[1]);
  for (const sym of new Set(imports)) {
    const used = new RegExp(`<${sym}[\\s/>]`).test(src);
    if (!used) {
      failures.push({
        file: routerFile,
        symbol: sym,
        route: "(import sem <Route>)",
        reason: "import lazy/estático declarado e nunca renderizado",
        expected: "usar em uma <Route> ou remover o import",
      });
    }
  }
}

// 3) Rota P0 que redireciona apesar de existir componente dedicado + 4) slug duplicado.
for (const [route, expected] of Object.entries(P0_ROUTES)) {
  const routeRe = new RegExp(`path="${route.replace(/\//g, "\\/")}"[^>]*element=\\{([^}]+)\\}`, "g");
  const matches = [...routerSrc.matchAll(routeRe)].map((m) => m[1].trim());
  if (matches.length === 0) continue;
  const redirecting = matches.filter((m) => m.includes("Navigate"));
  if (redirecting.length && existsSync(expected)) {
    failures.push({
      file: expected,
      symbol: route,
      route,
      reason: "rota P0 redireciona enquanto existe componente de página dedicado",
      expected,
    });
  }
  const components = [...new Set(matches.filter((m) => !m.includes("Navigate")))];
  if (components.length > 1) {
    failures.push({
      file: ROUTERS[0],
      symbol: components.join(" / "),
      route,
      reason: "duas implementações montadas no mesmo slug canônico",
      expected,
    });
  }
}

// 5) Conteúdo P0 precisa viver no componente canônico (não em reexport genérico).
const localPage = P0_ROUTES["/tecnico-informatica-curitiba"];
if (existsSync(localPage)) {
  const src = readFileSync(localPage, "utf8");
  if (/CidadeLandingLayout/.test(src) && src.split(/\r?\n/).length < 40) {
    failures.push({
      file: localPage,
      symbol: "TecnicoInformaticaCuritiba",
      route: "/tecnico-informatica-curitiba",
      reason: "página P0 é apenas reexport do template genérico de cidade (sem conteúdo próprio)",
      expected: "componente próprio com conteúdo editorial exclusivo",
    });
  }
}

console.log(`[orphan-gate] escopo: ${pages.length} página(s) + ${ROUTERS.length} roteador(es)`);
for (const n of notices) console.log(`  \u2139 ${n}`);

if (failures.length) {
  console.error(`\n[orphan-gate] FALHOU — ${failures.length} problema(s):`);
  for (const f of failures) {
    console.error(
      `  \u2717 ${f.file}\n      símbolo: ${f.symbol}\n      rota: ${f.route}\n      motivo: ${f.reason}\n      esperado: ${f.expected}`,
    );
  }
  process.exit(1);
}
console.log("[orphan-gate] OK — nenhum componente órfão nas páginas comerciais \u2714");
