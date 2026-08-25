import { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { MapPin, Search, MessageCircle, Building2 } from "lucide-react";
import { MODALIDADES } from "@/lib/precosConfig";
import { bairroPathPorNome } from "@/lib/bairroLinks";
import { trackCTAClick } from "@/lib/analytics";

export interface DiretorioRegiao {
  nome: string;
  bairros: readonly string[];
}

export interface DiretorioCidade {
  slug: string;
  cidade: string;
}

interface Props {
  regioes: readonly DiretorioRegiao[];
  cidades: readonly DiretorioCidade[];
  /** Cidades atendidas que ainda não possuem página local própria. */
  cidadesSemPagina?: readonly string[];
}

/** Valor numérico da modalidade, para ordenar do menor para o maior. */
const valorNumerico = (label: string): number => {
  const m = label.replace(/\./g, "").match(/(\d+),(\d{2})/);
  return m ? Number(`${m[1]}.${m[2]}`) : Number.POSITIVE_INFINITY;
};

/** Modalidades reais da operação, da mais barata para a mais cara. */
const MODALIDADES_ORDENADAS = [...MODALIDADES].sort(
  (a, b) => valorNumerico(a.valorLabel) - valorNumerico(b.valorLabel),
);

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

type Item = {
  chave: string;
  nome: string;
  contexto: string;
  to: string | null;
  escopo: "bairro" | "cidade";
};

/**
 * Diretório de localidades com busca e filtro por tipo de atendimento.
 *
 * Regras de honestidade de dados:
 *  - não existe preço por bairro: os valores exibidos são os da tabela única
 *    de modalidades (`precosConfig`), ordenados do menor para o maior;
 *  - "disponibilidade" = localidade com página local publicada (operação
 *    documentada) aparece antes das demais; nada é inventado.
 */
export const DiretorioLocalidades = ({ regioes, cidades, cidadesSemPagina = [] }: Props) => {
  const [busca, setBusca] = useState("");
  const [modalidade, setModalidade] = useState<string>("todas");

  const itens = useMemo<Item[]>(() => {
    const bairros: Item[] = regioes.flatMap((r) =>
      r.bairros.map((b) => ({
        chave: `bairro-${b}`,
        nome: b,
        contexto: `Curitiba · ${r.nome}`,
        to: bairroPathPorNome(b),
        escopo: "bairro" as const,
      })),
    );
    const municipios: Item[] = cidades.map((c) => ({
      chave: `cidade-${c.slug}`,
      nome: c.cidade,
      contexto: "Região metropolitana",
      to: `/tecnico-informatica-${c.slug}`,
      escopo: "cidade" as const,
    }));
    const extras: Item[] = cidadesSemPagina.map((c) => ({
      chave: `cidade-extra-${c}`,
      nome: c,
      contexto: "Região metropolitana",
      to: null,
      escopo: "cidade" as const,
    }));
    return [...bairros, ...municipios, ...extras].sort((a, b) => {
      // Disponibilidade documentada primeiro; depois ordem alfabética.
      if (!!a.to !== !!b.to) return a.to ? -1 : 1;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });
  }, [regioes, cidades, cidadesSemPagina]);

  const filtrados = useMemo(() => {
    const q = normalizar(busca.trim());
    if (!q) return itens;
    return itens.filter((i) => normalizar(i.nome).includes(q) || normalizar(i.contexto).includes(q));
  }, [busca, itens]);

  const modalidadeSelecionada =
    modalidade === "todas" ? null : MODALIDADES_ORDENADAS.find((m) => m.id === modalidade) ?? null;

  const abrir = (item: Item) => {
    const escopoTexto = item.escopo === "bairro" ? "Curitiba" : "região metropolitana de Curitiba";
    const extra = modalidadeSelecionada ? ` Modalidade pretendida: ${modalidadeSelecionada.titulo}.` : "";
    trackCTAClick("whatsapp", `areas_diretorio_${item.escopo}`);
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: {
          location: `areas_diretorio_${item.escopo}`,
          message: `Olá! Preciso de atendimento técnico em ${item.nome} (${escopoTexto}).${extra} Pode confirmar agenda e a modalidade indicada para o meu caso?`,
        },
      }),
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="diretorio-busca" className="text-sm font-semibold text-foreground">
            Buscar bairro ou cidade
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="diretorio-busca"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: Batel, Cajuru, Pinhais"
              className="min-h-12 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="md:w-80">
          <label htmlFor="diretorio-modalidade" className="text-sm font-semibold text-foreground">
            Tipo de atendimento (do menor valor ao maior)
          </label>
          <select
            id="diretorio-modalidade"
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
            className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground"
          >
            <option value="todas">Todos os tipos</option>
            {MODALIDADES_ORDENADAS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo} — {m.valorLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {modalidadeSelecionada && (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <strong className="font-semibold">{modalidadeSelecionada.valorLabel}</strong> ·{" "}
          {modalidadeSelecionada.unidade}. {modalidadeSelecionada.resumo}
        </p>
      )}

      <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        {filtrados.length} localidade{filtrados.length === 1 ? "" : "s"} na lista. Localidades com página
        local publicada aparecem primeiro; as demais são atendidas mediante confirmação de agenda.
      </p>

      {filtrados.length === 0 ? (
        <p className="mt-5 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Nenhuma localidade com esse nome na lista. Isso não significa que não atendemos: descreva o
          endereço na triagem pelo WhatsApp que confirmamos agenda e deslocamento.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.slice(0, 60).map((item) => (
            <li key={item.chave} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.escopo === "bairro" ? (
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {item.contexto}
              </div>
              <h3 className="mt-1.5 text-base font-heading font-bold text-foreground">{item.nome}</h3>
              {item.to ? (
                <Link
                  to={item.to}
                  className="mt-1 inline-flex text-sm font-semibold text-accent underline underline-offset-4"
                >
                  Ver página local
                </Link>
              ) : (
                <span className="mt-1 inline-flex text-sm text-muted-foreground">
                  Atendida mediante agenda
                </span>
              )}
              <button
                type="button"
                onClick={() => abrir(item)}
                data-cta-location={`areas_diretorio_${item.escopo}`}
                data-wa-funnel="required"
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Confirmar agenda
              </button>
            </li>
          ))}
        </ul>
      )}

      {filtrados.length > 60 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Mostrando as 60 primeiras localidades. Use a busca para encontrar a sua.
        </p>
      )}
    </div>
  );
};

export default DiretorioLocalidades;
