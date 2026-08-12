// ============================================================================
// ESPELHO SEM DRIFT DAS LANDINGS WI-FI / SMART TV × BAIRRO (prerender estático)
// ============================================================================
// Lê `src/pages/servico-bairro/wifiTvBairroData.ts` e reproduz exatamente os
// mesmos metaTitle / metaDescription / H1 / subtítulo que o React hidrata,
// para que o crawler sem JS receba o HTML completo com canonical self.
//
// Só entram bairros com `indexable: true` (Onda 1 de liberação de índice).
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const src = readFileSync(join(ROOT, "src/pages/servico-bairro/wifiTvBairroData.ts"), "utf8");

/** Extrai o bloco `{ ... }` balanceado a partir de um índice de abertura. */
function block(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(openIdx, i + 1);
    }
  }
  return "";
}

/** Bairros com narrativa exclusiva e `indexable: true` explícito. */
const indexaveis = [];
for (const m of src.matchAll(/"?([a-z-]+)"?:\s*\{\s*\n\s*slug:\s*"([a-z-]+)"/g)) {
  const body = block(src, src.indexOf("{", m.index));
  if (!/\n\s*indexable:\s*true/.test(body)) continue;
  const nome = body.match(/\n\s*nome:\s*"([^"]+)"/)?.[1];
  const tempo = body.match(/\n\s*tempoAtendimento:\s*"([^"]+)"/)?.[1] ?? "";
  if (nome) indexaveis.push({ slug: m[2], nome, tempo });
}

/** Lê um template literal do builder e resolve `${b.nome}` / `${b.tempoAtendimento}`. */
function tpl(builder, campo) {
  const fnIdx = src.indexOf(`export function ${builder}(`);
  const body = src.slice(fnIdx, src.indexOf("\nexport ", fnIdx + 1) + 1 || undefined);
  return body.match(new RegExp(`\\n\\s{4}${campo}:\\s*\`([^\`]+)\``))?.[1] ?? "";
}

const VERTICAIS = [
  { builder: "buildWifiBairroData", servicoSlug: "redes-wifi" },
  { builder: "buildTvBairroData", servicoSlug: "manutencao-tv" },
].map((v) => ({
  ...v,
  title: tpl(v.builder, "metaTitle"),
  description: tpl(v.builder, "metaDescription"),
  h1: tpl(v.builder, "h1"),
  subtitulo: tpl(v.builder, "subtitulo"),
}));

const fill = (t, b) =>
  t.replace(/\$\{b\.nome\}/g, b.nome).replace(/\$\{b\.tempoAtendimento\}/g, b.tempo);

/** Rotas Wi-Fi/TV × bairro indexáveis, prontas para o prerender curado. */
export const WIFI_TV_BAIRRO_ROUTES = indexaveis.flatMap((b) =>
  VERTICAIS.map((v) => ({
    path: `/servicos/${v.servicoSlug}/${b.slug}`,
    title: fill(v.title, b),
    description: fill(v.description, b),
    h1: fill(v.h1, b),
    subtitulo: fill(v.subtitulo, b),
  })),
);
