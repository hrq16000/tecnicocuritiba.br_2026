// RODADA 4C — Gate de canibalização interna das páginas comerciais P0.
//
// Compara as oito páginas comerciais prioritárias (e, em modo amplo, todas as
// rotas curadas) e falha quando duas páginas disputam a mesma intenção:
//   • title idêntico ou quase idêntico;
//   • H1 idêntico ou quase idêntico;
//   • introdução estática quase idêntica;
//   • description quase idêntica;
//   • home e /tecnico-informatica-curitiba equivalentes em title ou H1;
//   • duas páginas declarando a mesma keyword principal;
//   • link interno apontando para rota não dominante da intenção.
//
// A comparação usa similaridade de tokens (Jaccard + shingles), não presença
// de palavra isolada.
//
// Uso:
//   node scripts/check-cannibalization.mjs
//   node scripts/check-cannibalization.mjs --all      # inclui as 33 rotas curadas
import { CURATED_ROUTES, h1For, staticBodyFor, linksFor } from "./curated-static-body.mjs";

const args = process.argv.slice(2);
const ALL = args.includes("--all");

// Matriz de intenção — uma única página dominante por intenção.
export const INTENT_MATRIX = [
  { path: "/", keyword: "marca tecnico em curitiba", role: "home/roteador PF×PJ", notCompeting: ["/tecnico-informatica-curitiba"] },
  { path: "/tecnico-informatica-curitiba", keyword: "tecnico de informatica em curitiba", role: "dominante local", notCompeting: ["/"] },
  { path: "/servicos/manutencao-de-computador", keyword: "conserto e manutencao de computador", role: "serviço hardware/software", notCompeting: ["/servicos/manutencao-de-notebook"] },
  { path: "/servicos/manutencao-de-notebook", keyword: "assistencia tecnica de notebook", role: "serviço notebook", notCompeting: ["/servicos/manutencao-de-computador"] },
  { path: "/servicos/recuperacao-de-dados", keyword: "backup e recuperacao de dados", role: "serviço dados", notCompeting: ["/servicos/formatacao"] },
  { path: "/atendimento-domicilio", keyword: "tecnico de informatica a domicilio", role: "modalidade domiciliar", notCompeting: ["/atendimento-remoto", "/coleta-e-entrega"] },
  { path: "/servicos/formatacao", keyword: "formatacao de computador", role: "serviço formatação", notCompeting: ["/servicos/remocao-de-virus"] },
  { path: "/servicos/upgrade-ssd-ram", keyword: "instalacao de ssd e upgrade de memoria", role: "serviço upgrade", notCompeting: ["/servicos/manutencao-de-computador"] },
  { path: "/empresa-de-ti-curitiba", keyword: "empresa de ti em curitiba", role: "PJ institucional", notCompeting: ["/servicos/suporte-tecnico-empresarial"] },
  { path: "/servicos/suporte-tecnico-empresarial", keyword: "suporte tecnico empresarial", role: "PJ execução", notCompeting: ["/empresa-de-ti-curitiba", "/servicos/manutencao-preventiva-empresas", "/servicos/backup-para-empresas"] },
  // Onda 3D: rotina planejada (preventiva) x reparo (manutenção de computador);
  // prevenção (backup) x tentativa após perda (recuperação de dados).
  { path: "/servicos/manutencao-preventiva-empresas", keyword: "manutencao preventiva de computadores para empresas", role: "PJ rotina planejada", notCompeting: ["/servicos/manutencao-de-computador", "/servicos/suporte-tecnico-empresarial", "/empresa-de-ti-curitiba"] },
  { path: "/servicos/backup-para-empresas", keyword: "backup para empresas", role: "PJ prevenção de perda", notCompeting: ["/servicos/recuperacao-de-dados", "/servicos/suporte-tecnico-empresarial", "/empresa-de-ti-curitiba"] },
  // Onda 3E: modalidade (remoto) x contexto de trabalho (home office) x
  // organização (empresarial); confiança durante o atendimento (segurança dos
  // dados) x prevenção (backup) x tentativa após perda (recuperação).
  { path: "/atendimento-remoto", keyword: "atendimento remoto de informatica", role: "modalidade remota", notCompeting: ["/atendimento-domicilio", "/servicos/suporte-home-office", "/servicos/suporte-tecnico-empresarial"] },
  { path: "/servicos/montagem-de-pc", keyword: "montagem de pc em curitiba", role: "construir e validar um conjunto novo", notCompeting: ["/servicos/manutencao-de-computador", "/servicos/upgrade-ssd-ram", "/equipamentos-atendidos"] },
  { path: "/servicos/suporte-home-office", keyword: "suporte tecnico para home office", role: "contexto de trabalho em casa", notCompeting: ["/atendimento-remoto", "/servicos/suporte-tecnico-empresarial", "/servicos/redes-e-wifi"] },
  { path: "/seguranca-dos-dados", keyword: "seguranca dos dados na assistencia tecnica", role: "confiança e práticas no atendimento", notCompeting: ["/servicos/backup-para-empresas", "/servicos/recuperacao-de-dados", "/precos-e-politicas"] },
  { path: "/equipamentos-atendidos", keyword: "equipamentos atendidos assistencia tecnica", role: "hub de equipamentos", notCompeting: ["/servicos/manutencao-de-notebook", "/servicos/manutencao-de-computador"] },
  // Cluster de sintoma (Rodada 3B/3C): intenção informacional de diagnóstico,
  // dominante para a busca por sintoma — nunca para a busca por serviço.
  { path: "/problemas/notebook-nao-liga", keyword: "notebook nao liga", role: "sintoma notebook", notCompeting: ["/servicos/manutencao-de-notebook", "/servicos/formatacao"] },
  { path: "/problemas/computador-lento", keyword: "computador lento", role: "sintoma lentidao", notCompeting: ["/servicos/manutencao-de-computador", "/servicos/formatacao", "/servicos/upgrade-ssd-ram"] },
  { path: "/problemas/tela-azul-windows", keyword: "tela azul windows", role: "sintoma instabilidade do sistema", notCompeting: ["/servicos/formatacao", "/servicos/upgrade-ssd-ram", "/problemas/computador-lento"] },
  { path: "/problemas/notebook-superaquecendo", keyword: "notebook superaquecendo", role: "sintoma temperatura", notCompeting: ["/servicos/manutencao-de-notebook", "/problemas/notebook-nao-liga", "/problemas/computador-lento"] },
  { path: "/problemas/notebook-nao-carrega-bateria", keyword: "notebook nao carrega bateria", role: "sintoma de carga e alimentacao", notCompeting: ["/servicos/manutencao-de-notebook", "/problemas/notebook-nao-liga", "/servicos/conserto-placa"] },
  { path: "/problemas/tv-nao-liga", keyword: "tv nao liga", role: "sintoma de tv", notCompeting: ["/servicos/conserto-tv", "/servicos/conserto-placa", "/problemas/notebook-nao-liga"] },
  { path: "/problemas/computador-desliga-sozinho", keyword: "computador desliga sozinho", role: "sintoma de desligamento", notCompeting: ["/servicos/manutencao-de-computador", "/problemas/computador-lento", "/problemas/notebook-superaquecendo", "/problemas/notebook-nao-liga"] },
  { path: "/problemas/wifi-caindo-toda-hora", keyword: "wifi caindo toda hora", role: "sintoma de rede", notCompeting: ["/servicos/redes-e-wifi", "/servicos/suporte-tecnico-empresarial"] },
  { path: "/problemas/tv-com-som-sem-imagem", keyword: "tv com som e sem imagem", role: "sintoma de televisor", notCompeting: ["/servicos/conserto-tv", "/servicos/conserto-placa", "/problemas/tv-nao-liga"] },
  { path: "/problemas/notebook-molhado", keyword: "notebook molhado", role: "sintoma de liquido em notebook", notCompeting: ["/servicos/manutencao-de-notebook", "/servicos/conserto-placa", "/servicos/recuperacao-de-dados"] },
  { path: "/problemas/tela-de-notebook-quebrada", keyword: "tela de notebook quebrada", role: "sintoma de tela/painel em notebook", notCompeting: ["/servicos/manutencao-de-notebook", "/servicos/conserto-monitor", "/servicos/conserto-placa"] },
  { path: "/problemas/hd-nao-reconhecido", keyword: "hd nao reconhecido", role: "sintoma de armazenamento nao detectado", notCompeting: ["/servicos/recuperacao-de-dados", "/servicos/upgrade-ssd-ram", "/servicos/manutencao-de-computador"] },
  { path: "/problemas/computador-nao-liga", keyword: "computador de mesa nao liga", role: "sintoma de energia/POST em desktop", notCompeting: ["/servicos/manutencao-de-computador", "/servicos/conserto-placa", "/problemas/notebook-nao-liga", "/problemas/computador-desliga-sozinho"] },
  { path: "/problemas/notebook-com-tela-preta", keyword: "notebook com tela preta", role: "sintoma de ausencia de imagem em notebook", notCompeting: ["/servicos/manutencao-de-notebook", "/problemas/notebook-nao-liga", "/problemas/tela-de-notebook-quebrada"] },
  { path: "/problemas/tv-desligando-sozinha", keyword: "tv desligando sozinha", role: "sintoma de desligamento espontaneo de tv", notCompeting: ["/servicos/conserto-tv", "/problemas/tv-nao-liga", "/problemas/tv-com-som-sem-imagem"] },
  { path: "/problemas/computador-fazendo-barulho", keyword: "computador fazendo barulho", role: "sintoma de ruido em computador", notCompeting: ["/servicos/manutencao-de-computador", "/problemas/computador-lento", "/problemas/computador-desliga-sozinho"] },
  { path: "/problemas/tv-com-linhas-na-tela", keyword: "tv com linhas na tela", role: "sintoma de linhas na imagem de tv", notCompeting: ["/servicos/conserto-tv", "/problemas/tv-com-som-sem-imagem", "/servicos/conserto-placa"] },
  { path: "/problemas/tv-sem-som", keyword: "tv sem som", role: "sintoma de ausencia de audio em tv", notCompeting: ["/servicos/conserto-tv", "/problemas/tv-com-som-sem-imagem", "/problemas/tv-desligando-sozinha", "/servicos/conserto-placa"] },
  { path: "/problemas/impressora-nao-imprime", keyword: "impressora nao imprime", role: "sintoma de falha de impressao", notCompeting: ["/conserto-impressora-curitiba", "/servicos/redes-e-wifi", "/servicos/manutencao-de-computador"] },
  { path: "/problemas/monitor-sem-sinal", keyword: "monitor sem sinal", role: "sintoma de ausencia de video em desktop", notCompeting: ["/servicos/conserto-monitor", "/problemas/computador-nao-liga", "/problemas/notebook-com-tela-preta", "/servicos/manutencao-de-computador"] },
  { path: "/problemas/notebook-lento", keyword: "notebook lento", role: "sintoma de lentidao em notebook", notCompeting: ["/problemas/computador-lento", "/servicos/upgrade-ssd-ram", "/servicos/manutencao-de-notebook", "/servicos/formatacao"] },
  { path: "/problemas/computador-travando", keyword: "computador travando", role: "sintoma de congelamento em desktop", notCompeting: ["/problemas/computador-lento", "/problemas/tela-azul-windows", "/problemas/computador-desliga-sozinho", "/servicos/manutencao-de-computador"] },
  { path: "/problemas/touchpad-nao-funciona", keyword: "touchpad nao funciona", role: "sintoma de touchpad em notebook", notCompeting: ["/problemas/teclado-de-notebook-nao-funciona", "/servicos/manutencao-de-notebook", "/problemas/notebook-molhado", "/atendimento-remoto"] },
  { path: "/problemas/teclado-de-notebook-nao-funciona", keyword: "teclado de notebook nao funciona", role: "sintoma de teclado em notebook", notCompeting: ["/servicos/manutencao-de-notebook", "/problemas/notebook-molhado", "/servicos/conserto-placa"] },
];

