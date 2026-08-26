#!/usr/bin/env node
/**
 * RODADA 3S — gate do padrão visual das páginas empresariais.
 *
 * Escopo fechado: /empresa-de-ti-curitiba e /servicos/suporte-tecnico-empresarial.
 * Valida apresentação e conformidade editorial, sem tocar em conteúdo:
 *   • variante empresarial aplicada (sem herdar o template residencial);
 *   • CTA primário + no máximo um CTA secundário de contexto (link interno);
 *   • no máximo 3 CTAs de WhatsApp na página de serviço;
 *   • ausência de elementos exclusivos do template de sintoma;
 *   • ausência de claims proibidos (promessa de prazo/resultado/conformidade);
 *   • breadcrumb correto por família (hub sem pai, serviço com "Serviços").
 */
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const errors = [];
const ok = [];
const check = (cond, msg) => (cond ? ok.push(msg) : errors.push(msg));

const lib = read("src/lib/visualEmpresarial3s.ts");
const layout = read("src/components/servico/ServicoLandingLayout.tsx");
const core = read("src/pages/servicos/ServicoCore.tsx");
const hub = read("src/pages/EmpresaDeTiCuritiba.tsx");

// 1. Escopo fechado
const escopoBloco = lib.match(/VISUAL_3S_PATHS = \[([\s\S]*?)\]/)?.[1] ?? "";
const escopo = [...escopoBloco.matchAll(/"(\/[a-z0-9/-]+)"/g)].map((m) => m[1]);
check(
  escopo.includes("/empresa-de-ti-curitiba") &&
    escopo.includes("/servicos/suporte-tecnico-empresarial") &&
    escopo.length === 2,
  "escopo 3S limitado às duas páginas empresariais",
);

// 2. Variante empresarial ligada só ao slug do escopo
check(/VISUAL_3S_SERVICO_SLUGS = \["suporte-tecnico-empresarial"\]/.test(lib), "variante empresarial restrita ao slug do escopo");
check(core.includes("VISUAL_3S_SERVICO_SLUGS") && core.includes('variante: "empresarial"'), "ServicoCore aplica a variante empresarial");
check(layout.includes("const isEmpresarial = data.variante") && layout.includes("EMPRESARIAL_SERVICO_HERO"), "layout diferencia hero empresarial do residencial");

