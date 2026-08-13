import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Wrench, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { upsertCanonical } from "@/lib/canonicalUrl";
import { siteConfig } from "@/lib/siteConfig";
import { trackPageView } from "@/lib/analytics";
import { getParceiro, isParceiroIndexavel } from "@/lib/parceirosData";
import NotFound from "@/pages/NotFound";

/**
 * Perfil de parceiro prestador.
 *
 * A rota existe sempre (SEO evolutivo: não removemos URLs), mas só recebe
 * `index, follow` quando o parceiro passa em todas as provas de
 * `pendenciasDoParceiro()`. Sem prova → noindex e fora do sitemap.
 */
const ParceiroPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const parceiro = slug ? getParceiro(slug) : undefined;
  const indexavel = parceiro ? isParceiroIndexavel(parceiro) : false;

  useEffect(() => {
    if (!parceiro) return;
    const titulo = `${parceiro.nome} — técnico parceiro em ${parceiro.cidade}, ${parceiro.uf}`;
    document.title = `${titulo} | ${siteConfig.brandName}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${parceiro.nome} atende ${parceiro.cidade} (${parceiro.uf}) com ${parceiro.servicos
          .slice(0, 3)
          .join(", ")}. Fotos reais do atendimento e casos técnicos descritos.`,
      );
    upsertCanonical(`${siteConfig.baseUrl}/parceiros/${parceiro.slug}`);

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = indexavel ? "index, follow" : "noindex, follow";

    trackPageView(`/parceiros/${parceiro.slug}`, titulo);
  }, [parceiro, indexavel]);

  if (!parceiro) return <NotFound />;

  const jsonLd = indexavel
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: parceiro.nome,
        url: `${siteConfig.baseUrl}/parceiros/${parceiro.slug}`,
        areaServed: `${parceiro.cidade}, ${parceiro.uf}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: parceiro.cidade,
          addressRegion: parceiro.uf,
          addressCountry: "BR",
        },
        makesOffer: parceiro.servicos.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <Header />
      <Breadcrumbs items={[{ label: "Rede de parceiros", href: "/parceiros" }, { label: parceiro.nome }]} />

      <main>
        <section className="hero-gradient py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm text-accent">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {parceiro.cidade} — {parceiro.uf}
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-heading font-bold text-white">{parceiro.nome}</h1>
            <p className="mt-4 text-white/85">{parceiro.apresentacao}</p>
            {parceiro.whatsapp && (
              <Button asChild className="mt-6">
                <a href={parceiro.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Falar com este parceiro</span>
                </a>
              </Button>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Serviços atendidos</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {parceiro.servicos.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {parceiro.fotos.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Fotos do atendimento</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {parceiro.fotos.map((foto) => (
                    <figure key={foto.src} className="overflow-hidden rounded-xl border border-border">
                      <img
                        src={foto.src}
                        alt={foto.alt}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <figcaption className="p-2 text-xs text-muted-foreground">{foto.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {parceiro.casos.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Casos técnicos executados</h2>
                <ul className="space-y-4">
                  {parceiro.casos.map((caso) => (
                    <li key={`${caso.equipamento}-${caso.sintoma}`} className="rounded-xl border border-border p-4">
                      <h3 className="font-semibold">{caso.equipamento}</h3>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Sintoma:</strong> {caso.sintoma}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Solução:</strong> {caso.solucao}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Prazo:</strong> {caso.prazo}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {parceiro.faq.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Perguntas frequentes</h2>
                <dl className="space-y-4">
                  {parceiro.faq.map((item) => (
                    <div key={item.pergunta} className="rounded-xl border border-border p-4">
                      <dt className="font-semibold">{item.pergunta}</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">{item.resposta}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Precisa de atendimento em Curitiba e região? Veja as{" "}
              <Link className="underline" to="/areas-atendidas">
                áreas atendidas pela nossa equipe
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ParceiroPage;