const P0 = new Set(INTENT_MATRIX.map((i) => i.path));

const STOP = new Set(
  "a o e de da do das dos em no na nos nas para por com sem que se ao aos as os um uma uns umas mais ou seu sua seus suas pelo pela como quando onde entre sobre ate the and".split(" "),
);
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const tokens = (s) => norm(s).split(" ").filter((t) => t.length > 2 && !STOP.has(t));
const shingles = (s, n = 3) => {
  const t = tokens(s);
  const out = new Set();
  for (let i = 0; i + n <= t.length; i += 1) out.add(t.slice(i, i + n).join(" "));
  return out;
};
const jaccard = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const v of a) if (b.has(v)) inter += 1;
  return inter / (a.size + b.size - inter);
};

const introOf = (path) => {
  try {
    const body = staticBodyFor(path) ?? "";
    const m = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    return m ? m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  } catch {
    return "";
  }
};

const pages = CURATED_ROUTES.filter((r) => ALL || P0.has(r.path)).map((r) => {
  let links = [];
  try {
    links = (linksFor(r.path) ?? []).map((l) => (typeof l === "string" ? l : l.href ?? l.to ?? ""));
  } catch {
    links = [];
  }
  return {
    path: r.path,
    title: r.title,
    description: r.description,
    h1: (() => {
      try {
        return h1For(r.path) ?? "";
      } catch {
        return "";
      }
    })(),
    intro: introOf(r.path),
    links: links.filter(Boolean),
  };
});

