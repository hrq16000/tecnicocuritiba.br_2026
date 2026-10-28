#!/usr/bin/env node
/** Dados públicos em módulos estáticos por artigo, sem executar o arquivo de origem. */
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let pending;

export function generateProblemaArticles() {
  return pending ??= generate();
}

async function generate() {
  const input = join(ROOT, "src/lib/problemaPagesData.ts");
  const source = ts.createSourceFile(input, await readFile(input, "utf8"), ts.ScriptTarget.Latest, true);
  const bindings = new Map();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) bindings.set(declaration.name.text, declaration.initializer);
    }
  }
  const cache = new Map();
  const resolving = new Set();
  function literal(node) {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression);
    if (ts.isIdentifier(node)) {
      if (cache.has(node.text)) return cache.get(node.text);
      if (!bindings.has(node.text) || resolving.has(node.text)) throw new Error("Referência não literal: " + node.text);
      resolving.add(node.text);
      const value = literal(bindings.get(node.text));
      resolving.delete(node.text);
      cache.set(node.text, value);
      return value;
    }
    if (ts.isArrayLiteralExpression(node)) {
      const result = [];
      for (const item of node.elements) {
        if (ts.isSpreadElement(item)) {
          const items = literal(item.expression);
          if (!Array.isArray(items)) throw new Error("Spread deve ser array literal.");
          result.push(...items);
        } else result.push(literal(item));
      }
      return result;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const result = Object.create(null);
      for (const property of node.properties) {
        if (ts.isSpreadAssignment(property)) { Object.assign(result, literal(property.expression)); continue; }
        if (!ts.isPropertyAssignment(property)) throw new Error("Propriedade não literal.");
        const key = ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name) ? property.name.text : undefined;
        if (!key) throw new Error("Nome de propriedade não literal.");
        result[key] = literal(property.initializer);
      }
      return result;
    }
    if (ts.isTemplateExpression(node)) {
      return node.head.text + node.templateSpans.map((span) => String(literal(span.expression)) + span.literal.text).join("");
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const left = literal(node.left), right = literal(node.right);
      if (!["string", "number"].includes(typeof left) || !["string", "number"].includes(typeof right)) throw new Error("Concatenação não literal.");
      return left + right;
    }
    throw new Error("Expressão não suportada nos dados: " + ts.SyntaxKind[node.kind]);
  }

  const array = bindings.get("problemaPagesData");
  if (!array) throw new Error("Base de artigos ausente.");
  const articles = literal(array);
  if (!Array.isArray(articles) || !articles.length) throw new Error("Base de artigos vazia.");
  const unique = new Map();
  for (const article of articles) {
    if (typeof article.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(article.slug)) throw new Error("Slug inválido na origem.");
    if (!unique.has(article.slug)) unique.set(article.slug, article);
  }
  const output = join(ROOT, "src/generated/problema-articles");
  await mkdir(output, { recursive: true });
  const expected = new Set([...unique.keys()].map((slug) => slug + ".json"));
  for (const entry of await readdir(output, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json") && !expected.has(entry.name)) await unlink(join(output, entry.name));
  }
  for (const [slug, article] of unique) {
    const file = join(output, slug + ".json");
    const next = JSON.stringify(article) + "\n";
    const current = await readFile(file, "utf8").catch(() => null);
    if (current !== next) await writeFile(file, next);
  }
  console.log("[problema-articles] " + unique.size + " artigos estáticos; primeira ocorrência preservada.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateProblemaArticles().catch((error) => { console.error(error); process.exitCode = 1; });
}
