// ─────────────────────────────────────────────────────────────
// CORPO ESTÁTICO + JSON-LD ESTÁTICO POR ROTA CURADA
//
// Objetivo (Rodada 1 — Static SEO Foundation): eliminar o fallback da
// homepage no HTML inicial das rotas curadas. Cada rota recebe:
//   • um único H1 próprio
//   • um primeiro parágrafo próprio
//   • breadcrumb semântico (apenas para URLs que existem)
//   • 3–6 links internos contextuais
//   • CTA textual reaproveitando o deep link oficial do WhatsApp
//   • JSON-LD estático coerente com o tipo da página
//
// Fonte dos títulos/descrições: scripts/curated-routes-meta.mjs (espelho
// curado das fontes React). Nada aqui inventa preço, avaliação, SLA,
// endereço físico ou parceiro. Nenhum conteúdo é ocultado (o bloco vive
// dentro do <noscript> do #root e é substituído pelo React na hidratação).
// ─────────────────────────────────────────────────────────────

import { CURATED_ROUTES } from "./curated-routes-meta.mjs";
import { EDITORIAL_WAVE } from "./lib/editorial-wave.mjs";
import { BLOCOS_3T, CTA_3T } from "./lib/blocos-3t.mjs";
import { BLOCOS_3U, CTA_3U } from "./lib/blocos-3u.mjs";
import { BLOCOS_4A, CTA_4A } from "./lib/blocos-4a.mjs";
import { SERVICO_VISUAL_3Q } from "./lib/servico-visual-3q.mjs";

// Rodada 3G/A1 — segundo link de entrada dos artigos aprovados, servido
// no HTML estático das páginas comerciais. Espelha
// src/lib/editorialInboundLinks.ts e é derivado da onda editorial
// aprovada (fail-closed: artigo noindex nunca aparece aqui).
const EDITORIAL_LABELS = {
  "quando-trocar-hd-por-ssd": "Quando vale trocar o HD por SSD",
  "como-saber-se-pc-tem-virus-malware": "Como saber se o PC tem vírus ou malware",
  "backup-como-proteger-seus-arquivos": "Backup: como proteger seus arquivos",
  "como-melhorar-sinal-wifi-em-casa": "Como melhorar o sinal de Wi-Fi em casa",
  "notebook-superaquecendo-o-que-fazer": "Notebook superaquecendo: o que fazer",
};

const EDITORIAL_EXTRA_INBOUND = {
  "backup-como-proteger-seus-arquivos": ["/seguranca-dos-dados"],
};

const EDITORIAL_INBOUND = (() => {
  const map = {};
  for (const art of EDITORIAL_WAVE) {
    const label = EDITORIAL_LABELS[art.slug];
    if (!label) continue;
    const alvos = [art.pilar, ...(EDITORIAL_EXTRA_INBOUND[art.slug] ?? [])];
    for (const alvo of alvos) {
      (map[alvo] ??= []).push({ slug: art.slug, label });
    }
  }
  for (const k of Object.keys(map)) map[k] = map[k].slice(0, 3);
  return map;
})();

function editorialInboundHtml(path) {
  const itens = EDITORIAL_INBOUND[path] ?? [];
  if (itens.length === 0) return "";
  const li = itens
    .map((i) => `<li><a href="/blog/${i.slug}" style="color:#7fd4ec">${esc(i.label)}</a></li>`)
    .join("");
  return `<h2 style="font-size:1.1rem;margin:24px 0 8px">Conteúdo relacionado</h2><ul style="line-height:1.9;padding-left:20px">${li}</ul>`;
}

export const SITE = "https://tecnico.curitiba.br";

// Espelho mínimo de src/lib/siteConfig.ts / src/lib/localBusinessJsonLd.ts.
// Mantém NAP, área atendida e horários idênticos ao runtime.
export const SITE_CONFIG = {
  brandName: "Técnico em Curitiba",
  legalName: "Técnico em Curitiba — Assistência Técnica em Informática",
  foundedYear: "1998",
  phoneE164: "+5541997086380",
  whatsappNumber: "5541997086380",
  primaryCity: "Curitiba",
  region: "PR",
  country: "BR",
  businessType: ["LocalBusiness", "ProfessionalService", "ComputerRepairService"],
  serviceArea: [
    "Curitiba",
    "São José dos Pinhais",
    "Pinhais",
    "Colombo",
    "Araucária",
    "Campo Largo",
    "Região Metropolitana de Curitiba",
  ],
};

const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
];

const NAP = {
  name: SITE_CONFIG.brandName,
  legalName: SITE_CONFIG.legalName,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.primaryCity,
    addressRegion: SITE_CONFIG.region,
    addressCountry: SITE_CONFIG.country,
  },
  telephone: SITE_CONFIG.phoneE164,
  email: SITE_CONFIG.email,
};

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BY_PATH = new Map(CURATED_ROUTES.map((r) => [r.path, r]));

/** Rótulo curto (H1) derivado do título curado da própria rota. */
export function h1For(route) {
  // Rotas com H1 explícito (espelho da fábrica serviço × bairro) mandam.
  if (route.h1) return route.h1;
  const head = route.title.split("|")[0].trim();
  // Títulos muito curtos ganham o complemento do próprio título curado
  // (evita H1 genérico como "Equipamentos Atendidos").
  if (head.length < 26) {
    const tail = route.title.split("|").slice(1).join("|").split("-")[0].trim();
    return tail ? `${head} — ${tail}` : head;
  }
  return head;
}