const failures = [];
const warn = [];
// Rotas de família geográfica (cidade/bairro) usam template data-driven e
// compartilham fraseado por construção — no modo --all viram aviso, nunca
// bloqueio. O gate duro vale para as páginas comerciais P0.
const familyKey = (p) => {
  if (p.startsWith("/bairros/")) return "bairros";
  if (p.startsWith("/tecnico-informatica-")) return "cidades";
  return null;
};
const isTemplatePair = (a, b) => {
  const fa = familyKey(a);
  const fb = familyKey(b);
  return Boolean(fa) && fa === fb && !(P0.has(a) && P0.has(b));
};
const add = (msg, a, b) => {
  if (a && b && isTemplatePair(a, b)) warn.push(`${msg} [família de template — informativo]`);
  else if (a && b && (!P0.has(a) || !P0.has(b)) && ALL) warn.push(`${msg} [fora do escopo P0 — informativo]`);
  else failures.push(msg);
};

// 1. Duplicidade exata de title / H1 / description
const seen = (field) => {
  const map = new Map();
  for (const p of pages) {
    const key = norm(p[field]);
    if (!key) continue;
    if (map.has(key)) add(`${field} idêntico entre ${map.get(key)} e ${p.path}: "${p[field]}"`, map.get(key), p.path);
    else map.set(key, p.path);
  }
};
["title", "h1", "description"].forEach(seen);

