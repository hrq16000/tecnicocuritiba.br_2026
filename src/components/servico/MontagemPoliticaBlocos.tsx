import { Link } from "@/lib/router-compat";
import { CheckCircle2, ShieldCheck, Cpu, PackageCheck } from "lucide-react";
import {
  PECAS_DO_CLIENTE,
  PECAS_ADQUIRIDAS,
  REGRA_BIOS,
  TESTES_MONTAGEM,
  GARANTIA_MONTAGEM,
} from "@/lib/politicaMontagem";

/**
 * Blocos visíveis obrigatórios da página /servicos/montagem-de-pc:
 * política de peças (cliente e adquiridas), checklist de BIOS/drivers/testes
 * e delimitação de garantia. Fonte única: src/lib/politicaMontagem.ts.
 * Nenhuma promessa de desempenho, preço fechado ou overclock.
 */
export const MontagemPoliticaBlocos = () => (
  <section className="border-t border-border/60 bg-muted/20 py-14">
    <div className="container mx-auto max-w-5xl px-4 space-y-10">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Peças fornecidas pelo cliente: como tratamos compatibilidade, procedência e troca
        </h2>
        <p className="mt-3 text-muted-foreground">
          Regras completas, com prazo de troca, integridade no recebimento e a separação entre garantia
          da peça e garantia da mão de obra, estão na{" "}
          <Link to="/politica-de-pecas-do-cliente" className="font-medium text-[hsl(var(--accent))] underline">
            política de peças do cliente
          </Link>
          .
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <PackageCheck className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
              Peças que você compra
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {PECAS_DO_CLIENTE.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <PackageCheck className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
              Peças adquiridas a pedido
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {PECAS_ADQUIRIDAS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Checklist de BIOS/UEFI, drivers oficiais e testes antes da entrega
        </h2>
        <p className="mt-3 text-muted-foreground">
          Esta é a lista do que é conferido em cada montagem. Publicamos apenas o que é realmente
          executado — sem estimativa de quadros por segundo, percentual de ganho ou promessa de
          desempenho em jogos.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Cpu className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
              BIOS, firmware e drivers
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {REGRA_BIOS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
              Testes finais de entrega
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {TESTES_MONTAGEM.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Teste com duração definida não substitui o uso prolongado, e informamos isso antes da
              entrega.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Garantia da montagem, da configuração e da peça
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GARANTIA_MONTAGEM.map((g) => (
            <div key={g.titulo} className="rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
                {g.titulo}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