const SHORT_LABEL = {
  "/": "Início",
  "/guia-tecnico-informatica": "Guia técnico de informática",
  "/servicos": "Serviços",
  "/sobre": "Sobre",
  "/faq": "Dúvidas frequentes",
  "/contato": "Contato",
  "/como-funciona": "Como funciona",
  "/precos-e-politicas": "Preços e políticas",
  "/tecnico-informatica-curitiba": "Técnico em Curitiba",
  "/empresa-de-ti-curitiba": "Empresa de TI em Curitiba",
  "/atendimento-domicilio": "Atendimento em domicílio",
  "/atendimento-remoto": "Atendimento remoto",
  "/coleta-e-entrega": "Coleta e entrega",
  "/diagnostico-tecnico": "Diagnóstico técnico",
  "/equipamentos-atendidos": "Equipamentos atendidos",
  "/areas-atendidas": "Áreas atendidas",
  "/quando-nao-compensa": "Quando não compensa reparar",
  "/problemas/notebook-nao-liga": "Notebook não liga",
  "/problemas/tela-azul-windows": "Tela azul no Windows",
  "/problemas/notebook-superaquecendo": "Notebook superaquecendo",
  "/problemas/notebook-nao-carrega-bateria": "Notebook não carrega a bateria",
  "/problemas/tv-nao-liga": "TV não liga",
  "/problemas/computador-desliga-sozinho": "Computador desliga sozinho",
  "/problemas/wifi-caindo-toda-hora": "Wi-Fi caindo toda hora",
  "/problemas/tv-com-som-sem-imagem": "TV com som e sem imagem",
  "/problemas/notebook-molhado": "Notebook molhado",
  "/problemas/tela-de-notebook-quebrada": "Tela de notebook quebrada",
  "/problemas/hd-nao-reconhecido": "HD não reconhecido",
  "/problemas/computador-nao-liga": "Computador não liga",
  "/problemas/teclado-de-notebook-nao-funciona": "Teclado de notebook não funciona",
  "/problemas/computador-fazendo-barulho": "Computador fazendo barulho",
  "/problemas/notebook-com-tela-preta": "Notebook com tela preta",
  "/problemas/tv-desligando-sozinha": "TV desligando sozinha",
  "/problemas/tv-sem-som": "TV sem som",
  "/problemas/impressora-nao-imprime": "Impressora não imprime",
  "/problemas/monitor-sem-sinal": "Monitor sem sinal",
  "/problemas/notebook-lento": "Notebook lento",
  "/problemas/computador-travando": "Computador travando",
  "/problemas/notebook-desligando-sozinho": "Notebook desligando sozinho",
  "/problemas/pen-drive-nao-reconhecido": "Pen drive não reconhecido",
  "/problemas/touchpad-nao-funciona": "Touchpad não funciona",
  "/problemas/dobradica-do-notebook-quebrada": "Dobradiça do notebook quebrada",
  "/problemas/computador-sem-som": "Computador sem som",
  "/problemas/tela-do-computador-piscando": "Tela do computador piscando",
  "/problemas/notebook-nao-conecta-no-wifi": "Notebook não conecta no Wi-Fi",
  "/problemas/windows-nao-inicia": "Windows não inicia",
  "/problemas/webcam-nao-funciona": "Webcam não funciona",
  "/problemas/tv-nao-conecta-no-wifi": "TV não conecta no Wi-Fi",
  "/problemas/tv-com-imagem-escura": "TV com imagem escura",
  "/problemas/tv-com-linhas-na-tela": "TV com linhas na tela",
  "/problemas/tv-travando": "TV travando",
  "/problemas/mouse-nao-funciona": "Mouse não funciona",
  "/seguranca-dos-dados": "Segurança dos dados",
  "/servicos/suporte-home-office": "Suporte para home office",
  "/servicos/montagem-de-pc": "Montagem de PC e PC Gamer",
};

export function labelFor(path) {
  if (SHORT_LABEL[path]) return SHORT_LABEL[path];
  const route = BY_PATH.get(path);
  if (route) return h1For(route);
  return path;
}

/** Família da rota — decide breadcrumb, links e schema. */
export function familyOf(path) {
  if (path === "/") return "home";
  if (path.startsWith("/problemas/")) return "problema";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(path)) return "servico-bairro";
  if (path.startsWith("/servicos/")) return "servico";
  if (path === "/servicos") return "hub-servicos";
  if (path.startsWith("/bairros/")) return "bairro";
  if (path === "/tecnico-informatica-curitiba") return "cidade-mae";
  if (path.startsWith("/tecnico-informatica-")) return "cidade";
  if (path === "/empresa-de-ti-curitiba") return "empresa";
  if (path === "/sobre") return "sobre";
  if (path === "/contato") return "contato";
  if (["/atendimento-domicilio", "/atendimento-remoto", "/coleta-e-entrega", "/diagnostico-tecnico"].includes(path))
    return "modalidade";
  return "institucional";
}


const SERVICOS = CURATED_ROUTES.filter((r) => r.path.startsWith("/servicos/")).map((r) => r.path);
const SERVICO_BAIRRO_PATHS = CURATED_ROUTES.filter((r) =>
  /^\/servicos\/[^/]+\/[^/]+$/.test(r.path),
).map((r) => r.path);
const BAIRROS = CURATED_ROUTES.filter((r) => r.path.startsWith("/bairros/")).map((r) => r.path);
const CIDADES = CURATED_ROUTES.filter(
  (r) => r.path.startsWith("/tecnico-informatica-") && r.path !== "/tecnico-informatica-curitiba",
).map((r) => r.path);