// 3. Hierarquia de CTAs
for (const [nome, src] of [["hub", hub], ["layout de serviço", layout]]) {
  const secundarios = (src.match(/data-cta-secundario="empresarial"/g) || []).length;
  check(secundarios === 1, `${nome}: exatamente um CTA secundário de contexto`);
}
const waCtas = (layout.match(/data-cta-location=\{`\$\{data\.trackingKey\}/g) || []).length;
check(waCtas <= 3, `layout de serviço: ${waCtas} CTA(s) de WhatsApp (limite 3)`);
const hubWa = (hub.match(/wa\.me|whatsappUrl}/g) || []).length;
check(hubWa > 0, "hub mantém CTA primário de WhatsApp");

// 4. Sem elementos do template de sintoma
const sintoma = [/role="alert"/, /não insista/i, /nao-insistir/];
for (const [nome, src] of [["hub", hub], ["layout de serviço", layout]]) {
  check(!sintoma.some((re) => re.test(src)), `${nome}: sem elementos exclusivos do template de sintoma`);
}

// 5. Claims proibidos na camada visual empresarial
const claims = [
  /em até \d+\s*(h|horas|dias)/i,
  /garantimos? (o )?(resultado|funcionamento)/i,
  /100% (seguro|garantido)/i,
  /conformidade (com a )?(lgpd|iso)/i,
  /melhor (empresa|suporte) de curitiba/i,
];
for (const [nome, src] of [["padrão 3S", lib], ["hub", hub], ["layout de serviço", layout]]) {
  const hit = claims.find((re) => re.test(src));
  check(!hit, `${nome}: sem promessa não comprovável${hit ? ` (${hit})` : ""}`);
}

// 6. Taxonomia / breadcrumbs
check(
  /Breadcrumbs items=\{\[\{ label: "Empresa de TI em Curitiba" \}\]\}/.test(hub.replace(/\s+/g, " ")),
  "hub: breadcrumb Início › Empresa de TI em Curitiba",
);
check(
  /items=\{\[\{ label: "Serviços", href: "\/servicos" \}/.test(layout.replace(/\s+/g, " ")),
  "serviço empresarial: breadcrumb com pai Serviços",
);

// 7. JSON-LD dentro do escopo (sem rating inventado, sem schema de sintoma)
check(!/aggregateRating|ratingValue/.test(hub), "hub: sem aggregateRating");
check(/"@type": "FAQPage"/.test(hub) && /"@type": "Service"/.test(hub), "hub: JSON-LD limitado a Service + FAQPage");

// 8. Blocos exclusivos do padrão empresarial (hub × serviço distintos)
const hubBlocos = read("src/components/empresa/HubEmpresarialBlocos.tsx");
const servicoBlocos = read("src/components/servico/SuporteEmpresarialBlocos.tsx");
const semComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const modalidades = read("src/components/servico/SuporteModalidadesSection.tsx");

check(hub.includes("PilaresOperacionaisSection") && hub.includes("MapaServicosEmpresariaisSection"), "hub: pilares operacionais e mapa de serviços aplicados");
const mapaEntradas = (hubBlocos.match(/^\s{4}to: "\/[a-z0-9/-]+",$/gm) || []).length;
check(mapaEntradas <= 11 && /const MAPA = \[/.test(hubBlocos), "hub: mapa de serviços presente");
check((hubBlocos.match(/label: "[^"]+",\n\s+to:/g) || []).length <= 7, "hub: mapa com no máximo sete entradas");
check(!/wa\.me/.test(hubBlocos) && !/wa\.me/.test(servicoBlocos), "blocos 3S não criam CTA de WhatsApp extra");
check(!/TI para (advogad|clínic|contad|arquitet)/i.test(hubBlocos), "hub: contextos sem falsa especialização por profissão");

check(core.includes("SuporteEmpresarialBlocos"), "serviço: indicadores, fluxo e impacto aplicados");
check(/id="escopo-empresarial"/.test(servicoBlocos) && /id="fluxo-empresarial"/.test(servicoBlocos) && /id="impacto"/.test(servicoBlocos), "serviço: âncoras de escopo, fluxo e impacto");
check(/prazo e prioridade dependem de/i.test(servicoBlocos), "serviço: aviso de que prazo e prioridade não são automáticos");
check(!/(\bSLA\b|24 ?horas|tempo de resposta|chamados ilimitados)/i.test(semComentarios(servicoBlocos)), "serviço: sem SLA, cobertura 24h ou chamados ilimitados");
check(!/R\$/.test(servicoBlocos) && !/R\$/.test(hubBlocos), "blocos 3S sem preço novo");
check(/avulso/i.test(modalidades) && /recorrente/i.test(modalidades) && /não trabalhamos com suporte ilimitado/i.test(modalidades), "serviço: comparação avulso × recorrente sem promessa de ilimitado");

// 9. Hub e serviço não compartilham o mesmo hero nem o mesmo resumo
const hubHero = lib.match(/EMPRESARIAL_HUB_HERO[\s\S]*?\n\};/)?.[0] ?? "";
const servHero = lib.match(/EMPRESARIAL_SERVICO_HERO[\s\S]*?\n\};/)?.[0] ?? "";
const contexto = (t) => t.match(/contexto:\s*"?([^",]+)/)?.[1] ?? "";
const cta = (t) => t.match(/ctaPrimario:\s*"([^"]+)"/)?.[1] ?? "";
check(contexto(hubHero) !== contexto(servHero) && cta(hubHero) !== cta(servHero), "hub e serviço com hero e CTA distintos");

for (const m of ok) console.log(`  ✓ ${m}`);
if (errors.length) {
  console.error("\n✗ RODADA 3S com pendências:");
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}
console.log("\nRODADA 3S: padrão visual empresarial validado.");
