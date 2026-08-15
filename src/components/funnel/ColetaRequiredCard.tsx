import { Link } from "@/lib/router-compat";
import { Package, Clock, Wrench, ShieldCheck } from "lucide-react";
import {
  COLETA_TAXA_MINIMA_LABEL,
  DIAGNOSTICO_VALOR_LABEL,
  PRAZO_LONGO,
  PRAZO_RAPIDO,
} from "@/lib/coletaConfig";

interface Props {
  equipamento: string;
  sintoma: string;
  accepted: boolean;
  onAcceptChange: (v: boolean) => void;
}

export const ColetaRequiredCard = ({ equipamento, sintoma, accepted, onAcceptChange }: Props) => {
  const prazo = /celular|tablet|som|caixa|rádio|radio/i.test(equipamento) ? PRAZO_RAPIDO : PRAZO_LONGO;

  return (
    <div className="rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <Package className="h-5 w-5 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-foreground">
            Esse caso exige <span className="text-amber-700 dark:text-amber-400">Coleta e Entrega</span>
          </p>
          <p className="text-xs text-foreground/75 leading-snug mt-0.5">
            Sintoma <strong>“{sintoma}”</strong> não pode ser resolvido em visita técnica — precisamos do equipamento na bancada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-start gap-1.5 rounded-md bg-background/60 border border-border p-2">
          <Wrench className="h-3.5 w-3.5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Mínimo do reparo</p>
            <p className="text-foreground/70">{COLETA_TAXA_MINIMA_LABEL} (diagnóstico incluso)</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 rounded-md bg-background/60 border border-border p-2">
          <Clock className="h-3.5 w-3.5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Prazo</p>
            <p className="text-foreground/70">{prazo}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 rounded-md bg-background/60 border border-border p-2">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Desistiu?</p>
            <p className="text-foreground/70">Paga só {DIAGNOSTICO_VALOR_LABEL}</p>
          </div>
        </div>
      </div>

      <label className="flex items-start gap-2 cursor-pointer rounded-lg border border-amber-500/40 bg-background/50 p-2.5 hover:bg-background/80 transition-colors">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-amber-600"
        />
        <span className="text-xs leading-snug">
          Estou ciente e autorizo a <strong>Coleta e Entrega</strong> nessas condições. Concordo com os{" "}
          <Link to="/termos-e-condicoes" className="underline hover:text-foreground">termos</Link> e a{" "}
          <Link to="/coleta-e-entrega" className="underline hover:text-foreground">política de coleta</Link>.
        </span>
      </label>
    </div>
  );
};

export default ColetaRequiredCard;