/** Rotação determinística de irmãos (evita blocos de links idênticos). */
function siblings(list, self, count) {
  const others = list.filter((p) => p !== self);
  const start = Math.abs(hash(self)) % Math.max(others.length, 1);
  const out = [];
  for (let i = 0; i < Math.min(count, others.length); i++) {
    out.push(others[(start + i) % others.length]);
  }
  return out;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Rótulos curtos de breadcrumb para o cluster de sintomas. */
const PROBLEMA_CRUMB_LABEL = {
  "/problemas/computador-lento": "Computador lento",
  "/problemas/notebook-nao-liga": "Notebook não liga",
};

export function breadcrumbFor(path) {
  const fam = familyOf(path);
  const crumbs = [{ path: "/", name: "Início" }];
  if (fam === "home") return crumbs;
  if (fam === "servico" || fam === "servico-bairro") crumbs.push({ path: "/servicos", name: "Serviços" });
  if (fam === "servico-bairro") {
    const parent = `/servicos/${path.split("/")[2]}`;
    if (BY_PATH.has(parent)) crumbs.push({ path: parent, name: labelFor(parent) });
  }
  // "Problemas" é nível taxonômico do cluster de sintomas: não existe rota, então vai sem URL.
  if (fam === "problema") crumbs.push({ path: null, name: "Problemas" });
  if (fam === "bairro" || fam === "cidade")
    crumbs.push({ path: "/tecnico-informatica-curitiba", name: "Técnico de Informática em Curitiba" });
  crumbs.push({ path, name: PROBLEMA_CRUMB_LABEL[path] ?? labelFor(path) });
  return crumbs;
}

/** Saídas obrigatórias por página de sintoma (contrato editorial da onda 3C). */
const PROBLEMA_LINKS = {
  "/problemas/computador-lento": [
    "/servicos/manutencao-de-computador",
    "/servicos/formatacao",
    "/servicos/upgrade-ssd-ram",
    "/servicos/remocao-de-virus",
    "/servicos/recuperacao-de-dados",
    "/guia-tecnico-informatica",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/tela-azul-windows": [
    "/servicos/formatacao",
    "/servicos/upgrade-ssd-ram",
    "/servicos/recuperacao-de-dados",
    "/servicos/manutencao-de-computador",
    "/problemas/computador-lento",
    "/guia-tecnico-informatica",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/notebook-superaquecendo": [
    "/servicos/manutencao-de-notebook",
    "/servicos/manutencao-de-computador",
    "/servicos/formatacao",
    "/problemas/notebook-nao-liga",
    "/guia-tecnico-informatica",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/notebook-nao-liga": [
    "/servicos/manutencao-de-notebook",
    "/servicos/recuperacao-de-dados",
    "/servicos/upgrade-ssd-ram",
    "/guia-tecnico-informatica",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/notebook-nao-carrega-bateria": [
    "/servicos/manutencao-de-notebook",
    "/servicos/conserto-placa",
    "/diagnostico-tecnico",
    "/problemas/notebook-nao-liga",
    "/problemas/notebook-superaquecendo",
    "/guia-tecnico-informatica",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/computador-desliga-sozinho": [
    "/servicos/manutencao-de-computador",
    "/servicos/upgrade-ssd-ram",
    "/servicos/conserto-placa",
    "/problemas/notebook-superaquecendo",
    "/problemas/tela-azul-windows",
    "/quando-nao-compensa",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/wifi-caindo-toda-hora": [
    "/servicos/redes-e-wifi",
    "/servicos/suporte-tecnico-empresarial",
    "/servicos/suporte-home-office",
    "/como-funciona",
    "/precos-e-politicas",
    "/contato",
  ],
  "/problemas/tv-nao-liga": [
    "/servicos/conserto-tv",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/quando-nao-compensa",
    "/equipamentos-atendidos",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  // Onda 10
  "/problemas/tv-com-som-sem-imagem": [
    "/servicos/conserto-tv",
    "/servicos/conserto-placa",
    "/problemas/tv-nao-liga",
    "/coleta-e-entrega",
    "/quando-nao-compensa",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/tela-de-notebook-quebrada": [
    "/servicos/manutencao-de-notebook",
    "/servicos/conserto-placa",
    "/servicos/recuperacao-de-dados",
    "/problemas/notebook-nao-liga",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/computador-nao-liga": [
    "/servicos/manutencao-de-computador",
    "/servicos/conserto-placa",
    "/servicos/recuperacao-de-dados",
    "/problemas/computador-desliga-sozinho",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/teclado-de-notebook-nao-funciona": [
    "/servicos/manutencao-de-notebook",
    "/problemas/notebook-molhado",
    "/servicos/conserto-placa",
    "/problemas/notebook-nao-liga",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/notebook-com-tela-preta": [
    "/servicos/manutencao-de-notebook",
    "/problemas/notebook-nao-liga",
    "/problemas/tela-de-notebook-quebrada",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/monitor-sem-sinal": [
    "/servicos/conserto-monitor",
    "/servicos/manutencao-de-computador",
    "/problemas/computador-nao-liga",
    "/problemas/notebook-com-tela-preta",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/notebook-lento": [
    "/servicos/upgrade-ssd-ram",
    "/servicos/manutencao-de-notebook",
    "/problemas/computador-lento",
    "/problemas/notebook-superaquecendo",
    "/servicos/formatacao",
    "/servicos/remocao-de-virus",
    "/precos-e-politicas",
  ],
  "/problemas/notebook-desligando-sozinho": [
    "/servicos/manutencao-de-notebook",
    "/problemas/notebook-superaquecendo",
    "/problemas/notebook-nao-carrega-bateria",
    "/problemas/notebook-nao-liga",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/pen-drive-nao-reconhecido": [
    "/servicos/recuperacao-de-dados",
    "/problemas/hd-nao-reconhecido",
    "/servicos/conserto-placa",
    "/servicos/remocao-de-virus",
    "/servicos/manutencao-de-computador",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/dobradica-do-notebook-quebrada": [
    "/servicos/manutencao-de-notebook",
    "/problemas/tela-de-notebook-quebrada",
    "/problemas/notebook-com-tela-preta",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/tela-do-computador-piscando": [
    "/servicos/conserto-monitor",
    "/problemas/monitor-sem-sinal",
    "/servicos/conserto-placa",
    "/servicos/manutencao-de-computador",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/webcam-nao-funciona": [
    "/servicos/manutencao-de-notebook",
    "/servicos/manutencao-de-computador",
    "/problemas/notebook-lento",
    "/problemas/computador-sem-som",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/tv-nao-conecta-no-wifi": [
    "/servicos/redes-e-wifi",
    "/servicos/conserto-tv",
    "/problemas/wifi-caindo-toda-hora",
    "/problemas/tv-travando",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/windows-nao-inicia": [
    "/servicos/formatacao",
    "/servicos/recuperacao-de-dados",
    "/servicos/upgrade-ssd-ram",
    "/problemas/computador-nao-liga",
    "/problemas/computador-lento",
    "/precos-e-politicas",
  ],
  "/problemas/tv-com-imagem-escura": [
    "/servicos/conserto-tv",
    "/problemas/tv-com-som-sem-imagem",
    "/problemas/tv-nao-liga",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/notebook-nao-conecta-no-wifi": [
    "/servicos/redes-e-wifi",
    "/problemas/wifi-caindo-toda-hora",
    "/servicos/manutencao-de-notebook",
    "/problemas/notebook-lento",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/tv-travando": [
    "/servicos/conserto-tv",
    "/problemas/tv-desligando-sozinha",
    "/servicos/redes-e-wifi",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/mouse-nao-funciona": [
    "/servicos/manutencao-de-computador",
    "/problemas/touchpad-nao-funciona",
    "/servicos/conserto-placa",
    "/problemas/computador-travando",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/computador-sem-som": [
    "/servicos/manutencao-de-computador",
    "/servicos/conserto-placa",
    "/servicos/formatacao",
    "/problemas/tv-sem-som",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/problemas/computador-travando": [
    "/servicos/manutencao-de-computador",
    "/problemas/computador-lento",
    "/problemas/tela-azul-windows",
    "/problemas/computador-desliga-sozinho",
    "/servicos/upgrade-ssd-ram",
    "/servicos/formatacao",
    "/precos-e-politicas",
  ],
  "/problemas/touchpad-nao-funciona": [
    "/servicos/manutencao-de-notebook",
    "/problemas/teclado-de-notebook-nao-funciona",
    "/problemas/notebook-molhado",
    "/atendimento-remoto",
    "/servicos/upgrade-ssd-ram",
    "/coleta-e-entrega",
    "/precos-e-politicas",
  ],
  "/problemas/tv-sem-som": [
    "/servicos/conserto-tv",
    "/problemas/tv-com-som-sem-imagem",
    "/problemas/tv-desligando-sozinha",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/quando-nao-compensa",
  ],
  "/problemas/impressora-nao-imprime": [
    "/conserto-impressora-curitiba",
    "/servicos/redes-e-wifi",
    "/servicos/manutencao-de-computador",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/tv-desligando-sozinha": [
    "/servicos/conserto-tv",
    "/problemas/tv-nao-liga",
    "/problemas/tv-com-som-sem-imagem",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/quando-nao-compensa",
  ],
  "/problemas/computador-fazendo-barulho": [
    "/servicos/manutencao-de-computador",
    "/problemas/computador-desliga-sozinho",
    "/problemas/computador-lento",
    "/servicos/recuperacao-de-dados",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/tv-com-linhas-na-tela": [
    "/servicos/conserto-tv",
    "/servicos/conserto-placa",
    "/problemas/tv-com-som-sem-imagem",
    "/problemas/tv-nao-liga",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/hd-nao-reconhecido": [
    "/problemas/pen-drive-nao-reconhecido",
    "/servicos/recuperacao-de-dados",
    "/servicos/manutencao-de-computador",
    "/servicos/upgrade-ssd-ram",
    "/problemas/computador-lento",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
  "/problemas/notebook-molhado": [
    "/servicos/manutencao-de-notebook",
    "/servicos/conserto-placa",
    "/servicos/recuperacao-de-dados",
    "/problemas/notebook-nao-liga",
    "/coleta-e-entrega",
    "/precos-e-politicas",
    "/como-funciona",
  ],
};

/** Saídas obrigatórias do cluster empresarial (contrato editorial da onda 3D). */
const SERVICO_LINKS = {
  // Saídas para o cluster de sintoma: sem esses links o HTML servido deixava
  // /problemas/* órfão (só existiam no bundle React).
  "/servicos/manutencao-de-notebook": [
    "/problemas/notebook-nao-liga",
    "/problemas/notebook-nao-carrega-bateria",
    "/problemas/notebook-molhado",
    "/problemas/tela-de-notebook-quebrada",
    "/servicos",
    "/servicos/formatacao",
    "/servicos/upgrade-ssd-ram",
    "/precos-e-politicas",
    "/contato",
  ],
  // Onda 9 — entrada obrigatória para o sintoma de rede no HTML servido.
  "/servicos/redes-e-wifi": [
    "/problemas/wifi-caindo-toda-hora",
    "/servicos/suporte-tecnico-empresarial",
    "/servicos/suporte-home-office",
    "/como-funciona",
    "/precos-e-politicas",
    "/contato",
  ],
  // Onda 8 — entrada obrigatória para o sintoma de TV no HTML servido.
  "/servicos/conserto-tv": [
    "/problemas/tv-nao-liga",
    "/problemas/tv-com-som-sem-imagem",
    "/servicos/conserto-placa",
    "/coleta-e-entrega",
    "/quando-nao-compensa",
    "/precos-e-politicas",
    "/contato",
  ],
  "/servicos/manutencao-de-computador": [
    "/problemas/computador-lento",
    "/problemas/computador-desliga-sozinho",
    "/problemas/hd-nao-reconhecido",
    "/servicos",
    "/servicos/formatacao",
    "/servicos/upgrade-ssd-ram",
    "/precos-e-politicas",
    "/contato",
  ],
  "/servicos/suporte-tecnico-empresarial": [
    "/empresa-de-ti-curitiba",
    "/servicos/manutencao-preventiva-empresas",
    "/servicos/backup-para-empresas",
    "/servicos/redes-e-wifi",
    "/atendimento-remoto",
    "/precos-e-politicas",
  ],
  "/servicos/manutencao-preventiva-empresas": [
    "/servicos/suporte-tecnico-empresarial",
    "/servicos/backup-para-empresas",
    "/servicos/manutencao-de-computador",
    "/empresa-de-ti-curitiba",
    "/como-funciona",
    "/precos-e-politicas",
  ],
  "/servicos/backup-para-empresas": [
    "/servicos/recuperacao-de-dados",
    "/servicos/suporte-tecnico-empresarial",
    "/servicos/manutencao-preventiva-empresas",
    "/empresa-de-ti-curitiba",
    "/como-funciona",
    "/precos-e-politicas",
  ],
  "/servicos/suporte-home-office": [
    "/atendimento-remoto",
    "/atendimento-domicilio",
    "/servicos/redes-e-wifi",
    "/servicos/backup-para-empresas",
    "/seguranca-dos-dados",
    "/precos-e-politicas",
  ],
  "/servicos/montagem-de-pc": [
    "/servicos/manutencao-de-computador",
    "/servicos/upgrade-ssd-ram",
    "/equipamentos-atendidos",
    "/precos-e-politicas",
    "/como-funciona",
    "/coleta-e-entrega",
  ],
  "/servicos/redes-e-wifi": [
    "/servicos/suporte-tecnico-empresarial",
    "/empresa-de-ti-curitiba",
    "/servicos/manutencao-preventiva-empresas",
    "/atendimento-domicilio",
    "/precos-e-politicas",
    "/servicos",
  ],
};

/** Saídas obrigatórias das modalidades e hubs institucionais (onda 3E). */
const PAGE_LINKS = {
  "/atendimento-remoto": [
    "/servicos/suporte-home-office",
    "/servicos/suporte-tecnico-empresarial",
    "/seguranca-dos-dados",
    "/como-funciona",
    "/precos-e-politicas",
    "/atendimento-domicilio",
  ],
  "/atendimento-domicilio": [
    "/equipamentos-atendidos",
    "/servicos/suporte-home-office",
    "/como-funciona",
    "/precos-e-politicas",
    "/coleta-e-entrega",
    "/atendimento-remoto",
  ],
  "/guia-tecnico-informatica": [
    "/servicos/manutencao-de-computador",
    "/servicos/manutencao-de-notebook",
    "/servicos/upgrade-ssd-ram",
    "/servicos/formatacao",
    "/problemas/computador-lento",
    "/problemas/notebook-nao-liga",
    "/precos-e-politicas",
  ],
  "/areas-atendidas": [
    "/tecnico-informatica-curitiba",
    "/atendimento-domicilio",
    "/atendimento-remoto",
    "/coleta-e-entrega",
    "/como-funciona",
    "/precos-e-politicas",
  ],
  "/equipamentos-atendidos": [
    "/servicos/montagem-de-pc",
    "/servicos/manutencao-de-notebook",
    "/servicos/manutencao-de-computador",
    "/servicos/upgrade-ssd-ram",
    "/servicos/recuperacao-de-dados",
    "/servicos/redes-e-wifi",
    "/servicos/suporte-home-office",
  ],
  "/seguranca-dos-dados": [
    "/precos-e-politicas",
    "/servicos/formatacao",
    "/servicos/recuperacao-de-dados",
    "/servicos/backup-para-empresas",
    "/atendimento-remoto",
    "/como-funciona",
  ],
};

export function linksFor(path) {
  if (PAGE_LINKS[path]) {
    return [...new Set(PAGE_LINKS[path].filter((p) => p !== path && BY_PATH.has(p)))];
  }
  const fam = familyOf(path);
  let out = [];
  switch (fam) {
    case "home":
      out = ["/servicos", "/tecnico-informatica-curitiba", "/como-funciona", "/precos-e-politicas", "/contato"];
      break;
    case "hub-servicos":
      out = [
        ...siblings(SERVICOS, path, 3),
        "/guia-tecnico-informatica",
        "/problemas/notebook-nao-liga",
        "/problemas/computador-lento",
        "/precos-e-politicas",
        "/contato",
      ];
      break;
    case "servico-bairro": {
      const parent = `/servicos/${path.split("/")[2]}`;
      out = [
        parent,
        "/tecnico-informatica-curitiba",
        ...siblings(SERVICO_BAIRRO_PATHS, path, 2),
        "/atendimento-domicilio",
        "/precos-e-politicas",
      ];
      break;
    }
    case "problema":
      // Cada sintoma aponta para os serviços que realmente resolvem aquele cenário.
      out = PROBLEMA_LINKS[path] ?? [
        "/servicos/manutencao-de-notebook",
        "/precos-e-politicas",
        "/como-funciona",
        "/quando-nao-compensa",
        "/servicos",
      ];
      break;
    case "servico":
      out = SERVICO_LINKS[path] ?? ["/servicos", ...siblings(SERVICOS, path, 3), "/precos-e-politicas", "/contato"];
      break;
    case "bairro":
      out = ["/tecnico-informatica-curitiba", ...siblings(BAIRROS, path, 2), "/servicos", "/atendimento-domicilio"];
      break;
    case "cidade":
      out = ["/tecnico-informatica-curitiba", ...siblings(CIDADES, path, 2), "/servicos", "/coleta-e-entrega"];
      break;
    case "cidade-mae":
      // A página-mãe distribui autoridade para bairros-âncora E cidades da RMC.
      out = [
        "/servicos",
        ...siblings(BAIRROS, path, 2),
        ...siblings(CIDADES, path, 2),
        "/atendimento-domicilio",
        "/precos-e-politicas",
      ];
      break;
    case "empresa":
      out = [
        "/servicos/suporte-tecnico-empresarial",
        "/servicos/manutencao-preventiva-empresas",
        "/servicos/backup-para-empresas",
        "/servicos/redes-e-wifi",
        "/atendimento-remoto",
        "/precos-e-politicas",
      ];
      break;
    case "sobre":
      out = ["/como-funciona", "/precos-e-politicas", "/servicos", "/contato"];
      break;
    case "contato":
      out = ["/servicos", "/como-funciona", "/precos-e-politicas", "/atendimento-domicilio"];
      break;
    case "modalidade":
      out = ["/servicos", "/como-funciona", "/precos-e-politicas", "/tecnico-informatica-curitiba"];
      break;
    default:
      out = ["/servicos", "/como-funciona", "/faq", "/contato"];
  }
  return [...new Set(out.filter((p) => p !== path && BY_PATH.has(p)))].slice(0, PROBLEMA_LINKS[path]?.length ?? SERVICO_LINKS[path]?.length ?? 6);
}

const WA_BASE = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

function waLink(route) {
  const msg = `Olá! Vim da página ${route.path} do site Técnico em Curitiba e preciso de atendimento.`;
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}

/**
 * Rodada 3Q — resumo, sumário navegável e caixas editoriais das seis
 * páginas comerciais de serviço, servidos já no HTML inicial (paridade
 * com o React). Fonte única: scripts/lib/servico-visual-3q.mjs.
 */
function visual3qHtml(path) {
  const slug = path.startsWith("/servicos/") ? path.split("/")[2] : null;
  const v = slug ? SERVICO_VISUAL_3Q[slug] : null;
  if (!v) return "";
  const resumo = v.resumo
    .map((r) => `<li><strong>${esc(r.label)}:</strong> ${esc(r.value)}</li>`)
    .join("");
  const toc = v.toc
    .map((t) => `<li><a href="#${t.id}" style="color:#7fd4ec">${esc(t.label)}</a></li>`)
    .join("");
  const caixas = v.caixas
    .slice(0, 3)
    .map(
      (c) =>
        `<h3 style="font-size:1rem;margin:14px 0 6px">${esc(c.titulo)}</h3>` +
        `<ul style="line-height:1.7;padding-left:20px;font-size:.93rem;opacity:.94">` +
        c.itens.map((i) => `<li>${esc(i)}</li>`).join("") +
        `</ul>` +
        (c.nota ? `<p style="margin:0 0 10px;font-size:.93rem">${esc(c.nota)}</p>` : ""),
    )
    .join("");
  return (
    `<p style="margin:18px 0 6px"><strong>Resumo do serviço</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">${resumo}</ul>` +
    `<p style="margin:18px 0 6px"><strong>Nesta página</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">${toc}</ul>` +
    `<h2 id="pontos-de-atencao" style="font-size:1.1rem;margin:24px 0 8px">${esc(v.caixasTitulo)}</h2>` +
    caixas
  );
}


/**
 * RODADA 3S — blocos empresariais servidos já no HTML inicial das duas
 * páginas do escopo (hub e serviço), em paridade com o React: sumário,
 * pilares/indicadores, contextos, avulso × recorrente, fluxo e limites.
 */
const VISUAL_3S_STATIC = {
  "/empresa-de-ti-curitiba": {
    toc: [
      ["pilares", "Pilares do atendimento empresarial"],
      ["escopo", "O que abrange a solução de TI"],
      ["contextos", "Contextos atendidos"],
      ["mapa-servicos", "Mapa dos serviços empresariais"],
      ["cobertura", "Bairros e cidades atendidas"],
      ["faq", "Perguntas frequentes"],
    ],
    secoes: [
      ["pilares", "Pilares do atendimento empresarial", [
        "Computadores e usuários — lentidão, falhas, configurações e suporte ao usuário.",
        "Redes e conectividade — Wi-Fi, cabeamento, impressoras em rede e compartilhamento.",
        "Prevenção e continuidade — manutenção preventiva, backup e organização do ambiente.",
        "Atendimento remoto e presencial — modalidade definida na triagem, conforme a demanda.",
      ]],
      ["contextos", "Contextos atendidos", [
        "Escritórios com prazos e arquivos sensíveis.",
        "Recepções e postos de atendimento.",
        "Operações com períodos de maior demanda.",
        "Profissionais que usam arquivos e programas exigentes.",
        "Avaliamos o contexto operacional, não uma especialização setorial.",
      ]],
      ["registrar", "O que registrar antes de pedir suporte", [
        "Equipamento, usuário afetado e horário do início do problema.",
        "Mensagem de erro, programa envolvido e alteração recente.",
        "Impacto na operação e quantas pessoas estão paradas.",
        "Se existe backup recente e quem autoriza alterações.",
        "Senhas e códigos de autenticação não devem ser enviados por mensagem.",
      ]],
      ["mapa-servicos", "Mapa dos serviços empresariais", [
        "Suporte técnico empresarial, manutenção preventiva e backup para empresas.",
        "Redes e Wi-Fi, atendimento remoto, montagem de workstation e segurança dos dados.",
      ]],
    ],
  },
  "/servicos/suporte-tecnico-empresarial": {
    toc: [
      ["incluso", "O que está incluso"],
      ["fluxo-empresarial", "Como corre um chamado"],
      ["impacto", "Impacto e prioridade"],
      ["como-funciona", "Como funciona o atendimento"],
      ["fatores-valor", "O que influencia o valor"],
      ["faq", "Perguntas frequentes"],
    ],
    secoes: [
      ["escopo-empresarial", "Escopo do suporte empresarial", [
        "Computadores e usuários.",
        "Remoto e presencial.",
        "Avulso ou recorrente.",
        "Escopo autorizado antes da execução.",
      ]],
      ["fluxo-empresarial", "Como corre um chamado empresarial", [
        "Solicitação, triagem e levantamento do impacto e dos equipamentos afetados.",
        "Definição da modalidade, diagnóstico e autorização do escopo e do valor.",
        "Execução, registro do que foi feito e orientação sobre o próximo passo.",
        "As etapas não acontecem necessariamente em uma única visita.",
      ]],
      ["modalidades", "Atendimento avulso ou recorrente", [
        "Avulso: demanda pontual, escopo por chamado, prioridade conforme agenda.",
        "Recorrente: necessidades frequentes, levantamento inicial, histórico e preventiva no escopo.",
        "O atendimento recorrente não significa suporte ilimitado: frequência, prioridade, modalidades e responsabilidades precisam ser definidas no escopo contratado.",
      ]],
      ["impacto", "Impacto e prioridade", [
        "Descreva se o problema afeta um usuário, vários usuários, a rede, a impressão ou o acesso a sistema externo.",
        "O impacto informado ajuda na triagem, mas prazo e prioridade dependem de disponibilidade, escopo e eventual contratação específica.",
      ]],
      ["terceiros", "Limites e sistemas de terceiros", [
        "Podemos verificar: computador, rede, acesso local, configuração, mensagem de erro e permissões disponíveis.",
        "Pode depender do fornecedor: erro interno do sistema, licença, servidor externo, conta, autenticação e integração.",
        "Não realizamos sem autorização: alteração de política, redefinição de credencial ou acesso administrativo indevido.",
      ]],
    ],
  },
};

/**
 * RODADA 3T — contexto empresarial estático das páginas propagadas.
 * Espelha os cartões de src/lib/visualEmpresarial3t.ts (paridade HTML × React).
 */
const VISUAL_3T_STATIC = {
  "/servicos/manutencao-preventiva-empresas": [
    ["contexto-empresarial", "Contexto do atendimento empresarial", [
      "O que a rotina cobre: revisão periódica de estações, limpeza interna, checagem de armazenamento, atualizações e verificação das rotinas de backup já existentes.",
      "Como o escopo é fechado: levantamos os equipamentos em uso e definimos com a empresa o que entra na rotina e com que periodicidade. Nada é executado sem aprovação.",
      "O que fica fora: preventiva não substitui reparo de falha em curso nem manutenção de sistemas de terceiros (ERP, contábil, e-mail corporativo), que seguem com o fornecedor.",
    ]],
  ],
  "/servicos/backup-para-empresas": [
    ["contexto-empresarial", "Contexto do atendimento empresarial", [
      "O que entra no escopo: mapeamento do que precisa ser copiado, definição de destino das cópias, agendamento das rotinas e teste de restauração dos arquivos combinados.",
      "Acessos e credenciais: trabalhamos com o acesso mínimo necessário, autorizado por quem responde pela empresa. Credenciais permanecem sob controle do cliente.",
      "Limites de sistemas de terceiros: backup interno de plataformas mantidas por fornecedores (ERP, CRM, e-mail em nuvem) depende do recurso do próprio fornecedor. Registramos por escrito o que não é possível copiar.",
    ]],
  ],
};

function visual3tHtml(path) {
  const secoes = VISUAL_3T_STATIC[path];
  if (!secoes) return "";
  return secoes
    .map(
      ([id, titulo, itens]) =>
        `<h2 id="${id}" style="font-size:1.1rem;margin:24px 0 8px">${esc(titulo)}</h2>` +
        `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem;opacity:.94">` +
        itens.map((i) => `<li>${esc(i)}</li>`).join("") +
        `</ul>`,
    )
    .join("");
}

/** RODADA 3T — blocos editoriais estáticos (paridade com React). */
function blocos3tHtml(path) {
  const slug = path.replace("/servicos/", "");
  const cfg = BLOCOS_3T[slug];
  if (!cfg) return "";
  const ul = (itens) =>
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem;opacity:.94">` +
    itens.map((i) => `<li>${esc(i)}</li>`).join("") +
    `</ul>`;
  const toc =
    `<p style="margin:18px 0 6px"><strong>Nesta página</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">` +
    cfg.tocExtra
      .map((t) => `<li><a href="#${t.id}" style="color:#7fd4ec">${esc(t.label)}</a></li>`)
      .join("") +
    `</ul>`;
  const secoes = cfg.secoes
    .map((sec) => {
      const head = `<h2 id="${sec.id}" style="font-size:1.1rem;margin:24px 0 8px">${esc(sec.titulo)}</h2>`;
      let corpo = "";
      if (sec.intro) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.intro)}</p>`;
      if (sec.destaque) corpo += `<p style="margin:0 0 10px;font-size:.95rem"><strong>${esc(sec.destaque)}</strong></p>`;
      if (sec.cards) corpo += ul(sec.cards.map((c) => `${c.titulo}: ${c.texto ?? (c.itens || []).join("; ")}`));
      if (sec.passos) corpo += ul(sec.passos);
      if (sec.linhas) corpo += ul(sec.linhas.map((l) => l.join(" — ")));
      if (sec.listas) corpo += sec.listas.map((l) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(l.titulo)}</h3>` + ul(l.itens)).join("");
      if (sec.kind === "duas-colunas") corpo += sec.colunas.map((c) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(c.titulo)}</h3>` + ul(c.itens)).join("");
      if (sec.nota) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.nota)}</p>`;
      const links = (sec.cards || []).filter((c) => c.link);
      if (links.length)
        corpo +=
          `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">` +
          links.map((c) => `<li><a href="${c.link.to}" style="color:#7fd4ec">${esc(c.link.label)}</a></li>`).join("") +
          `</ul>`;
      return head + corpo;
    })
    .join("");
  const cta = CTA_3T[slug];
  const ctaHtml = cta
    ? `<p style="margin:16px 0"><a href="${waLink({ path })}" data-cta-location="noscript_static_3t" style="color:#7fd4ec"><strong>${esc(cta.label)}</strong></a></p>`
    : "";
  return toc + secoes + ctaHtml;
}

