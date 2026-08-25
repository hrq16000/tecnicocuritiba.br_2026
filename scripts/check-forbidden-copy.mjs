#!/usr/bin/env node
/**
 * GATE DE COPY PROIBIDO
 *
 * Bloqueia no CI qualquer reintrodução de:
 *   1. CNPJ, razão social ou o nome da entidade jurídica (Ping Soluções);
 *   2. e-mail de contato publicado (mailto: / contato@dominio);
 *   3. o número de WhatsApp como texto visível (só é permitido em wa.me,
 *      no campo `telephone` do JSON-LD e nas constantes de configuração);
 *   4. a palavra "orçamento" / "orçar" / "orçado" — o vocabulário oficial é
 *      "agendar", "solicitar atendimento" e "valor".
 *
 * Uso: node scripts/check-forbidden-copy.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src", "index.html", "scripts/curated-static-body.mjs", "scripts/curated-routes-meta.mjs"];
const EXT = new Set([".ts", ".tsx", ".html", ".mjs"]);
const SKIP = /(^|\/)(node_modules|dist|\.git)(\/|$)|\.test\.[tj]sx?$/;

const RULES = [
  { id: "cnpj", re: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/, msg: "CNPJ exposto" },
  { id: "cnpj-palavra", re: /\bCNPJ\b(?!\s*nem)/, msg: "menção a CNPJ" },
  { id: "razao-social", re: /raz[ãa]o social/i, msg: "menção a razão social" },
  { id: "entidade", re: /Ping\s+Solu[çc][õo]es/i, msg: "razão social exposta" },
  { id: "email", re: /mailto:|contato@[a-z0-9.-]+/i, msg: "e-mail de contato exposto" },
  { id: "whatsapp-visivel", re: /\(?41\)?[\s.-]?9{1,2}\s?9?7\d{3}[-\s.]?\d{4}/, msg: "número de WhatsApp visível" },
  { id: "orcamento", re: /\bor[çc]ament|\bor[çc]ad[oa]s?\b|\bor[çc]ar\b/i, msg: 'palavra proibida: usar "agendar"/"solicitar atendimento"/"valor"' },
];

/** Exceções conscientes (código, não copy visível). */
const ALLOW = [
  { file: "src/lib/funnel/triageConfig.ts", id: "cnpj-palavra" },
  { file: "src/lib/funnel/triageConfig.ts", id: "razao-social" },
  { file: "src/lib/funnelAnalytics.ts", id: "cnpj-palavra" },
  { file: "src/lib/funnelAnalytics.ts", id: "razao-social" },
  { file: "src/lib/siteConfig.ts", id: "cnpj-palavra" },
  { file: "src/lib/siteConfig.ts", id: "razao-social" },
  // rotas legadas/canônicas que não podem ser removidas (SEO evolutivo)
  { file: "src/App.tsx", id: "orcamento" },
  { file: "src/LegacyApp.tsx", id: "orcamento" },
  // Módulo de O.S.: termo jurídico literal do contrato de laboratório e dado
  // de pagamento enviado apenas na conversa privada (nunca em tela pública).
  { file: "src/lib/os/termosOs.ts", id: "orcamento" },
  { file: "src/lib/os/termosOs.ts", id: "cnpj" },
  { file: "src/lib/os/termosOs.ts", id: "cnpj-palavra" },

];

const files = [];
const walk = (p) => {
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).forEach((f) => !SKIP.test(join(p, f)) && walk(join(p, f)));
  if (EXT.has(extname(p)) && !SKIP.test(p)) files.push(p);
};
for (const r of ROOTS) { try { walk(r); } catch { /* opcional */ } }

const findings = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (!rule.re.test(line)) continue;
      if (ALLOW.some((a) => a.file === file && a.id === rule.id)) continue;
      // wa.me e telephone do JSON-LD são permitidos
      if (rule.id === "whatsapp-visivel" && /wa\.me|telephone|whatsappNumber|phoneE164/.test(line)) continue;
      findings.push({ file, line: i + 1, rule: rule.id, msg: rule.msg, text: line.trim().slice(0, 120) });
    }
  });
}

if (findings.length) {
  console.error(`\n❌ Copy proibido: ${findings.length} ocorrência(s)\n`);
  for (const f of findings) console.error(`  ${f.file}:${f.line}  [${f.rule}] ${f.msg}\n      ${f.text}`);
  console.error("\nVocabulário oficial: agendar · solicitar atendimento · valor. Sem CNPJ, razão social, e-mail ou telefone visível.");
  process.exit(1);
}
console.log("✅ Copy proibido: nenhuma ocorrência (CNPJ, razão social, e-mail, telefone visível, orçamento).");