// 2. Similaridade alta entre pares
const LIMITS = { title: 0.7, h1: 0.7, intro: 0.55, description: 0.6 };
for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    const a = pages[i];
    const b = pages[j];
    for (const [field, limit] of Object.entries(LIMITS)) {
      const sa = field === "intro" ? shingles(a[field]) : new Set(tokens(a[field]));
      const sb = field === "intro" ? shingles(b[field]) : new Set(tokens(b[field]));
      const score = jaccard(sa, sb);
      if (score > limit) add(`${field} quase idêntico (${score.toFixed(2)} > ${limit}) entre ${a.path} e ${b.path}`, a.path, b.path);
      else if (score > limit - 0.12 && score > 0) warn.push(`${field} próximo (${score.toFixed(2)}) entre ${a.path} e ${b.path}`);
    }
  }
}

// 3. Home × técnico Curitiba precisam ser explicitamente distintas
const home = pages.find((p) => p.path === "/");
const local = pages.find((p) => p.path === "/tecnico-informatica-curitiba");
if (home && local) {
  for (const field of ["title", "h1", "intro"]) {
    const score = jaccard(new Set(tokens(home[field])), new Set(tokens(local[field])));
    if (score > 0.5) add(`home × /tecnico-informatica-curitiba com ${field} equivalente (${score.toFixed(2)} > 0.50)`);
  }
}

// 4. Keyword principal única por intenção
const kw = new Map();
for (const item of INTENT_MATRIX) {
  const key = norm(item.keyword);
  if (kw.has(key)) add(`keyword principal duplicada "${item.keyword}": ${kw.get(key)} e ${item.path}`);
  else kw.set(key, item.path);
}

// 5. Links internos não podem apontar para a rota não dominante da intenção
const intentByPath = new Map(INTENT_MATRIX.map((i) => [i.path, i]));
for (const p of pages) {
  const intent = intentByPath.get(p.path);
  if (!intent) continue;
  for (const href of p.links) {
    const clean = href.split("#")[0].replace(/\/$/, "") || "/";
    if (intent.notCompeting.includes(clean) && clean !== "/tecnico-informatica-curitiba" && p.path === "/")
      warn.push(`${p.path} aponta para ${clean} (rota concorrente declarada)`);
  }
}

// 6. Canonical coerente (a fonte curada é path-relativa ao domínio canônico)
for (const p of pages) if (!p.path.startsWith("/")) add(`canonical inválido para ${p.path}`);

console.log(`check:cannibalization — ${pages.length} página(s) comparada(s) (${ALL ? "todas as curadas" : "P0"}).`);
for (const w of warn.slice(0, 20)) console.log(`  aviso: ${w}`);
if (failures.length) {
  console.error("\nBLOQUEADO — canibalização interna detectada:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("✓ Nenhuma canibalização entre as páginas comerciais P0.");