/** RODADA 3U — blocos estáticos de atendimento remoto, segurança e montagem. */
function blocos3uHtml(path) {
  const cfg = BLOCOS_3U[path];
  if (!cfg) return "";
  const ul = (itens) =>
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem;opacity:.94">` +
    itens.map((i) => `<li>${esc(i)}</li>`).join("") +
    `</ul>`;
  const resumo = cfg.resumo?.length
    ? ul(cfg.resumo.map((r) => `${r.label}: ${r.value}`))
    : "";
  const toc =
    `<p style="margin:18px 0 6px"><strong>Nesta página</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">` +
    cfg.tocExtra.map((t) => `<li><a href="#${t.id}" style="color:#7fd4ec">${esc(t.label)}</a></li>`).join("") +
    `</ul>`;
  const secoes = cfg.secoes
    .map((sec) => {
      let corpo = `<h2 id="${sec.id}" style="font-size:1.1rem;margin:24px 0 8px">${esc(sec.titulo)}</h2>`;
      if (sec.intro) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.intro)}</p>`;
      if (sec.cards) corpo += ul(sec.cards.map((c) => `${c.titulo}: ${c.texto ?? (c.itens || []).join("; ")}`));
      if (sec.passos) corpo += ul(sec.passos);
      if (sec.colunas && typeof sec.colunas[0] === "object")
        corpo += sec.colunas.map((c) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(c.titulo)}</h3>` + ul(c.itens)).join("");
      if (sec.linhas) corpo += ul(sec.linhas.map((l) => l.join(" — ")));
      if (sec.listas) corpo += sec.listas.map((l) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(l.titulo)}</h3>` + ul(l.itens)).join("");
      if (sec.nota) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.nota)}</p>`;
      return corpo;
    })
    .join("");
  const cta = CTA_3U[path];
  const ctaHtml = cta
    ? `<p style="margin:16px 0"><a href="${waLink({ path })}" data-cta-location="noscript_static_3u" style="color:#7fd4ec"><strong>${esc(cta.label)}</strong></a></p>`
    : "";
  return resumo + toc + secoes + ctaHtml;
}

