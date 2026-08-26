import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const bairroDir = path.join(root, "src", "pages", "bairros");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "bairro-data-schema-report.json");

const files = fs.readdirSync(bairroDir).filter((file) => file.endsWith(".tsx")).sort();
const invalid = [];
let propertiesChecked = 0;

function visit(node, file, source) {
  if (ts.isPropertyAssignment(node) && node.name.getText(source).replace(/["']/g, "") === "dicasLocais") {
    propertiesChecked += 1;
    const initializer = node.initializer;
    if (!ts.isArrayLiteralExpression(initializer)) {
      invalid.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, reason: "dicasLocais deve ser um array literal de strings" });
    } else {
      initializer.elements.forEach((element) => {
        if (!ts.isStringLiteral(element) && !ts.isNoSubstitutionTemplateLiteral(element)) {
          invalid.push({ file, line: source.getLineAndCharacterOfPosition(element.getStart(source)).line + 1, reason: "cada dicaLocais deve ser uma string literal" });
        } else if (!element.text.trim()) {
          invalid.push({ file, line: source.getLineAndCharacterOfPosition(element.getStart(source)).line + 1, reason: "dicasLocais não pode conter strings vazias" });
        }
      });
    }
  }
  ts.forEachChild(node, (child) => visit(child, file, source));
}

for (const file of files) {
  const relative = path.posix.join("src/pages/bairros", file);
  const sourceText = fs.readFileSync(path.join(bairroDir, file), "utf8");
  const source = ts.createSourceFile(relative, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  visit(source, relative, source);
}

const report = {
  schema: "BairroData",
  checked_files: files.length,
  routes_checked: propertiesChecked,
  valid_count: Math.max(propertiesChecked - new Set(invalid.map((item) => item.file)).size, 0),
  invalid_count: invalid.length,
  invalid_files: invalid,
};
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`BairroData: ${files.length} arquivos, ${propertiesChecked} listas dicasLocais, ${invalid.length} incompatibilidades.`);
console.log(`Relatório: ${path.relative(root, reportPath)}`);
if (invalid.length) process.exitCode = 1;
