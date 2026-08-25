/**
 * ANÁLISE DE QUALIDADE DE PÁGINA (heurística explícita e auditável)
 *
 * Extrai sinais do HTML realmente servido e converte em QUALITY SCORE 0–100
 * segundo a rubrica da Fase 6:
 *   25 satisfação da intenção · 20 valor incremental · 20 experiência/utilidade
 *   15 confiança · 10 organização semântica · 10 originalidade
 *
 * Regras de honestidade do score:
 *  - nenhum critério é atendido por presença de palavra-chave isolada;
 *  - valor incremental e originalidade são calculados por comparação real
 *    entre páginas do mesmo cluster (shingles), não por contagem de palavras;
 *  - o score não é normalizado para "ficar bonito": a distribuição é o
 *    resultado bruto das medições.
 */

const STRIP = /<(script|style|template)[\s\S]*?<\/\1>/gi;
const NAV = /<(?:header|nav|footer)\b[\s\S]*?<\/(?:header|nav|footer)>/gi;

export function extractSignals(html) {
  const clean = html.replace(STRIP, "");
  const mainMatch = clean.match(/<main\b[\s\S]*?<\/main>/i);
  const main = mainMatch ? mainMatch[0] : clean;
  const body = main.replace(NAV, "");

  const title = (clean.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const description = clean.match(/name="description"\s+content="([^"]*)"/i)?.[1] ?? "";
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1]));
  const h2s = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => textOf(m[1]));
  const h3s = [...body.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => textOf(m[1]));
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => textOf(m[1])).filter(Boolean);
  const listItems = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => textOf(m[1])).filter(Boolean);
  const tables = [...body.matchAll(/<table\b/gi)].length;
  const text = textOf(body);
  const words = text.split(/\s+/).filter(Boolean);

  const jsonLd = [...clean.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const types = new Set();
  const faqSchemaQuestions = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const t = node["@type"];
    for (const one of Array.isArray(t) ? t : t ? [t] : []) types.add(one);
    if (t === "FAQPage") for (const q of node.mainEntity ?? []) faqSchemaQuestions.push(String(q.name ?? "").trim());
    for (const v of Object.values(node)) if (v && typeof v === "object") walk(v);
  };
  jsonLd.forEach(walk);

  const internalLinks = [...body.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: m[1].length > 1 ? m[1].replace(/\/+$/, "") : "/",
    anchor: textOf(m[2]),
  }));

  return {
    title,
    description,
    h1s,
    h2s,
    h3s,
    paragraphs,
    listItems,
    tables,
    text,
    wordCount: words.length,
    schemaTypes: [...types],
    faqSchemaQuestions,
    internalLinks,
  };
}

