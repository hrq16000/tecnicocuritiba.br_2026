/**
 * ============================================================================
 * RESOLUÇÃO DE LINKS DE BAIRRO (fonte única: src/lib/bairrosData.ts)
 * ============================================================================
 * Hubs locais (áreas atendidas, home, Curitiba) listam bairros por nome de
 * exibição. Este resolvedor converte esse nome no caminho da página real do
 * bairro quando ela existe — evitando listas de links mantidas à mão, que é a
 * origem histórica de páginas de bairro sem nenhum link de entrada.
 *
 * Regra fail-closed: nome sem página correspondente devolve `null` e continua
 * como texto simples. Nunca inventamos rota.
 */
import { BAIRRO_LIST } from "@/lib/bairrosData";

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Apelidos usados nos hubs que não batem literalmente com `nome`. */
const APELIDOS: Record<string, string> = {
  "cic cidade industrial": "cic",
  "cidade industrial": "cidade industrial",
  cic: "cic",
  centro: "centro",
  "centro de curitiba": "centro",
  "sitio cercado": "sitio-cercado",
};

const INDICE = new Map<string, string>();
for (const b of BAIRRO_LIST) {
  INDICE.set(normalizar(b.nome), b.slug);
  INDICE.set(normalizar(b.slug), b.slug);
  INDICE.set(normalizar(b.areaName), b.slug);
}
for (const [alias, slug] of Object.entries(APELIDOS)) {
  const alvo = BAIRRO_LIST.find((b) => b.slug === slug);
  if (alvo) INDICE.set(normalizar(alias), alvo.slug);
}

/** Caminho da página do bairro para um nome de exibição, ou `null`. */
export function bairroPathPorNome(nome: string): string | null {
  const slug = INDICE.get(normalizar(nome));
  return slug ? `/bairros/${slug}` : null;
}

/** Todos os bairros com página própria, em ordem alfabética de exibição. */
export const BAIRROS_COM_PAGINA = BAIRRO_LIST.map((b) => ({
  nome: b.nome,
  slug: b.slug,
  to: `/bairros/${b.slug}`,
  subtitulo: b.subtitulo,
})).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
