import { useEffect, useMemo, useState } from "react";
import { Truck, MapPin, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FAIXAS_LOGISTICAS,
  faixaPorRegiao,
  MOVIMENTACOES,
  CHECKLIST_COLETA,
  RAIO_MAXIMO_KM,
  type FaixaLogistica,
} from "@/lib/logisticaColeta";

export interface ColetaGateState {
  faixa?: FaixaLogistica;
  prerequisitos: string[];
  status: string;
  ok: boolean;
}

interface Props {
  bairro?: string | null;
  value: ColetaGateState;
  onChange: (v: ColetaGateState) => void;
}

/** Pré-requisitos que o cliente precisa confirmar antes de agendar a coleta. */
const PRE_REQUISITOS = CHECKLIST_COLETA.filter((i) => i.obrigatorio)
  .filter((i) => ["conferir-faixa", "fotos-estado", "riscos-previos", "acessorios", "termo"].includes(i.id))
  .map((i) => ({
    id: i.id,
    label:
      i.id === "conferir-faixa"
        ? `Confirmo que o endereço está dentro do raio de ${RAIO_MAXIMO_KM} km de Curitiba`
        : i.id === "fotos-estado"
          ? "Autorizo o registro fotográfico do aparelho na retirada"
          : i.id === "riscos-previos"
            ? "Concordo em registrar riscos, trincas e marcas já existentes"
            : i.id === "acessorios"
              ? "Vou separar os acessórios (cabo, fonte, controle, base) para a coleta"
              : "Aceito as condições: diagnóstico R$ 99,99 e reparo mínimo R$ 299,99",
  }));

const STATUS_INICIAL = MOVIMENTACOES[0];

/**
 * Gate de coleta e entrega premium — fail-closed.
 * Só libera o agendamento depois de registrar faixa de raio, pré-requisitos
 * e o status inicial de movimentação da OS.
 */
export const ColetaGateCard = ({ bairro, value, onChange }: Props) => {
  const sugerida = useMemo(() => faixaPorRegiao(bairro), [bairro]);
  const [faixaId, setFaixaId] = useState<string>(value.faixa?.id ?? sugerida?.id ?? "");

  const faixa = FAIXAS_LOGISTICAS.find((f) => f.id === faixaId);
  const marcados = value.prerequisitos;
  const completo = !!faixa && PRE_REQUISITOS.every((p) => marcados.includes(p.id));

  useEffect(() => {
    onChange({
      faixa,
      prerequisitos: marcados,
      status: STATUS_INICIAL.label,
      ok: completo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faixaId, marcados.join("|"), completo]);

  const toggle = (id: string) =>
    onChange({
      faixa,
      status: STATUS_INICIAL.label,
      prerequisitos: marcados.includes(id) ? marcados.filter((m) => m !== id) : [...marcados, id],
      ok: false,
    });

  return (
    <div className="rounded-xl border border-border bg-card/60 p-3 space-y-3">
      <div className="flex items-start gap-2">
        <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-foreground">Coleta e entrega — pré-requisitos</p>
          <p className="mt-0.5 text-xs text-foreground/70">
            Registramos a faixa de distância e o estado do aparelho antes de agendar. Raio máximo de {RAIO_MAXIMO_KM} km.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="faixa-coleta" className="text-xs font-semibold text-foreground">
          Faixa de distância{sugerida ? " (sugerida pela sua região)" : ""}
        </label>
        <select
          id="faixa-coleta"
          value={faixaId}
          onChange={(e) => setFaixaId(e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione a faixa da sua região</option>
          {FAIXAS_LOGISTICAS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
        {faixa && (
          <p className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-border bg-background/60 p-2 text-[11px] leading-snug text-foreground/80">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" aria-hidden="true" />
            <span>
              {faixa.taxaLabel} · Janelas: {faixa.janelas} · Retirada em até {faixa.prazoColetaDias} dia(s) útil(eis)
              após a confirmação.
            </span>
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        {PRE_REQUISITOS.map((p) => (
          <label
            key={p.id}
            className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-background/50 p-2.5 text-[11px] leading-snug transition-colors hover:bg-background/80"
          >
            <Checkbox
              checked={marcados.includes(p.id)}
              onCheckedChange={() => toggle(p.id)}
              className="mt-0.5"
              aria-label={p.label}
            />
            <span className="text-foreground/85">{p.label}</span>
          </label>
        ))}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-foreground/70">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
        Status inicial da sua OS: <strong className="text-foreground">{STATUS_INICIAL.label}</strong> — você acompanha
        cada movimentação até a entrega.
      </p>
    </div>
  );
};

export default ColetaGateCard;