/** RODADA 4A — blocos estáticos de TV/Smart TV e reparo de placas. */
function blocos4aHtml(path) {
  const cfg = BLOCOS_4A[path];
  if (!cfg) return "";
  const ul = (itens) =>
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem;opacity:.94">` +
    itens.map((i) => `<li>${esc(i)}</li>`).join("") +
    `</ul>`;
  const resumo = cfg.resumo?.length ? ul(cfg.resumo.map((r) => `${r.label}: ${r.value}`)) : "";
  const toc =
    `<p style="margin:18px 0 6px"><strong>Nesta página</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">` +
    cfg.tocExtra.map((t) => `<li><a href="#${t.id}" style="color:#7fd4ec">${esc(t.label)}</a></li>`).join("") +
    `</ul>`;
  const secoes = cfg.secoes
    .map((sec) => {
      let corpo = `<h2 id="${sec.id}" style="font-size:1.1rem;margin:24px 0 8px">${esc(sec.titulo)}</h2>`;
      if (sec.intro) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.intro)}</p>`;
      if (sec.destaque) corpo += `<p style="margin:0 0 10px;font-size:.95rem"><strong>${esc(sec.destaque)}</strong></p>`;
      if (sec.cards)
        corpo += ul(sec.cards.map((c) => `${c.titulo}: ${c.texto ?? (c.itens || []).join("; ")}`));
      if (sec.passos) corpo += ul(sec.passos);
      if (sec.colunas)
        corpo += sec.colunas
          .map((c) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(c.titulo)}</h3>` + ul(c.itens))
          .join("");
      if (sec.listas)
        corpo += sec.listas
          .map((l) => `<h3 style="font-size:1rem;margin:12px 0 4px">${esc(l.titulo)}</h3>` + ul(l.itens))
          .join("");
      if (sec.nota) corpo += `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(sec.nota)}</p>`;
      return corpo;
    })
    .join("");
  const cta = CTA_4A[path];
  const ctaHtml = cta
    ? `<p style="margin:16px 0"><a href="${waLink({ path })}" data-cta-location="noscript_static_4a" style="color:#7fd4ec"><strong>${esc(cta.label)}</strong></a></p>`
    : "";
  return resumo + toc + secoes + ctaHtml;
}

