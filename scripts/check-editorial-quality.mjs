#!/usr/bin/env node
// Gate de staging editorial: não lê nem altera rotas públicas.
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DRAFTS = path.join(ROOT, "docs", "staging-editorial", "drafts");
const FIXTURES = path.join(ROOT, "scripts", "fixtures", "editorial-quality");
const REQUIRED = ["# Intenção", "# Lacuna atual", "# Proposta editorial", "# Segurança e limites", "# Relações futuras", "PRIMARY_INTENT:", "USER_DECISION:", "EXISTING_INFORMATION:", "NEW_INFORMATION:", "SAFETY_VALUE:", "DIAGNOSTIC_VALUE:", "DUPLICATION_RISK:"];
const FORBIDDEN = [
  /\b(?:o|a)\s+melhor\b|\b(?:líder|número ?1|imediato|mais rápid[oa])\b/i,
  /\b(?:centenas|90%|100%|anos de experiência)\b/i,
  /\b(?:grátis|gratuito)\b/i,
];
const UNSAFE = [
  /seu\s+(?:ssd|hd|disco)\s+não aparece,\s*então\s+(?:ele\s+)?queimou/i,
  /\bformate\s+(?:o\s+)?(?:disco|ssd|hd|unidade)\b/i,
  /\b(?:99|100)%\s+(?:de\s+)?(?:sucesso|recupera)/i,
  /(?:recuperad[oa]|arquivos).{0,40}\b(?:com certeza|garantid[oa])\b/i,
  /\b(?:r\$|reais)\s*\d/i,
];

function unsafeReasons(body) {
  return UNSAFE.filter((pattern) => pattern.test(body)).map((pattern) => String(pattern));
}

const files = (await fs.readdir(DRAFTS)).filter((file) => file.endsWith(".md"));
const failures = [];
for (const file of files) {
  const body = await fs.readFile(path.join(DRAFTS, file), "utf8");
  for (const heading of REQUIRED) if (!body.includes(heading)) failures.push(`${file}: seção obrigatória ausente (${heading})`);
  if (!/INFORMATION_GAIN_AFTER:\s*[3-5]/.test(body)) failures.push(`${file}: INFORMATION_GAIN_AFTER deve ser 3–5`);
  if (!/STATUS:\s*STAGING_ONLY/.test(body)) failures.push(`${file}: status deve ser STAGING_ONLY`);
  for (const pattern of FORBIDDEN) if (pattern.test(body)) failures.push(`${file}: claim proibido (${pattern})`);
  const garantiaPromocional = body
    .split("\n")
    .some((line) => /\bgarantid[oa]\b/i.test(line) && !/não\s+(?:é\s+)?garantid[oa]/i.test(line));
  if (garantiaPromocional) failures.push(`${file}: promessa de garantia sem suporte`);
  for (const reason of unsafeReasons(body)) failures.push(`${file}: conteúdo inseguro ou não verificável (${reason})`);
}
for (const fixture of await fs.readdir(FIXTURES)) {
  const body = await fs.readFile(path.join(FIXTURES, fixture), "utf8");
  if (!unsafeReasons(body).length) failures.push(`fixture ${fixture}: deveria ser rejeitada pelo gate`);
}
if (!files.length) failures.push("nenhum draft em docs/staging-editorial/drafts");
if (failures.length) {
  console.error("FALHA — qualidade editorial de staging");
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`PASS — ${files.length} draft(s) de staging passaram pelo gate editorial.`);
