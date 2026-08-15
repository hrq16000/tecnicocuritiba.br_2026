import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LocalidadeInput } from "@/components/funnel/LocalidadeInput";
import type { Field } from "@/lib/funnel/triageConfig";


interface Props {
  field: Field;
  value: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  /** Disparado quando um valor é escolhido (para foco/auto-advance). */
  onSelect?: (value: string) => void;
}

/**
 * Renderiza um campo de triagem de forma acessível e consistente.
 * Suporta single (cards), chips (pílulas), text e textarea.
 * O container recebe a ref para foco/scroll ao validar.
 */
export const TriageField = forwardRef<HTMLDivElement, Props>(
  ({ field, value, invalid, onChange, onSelect }, ref) => {
    const describedById = `${field.id}-help`;
    const errorRing = invalid
      ? "ring-2 ring-destructive/70 rounded-lg animate-pulse"
      : "";

    return (
      <div ref={ref} className={`space-y-1.5 scroll-mt-4 ${errorRing}`}>
        <label
          className="block text-sm font-medium text-foreground"
          htmlFor={field.type === "text" || field.type === "textarea" ? field.id : undefined}
          id={`${field.id}-label`}
        >
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </label>
        {field.helper && (
          <p id={describedById} className="text-xs text-muted-foreground">
            {field.helper}
          </p>
        )}

        {field.type === "single" && (
          <div
            role="radiogroup"
            aria-labelledby={`${field.id}-label`}
            className="grid gap-1.5"
          >
            {field.options?.map((o) => {
              const active = value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    onChange(o.value);
                    onSelect?.(o.value);
                  }}
                  className={`min-h-11 text-left px-3 py-2.5 rounded-lg border text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border bg-card hover:border-primary/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                        active ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    />
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {field.type === "chips" && (
          <div role="radiogroup" aria-labelledby={`${field.id}-label`} className="flex flex-wrap gap-1.5">
            {field.options?.map((o) => {
              const active = value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    onChange(o.value);
                    onSelect?.(o.value);
                  }}
                  className={`min-h-9 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/60"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}

        {field.type === "multi" && (
          <div aria-labelledby={`${field.id}-label`} className="grid gap-1.5">
            {field.options?.map((o) => {
              const selected = value.split(",").map((v) => v.trim()).filter(Boolean);
              const active = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="checkbox"
                  aria-checked={active}
                  onClick={() => {
                    const next = active
                      ? selected.filter((v) => v !== o.value)
                      : [...selected, o.value];
                    const joined = next.join(",");
                    onChange(joined);
                    onSelect?.(joined);
                  }}
                  className={`min-h-11 text-left px-3 py-2.5 rounded-lg border text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border bg-card hover:border-primary/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 rounded-[4px] border-2 ${
                        active ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    />
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {field.type === "text" && field.id === "bairro" && (
          <LocalidadeInput
            id={field.id}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
            ariaDescribedBy={field.helper ? describedById : undefined}
          />
        )}

        {field.type === "text" && field.id !== "bairro" && (

          <Input
            id={field.id}
            value={value}
            placeholder={field.placeholder}
            aria-describedby={field.helper ? describedById : undefined}
            aria-invalid={invalid || undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        )}


        {field.type === "textarea" && (
          <Textarea
            id={field.id}
            value={value}
            rows={4}
            placeholder={field.placeholder}
            aria-describedby={field.helper ? describedById : undefined}
            aria-invalid={invalid || undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  },
);

TriageField.displayName = "TriageField";

export default TriageField;