function visual3sHtml(path) {
  const v = VISUAL_3S_STATIC[path];
  if (!v) return "";
  const toc = v.toc
    .map(([id, label]) => `<li><a href="#${id}" style="color:#7fd4ec">${esc(label)}</a></li>`)
    .join("");
  const secoes = v.secoes
    .map(
      ([id, titulo, itens]) =>
        `<h2 id="${id}" style="font-size:1.1rem;margin:24px 0 8px">${esc(titulo)}</h2>` +
        `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem;opacity:.94">` +
        itens.map((i) => `<li>${esc(i)}</li>`).join("") +
        `</ul>`,
    )
    .join("");
  return (
    `<p style="margin:18px 0 6px"><strong>Nesta página</strong></p>` +
    `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">${toc}</ul>` +
    secoes
  );
}

/** HTML estático (dentro do <noscript> do #root) específico da rota. */
export function staticBodyFor(route) {
  const h1 = h1For(route);
  const crumbs = breadcrumbFor(route.path);
  const links = linksFor(route.path);
  const crumbHtml = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span aria-current="page">${esc(c.name)}</span>`
        : c.path
          ? `<a href="${c.path}" style="color:#7fd4ec">${esc(c.name)}</a> ›`
          : `<span>${esc(c.name)}</span> ›`,
    )
    .join(" ");
  const faqHtml = route.faq?.length
    ? `<h2 style="font-size:1.1rem;margin:24px 0 8px">Perguntas frequentes</h2>` +
      route.faq
        .map(
          (f) =>
            `<h3 style="font-size:1rem;margin:14px 0 4px">${esc(f.pergunta ?? f.question)}</h3><p style="margin:0;font-size:.95rem;opacity:.94">${esc(f.resposta ?? f.answer)}</p>`,
        )
        .join("")
    : "";
  const offersHtml = route.offers?.length
    ? `<h2 style="font-size:1.1rem;margin:24px 0 8px">Valores de referência</h2>` +
      `<ul style="line-height:1.8;padding-left:20px;font-size:.95rem">` +
      route.offers
        .map(
          (o) =>
            `<li><strong>${esc(o.nome)}</strong> — ${esc(o.valor)}${o.obs ? ` <span style="opacity:.85">(${esc(o.obs)})</span>` : ""}</li>`,
        )
        .join("") +
      `</ul>`
    : "";
  const blocosHtml = route.blocos?.length
    ? route.blocos
        .map(
          (b) =>
            `<h2 style="font-size:1.1rem;margin:24px 0 8px">${esc(b.titulo)}</h2>` +
            b.paragrafos.map((t) => `<p style="margin:0 0 10px;font-size:.95rem;opacity:.94">${esc(t)}</p>`).join(""),
        )
        .join("")
    : "";
  const subHtml = route.subtitulo
    ? `<p style="margin:0 0 16px;font-size:.98rem;opacity:.92">${esc(route.subtitulo)}</p>`
    : "";
  const linksHtml = links
    .map((p) => `<li><a href="${p}" style="color:#7fd4ec">${esc(labelFor(p))}</a></li>`)
    .join("");

  return `
        <div style="min-height:100vh;background:linear-gradient(155deg,hsl(205,58%,15%) 0%,hsl(200,45%,22%) 100%);color:#fff;padding:32px 20px;font-family:Arial,sans-serif;max-width:820px;margin:0 auto">
          <img src="/logo.webp" alt="Técnico em Curitiba" width="240" height="78" style="max-width:60vw;height:auto" />
          <nav aria-label="Trilha de navegação" style="font-size:.85rem;opacity:.9;margin:16px 0">${crumbHtml}</nav>
          <h1 style="font-size:1.6rem;line-height:1.25;margin:8px 0 12px">${esc(h1)}</h1>
          <p style="margin:0 0 16px;font-size:1rem;opacity:.94">${esc(route.description)}</p>
          ${subHtml}
          <p style="margin:0 0 20px"><a href="${waLink(route)}" data-cta-location="noscript_static" style="background:#16a34a;color:#fff;font-weight:bold;padding:14px 26px;border-radius:12px;text-decoration:none;display:inline-block">Falar no WhatsApp</a></p>
          ${visual3qHtml(route.path)}
          ${visual3sHtml(route.path)}
          ${visual3tHtml(route.path)}
          ${blocos3tHtml(route.path)}
          ${blocos3uHtml(route.path)}
          ${blocos4aHtml(route.path)}
          ${blocosHtml}
          ${offersHtml}
          ${faqHtml}
          ${editorialInboundHtml(route.path)}
          <h2 style="font-size:1.1rem;margin:24px 0 8px">Páginas relacionadas</h2>
          <ul style="line-height:1.9;padding-left:20px">${linksHtml}</ul>
          <h2 style="font-size:1.1rem;margin:24px 0 8px">Identificação e responsabilidade técnica</h2>
          <p style="margin:0 0 8px;font-size:.9rem;opacity:.9">${esc(SITE_CONFIG.brandName)} — atuação em informática desde ${esc(SITE_CONFIG.foundedYear)} em Curitiba e região metropolitana. Atendimento exclusivamente pelo WhatsApp.</p>
          <ul style="line-height:1.9;padding-left:20px;font-size:.9rem">
            <li><a href="/gestor-responsavel" style="color:#7fd4ec">Gestor responsável e escopo técnico</a></li>
            <li><a href="/precos-e-politicas" style="color:#7fd4ec">Preços, garantia e políticas</a></li>
          </ul>
          <p style="margin-top:22px;font-size:.85rem;opacity:.85">Para uma experiência completa, ative o JavaScript no seu navegador.</p>
        </div>`;
}

function localBusiness(path, { name, description, areaServed } = {}) {
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const isHome = path === "/";
  return {
    "@context": "https://schema.org",
    "@type": SITE_CONFIG.businessType,
    "@id": isHome ? `${SITE}/#localbusiness` : `${url}#localbusiness`,
    parentOrganization: { "@id": `${SITE}/#organization` },
    name: name ?? NAP.name,
    legalName: NAP.legalName,
    foundingDate: SITE_CONFIG.foundedYear,
    url,
    address: NAP.address,
    telephone: NAP.telephone,
    email: NAP.email,
    areaServed: (areaServed ?? SITE_CONFIG.serviceArea).map((n) => ({ "@type": "City", name: n })),
    openingHoursSpecification: OPENING_HOURS,
    ...(description ? { description } : {}),
  };
}

