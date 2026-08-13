// ─────────────────────────────────────────────────────────────
// REDE DE PARCEIROS PRESTADORES (Brasil) — registro FAIL-CLOSED.
//
// Um parceiro só é publicado/indexado quando existe prova real:
//   • ≥ MIN_FOTOS fotos próprias do atendimento dele (arquivos em public/,
//     sem IA, sem banco de imagens, sem placeholder);
//   • ≥ MIN_CASOS casos técnicos reais descritos (equipamento, sintoma,
//     solução, prazo) — sem inventar resultado, sem nota/avaliação;
//   • ≥ MIN_FAQ perguntas exclusivas do parceiro (não copiadas do template);
//   • cidade/UF e lista de serviços realmente atendidos;
//   • `aprovadoEm` (data ISO) preenchida após conferência manual.
//
// Sem TODOS esses itens, o parceiro fica `rascunho`: rota existe, mas com
// noindex e fora do sitemap. Nunca criar parceiro fictício para "encher"
// a rede — isso violaria as regras de trust claims do projeto.
//
// Estado inicial: ZERO parceiros aprovados.
// ─────────────────────────────────────────────────────────────

export const MIN_FOTOS = 3;
export const MIN_CASOS = 2;
export const MIN_FAQ = 5;

export type ParceiroStatus = "rascunho" | "em_revisao" | "aprovado";

export interface ParceiroCaso {
  equipamento: string;
  sintoma: string;
  solucao: string;
  prazo: string;
}

export interface ParceiroFoto {
  /** Caminho local em public/ (foto real do parceiro, sem IA). */
  src: string;
  /** Alt factual do que aparece na foto. */
  alt: string;
}

export interface Parceiro {
  slug: string;
  nome: string;
  cidade: string;
  uf: string;
  status: ParceiroStatus;
  /** Resumo autoral do parceiro (≥ 60 palavras próprias). */
  apresentacao: string;
  servicos: string[];
  fotos: ParceiroFoto[];
  casos: ParceiroCaso[];
  faq: { pergunta: string; resposta: string }[];
  /** Deep link de contato do parceiro (somente wa.me). */
  whatsapp?: string;
  aprovadoEm?: string;
}

/**
 * Registro de parceiros. Vazio por design: cada entrada precisa de fotos
 * reais e casos verificados antes de entrar aqui.
 */
export const PARCEIROS: Parceiro[] = [];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Validação fail-closed: retorna as pendências que impedem a indexação. */
export function pendenciasDoParceiro(p: Parceiro): string[] {
  const faltas: string[] = [];
  if (p.status !== "aprovado") faltas.push(`status "${p.status}" (precisa ser "aprovado")`);
  if (!p.cidade || !p.uf) faltas.push("cidade/UF ausente");
  if (!p.servicos?.length) faltas.push("nenhum serviço declarado");
  if ((p.apresentacao ?? "").split(/\s+/).filter(Boolean).length < 60) {
    faltas.push("apresentação com menos de 60 palavras próprias");
  }
  if ((p.fotos?.length ?? 0) < MIN_FOTOS) faltas.push(`${p.fotos?.length ?? 0} foto(s) real(is) (mínimo ${MIN_FOTOS})`);
  if (p.fotos?.some((f) => !f.src.startsWith("/") || /placeholder|og-image|logo/i.test(f.src))) {
    faltas.push("foto placeholder/branding usada como prova");
  }
  if (p.fotos?.some((f) => (f.alt ?? "").trim().length < 12)) faltas.push("foto sem alt factual");
  if ((p.casos?.length ?? 0) < MIN_CASOS) faltas.push(`${p.casos?.length ?? 0} caso(s) técnico(s) (mínimo ${MIN_CASOS})`);
  if ((p.faq?.length ?? 0) < MIN_FAQ) faltas.push(`${p.faq?.length ?? 0} pergunta(s) na FAQ (mínimo ${MIN_FAQ})`);
  if (p.whatsapp && !p.whatsapp.startsWith("https://wa.me/")) faltas.push("contato fora do padrão wa.me");
  if (!p.aprovadoEm || !ISO_DATE.test(p.aprovadoEm)) faltas.push("aprovadoEm ausente/inválida");
  else if (new Date(p.aprovadoEm).getTime() > Date.now()) faltas.push("aprovadoEm no futuro");
  return faltas;
}

export function isParceiroIndexavel(p: Parceiro): boolean {
  return pendenciasDoParceiro(p).length === 0;
}

export function getParceiro(slug: string): Parceiro | undefined {
  return PARCEIROS.find((p) => p.slug === slug);
}

export function parceirosIndexaveis(): Parceiro[] {
  return PARCEIROS.filter(isParceiroIndexavel);
}

/** Agrupamento por UF para o hub (somente parceiros indexáveis). */
export function parceirosPorUf(): { uf: string; parceiros: Parceiro[] }[] {
  const mapa = new Map<string, Parceiro[]>();
  for (const p of parceirosIndexaveis()) {
    mapa.set(p.uf, [...(mapa.get(p.uf) ?? []), p]);
  }
  return [...mapa.entries()]
    .map(([uf, parceiros]) => ({ uf, parceiros: parceiros.sort((a, b) => a.nome.localeCompare(b.nome)) }))
    .sort((a, b) => a.uf.localeCompare(b.uf));
}
