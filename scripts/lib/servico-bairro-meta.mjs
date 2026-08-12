// ============================================================================
// ESPELHO SEM DRIFT DAS LANDINGS SERVIÇO × BAIRRO (para o prerender estático)
// ============================================================================
// Lê os dados diretamente de `src/lib/servicoBairroFactory.ts` e
// `src/lib/bairrosData.ts`, evitando duplicar copy num segundo arquivo.
// Assim, o HTML estático (crawler sem JS) fica idêntico ao que o React
// hidrata: mesmo H1, mesma descrição e mesmo FAQ.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const factorySrc = readFileSync(join(ROOT, "src/lib/servicoBairroFactory.ts"), "utf8");
const bairrosSrc = readFileSync(join(ROOT, "src/lib/bairrosData.ts"), "utf8");

/** Extrai o bloco `{ ... }` balanceado a partir de um índice de abertura. */
function block(src, openIdx, open = "{", close = "}") {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === open) depth++;
    else if (src[i] === close) {
      depth--;
      if (depth === 0) return src.slice(openIdx, i + 1);
    }
  }
  return "";
}

// ── Serviços ────────────────────────────────────────────────────────────────
const servicos = {};
for (const m of factorySrc.matchAll(/^ {2}"([a-z-]+)": \{$/gm)) {
  const body = block(factorySrc, factorySrc.indexOf("{", m.index + m[0].length - 1));
  const nome = body.match(/\n\s{4}nome:\s*"([^"]+)"/)?.[1];
  const h1Tpl = body.match(/\n\s{4}h1:\s*\(b\)\s*=>\s*`([^`]+)`/)?.[1];
  const subtitulo = body.match(/\n\s{4}subtitulo:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  if (!nome || !h1Tpl) continue;

  const faqIdx = body.indexOf("faq: (b) => [");
  const faqBlock = faqIdx === -1 ? "" : block(body, body.indexOf("[", faqIdx), "[", "]");
  const faq = [...faqBlock.matchAll(/pergunta:\s*`?"?((?:[^"`\\]|\\.)*)[`"],\s*\n\s*resposta:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map(
    (f) => ({ pergunta: f[1], resposta: f[2] }),
  );

  servicos[m[1]] = { slug: m[1], nome, h1Tpl, subtitulo: unescape_(subtitulo ?? ""), faq };
}

// ── Bairros ─────────────────────────────────────────────────────────────────
// Fontes: `bairrosData.ts` (âncoras com layout local próprio) e
// `wifiTvBairroData.ts` (âncoras da fábrica serviço × bairro).
const bairros = {};
const wifiTvSrc = readFileSync(join(ROOT, "src/pages/servico-bairro/wifiTvBairroData.ts"), "utf8");
for (const src of [bairrosSrc, wifiTvSrc]) {
  for (const m of src.matchAll(/"?([a-z-]+)"?:\s*\{\s*\n\s*slug:\s*"([a-z-]+)"/g)) {
    const body = block(src, src.indexOf("{", m.index));
    const nome = body.match(/\n\s*nome:\s*"([^"]+)"/)?.[1];
    if (nome && !bairros[m[2]]) bairros[m[2]] = { slug: m[2], nome };
  }
}

function unescape_(s) {
  return s.replace(/\\"/g, '"').replace(/\\n/g, " ");
}

/** Metadados estáticos (title/description/H1/FAQ) de uma landing serviço × bairro. */
export function servicoBairroMeta(path) {
  const [, , servicoSlug, bairroSlug] = path.split("/");
  const servico = servicos[servicoSlug];
  const bairro = bairros[bairroSlug];
  if (!servico || !bairro) return null;
  return {
    path,
    // Espelha src/lib/servicoBairroFactory.ts: título curto para não truncar na SERP.
    title: `${servico.nome} — ${bairro.nome}${bairro.nome.includes("Curitiba") ? "" : ", Curitiba"}`,
    description: `${servico.nome} no ${bairro.nome}, em Curitiba. Triagem por WhatsApp, atendimento agendado e condições por escrito. Visita de inspeção a partir de R$ 99,99.`,
    h1: servico.h1Tpl.replace("${b}", bairro.nome),
    subtitulo: servico.subtitulo,
    faq: servico.faq.map((f) => ({
      pergunta: f.pergunta.replace("${b}", bairro.nome),
      resposta: f.resposta.replace("${b}", bairro.nome),
    })),
    servicoSlug,
    bairroSlug,
  };
}

export const SERVICOS_MIRROR = servicos;
export const BAIRROS_MIRROR = bairros;
