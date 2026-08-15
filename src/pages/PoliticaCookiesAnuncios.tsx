import { Helmet } from "react-helmet";
import { Link } from "@/lib/router-compat";
import { useCanonical } from "@/lib/canonicalUrl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Cookie, BarChart3, Megaphone, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { resetConsent } from "@/lib/consentStore";

const CANONICAL = "https://tecnico.curitiba.br/politica-de-cookies-e-anuncios";
const UPDATED = "08/08/2026";

const faqs: Array<{ q: string; a: string }> = [
  {
    q: "Quais cookies o site usa?",
    a: "Cookies essenciais para o funcionamento das páginas, cookies de análise (Google Analytics 4) e cookies de publicidade (Google Ads e Google AdSense). Análise e publicidade só são ativados após o seu aceite no banner.",
  },
  {
    q: "O que acontece se eu recusar os cookies?",
    a: "O site continua funcionando normalmente. Análise e anúncios personalizados ficam desativados: o Consent Mode v2 mantém ad_storage, ad_user_data, ad_personalization e analytics_storage como denied e o script do AdSense não é carregado.",
  },
  {
    q: "O site registra algo mesmo sem cookies?",
    a: "Sim. Registramos eventos técnicos próprios do funil de atendimento (por exemplo: abertura do formulário, etapa preenchida e clique no WhatsApp) em uma tabela interna chamada click_events. Esse registro não usa cookies, não guarda IP, nome, telefone ou endereço, e serve apenas para medir se o atendimento está funcionando.",
  },
  {
    q: "Como desativo anúncios personalizados do Google?",
    a: "Você pode ajustar as preferências em google.com/settings/ads ou usar o opt-out setorial em aboutads.info/choices. Também pode recusar o consentimento no banner deste site a qualquer momento.",
  },
  {
    q: "Como altero minha escolha depois?",
    a: "Use o botão “Gerenciar preferências” nesta página. Ele apaga a decisão salva no seu navegador e reabre o banner de consentimento imediatamente.",
  },
  {
    q: "Por quanto tempo a decisão fica salva?",
    a: "A decisão fica salva no seu navegador (armazenamento local) com data e versão da política, até você limpar os dados do site ou usar o botão de gerenciar preferências.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
    { "@type": "ListItem", position: 2, name: "Política de Cookies e Anúncios", item: CANONICAL },
  ],
};

const PoliticaCookiesAnuncios = () => {
  useCanonical(CANONICAL);

  return (
    <>
      <Helmet>
        <title>Política de Cookies e Anúncios | Técnico em Curitiba</title>
        <meta
          name="description"
          content="Como o tecnico.curitiba.br usa cookies de análise e anúncios (Google Analytics, Ads e AdSense), como recusar, como gerenciar preferências e o que é registrado sem cookies."
        />
        <meta property="og:title" content="Política de Cookies e Anúncios | Técnico em Curitiba" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      <main className="bg-background">
        <PageHero
          title="Política de Cookies e Anúncios"
          subtitle={`Cookies, Consent Mode v2, AdSense e telemetria técnica. Atualizada em ${UPDATED}.`}
        />

        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16 text-foreground/85 leading-relaxed text-[15px]">
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              <Cookie className="h-5 w-5 text-accent" /> 1. O que são cookies
            </h2>
            <p>
              Cookies são pequenos arquivos gravados pelo navegador quando você visita um site. Eles
              permitem lembrar preferências, medir audiência e, no caso de publicidade, ajustar os
              anúncios exibidos. Neste site, cookies de análise e de anúncios só são ativados depois
              do seu aceite no banner de consentimento.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              <BarChart3 className="h-5 w-5 text-accent" /> 2. Categorias usadas
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Essenciais:</strong> funcionamento das páginas, segurança e memória da sua decisão de consentimento. Sempre ativos.</li>
              <li><strong>Análise (opcional):</strong> Google Analytics 4, com IP anonimizado, para entender quais páginas ajudam o visitante.</li>
              <li><strong>Anúncios (opcional):</strong> Google Ads e Google AdSense, incluindo o cookie DART, para mensuração e exibição de anúncios.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              <ShieldCheck className="h-5 w-5 text-accent" /> 3. Consent Mode v2 e AdSense
            </h2>
            <p>
              O site carrega com <strong>todos os sinais negados por padrão</strong>
              (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code> e{" "}
              <code>analytics_storage</code> = <em>denied</em>). O script{" "}
              <code>adsbygoogle</code> só é injetado na página <strong>após o aceite de anúncios</strong>.
              Se você recusar, nenhum script de publicidade é carregado e nenhuma personalização ocorre.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              <Megaphone className="h-5 w-5 text-accent" /> 4. Registro técnico sem cookies (telemetria first-party)
            </h2>
            <p>
              Além dos cookies, registramos eventos técnicos do funil de atendimento em uma tabela
              interna (<code>click_events</code>): abertura do formulário, etapa preenchida, envio e
              clique no WhatsApp, com a página de origem e a faixa de largura de tela.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Não usa cookies e não cria perfil publicitário.</li>
              <li>Não guarda IP, nome, telefone, endereço ou conteúdo de mensagens.</li>
              <li>O identificador de sessão é temporário e vive apenas na aba aberta.</li>
              <li>Base legal: legítimo interesse (art. 7º, IX da LGPD) — medir e corrigir o próprio atendimento.</li>
              <li>Retenção: até 12 meses, com acesso restrito à administração do site.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              <SlidersHorizontal className="h-5 w-5 text-accent" /> 5. Como recusar ou mudar sua escolha
            </h2>
            <p className="mb-3">
              Você pode aceitar tudo, permitir só análise ou recusar. A decisão fica salva com data e
              versão da política e pode ser trocada quando quiser.
            </p>
            <button
              type="button"
              onClick={resetConsent}
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-5 py-3 font-bold text-foreground transition-colors hover:bg-accent/20"
            >
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Gerenciar preferências de cookies
            </button>
            <p className="mt-3">
              Opt-out externo:{" "}
              <a className="text-accent underline" href="https://www.google.com/settings/ads" rel="noopener nofollow" target="_blank">
                Configurações de anúncios do Google
              </a>{" "}
              e{" "}
              <a className="text-accent underline" href="https://www.aboutads.info/choices/" rel="noopener nofollow" target="_blank">
                aboutads.info/choices
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              6. Vendedores autorizados (ads.txt)
            </h2>
            <p>
              O arquivo{" "}
              <a className="text-accent underline" href="/ads.txt" rel="noopener">
                /ads.txt
              </a>{" "}
              deste domínio declara os vendedores autorizados a comercializar o inventário
              publicitário de tecnico.curitiba.br.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              7. Perguntas frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-bold text-foreground">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="text-sm text-muted-foreground">
            Veja também a{" "}
            <Link to="/politica-de-privacidade" className="text-accent underline">
              Política de Privacidade
            </Link>{" "}
            e os{" "}
            <Link to="/termos-e-condicoes" className="text-accent underline">
              Termos e Condições
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default PoliticaCookiesAnuncios;
