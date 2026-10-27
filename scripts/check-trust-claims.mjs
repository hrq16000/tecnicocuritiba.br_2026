#!/usr/bin/env node
/**
 * GATE DE CONFIANÇA (Rodada 4E) — bloqueia claims não comprováveis no copy.
 *
 * Varre src/ procurando afirmações que o projeto não pode sustentar com prova
 * real: rating/nota, número de clientes, percentual de satisfação, superlativo
 * de mercado, certificação/credenciamento/parceria, filial inexistente, SLA,
 * plano/preço mensal, garantia divergente da fonte central, nota fiscal
 * "garantida", telefone/WhatsApp divergente e ano institucional divergente.
 *
 * Exceções: apenas em scripts/trust-claims-allowlist.json, com justificativa.
 *
 * Uso: node scripts/check-trust-claims.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { isNonPromotionalClaim } from "./lib/trust-claims-context.mjs";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const ALLOWLIST_PATH = join(ROOT, "scripts", "trust-claims-allowlist.json");

const OFFICIAL_WHATSAPP = "5541997086380";
const OFFICIAL_YEAR = "1998";
const WARRANTY_DAYS = "90";

const RULES = [
  { id: "rating-hardcoded", re: /(nota|avalia(ç|c)(ã|a)o)\s*(m(é|e)dia\s*)?(de\s*)?[45][.,]\d\s*(estrelas|\/\s*5|de\s*5)/i, msg: "rating/nota hardcoded" },
  { id: "estrelas-hardcoded", re: /\b[45][.,]\d\s*(★|estrelas)\b/i, msg: "avaliação em estrelas hardcoded" },
  { id: "num-clientes", re: /\b\d[\d.\s]*\+?\s*(mil\s*)?clientes\s*(atendidos|satisfeitos|felizes)/i, msg: "número de clientes inventado" },
  { id: "num-atendimentos", re: /\b\d[\d.\s]*\+?\s*(mil\s*)?(atendimentos|servi(ç|c)os)\s*(realizados|conclu(í|i)dos)/i, msg: "número de atendimentos inventado" },
  { id: "satisfacao", re: /\b\d{1,3}\s*%\s*(de\s*)?(satisfa(ç|c)(ã|a)o|aprova(ç|c)(ã|a)o|sucesso)/i, msg: "percentual de satisfação inventado" },
  { id: "satisfacao-label", re: /label:\s*["'`]\s*Satisfa(ç|c)(ã|a)o/i, msg: "métrica de satisfação inventada" },
  { id: "superlativo", re: /(melhor\s+(de|em)\s+curitiba|mais\s+recomendad|l(í|i)der\s+(em|no|de)\s|n(º|o)\s*1\s+(em|de|da))/i, msg: "superlativo de mercado não comprovável" },
  { id: "certificado", re: /(t(é|e)cnic[oa]s?|profissiona(l|is)|equipe|atendimento)\s+([a-zà-ú]+\s+){0,2}(certificad|credenciad|autorizad)[oa]s?/i, msg: "certificação/credenciamento sem emissor" },
  { id: "assistencia-autorizada", re: /assist(ê|e)ncia\s+(t(é|e)cnica\s+)?autorizada/i, msg: "claim de assistência autorizada" },
  { id: "parceiro-oficial", re: /parceir[oa]s?\s+(oficia(l|is)|autorizad)/i, msg: "parceria oficial não comprovada" },
  { id: "garantia-total", re: /garantia\s+(total|vital(í|i)cia|ilimitada)/i, msg: "garantia total/ilimitada" },
  { id: "sigilo-absoluto", re: /(sigilo|confidencialidade|privacidade)\s+(absolut|total)/i, msg: "sigilo absoluto não sustentável" },
  { id: "recuperacao-garantida", re: /recupera(ç|c)(ã|a)o\s+(de\s+dados\s+)?garantida|garantimos\s+a\s+recupera/i, msg: "recuperação de dados garantida" },
  { id: "nf-garantida", re: /nota\s+fiscal\s+garantida/i, msg: "nota fiscal apresentada como garantia" },
  { id: "sla", re: /\bSLA\b/, msg: "SLA não praticado" },
  { id: "plano-mensal", re: /(plano|planos|pacote|pacotes)\s+mensa(l|is)|mensalidade|R\$\s*\d+[^\n]{0,12}\/\s*m(ê|e)s/i, msg: "plano/preço mensal inexistente" },
  { id: "mesmo-dia", re: /(no\s+)?mesmo\s+dia\b/i, msg: "promessa de atendimento no mesmo dia" },
  { id: "filial", re: /\b(filia(l|is)|nossa\s+loja|nossa\s+unidade|nosso\s+laborat(ó|o)rio)\b/i, msg: "filial/unidade física inexistente" },
  { id: "endereco-placeholder", re: /(Rua|Av\.?|Avenida)\s+(Exemplo|Teste|Fulano|XXX|Lorem)/i, msg: "endereço placeholder" },
  { id: "ano-divergente", re: /(desde|atuando desde|no mercado desde)\s+(19[0-9]{2}|20[0-2][0-9])/i, msg: "ano institucional divergente da fonte central", check: (m) => m[2] !== OFFICIAL_YEAR },
  { id: "whatsapp-divergente", re: /55\d{2}9?\d{8}/, msg: "número de WhatsApp divergente do oficial", check: (m) => m[0] !== OFFICIAL_WHATSAPP },
  { id: "garantia-divergente", re: /garantia\s+(de\s+)?(\d{1,3})\s*(dias|meses|ano)/i, msg: `garantia divergente da fonte central (${WARRANTY_DAYS} dias de serviço)`, check: (m) => !(m[3].startsWith("dia") && m[2] === WARRANTY_DAYS) },
].map((rule) => ({ ...rule, re: new RegExp(rule.re.source, `${rule.re.flags}g`) }));

const allow = existsSync(ALLOWLIST_PATH) ? JSON.parse(readFileSync(ALLOWLIST_PATH, "utf8")) : { exceptions: [] };
const isAllowed = (file, ruleId) =>
  allow.exceptions.some(
    (e) => (e.rule === ruleId || e.rule === "*") && (file === e.file || file.startsWith(e.file)),
  );

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(p);
  }
  return out;
}

const findings = [];
for (const file of walk(SRC)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comentários de governança
    for (const rule of RULES) {
      if (isAllowed(rel, rule.id)) continue;
      for (const m of line.matchAll(rule.re)) {
        if (rule.check && !rule.check(m)) continue;
        if (isNonPromotionalClaim(rule.id, line, m)) continue;
        findings.push({ file: rel, line: i + 1, rule: rule.id, msg: rule.msg, excerpt: line.trim().slice(0, 160) });
      }
    }
  });
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ findings, total: findings.length }, null, 2));
} else if (findings.length) {
  console.error(`\n❌ Gate de confiança: ${findings.length} claim(s) não comprovável(is)\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.rule}] ${f.msg}`);
    console.error(`      ${f.excerpt}`);
  }
  console.error(`\nCorrija o copy ou documente exceção em scripts/trust-claims-allowlist.json\n`);
} else {
  console.log("✅ Gate de confiança: nenhum claim não comprovável encontrado.");
}

process.exit(findings.length ? 1 : 0);
