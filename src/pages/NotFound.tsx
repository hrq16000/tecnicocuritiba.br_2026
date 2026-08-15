import { Link, useLocation } from "@/lib/router-compat";
import { useEffect } from "react";

const TITLE_404 = "Página não encontrada | Técnico Curitiba";
const DESC_404 =
  "A página que você tentou acessar não existe ou foi movida. Veja os serviços disponíveis ou volte para a página inicial.";

/**
 * Página 404 própria.
 *
 * Regras de SEO (Rodada 2A):
 *  • noindex, nofollow;
 *  • sem canonical (nunca aponta para a home);
 *  • sem oferta comercial, preço ou schema de serviço;
 *  • CTA de contato apenas pela triagem central (evento wa-funnel:open),
 *    nunca por link wa.me direto.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("404: rota inexistente:", location.pathname);
    }
    document.title = TITLE_404;

    const desc = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc) desc.setAttribute("content", DESC_404);

    // Canonical herdado do shell/prerender não pode sobreviver numa 404.
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
  }, [location.pathname]);

  const abrirTriagem = () => {
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", { detail: { location: "pagina_404" } }),
    );
  };

  return (
    <>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center gap-6 px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Erro 404</p>
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
          Página não encontrada
        </h1>
        <p className="text-base text-muted-foreground">
          O endereço acessado não existe ou foi movido. Você pode voltar para a página inicial,
          consultar a lista de serviços ou falar com o atendimento.
        </p>
        <nav aria-label="Links úteis" className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-xl bg-primary px-5 py-3 text-center font-semibold text-primary-foreground"
          >
            Ir para a página inicial
          </Link>
          <Link
            to="/servicos"
            className="rounded-xl border border-border px-5 py-3 text-center font-semibold text-foreground"
          >
            Ver serviços disponíveis
          </Link>
          <button
            type="button"
            onClick={abrirTriagem}
            className="rounded-xl border border-border px-5 py-3 text-center font-semibold text-foreground"
          >
            Falar com o atendimento
          </button>
        </nav>
      </main>
    </>
  );
};

export default NotFound;