/**
 * Organization — entidade institucional única do documento.
 * Espelha src/lib/organizationJsonLd.ts. Todos os `publisher`/`provider`/
 * `parentOrganization` referenciam este `@id` (nunca repetem o objeto).
 */
function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: SITE_CONFIG.brandName,
    alternateName: ["Técnico Curitiba", "Técnico de Informática Curitiba"],
    legalName: SITE_CONFIG.legalName,
    url: `${SITE}/`,
    logo: `${SITE}/logo.png`,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phoneE164,
    foundingDate: SITE_CONFIG.foundedYear,
    areaServed: SITE_CONFIG.serviceArea.map((name) => ({ "@type": "City", name })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
      areaServed: "BR-PR",
    },
    sameAs: [`https://wa.me/${SITE_CONFIG.whatsappNumber}`],
  };
}

function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: SITE_CONFIG.brandName,
    url: `${SITE}/`,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE}/#organization` },
  };
}

function breadcrumbList(path) {
  const crumbs = breadcrumbFor(path);
  if (crumbs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE}${path === "/" ? "/" : path}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE}${c.path === "/" ? "/" : c.path}` } : {}),
    })),
  };
}

/** Nó Service padrão da rota (provider sempre = Organization oficial). */
function serviceNode(route, { name } = {}) {
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  const label = name ?? h1For(route);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: label,
    serviceType: label,
    description: route.description,
    url,
    areaServed: SITE_CONFIG.serviceArea.map((n) => ({ "@type": "City", name: n })),
    provider: { "@id": `${SITE}/#organization` },
    ...(route.offers?.length
      ? {
          offers: route.offers.map((o) => ({
            "@type": "Offer",
            name: o.nome,
            price: o.price,
            priceCurrency: o.priceCurrency,
            availability: "https://schema.org/InStock",
            url,
          })),
        }
      : {}),
  };
}

