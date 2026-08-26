#!/usr/bin/env node
// Gate de staging editorial: não lê nem altera rotas públicas.
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DRAFTS = path.join(ROOT, "docs", "staging-editorial", "drafts");
const REQUIRED = ["# Intenção", "# Lacuna atual", "# Proposta editorial", "# Segurança e limites", "# Relações futuras"];
const FORBIDDEN = [
  /\b(?:melhor|líder|número ?1|garantid[oa]|imediato|mais rápid[oa])\b/i,
  /\b(?:centenas|90%|100%|anos de experiência)\b/i,
  /\b(?:grátis|gratuito)\b/i,
];

const files = (await fs.readdir(DRAFTS)).filter((file) => file.endsWith(".md"));
const failures = [];
for (const file of files) {
  const body = await fs.readFile(path.join(DRAFTS, file), "utf8");
  for (const heading of REQUIRED) if (!body.includes(heading)) failures.push(`${file}: seção obrigatória ausente (${heading})`);
  if (!/INFORMATION_GAIN_AFTER:\s*[3-5]/.test(body)) failures.push(`${file}: INFORMATION_GAIN_AFTER deve ser 3–5`);
  if (!/STATUS:\s*STAGING_ONLY/.test(body)) failures.push(`${file}: status deve ser STAGING_ONLY`);
  for (const pattern of FORBIDDEN) if (pattern.test(body)) failures.push(`${file}: claim proibido (${pattern})`);
}
if (!files.length) failures.push("nenhum draft em docs/staging-editorial/drafts");
if (failures.length) {
  console.error("FALHA — qualidade editorial de staging");
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`PASS — ${files.length} draft(s) de staging passaram pelo gate editorial.`);
