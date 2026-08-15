import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, Navigate } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PageSEO } from "@/components/PageSEO";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CTASection } from "@/components/CTASection";
import { trackPageView } from "@/lib/analytics";
import { trackWaClick } from "@/lib/funnelAnalytics";
import { CATEGORIES, type CategoryId, findCategory } from "./categories";
import { LOCAIS, findLocal, type LocalData } from "./locais";
import {
  categoryLocalMeta,
  localizedFaqs,
  offerFor,
  faixaDe,
  referenciaDe,
  PRECO_MINIMO_REPARO,
  PRECO_DIAGNOSTICO,
  GARANTIA_DIAS,
} from "@/lib/categoryLocalContent";
import {
  coverDe,
  coverCaption,
  coverCredit,
  coberturaLista,
  localBusinessNode,
  coverImageNode,
} from "@/lib/categoryLocalGeo";
import {
  Package, ShieldCheck, Clock, Wrench, MapPin, MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

const beneficios = [
  { icon: Package, title: "Coleta e Entrega", description: "Buscamos seu equipamento em casa e devolvemos consertado. Sem precisar deslocar até a loja." },
  { icon: ShieldCheck, title: "Garantia em todo serviço", description: "90 dias de garantia escrita sobre a peça e a mão-de-obra." },
  { icon: Wrench, title: "Diagnóstico transparente", description: "Valor do atendimento exato antes de qualquer execução. Você autoriza tudo por escrito." },
  { icon: Clock, title: "Prazo combinado", description: "Atualizações de andamento por WhatsApp. Sem surpresa." },
];

interface Props {
  categoryId: CategoryId;
  /** Override do slug local (quando renderizado sem useParams) */
  localSlug?: string;
}

/** Template compartilhado: categoria × local. */
export const CategoryLocalTemplate = ({ categoryId, localSlug }: Props) => {
  const params = useParams<{ local?: string }>();
  const slug = localSlug ?? params.local ?? "curitiba";
  const local = findLocal(slug);
  const category = CATEGORIES[categoryId];

  // Derivações seguras (mesmo quando `local` é nulo) para manter a ordem
  // dos hooks estável entre renders — corrige rules-of-hooks.
  const path = local ? `/${category.slug}/${local.slug}` : `/${category.slug}`;
  const cityLabel = local
    ? local.kind === "bairro" ? `${local.nome}, ${local.cidadeMae}` : local.nome
    : "";
  const meta = local ? categoryLocalMeta(category, local) : null;
  const title = meta?.title ?? "";
  const description = meta?.description ?? "";
  const faixa = local ? faixaDe(local) : null;
  const faqs = local ? localizedFaqs(category, local) : [];
  const msg = `Olá! Preciso de ${category.titlePrefix.toLowerCase()} em ${cityLabel}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  useEffect(() => {
    if (!local) return;
    trackPageView(path, title);
  }, [path, title, local]);

  if (!local) return <Navigate to={`/${category.slug}-curitiba`} replace />;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${category.titlePrefix} em ${cityLabel}`,
    serviceType: category.titlePrefix,
    provider: { "@type": "LocalBusiness", name: "Técnico Curitiba", url: "https://tecnico.curitiba.br", telephone: "+5541997086380", address: { "@type": "PostalAddress", addressLocality: "Curitiba", addressRegion: "PR", addressCountry: "BR" } },
    areaServed: { "@type": local.kind === "bairro" ? "Place" : "City", name: cityLabel, containedInPlace: { "@type": "State", name: "Paraná" } },
    description,
    offers: offerFor(category, local, "https://tecnico.curitiba.br"),
  };

  const localBusinessSchema = { "@context": "https://schema.org", ...localBusinessNode(category, local) };
  const imageSchema = { "@context": "https://schema.org", ...coverImageNode(category, local) };
  const cover = coverDe(category);
  const credit = coverCredit(category);
  const { cidades, bairros } = coberturaLista();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q.replace(/\?$/, "") + `?`,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Locais relacionados (outros 6)
  const related = LOCAIS.filter((l) => l.slug !== local.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={title}
        description={description}
        path={path}
        ogImage={cover.url}
        noindex
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: category.titlePrefix, path: `/${category.slug}-curitiba` },
          { name: cityLabel, path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(imageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        <PageHero
          title={`${category.titlePrefix} em ${cityLabel}`}
          subtitle={`${category.emoji} Coleta e entrega no seu endereço · diagnóstico incluso · garantia de 90 dias. Atendimento por WhatsApp em até 30 min.`}
          ctaText="Solicitar Coleta no WhatsApp"
        />

        <BenefitsGrid
          benefits={beneficios}
          title={`Por que escolher para ${cityLabel}`}
          subtitle="Coleta na porta, bancada com instrumental adequado, garantia escrita."
        />

        {/* Capa fotográfica real (licenciada) + mapa de cobertura */}
        <section className="container mx-auto px-4 pt-10">
          <figure className="max-w-3xl mx-auto">
            <img
              src={cover.url}
              alt={cover.alt}
              width={1200}
              height={630}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-2xl border border-border"
            />
            <figcaption className="text-xs text-muted-foreground mt-2">
              {coverCaption(category, local)} {credit.creditText} —{" "}
              <a href={credit.licenseUrl} rel="nofollow noopener" target="_blank" className="underline">
                {credit.license}
              </a>
              .
            </figcaption>
          </figure>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> Mapa de cobertura — cidades e bairros atendidos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {cityLabel} está na {faixa?.nome} ({faixa?.raio}) do nosso raio de coleta, medido a partir da base em
              Curitiba. Atendemos {cidades.length} cidades da Região Metropolitana e {bairros.length} bairros de
              Curitiba:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm">
              {[...cidades, ...bairros].map((l) => (
                <li key={l.slug}>
                  <Link to={`/${category.slug}/${l.slug}`} className="text-accent hover:underline">
                    {l.nome}
                    {l.kind === "bairro" ? ` (${l.cidadeMae})` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Coleta e preço — conteúdo visível espelhado no Offer/PriceSpecification */}
        {faixa && (
          <section className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6">
              <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> Coleta e entrega em {cityLabel}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {cityLabel} está na {faixa.nome} ({faixa.raio}), com {faixa.taxa}. As janelas de coleta são{" "}
                {faixa.janelas} e a retirada acontece em até {faixa.prazoColetaDias} dia(s) útil(eis) após o
                aceite. Referência de roteiro: {referenciaDe(local)}.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Reparo mínimo de R$ {PRECO_MINIMO_REPARO},00 com diagnóstico incluso. Sem autorização do serviço,
                o valor cobrado é apenas o diagnóstico de R${" "}
                {PRECO_DIAGNOSTICO.toFixed(2).replace(".", ",")}. Garantia de {GARANTIA_DIAS} dias sobre o
                serviço executado.
              </p>
            </div>
          </section>
        )}

        {/* Sintomas */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Problemas comuns de {category.nome.toLowerCase()} em {cityLabel}
            </h2>
            <p className="text-muted-foreground text-lg">
              Atendemos as falhas mais frequentes — todas com diagnóstico transparente antes da execução.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {category.sintomas.map((s) => (
              <a
                key={s}
                href={whatsappUrl}
                data-cta-location="category_local_sintoma"
                onClick={() => trackWaClick("category_local_sintoma", { bairro: local.slug, servico: category.id, sintoma: s })}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{s}</p>
                  <p className="text-xs text-muted-foreground">ver detalhes e agendar →</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section className="bg-secondary/40 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Como funciona em {cityLabel}
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { n: "1", t: "Triagem no WhatsApp", d: "Você envia fotos/vídeo e responde 5 perguntas no funil." },
                { n: "2", t: "Coleta agendada", d: "Buscamos no seu endereço com proteção e nota de retirada." },
                { n: "3", t: "Diagnóstico + valor do atendimento", d: `Avaliação em bancada. ${category.precoVisita}.` },
                { n: "4", t: "Reparo + entrega", d: `${category.prazoEntrega} · garantia de 90 dias.` },
              ].map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="mx-auto mb-2 w-9 h-9 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center">{s.n}</div>
                  <p className="font-semibold text-sm">{s.t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços oferecidos */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            Serviços de {category.nome} oferecidos
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {category.servicos.map((s) => (
              <div key={s} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card">
                <ShieldCheck className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
              Perguntas frequentes — {cityLabel}
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group p-5 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex justify-between items-center gap-4">
                    {f.q}
                    <span className="text-accent text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Interlinking */}
        <section className="bg-secondary/40 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
              Atendemos {category.nome} também em
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm">
              {related.map((l) => (
                <Link
                  key={l.slug}
                  to={`/${category.slug}/${l.slug}`}
                  className="px-3 py-2 rounded-lg border border-border bg-card hover:border-accent hover:text-accent text-center transition-colors"
                >
                  <MapPin className="inline h-3 w-3 mr-1 -mt-px" />
                  {l.nome}
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to={`/${category.slug}-curitiba`} className="text-accent font-semibold hover:underline">
                Ver hub completo de {category.titlePrefix} em Curitiba e RMC →
              </Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default CategoryLocalTemplate;

/* ===== Hub raiz por categoria (lista todos os locais) ===== */
export const CategoryHub = ({ categoryId }: { categoryId: CategoryId }) => {
  const category = CATEGORIES[categoryId];
  const path = `/${category.slug}-curitiba`;
  const title = `${category.titlePrefix} em Curitiba e Região Metropolitana | Coleta e Entrega`;
  const description = `${category.titlePrefix} para Curitiba, São José dos Pinhais, Araucária, Pinhais, Colombo, Campo Largo e mais. Coleta e entrega, reparo mínimo R$ 300 com diagnóstico incluso. WhatsApp em 30 min.`;

  useEffect(() => { trackPageView(path, title); }, [path, title]);

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.titlePrefix,
    description,
    provider: { "@type": "LocalBusiness", name: "Técnico Curitiba", url: "https://tecnico.curitiba.br" },
    areaServed: { "@type": "AdministrativeArea", name: "Região Metropolitana de Curitiba" },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={title}
        description={description}
        path={path}
        noindex
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: `${category.titlePrefix} em Curitiba`, path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(hubSchema)}</script>
      </Helmet>
      <Header />
      <main>
        <PageHero
          title={`${category.emoji} ${category.titlePrefix} em Curitiba e RMC`}
          subtitle={`Cobertura completa para ${category.nome.toLowerCase()}: coleta e entrega em toda a Região Metropolitana, diagnóstico incluso e garantia escrita.`}
          ctaText="Iniciar triagem no WhatsApp"
        />
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            Escolha sua cidade ou bairro
          </h2>
          <p className="text-center text-muted-foreground mb-8">{category.servicos.length}+ serviços disponíveis · {LOCAIS.length} locais atendidos</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {LOCAIS.map((l: LocalData) => (
              <Link
                key={l.slug}
                to={`/${category.slug}/${l.slug}`}
                className="p-3 rounded-lg border border-border bg-card hover:border-accent hover:shadow-md transition-all text-center"
              >
                <MapPin className="inline h-3.5 w-3.5 text-accent mr-1 -mt-px" />
                <span className="font-medium text-sm">{l.nome}</span>
                {l.kind === "bairro" && (
                  <p className="text-[10px] text-muted-foreground">bairro de {l.cidadeMae}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-secondary/40 py-10">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h3 className="text-xl font-bold mb-3">Como funciona</h3>
            <p className="text-muted-foreground">
              Triagem rápida pelo WhatsApp (com fotos/vídeo) → coleta agendada → diagnóstico em bancada → valor por escrito → reparo + entrega com garantia de 90 dias.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Quero valor do atendimento de ${category.titlePrefix}.`)}`}
              data-cta-location="category_local_how_it_works"
              onClick={() => trackWaClick("category_local_how_it_works", { servico: category.id })}
              className="inline-flex items-center gap-2 mt-5 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white px-5 py-3 rounded-lg font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com técnico agora
            </a>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

/* ===== Wrappers concretos para cada categoria (lazy-loadable) ===== */
export const ConsertoTVCity = () => <CategoryLocalTemplate categoryId="tv" />;
export const ConsertoSomCity = () => <CategoryLocalTemplate categoryId="som" />;
export const ConsertoVideogameCity = () => <CategoryLocalTemplate categoryId="videogame" />;
export const ConsertoCelularLocalCity = () => <CategoryLocalTemplate categoryId="celular" />;

export const ConsertoTVHub = () => <CategoryHub categoryId="tv" />;
export const ConsertoSomHub = () => <CategoryHub categoryId="som" />;
export const ConsertoVideogameHub = () => <CategoryHub categoryId="videogame" />;
export const ConsertoCelularLocalHub = () => <CategoryHub categoryId="celular" />;
