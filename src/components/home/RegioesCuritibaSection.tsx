import { Link } from "@/lib/router-compat";
import { REGIOES_COBERTURA } from "@/lib/bairrosBaseline";

/**
 * Cobertura por regiões e bairros de Curitiba + Região Metropolitana.
 * Modelo Service Area Business: nenhum endereço, CEP ou unidade física.
 *
 * Toda localidade exibida é um link real para a página correspondente — o
 * mapeamento vem de `src/lib/bairrosBaseline.ts`, a fonte única validada pelo
 * gate `check:rotas-localidades` (zero destino 404).
 */
export const RegioesCuritibaSection = () => {
  const regionais = REGIOES_COBERTURA.filter((r) => r.id !== "rmc");
  const rmc = REGIOES_COBERTURA.find((r) => r.id === "rmc");

  return (
    <section className="border-y border-border bg-secondary py-14 md:py-18" aria-labelledby="regioes-title">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Cobertura</span>
          <h2 id="regioes-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Regiões e bairros atendidos em Curitiba
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Atendimento por agendamento em toda Curitiba e na Região Metropolitana — no seu endereço, remoto ou com
            coleta e entrega para reparo em bancada.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regionais.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-bold text-foreground">{r.titulo}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {r.itens.map((item) => (
                  <li key={item.to}>
                    <Link
                      preload="intent"
                      to={item.to}
                      className="inline-block rounded-full border border-accent/40 bg-background px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label={`Atendimento técnico em ${item.nome}`}
                    >
                      {item.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {rmc && (
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-foreground">{rmc.titulo}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rmc.itens.map((item) => (
                <li key={item.to}>
                  <Link
                    preload="intent"
                    to={item.to}
                    className="inline-block rounded-full border border-accent/40 bg-background px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Atendimento técnico em ${item.nome}`}
                  >
                    {item.nome}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Não encontrou seu bairro? A cobertura é por área de atendimento — confirme a disponibilidade na triagem.{" "}
              <Link
                preload="intent"
                to="/areas-atendidas"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-accent"
              >
                Ver todas as áreas atendidas
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegioesCuritibaSection;
