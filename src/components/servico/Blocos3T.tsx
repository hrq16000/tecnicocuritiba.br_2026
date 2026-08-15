import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle, Info } from "lucide-react";
import { blocos3T, type Secao3T } from "@/lib/blocos3t";

/**
 * Rodada 3T — renderiza os blocos editoriais próprios de cada uma das
 * três páginas do escopo. Camada de apresentação: nenhum preço, prazo,
 * SLA ou plano é introduzido aqui.
 */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 font-heading text-2xl font-bold text-foreground md:text-3xl">{children}</h2>
);

const Secao = ({ secao }: { secao: Secao3T }) => {
  switch (secao.kind) {
    case "pilares":
    case "conceitos":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          {"intro" in secao && secao.intro && (
            <p className="-mt-2 mb-8 max-w-3xl text-muted-foreground">{secao.intro}</p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {secao.cards.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-foreground">{c.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "fluxo":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          <ol className="grid gap-3 md:grid-cols-2">
            {secao.passos.map((p, i) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--accent))] text-sm font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{p}</span>
              </li>
            ))}
          </ol>
          {secao.nota && (
            <p className="mt-6 max-w-3xl rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              <Info className="mr-2 inline h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
              {secao.nota}
            </p>
          )}
        </div>
      );

    case "matriz":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <caption className="sr-only">{secao.titulo}</caption>
              <thead>
                <tr>
                  {secao.colunas.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="border-b border-border px-4 py-3 font-bold text-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {secao.linhas.map((linha) => (
                  <tr key={linha[0]} className="align-top">
                    <th
                      scope="row"
                      className="border-b border-border px-4 py-3 font-bold text-foreground"
                    >
                      {linha[0]}
                    </th>
                    {linha.slice(1).map((cel) => (
                      <td key={cel} className="border-b border-border px-4 py-3 text-muted-foreground">
                        {cel}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {secao.nota && <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{secao.nota}</p>}
        </div>
      );

    case "limites":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          {secao.destaque && (
            <p className="mb-6 max-w-3xl rounded-xl border-l-4 border-[hsl(var(--accent))] border-y border-r border-border bg-card p-5 font-medium text-foreground">
              {secao.destaque}
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            {secao.listas.map((l) => (
              <div key={l.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-foreground">{l.titulo}</h3>
                <ul className="mt-3 space-y-2">
                  {l.itens.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]"
                        aria-hidden="true"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case "responsabilidades":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          <div className="grid gap-5 md:grid-cols-3">
            {secao.cards.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-foreground">{c.titulo}</h3>
                <ul className="mt-3 space-y-2">
                  {c.itens.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <ArrowRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]"
                        aria-hidden="true"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case "contextos":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          {secao.intro && <p className="-mt-2 mb-8 max-w-3xl text-muted-foreground">{secao.intro}</p>}
          <div className="grid gap-5 md:grid-cols-2">
            {secao.cards.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-bold text-foreground">{c.titulo}</h3>
                <ul className="mt-3 space-y-2">
                  {c.itens.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]"
                        aria-hidden="true"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={c.link.to}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))] underline underline-offset-4"
                >
                  {c.link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      );

    case "duas-colunas":
      return (
        <div className="container mx-auto px-4">
          <H2>{secao.titulo}</H2>
          {secao.destaque && (
            <p className="mb-6 max-w-3xl rounded-xl border-l-4 border-[hsl(var(--accent))] border-y border-r border-border bg-card p-5 font-medium text-foreground">
              {secao.destaque}
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">

            {secao.colunas.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-foreground">{c.titulo}</h3>
                <ul className="mt-3 space-y-2">
                  {c.itens.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]"
                        aria-hidden="true"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {secao.nota && <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{secao.nota}</p>}
        </div>
      );

    default:
      return null;
  }
};

/** Renderizador de seção reutilizado pela Rodada 3U. */
export const SecaoBloco = Secao;

export const Blocos3T = ({ slug }: { slug: string }) => {
  const cfg = blocos3T(slug);
  if (!cfg) return null;
  return (
    <>
      {cfg.secoes.map((secao, i) => (
        <section
          key={secao.id}
          id={secao.id}
          className={`scroll-mt-24 py-14 md:py-16 ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}
        >
          <Secao secao={secao} />
        </section>
      ))}
    </>
  );
};

export default Blocos3T;