function textOf(fragment) {
  return fragment
    .replace(STRIP, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Shingles de 6 palavras — base da comparação entre páginas do mesmo cluster. */
export function shingles(text, n = 6) {
  const w = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(" "));
  return set;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (big.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

// Marcadores de utilidade prática. Contam como sinal apenas quando aparecem em
// heading ou item de lista — texto corrido com a palavra solta não pontua.
const UTILIDADE = [
  { chave: "sintoma", re: /sintoma|como se manifesta|sinais de/i },
  { chave: "causa", re: /causa|por que (acontece|ocorre|isso)|origem do problema/i },
  { chave: "teste", re: /teste|verifica|checklist|passo a passo|como identificar|diagn[óo]stic/i },
  { chave: "evitar", re: /n[ãa]o fa[çc]a|evite|o que evitar|risco|cuidado/i },
  { chave: "quando-tecnico", re: /quando (procurar|chamar|acionar) (um )?t[ée]cnico|quando levar|quando pedir ajuda/i },
  { chave: "limitacao", re: /limita[çc]|n[ãa]o resolve|quando n[ãa]o (compensa|indicado)|fora do escopo/i },
  { chave: "decisao", re: /vale a pena|reparar ou (trocar|substituir)|quando (trocar|substituir)|como decidir/i },
  { chave: "expectativa", re: /prazo|quanto tempo|expectativa|resultado realista|o que esperar/i },
  { chave: "solucao", re: /poss[íi]veis solu|como resolvemos|o que fazemos|procedimento/i },
];

const CONFIANCA = [
  { chave: "responsavel", re: /respons[áa]vel t[ée]cnico|quem executa|gestor respons[áa]vel/i },
  { chave: "escopo", re: /escopo|o que est[áa] inclu[íi]d|o que n[ãa]o inclu/i },
  { chave: "fluxo", re: /diagn[óo]stico.{0,80}(valor|or[çc]amento).{0,120}autoriza|s[óo] executamos ap[óo]s|autoriza[çc][ãa]o/is },
  { chave: "garantia", re: /garantia/i },
  { chave: "transparencia", re: /sem balc[ãa]o|coleta e entrega|n[ãa]o cobramos|antes de autorizar/i },
  { chave: "contato", re: /whatsapp|falar com (um )?t[ée]cnico|agendar/i },
];

const VAZIAS = [
  /qualidade e excel[êe]ncia/i,
  /melhor atendimento/i,
  /solu[çc][ãa]o completa/i,
  /os melhores profissionais/i,
  /pre[çc]o justo e qualidade/i,
  /atendimento diferenciado/i,
];

/**
 * @param {{path:string, cluster:string, signals:object, similaridadeMax:number,
 *          textoExclusivoRatio:number, inboundContextual:number}} entrada
 */
export function scorePage({ path, cluster, signals, similaridadeMax, textoExclusivoRatio, inboundContextual }) {
  const s = signals;
  const headings = [...s.h2s, ...s.h3s];
  const headingsEListas = [...headings, ...s.listItems];
  const motivos = [];
  const causas = new Set();

  // ── 25 · satisfação da intenção ──────────────────────────────────────────
  let intencao = 0;
  const h1 = s.h1s[0] ?? "";
  if (s.h1s.length === 1 && h1.length >= 15) intencao += 6;
  else motivos.push("H1 ausente, duplicado ou curto demais");
  if (s.title.length >= 25 && s.title.length <= 70) intencao += 4;
  if (s.description.length >= 70 && s.description.length <= 170) intencao += 4;
  // "Resposta direta" = primeiro parágrafo substantivo entre os 3 primeiros.
  // O primeiro <p> costuma ser uma linha de apoio ("Atuação desde 1998"), que
  // não deveria contar como falha de intenção.
  const primeiro = s.paragraphs.slice(0, 3).find((p) => p.length >= 80) ?? s.paragraphs[0] ?? "";
  if (primeiro.length >= 140) intencao += 6;
  else if (primeiro.length >= 80) intencao += 3;
  else {
    motivos.push("nenhum dos primeiros parágrafos entrega resposta direta (< 80 caracteres)");
    causas.add("INTENT_AMBIGUITY");
  }

  if (headings.length >= 4) intencao += 5;
  else motivos.push("estrutura rasa: menos de 4 subtítulos");

  // ── 20 · valor incremental (comparação real com o cluster) ───────────────
  let incremental = 20;
  if (similaridadeMax >= 0.7) {
    incremental = 2;
    motivos.push(`sobreposição extrema com página do mesmo cluster (Jaccard ${similaridadeMax.toFixed(2)})`);
    causas.add("TEMPLATE_OVERUSE");
    causas.add("DUPLICATE_INTENT");
  } else if (similaridadeMax >= 0.55) {
    incremental = 8;
    motivos.push(`sobreposição alta com o cluster (Jaccard ${similaridadeMax.toFixed(2)})`);
    causas.add("TEMPLATE_OVERUSE");
  } else if (similaridadeMax >= 0.4) {
    incremental = 14;
    motivos.push(`sobreposição moderada com o cluster (Jaccard ${similaridadeMax.toFixed(2)})`);
  }
  if (textoExclusivoRatio < 0.35) {
    incremental = Math.min(incremental, 8);
    motivos.push(`pouco texto exclusivo (${(textoExclusivoRatio * 100).toFixed(0)}% dos shingles são próprios)`);
    causas.add("LOW_INCREMENTAL_VALUE");
  }

  // ── 20 · experiência / utilidade prática ─────────────────────────────────
  const utilidadeAtendida = UTILIDADE.filter((m) => headingsEListas.some((h) => m.re.test(h)));
  let utilidade = Math.min(14, utilidadeAtendida.length * 2);
  if (s.tables > 0) utilidade += 3;
  if (s.listItems.length >= 8) utilidade += 3;
  utilidade = Math.min(20, utilidade);
  if (utilidadeAtendida.length < 4) {
    motivos.push(
      `poucos elementos de utilidade prática em títulos/listas (${utilidadeAtendida.map((u) => u.chave).join(", ") || "nenhum"})`,
    );
    causas.add("THIN_INFORMATION");
  }
  if (utilidadeAtendida.length === 0) causas.add("COMMERCIAL_ONLY");

  // ── 15 · confiança ───────────────────────────────────────────────────────
  const confiancaAtendida = CONFIANCA.filter((m) => m.re.test(s.text));
  let confianca = Math.min(15, confiancaAtendida.length * 2.5);
  if (confiancaAtendida.length < 3) {
    motivos.push("sinais de confiança insuficientes (escopo, fluxo de autorização, responsável)");
    causas.add("WEAK_EVIDENCE");
  }

  // ── 10 · organização semântica ───────────────────────────────────────────
  let semantica = 0;
  if (s.h1s.length === 1) semantica += 3;
  if (headings.length >= 4) semantica += 2;
  const faqVisiveis = headingsEListas.filter((h) => /\?$/.test(h)).length;
  const faqSchema = s.faqSchemaQuestions.length;
  if (faqSchema === 0 || faqVisiveis >= faqSchema) semantica += 3;
  else motivos.push(`FAQPage declara ${faqSchema} perguntas e a página exibe ${faqVisiveis}`);
  const contextuais = s.internalLinks.filter((l) => l.href !== path && l.anchor.length >= 12).length;
  if (contextuais >= 3) semantica += 2;
  else motivos.push("poucos links internos contextuais com âncora descritiva");

  // ── 10 · originalidade / razão de existir ────────────────────────────────
  let originalidade = 0;
  if (textoExclusivoRatio >= 0.6) originalidade += 6;
  else if (textoExclusivoRatio >= 0.4) originalidade += 4;
  else if (textoExclusivoRatio >= 0.25) originalidade += 2;
  if (s.wordCount >= 600) originalidade += 2;
  if (inboundContextual >= 3) originalidade += 2;
  originalidade = Math.min(10, originalidade);

  const vazias = VAZIAS.filter((re) => re.test(s.text)).length;
  const penalidadeVazias = Math.min(6, vazias * 2);
  if (vazias) motivos.push(`${vazias} expressão(ões) publicitária(s) sem evidência`);

  const local = /^\/(bairros|servicos\/[^/]+\/|tecnico-informatica-)/.test(path);
  if (local && similaridadeMax >= 0.55) causas.add("LOCAL_DOORWAY_RISK");
  if (local && utilidadeAtendida.length < 3) causas.add("LOCAL_DOORWAY_RISK");
  if (cluster === "PROBLEMA" && utilidadeAtendida.length < 5) causas.add("LACK_OF_EXPERTISE");

  const score = Math.max(
    0,
    Math.round(intencao + incremental + utilidade + confianca + semantica + originalidade - penalidadeVazias),
  );

  return {
    score,
    faixa: score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "E",
    componentes: {
      intencao: Math.round(intencao),
      incremental: Math.round(incremental),
      utilidade: Math.round(utilidade),
      confianca: Math.round(confianca),
      semantica: Math.round(semantica),
      originalidade: Math.round(originalidade),
      penalidadeVazias,
    },
    utilidade: utilidadeAtendida.map((u) => u.chave),
    confiancaSinais: confiancaAtendida.map((c) => c.chave),
    causas: [...causas],
    motivos,
  };
}
