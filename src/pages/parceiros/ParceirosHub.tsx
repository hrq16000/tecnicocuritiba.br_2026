import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Camera, ClipboardList } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { upsertCanonical } from "@/lib/canonicalUrl";
import { siteConfig } from "@/lib/siteConfig";
import { trackPageView } from "@/lib/analytics";
import { parceirosPorUf, MIN_CASOS, MIN_FAQ, MIN_FOTOS } from "@/lib/parceirosData";

/**
 * Hub da rede de parceiros prestadores no Brasil.
 *
 * Fail-closed: enquanto não houver parceiro com prova real aprovada, a página
 * fica noindex e não lista ninguém — nada de perfil fictício para "encher"
 * a rede.
 */
const ParceirosHub = () => {
  const grupos = parceirosPorUf();
  const total = grupos.reduce((acc, g) => acc + g.parceiros.length, 0);

  useEffect(() => {
    document.title = "Rede de parceiros prestadores no Brasil | Técnico em Curitiba";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Rede de técnicos parceiros no Brasil. Cada perfil publicado tem fotos reais do atendimento, casos técnicos descritos e serviços verificados.",
      );
    upsertCanonical(`${siteConfig.baseUrl}/parceiros`);

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    // Sem parceiro aprovado, o hub não entra no índice.
    robots.content = total > 0 ? "index, follow" : "noindex, follow";

    trackPageView("/parceiros", "Rede de parceiros");
  }, [total]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[{ label: "Rede de parceiros" }]} />

      <main>
        <section className="hero-gradient py-12">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Rede de parceiros prestadores no Brasil
            </h1>
            <p className="text-white/85">
              Fora de Curitiba, o atendimento é feito por técnicos parceiros. Só publicamos um
              parceiro depois de conferir prova do trabalho dele — o perfil não existe antes disso.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-heading font-bold mb-6">O que exigimos de cada parceiro</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Camera, t: `${MIN_FOTOS} fotos reais`, d: "Fotos do atendimento e da bancada do próprio parceiro, sem imagem de banco e sem IA." },
                { icon: ClipboardList, t: `${MIN_CASOS} casos técnicos`, d: "Equipamento, sintoma, solução aplicada e prazo real de execução." },
                { icon: ShieldCheck, t: `${MIN_FAQ} perguntas próprias`, d: "FAQ escrita para a região dele, não copiada de template." },
                { icon: MapPin, t: "Cidade e serviços", d: "Cobertura declarada e lista de serviços que ele realmente executa." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="rounded-xl border border-border p-4">
                  <Icon className="h-5 w-5 text-accent mb-2" aria-hidden="true" />
                  <h3 className="font-semibold mb-1">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-heading font-bold mb-6">Parceiros publicados</h2>
            {total === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">
                <p className="mb-2 font-medium text-foreground">Nenhum parceiro publicado ainda.</p>
                <p className="text-sm">
                  Os perfis entram um a um, conforme a prova visual e os casos são conferidos. Em
                  Curitiba e região metropolitana o atendimento é feito pela nossa própria equipe —
                  veja as{" "}
                  <Link className="underline" to="/areas-atendidas">
                    áreas atendidas
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {grupos.map((grupo) => (
                  <div key={grupo.uf}>
                    <h3 className="font-heading font-semibold mb-3">{grupo.uf}</h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {grupo.parceiros.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/parceiros/${p.slug}`}
                            className="block rounded-xl border border-border p-4 transition-colors hover:border-accent"
                          >
                            <span className="font-semibold">{p.nome}</span>
                            <span className="block text-sm text-muted-foreground">
                              {p.cidade} — {p.uf} · {p.servicos.slice(0, 3).join(", ")}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ParceirosHub;
