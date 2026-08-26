import { Link, useLocation } from "@/lib/router-compat";
import { useEffect } from "react";
import { ArrowRight, Home, Wrench } from "lucide-react";

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
 *  • links de recuperação levam apenas a páginas úteis do próprio site;
 *    sem preço, CTA comercial ou link wa.me direto.
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

  return (
    <>
      <main className="relative isolate flex min-h-[76vh] items-center overflow-hidden bg-[radial-gradient(circle_at_86%_8%,hsl(var(--accent)/0.18),transparent_30%),linear-gradient(145deg,hsl(205_58%_15%),hsl(200_45%_22%))] px-5 py-16 text-white">
        <div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <section className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-black/15 p-7 shadow-2xl backdrop-blur-sm md:p-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-xs text-accent-foreground">TC</span>
            Técnico em Curitiba
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-accent">Erro 404</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Esta página não está mais neste endereço.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            O conteúdo pode ter sido movido, atualizado ou digitado com outro endereço. Use um dos caminhos abaixo para continuar no site.
          </p>
          <nav aria-label="Links úteis" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-center font-bold text-accent-foreground"
          >
            <Home className="h-4 w-4" /> Ir para o início
          </Link>
          <Link
            to="/servicos"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-center font-bold text-white hover:bg-white/10"
          >
            <Wrench className="h-4 w-4" /> Ver serviços
          </Link>
          <Link
            to="/tecnico-informatica-curitiba"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-center font-bold text-white hover:bg-white/10"
          >
            Técnico em Curitiba <ArrowRight className="h-4 w-4" />
          </Link>
          </nav>
          <p className="mt-8 border-t border-white/15 pt-5 text-sm text-white/70">
            Procurava um artigo técnico? Consulte o <Link to="/blog" className="font-bold text-accent hover:underline">blog</Link> ou descreva o problema pela triagem do site.
          </p>
        </section>
      </main>
    </>
  );
};

export default NotFound;
