import { forwardRef, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { LOCALIDADES } from "@/lib/bairrosSelect";
import { rankLocalidades } from "@/lib/localidade-filter";
import { cepToLocalidade, formatCep, isValidCep, lookupCep } from "@/lib/cepLookup";
import { setGeoFromUser } from "@/lib/geoContext";

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaDescribedBy?: string;
  className?: string;
}

/**
 * Campo de bairro/cidade com autocomplete e seleção manual.
 *
 * A geolocalização é apenas uma sugestão: quando ela falha (IP bloqueado,
 * permissão negada, VPN) o visitante precisa conseguir escolher o local
 * do atendimento — caso contrário a mensagem do WhatsApp sai sem região.
 * Por isso o campo aceita digitação livre (datalist) e oferece um seletor
 * pesquisável de Curitiba e Região Metropolitana.
 */
export const LocalidadeInput = forwardRef<HTMLInputElement, Props>(
  ({ id, value, onChange, placeholder, ariaDescribedBy, className }, ref) => {
    const listId = useId();
    const cepId = useId();
    const [manual, setManual] = useState(false);
    const [manualQuery, setManualQuery] = useState("");
    const manualId = useId();
    const suggestions = manual ? rankLocalidades(LOCALIDADES, manualQuery) : [];
    const [cep, setCep] = useState("");
    const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "erro">("idle");

    const handleCep = async (raw: string) => {
      const next = formatCep(raw);
      setCep(next);
      if (!isValidCep(next)) {
        setCepStatus("idle");
        return;
      }
      setCepStatus("loading");
      const found = await lookupCep(next);
      if (!found) {
        setCepStatus("erro");
        return;
      }
      setCepStatus("ok");
      onChange(cepToLocalidade(found));
    };

    return (
      <div className={className}>
        <Input
          ref={ref}
          id={id}
          list={listId}
          value={value}
          inputMode="text"
          autoComplete="address-level3"
          enterKeyHint="next"
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (!v) return;
            const [primeiro, segundo] = v.split(",").map((p) => p.trim());
            // Persiste a escolha do visitante: vale mais do que qualquer
            // inferência automática e alimenta a mensagem do WhatsApp.
            setGeoFromUser(
              segundo
                ? { city: segundo, neighborhood: primeiro }
                : { city: primeiro },
            );
          }}
          placeholder={placeholder ?? "Ex.: Batel, Curitiba"}
          aria-describedby={ariaDescribedBy}
          className="min-h-11 text-base"
        />
        <datalist id={listId}>
          {LOCALIDADES.map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>

        <div className="mt-2">
          <label htmlFor={cepId} className="text-xs font-medium text-muted-foreground">
            Prefere pelo CEP? (opcional)
          </label>
          <Input
            id={cepId}
            value={cep}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={9}
            onChange={(e) => void handleCep(e.target.value)}
            placeholder="00000-000"
            className="mt-1 min-h-11 text-base"
          />
          {cepStatus === "loading" && (
            <p className="mt-1 text-xs text-muted-foreground">Consultando CEP…</p>
          )}
          {cepStatus === "ok" && (
            <p className="mt-1 text-xs text-primary">Bairro e cidade preenchidos pelo CEP.</p>
          )}
          {cepStatus === "erro" && (
            <p className="mt-1 text-xs text-muted-foreground">
              CEP não encontrado. Você pode digitar o bairro e a cidade acima.
            </p>
          )}
        </div>


        {!manual ? (
          <button
            type="button"
            onClick={() => { setManualQuery(""); setManual(true); }}
            className="mt-1.5 text-xs font-medium text-primary underline underline-offset-2"
          >
            Não encontrou? Escolher bairro ou cidade na lista
          </button>
        ) : (
          <div className="mt-2 space-y-2 rounded-lg border border-border p-2">
            <label htmlFor={manualId} className="text-xs font-medium text-muted-foreground">
              Pesquisar bairro ou cidade
            </label>
            <Input id={manualId} value={manualQuery} type="search" autoComplete="off"
              placeholder="Digite parte do nome" onChange={(event) => setManualQuery(event.target.value)}
              className="min-h-11 text-base" />
            <p className="text-xs text-muted-foreground" role="status">
              {suggestions.length ? "Selecione uma sugestão ou refine sua busca." : "Nenhuma opção encontrada. Você pode digitar a localidade no campo acima."}
            </p>
            <ul aria-label="Sugestões de localidade" className="space-y-1">
              {suggestions.map((option) => (
                <li key={option}>
                  <button type="button" aria-pressed={value === option}
                    onClick={() => { onChange(option); setManualQuery(option); }}
                    className="min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary/10 aria-pressed:font-semibold">
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setManual(false)}
              className="min-h-11 text-xs font-medium text-primary underline underline-offset-2">
              Fechar sugestões
            </button>
          </div>
        )}
      </div>
    );
  },
);
LocalidadeInput.displayName = "LocalidadeInput";

export default LocalidadeInput;
