#!/usr/bin/env node
/** Índice leve de metadata: preserva o primeiro slug, como Array.find no runtime. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const input = resolve(root, "src/lib/problemaPagesData.ts");
const output = resolve(root, "src/data/problema-route-meta.generated.json");
const source = ts.createSourceFile(input, readFileSync(input, "utf8"), ts.ScriptTarget.Latest, true);
let entries;
for (const statement of source.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.name.text === "problemaPagesData") {
      if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
        throw new Error("problemaPagesData deve continuar sendo um array literal.");
      }
      entries = declaration.initializer.elements;
    }
  }
}
if (!entries?.length) throw new Error("Base de problemas ausente ou vazia.");
const metadata = new Map();
let duplicates = 0;
for (const entry of entries) {
  if (!ts.isObjectLiteralExpression(entry)) throw new Error("Entrada de problema não literal.");
  const fields = new Map(entry.properties.filter(ts.isPropertyAssignment).map((property) => [
    property.name.getText(source).replace(/^["']|["']$/g, ""), property.initializer,
  ]));
  const text = (key) => {
    const value = fields.get(key);
    if (!value || !ts.isStringLiteralLike(value)) throw new Error(`Campo ${key} não literal na metadata de problema.`);
    return value.text;
  };
  const slug = text("slug");
  // O componente atual usa Array.find: a primeira ocorrência é a canônica.
  if (metadata.has(slug)) { duplicates += 1; continue; }
  metadata.set(slug, { title: text("title"), metaDescription: text("metaDescription") });
}
const next = JSON.stringify(Object.fromEntries(metadata), null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(output, "utf8").replace(/\r\n/g, "\n") !== next) {
    throw new Error("Metadata defasada. Rode node scripts/generate-problema-route-meta.mjs.");
  }
} else {
  writeFileSync(output, next);
}
console.log(`[problema-route-meta] ${metadata.size} slugs; ${duplicates} repetições mantêm a primeira ocorrência.`);