/** Rotas P0 fora das famílias de serviço que também precisam de Service. */
const EXTRA_SERVICE_PATHS = new Set(["/", "/precos-e-politicas"]);

/**
 * Rotas institucionais que representam o negócio local (NAP, área atendida e
 * horários) e por isso recebem LocalBusiness estático além do nó de página.
 */
const EXTRA_LOCAL_BUSINESS_PATHS = new Set([
  "/contato",
  "/sobre",
  "/como-funciona",
  "/equipamentos-atendidos",
  // Cluster de informática — NAP, areaServed e horários idênticos ao rodapé.
  "/servicos",
  "/tecnico-informatica-curitiba",
  "/assistencia-tecnica-curitiba",
  "/empresa-de-ti-curitiba",
  "/guia-tecnico-informatica",
  "/atendimento-domicilio",
  "/atendimento-remoto",
  "/coleta-e-entrega",
  "/areas-atendidas",
  "/precos-e-politicas",
]);

/** JSON-LD estático da rota — um nó lógico por entidade. */
export function jsonLdFor(route) {
  const path = route.path;
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const fam = familyOf(path);
  const out = [organization(), website()];

  if (fam === "home") {
    out.push(localBusiness("/", { description: route.description }));
    out.push(
      serviceNode(route, { name: "Assistência técnica de informática em Curitiba e região" }),
    );
    if (route.faq?.length) {
      out.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: route.faq.map((f) => ({
          "@type": "Question",
          name: f.pergunta ?? f.question,
          acceptedAnswer: { "@type": "Answer", text: f.resposta ?? f.answer },
        })),
      });
    }
    return out;
  }

  if (
    fam === "servico" ||
    fam === "servico-bairro" ||
    fam === "hub-servicos" ||
    fam === "empresa" ||
    fam === "modalidade" ||
    fam === "cidade-mae" ||
    EXTRA_SERVICE_PATHS.has(path)
  ) {
    out.push(serviceNode(route));
  }

  const hasService = out.some((n) => n["@type"] === "Service");
  if (fam === "bairro" || fam === "cidade" || fam === "cidade-mae" || fam === "modalidade") {
    const local =
      fam === "cidade" || fam === "bairro"
        ? [h1For(route).replace(/^Técnico (de Informática )?(em|no|na) /i, "").split("(")[0].split("|")[0].trim()]
        : undefined;
    out.push(localBusiness(path, { name: h1For(route), description: route.description, areaServed: local }));
  } else if (!hasService) {
    const type = fam === "sobre" ? "AboutPage" : fam === "contato" ? "ContactPage" : "WebPage";
    out.push({
      "@context": "https://schema.org",
      "@type": type,
      "@id": `${url}#webpage`,
      name: h1For(route),
      description: route.description,
      url,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${SITE}/#website` },
      publisher: { "@id": `${SITE}/#organization` },
    });
  }

  // Institucionais: NAP/área/horários explícitos para busca local.
  if (EXTRA_LOCAL_BUSINESS_PATHS.has(path) && !out.some((n) => slotFor(n) === "local-business")) {
    out.push(localBusiness(path, { description: route.description }));
  }

  const bc = breadcrumbList(path);
  if (route.faq?.length) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      // Aceita ambos os formatos de origem (pergunta/resposta e question/answer).
      mainEntity: route.faq.map((f) => ({
        "@type": "Question",
        name: f.pergunta ?? f.question,
        acceptedAnswer: { "@type": "Answer", text: f.resposta ?? f.answer },
      })),
    });
  }
  if (bc) out.push(bc);
  return out;
}

/**
 * Slot (chave estável) de cada entidade estruturada. Mesma convenção do
 * runtime em src/lib/jsonLdSlots.ts — o client adota (upsert) o nó estático
 * pela chave, nunca por coincidência de @type.
 */
export function slotFor(schema) {
  const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
  if (types.includes("BreadcrumbList")) return "breadcrumb";
  if (types.includes("WebSite")) return "website";
  if (types.includes("Organization") && !types.some((t) => /Business|Service/.test(t))) return "organization";
  if (types.some((t) => /LocalBusiness|ComputerRepairService|ProfessionalService/.test(t))) return "local-business";
  if (types.includes("Service")) return "service";
  if (types.includes("FAQPage")) return "faq";
  if (types.includes("AboutPage")) return "about-page";
  if (types.includes("ContactPage")) return "contact-page";
  return "web-page";
}

/** Tipo principal (string) de um schema — usado para diagnóstico. */
export function primaryType(schema) {
  const t = schema["@type"];
  return Array.isArray(t) ? t[0] : t;
}

/** Scripts JSON-LD estáticos prontos para injeção no <head>. */
export function jsonLdScriptsFor(route) {
  return jsonLdFor(route)
    .map((schema, i) => {
      const types = (Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]]).join(" ");
      return `<script type="application/ld+json" id="ld-static-${i}" data-static-jsonld="1" data-schema-key="${slotFor(schema)}" data-jsonld-type="${esc(types)}">${JSON.stringify(schema)}</script>`;
    })
    .join("\n    ");
}

export { CURATED_ROUTES };
